import { PrismaClient } from '@prisma/client';
import { AppError } from '../../../../shared/types/express';
import MidtransManager from '../lib/midtrans';
import { InitiatePaymentInput } from '../schemas/payment.schema';

const prisma = new PrismaClient();

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
        quantity: item.quantity,
        name: `Product ${item.product_id}`, // In real app we might fetch title from marketplace-service again or store in OrderItem
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
}

export default new PaymentService();
