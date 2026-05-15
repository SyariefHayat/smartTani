import { logger } from '../../../../shared/utils/logger';
import { Worker, Job } from 'bullmq';
import { env } from '../config/env';
import orderRepository from '../repositories/order.repository';
import marketplaceClient from '../lib/marketplace-client';
import MessageBroker from '../lib/broker';
import { BROKER_EXCHANGES, BROKER_ROUTING_KEYS } from '../../../../shared/constants/broker';

const connection = {
  url: env.REDIS_URL,
};

export const initWorkers = () => {
  // Payment Timeout Worker
  const paymentWorker = new Worker(
    'payment-timeout-queue',
    async (job: Job) => {
      const { orderId } = job.data;
      logger.info(`🕒 Processing payment timeout for order: ${orderId}`);

      const order = await orderRepository.findById(orderId);

      if (!order) {
        logger.warn(`⚠️ Order ${orderId} not found in timeout job`);
        return;
      }

      if (order.status === 'pending_payment') {
        logger.info(`🚫 Cancelling order ${orderId} due to timeout`);

        // Update status to 'cancelled'
        await orderRepository.updateStatus(orderId, 'cancelled');

        // Restore stock in marketplace-service
        const itemsToRestore = order.items.map((item) => ({
          productId: item.product_id,
          quantity: Number(item.quantity),
        }));

        const restored = await marketplaceClient.restoreStock(itemsToRestore);
        if (!restored) {
          logger.error(`❌ Failed to restore stock for cancelled order ${orderId}`);
        }

        // Publish Event
        await MessageBroker.publish(BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.ORDER_CANCELLED, {
          orderId: order.id,
          buyerId: order.buyer_id,
          reason: 'Payment timeout',
          items: order.items,
        });
      } else {
        logger.info(`✅ Order ${orderId} status is ${order.status}, skipping cancellation`);
      }
    },
    { connection }
  );

  // Auto Complete Worker
  const completionWorker = new Worker(
    'auto-complete-queue',
    async (job: Job) => {
      const { orderId } = job.data;
      logger.info(`🕒 Processing auto-completion for order: ${orderId}`);

      const order = await orderRepository.findById(orderId);

      if (!order) {
        logger.warn(`⚠️ Order ${orderId} not found in auto-complete job`);
        return;
      }

      if (order.status === 'shipped') {
        logger.info(`✅ Auto-completing order ${orderId}`);

        // Update status to 'delivered' and set completed_at
        const updatedOrder = await orderRepository.completeOrder(orderId);

        // Publish Event
        await MessageBroker.publish(BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.ORDER_DELIVERED, {
          orderId: updatedOrder.id,
          buyerId: updatedOrder.buyer_id,
          totalAmount: updatedOrder.total_amount,
          items: updatedOrder.items,
          completedAt: updatedOrder.completed_at,
        });
      } else {
        logger.info(`ℹ️ Order ${orderId} status is ${order.status}, skipping auto-completion`);
      }
    },
    { connection }
  );

  paymentWorker.on('failed', (job, err) => {
    logger.error(`❌ Payment timeout job ${job?.id} failed:`, err);
  });

  completionWorker.on('failed', (job, err) => {
    logger.error(`❌ Auto completion job ${job?.id} failed:`, err);
  });
};
