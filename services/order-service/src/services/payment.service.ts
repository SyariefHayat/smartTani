import { PrismaClient } from '@prisma/client';
import { AppError } from '../../../../shared/types/express';
import MidtransManager from '../lib/midtrans';
import { InitiatePaymentInput } from '../schemas/payment.schema';
import { BROKER_EXCHANGES, BROKER_ROUTING_KEYS } from '../../../../shared/constants/broker';
import MessageBroker from '../lib/broker';
import marketplaceClient from '../lib/marketplace-client';
import { paymentTimeoutQueue } from '../lib/queue';
import { verifyMidtransSignature } from '../lib/midtrans-verify';

const prisma = new PrismaClient();

interface MidtransWebhookData {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraud_status?: string;
}

export class PaymentService {
  async initiatePayment(
    userId: string,
    userEmail: string,
    fullName: string,
    input: InitiatePaymentInput
  ) {
    // 1. Fetch order from DB
    const order = await prisma.order.findUnique({
      where: { id: input.orderId },
      include: { items: true },
    });

    // 2. Validasi: order ada, milik user, status pending_payment
    if (!order) {
      const error = new Error('Order tidak ditemukan') as AppError;
      error.statusCode = 404;
      error.code = 'ORDER_001';
      throw error;
    }

    if (order.buyer_id !== userId) {
      const error = new Error('Anda tidak memiliki akses untuk order ini') as AppError;
      error.statusCode = 403;
      error.code = 'AUTH_011';
      throw error;
    }

    if (order.status !== 'pending_payment') {
      const error = new Error('Order sudah tidak bisa dibayar') as AppError;
      error.statusCode = 400;
      error.code = 'ORDER_002';
      throw error;
    }

    // 3. Buat transaksi di Midtrans Snap
    const snap = MidtransManager.getSnap();
    const parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: Math.round(Number(order.total_amount)),
      },
      customer_details: {
        first_name: fullName,
        email: userEmail,
      },
      item_details: order.items.map((item) => ({
        id: item.product_id,
        price: Math.round(Number(item.price_per_unit)),
        quantity: Math.round(Number(item.quantity)),
        name: `Product ${item.product_id}`,
      })),
      expiry: {
        duration: 15,
        unit: 'minutes',
      },
    };

    // Add fees as item details for transparency in Midtrans
    if (Number(order.platform_fee) > 0) {
      (parameter.item_details as Record<string, unknown>[]).push({
        id: 'platform-fee',
        price: Math.round(Number(order.platform_fee)),
        quantity: 1,
        name: 'Biaya Platform',
      });
    }

    if (Number(order.shipping_cost) > 0) {
      (parameter.item_details as Record<string, unknown>[]).push({
        id: 'shipping-cost',
        price: Math.round(Number(order.shipping_cost)),
        quantity: 1,
        name: 'Ongkos Kirim',
      });
    }

    const transaction = await snap.createTransaction(parameter);

    // 4. Simpan payment_url di order
    await prisma.order.update({
      where: { id: order.id },
      data: {
        payment_url: transaction.redirect_url,
        // payment_token: transaction.token, // Optional
      },
    });

    return {
      paymentUrl: transaction.redirect_url,
      orderId: order.id,
    };
  }

  async handleWebhook(data: MidtransWebhookData) {
    // 1. Verifikasi signature
    const isValid = verifyMidtransSignature({
      order_id: data.order_id,
      status_code: data.status_code,
      gross_amount: data.gross_amount,
      signature_key: data.signature_key,
    });

    if (!isValid) {
      const error = new Error('Invalid signature') as AppError;
      error.statusCode = 400;
      throw error;
    }

    const orderId = data.order_id;
    const transactionStatus = data.transaction_status;
    const fraudStatus = data.fraud_status;

    let newStatus: string | null = null;

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        newStatus = 'paid';
      }
    } else if (transactionStatus === 'settlement') {
      newStatus = 'paid';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'expire') {
      newStatus = 'cancelled';
    } else if (transactionStatus === 'deny') {
      console.log(`⚠️ Payment denied for order ${orderId}`);
      return { message: 'Payment denied' };
    } else if (transactionStatus === 'pending') {
      newStatus = 'pending_payment';
    }

    if (!newStatus) return { message: 'Ignored' };

    // 2. Fetch current order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return { message: 'Order not found' };
    if (order.status === newStatus) return { message: 'No change' };

    // 3. Update Order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        paid_at: newStatus === 'paid' ? new Date() : undefined,
      },
    });

    // 4. Action based on status
    if (newStatus === 'paid') {
      // Batalkan job timeout di Bull Queue
      const jobId = `payment-timeout:${order.id}`;
      const job = await paymentTimeoutQueue.getJob(jobId);
      if (job) {
        await job.remove();
        console.log(`✅ Cancelled payment timeout job for order ${order.id}`);
      }

      // Kirim event ORDER_PAID ke RabbitMQ
      MessageBroker.publish(BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.ORDER_PAID, {
        orderId: order.id,
        buyerId: order.buyer_id,
        totalAmount: order.total_amount,
        items: order.items.map((item) => ({
          productId: item.product_id,
          quantity: Number(item.quantity),
          price: Number(item.price_per_unit),
        })),
      }).catch((err) => console.error('❌ Failed to publish ORDER_PAID:', err));
    } else if (newStatus === 'cancelled') {
      // Kembalikan stok ke marketplace-service
      const items = order.items.map((item) => ({
        productId: item.product_id,
        quantity: Number(item.quantity),
      }));
      await marketplaceClient.restoreStock(items);
    }

    return { message: `Order status updated to ${newStatus}` };
  }
}

export default new PaymentService();
