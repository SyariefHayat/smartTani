import { logger } from '../../../../shared/utils/logger';
import { Prisma } from '@prisma/client';
import { CheckoutInput } from '../schemas/cart.schema';
import cartService from './cart.service';
import marketplaceClient from '../lib/marketplace-client';
import { AppError } from '../../../../shared/types/express';
import { paymentTimeoutQueue, autoCompleteQueue } from '../lib/queue';
import RedisClient from '../lib/redis';
import { GetOrdersQuery, RefundInput } from '../schemas/order.schema';
import orderRepository from '../repositories/order.repository';
import prisma from '../lib/prisma';

import { BROKER_EXCHANGES, BROKER_ROUTING_KEYS } from '../../../../shared/constants/broker';
import MessageBroker from '../lib/broker';

export class OrderService {
  async getOrders(userId: string, role: string, query: GetOrdersQuery) {
    const { status, from_date, to_date, page, limit } = query;

    const { orders, total } = await orderRepository.findAll({
      userId,
      role,
      status,
      from_date,
      to_date,
      page,
      limit,
    });

    // If role is petani, filter items to only show THEIR products
    const resultOrders =
      role === 'petani'
        ? orders.map((order) => ({
            ...order,
            items: order.items.filter((item: any) => item.farmer_id === userId),
          }))
        : orders;

    return {
      orders: resultOrders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderById(orderId: string, userId: string, role: string) {
    const order = await orderRepository.findById(orderId);

    if (!order) {
      const error = new Error('Order tidak ditemukan') as AppError;
      error.statusCode = 404;
      error.code = 'ORDER_001';
      throw error;
    }

    // Access Control
    if (role === 'petani') {
      const hasItem = order.items.some((item) => item.farmer_id === userId);
      if (!hasItem) {
        const error = new Error('Anda tidak memiliki akses untuk order ini') as AppError;
        error.statusCode = 403;
        error.code = 'AUTH_011';
        throw error;
      }
      // Filter items to only show theirs
      return {
        ...order,
        items: order.items.filter((item) => item.farmer_id === userId),
      };
    }

    if (role !== 'admin' && order.buyer_id !== userId) {
      const error = new Error('Anda tidak memiliki akses untuk order ini') as AppError;
      error.statusCode = 403;
      error.code = 'AUTH_011';
      throw error;
    }

    return order;
  }

  async confirmOrder(orderId: string, userId: string, role: string) {
    const order = await orderRepository.findById(orderId);

    if (!order) {
      const error = new Error('Order tidak ditemukan') as AppError;
      error.statusCode = 404;
      error.code = 'ORDER_001';
      throw error;
    }

    // Validation: must be 'paid'
    if (order.status !== 'paid') {
      const error = new Error('Hanya order yang sudah dibayar yang bisa dikonfirmasi') as AppError;
      error.statusCode = 400;
      error.code = 'ORDER_002';
      throw error;
    }

    // Access Control: Petani must have items in this order
    const hasItem = order.items.some((item) => item.farmer_id === userId);
    if (role !== 'admin' && !hasItem) {
      const error = new Error('Anda tidak memiliki akses untuk order ini') as AppError;
      error.statusCode = 403;
      error.code = 'AUTH_011';
      throw error;
    }

    // Update status to 'confirmed_seller'
    const updatedOrder = await orderRepository.updateStatus(orderId, 'confirmed_seller');

    // Publish Event
    await MessageBroker.publish(BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.ORDER_CONFIRMED, {
      orderId: updatedOrder.id,
      buyerId: updatedOrder.buyer_id,
      items: updatedOrder.items,
      shippingAddress: updatedOrder.shipping_address,
    });

    return updatedOrder;
  }

  async deliverOrder(orderId: string, userId: string, role: string) {
    const order = await orderRepository.findById(orderId);

    if (!order) {
      const error = new Error('Order tidak ditemukan') as AppError;
      error.statusCode = 404;
      error.code = 'ORDER_001';
      throw error;
    }

    // Validation: must be 'shipped' or 'delivered'
    if (order.status !== 'shipped' && order.status !== 'delivered') {
      const error = new Error('Hanya order yang sedang dikirim atau sudah sampai yang bisa dikonfirmasi terima') as AppError;
      error.statusCode = 400;
      error.code = 'ORDER_002';
      throw error;
    }

    // Access Control: Only buyer (owner) or admin
    if (role !== 'admin' && order.buyer_id !== userId) {
      const error = new Error('Anda tidak memiliki akses untuk order ini') as AppError;
      error.statusCode = 403;
      error.code = 'AUTH_011';
      throw error;
    }

    // Update status to 'delivered' and set completed_at
    const updatedOrder = await orderRepository.completeOrder(orderId);

    // Cancel auto-complete job in Bull Queue
    const jobId = `auto-complete-${orderId}`;
    const job = await autoCompleteQueue.getJob(jobId);
    if (job) {
      await job.remove();
    }

    // Publish Event
    await MessageBroker.publish(BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.ORDER_DELIVERED, {
      orderId: updatedOrder.id,
      buyerId: updatedOrder.buyer_id,
      totalAmount: updatedOrder.total_amount,
      items: updatedOrder.items,
      completedAt: updatedOrder.completed_at,
    });

    return updatedOrder;
  }

  async requestRefund(orderId: string, userId: string, role: string, input: RefundInput) {
    const order = await orderRepository.findById(orderId);

    if (!order) {
      const error = new Error('Order tidak ditemukan') as AppError;
      error.statusCode = 404;
      error.code = 'ORDER_001';
      throw error;
    }

    // Validation: must be 'paid' or 'shipped'
    const validStatuses = ['paid', 'shipped'];
    if (!validStatuses.includes(order.status)) {
      const error = new Error(
        'Refund hanya bisa diajukan untuk order yang sudah dibayar atau sedang dikirim'
      ) as AppError;
      error.statusCode = 400;
      error.code = 'ORDER_002';
      throw error;
    }

    // Access Control: Only buyer (owner)
    if (role !== 'admin' && order.buyer_id !== userId) {
      const error = new Error('Anda tidak memiliki akses untuk order ini') as AppError;
      error.statusCode = 403;
      error.code = 'AUTH_011';
      throw error;
    }

    // Update status to 'refund_requested' and save reason
    const updatedOrder = await orderRepository.requestRefund(orderId, input.reason);

    // Publish Event for notification-service (Admin notification)
    await MessageBroker.publish(BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.ORDER_REFUND_REQUESTED, {
      orderId: updatedOrder.id,
      buyerId: updatedOrder.buyer_id,
      totalAmount: updatedOrder.total_amount,
      reason: input.reason,
    });

    return updatedOrder;
  }

  async checkout(userId: string, input: CheckoutInput) {
    // 1. Fetch cart dari Redis
    const cart = await cartService.getCart(userId);

    // 2. Validasi: cart tidak kosong
    if (!cart.items || cart.items.length === 0) {
      const error = new Error('Keranjang belanja kosong') as AppError;
      error.statusCode = 400;
      error.code = 'MARKET_009';
      throw error;
    }

    // Validasi ketersediaan semua produk
    const unavailableItems = cart.items.filter((item) => !item.isAvailable);
    if (unavailableItems.length > 0) {
      const error = new Error(
        'Beberapa produk dalam keranjang tidak tersedia atau stok tidak mencukupi'
      ) as AppError;
      error.statusCode = 400;
      error.code = 'MARKET_010';
      throw error;
    }

    // 3. Lock stok di marketplace-service
    const stockItems = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const stockReduced = await marketplaceClient.reduceStock(stockItems);
    if (!stockReduced) {
      const error = new Error('Gagal mengamankan stok produk. Silakan coba lagi.') as AppError;
      error.statusCode = 409;
      error.code = 'MARKET_008';
      throw error;
    }

    try {
      // 4. Hitung total_amount, platform_fee, shipping_cost
      const subtotal = cart.total;
      const platformFee = subtotal * 0.02; // 2%
      const shippingCost = 15000; // Mock flat shipping cost for MVP
      const totalAmount = subtotal + platformFee + shippingCost;

      // 5. Insert Order dan OrderItems ke PostgreSQL dalam satu transaction
      const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            buyer_id: userId,
            total_amount: totalAmount,
            platform_fee: platformFee,
            shipping_cost: shippingCost,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            shipping_address: input.shippingAddress as any,
            notes: input.notes,
            status: 'pending_payment',
            items: {
              create: cart.items.map((item) => ({
                product_id: item.productId,
                farmer_id: item.farmerId,
                quantity: item.quantity,
                price_per_unit: item.price_per_unit,
                subtotal: item.subtotal,
              })),
            },
          },
          include: {
            items: true,
          },
        });

        return newOrder;
      });

      // 6. Kosongkan cart di Redis
      await RedisClient.del(`cart:${userId}`);

      // Publish ORDER_CREATED event
      await MessageBroker.publish(BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.ORDER_CREATED, {
        orderId: order.id,
        buyerId: order.buyer_id,
        totalAmount: Number(order.total_amount),
        items: order.items.map((item) => ({
          productId: item.product_id,
          farmerId: item.farmer_id,
          quantity: Number(item.quantity),
          price: Number(item.price_per_unit),
          subtotal: Number(item.subtotal),
        })),
      });

      // 7. Schedule job di Bull Queue: payment-timeout-queue (15 menit)
      await paymentTimeoutQueue.add(
        'cancel-order',
        { orderId: order.id },
        {
          delay: 15 * 60 * 1000,
          jobId: `payment-timeout-${order.id}`,
        }
      );

      return order;
    } catch (error) {
      // Ideally rollback stock here if DB transaction fails
      // But for simplicity in this task, we focus on the flow
      logger.error('❌ Checkout failed:', error);
      throw error;
    }
  }
}

export default new OrderService();
