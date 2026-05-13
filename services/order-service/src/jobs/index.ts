import { Worker, Job } from 'bullmq';
import { env } from '../config/env';

const connection = {
  url: env.REDIS_URL,
};

export const initWorkers = () => {
  // Payment Timeout Worker
  const paymentWorker = new Worker(
    'payment-timeout-queue',
    async (job: Job) => {
      console.log(`🕒 Processing payment timeout for order: ${job.data.orderId}`);
      // TODO: Implement cancel order logic in next tasks
    },
    { connection }
  );

  // Auto Complete Worker
  const completionWorker = new Worker(
    'auto-complete-queue',
    async (job: Job) => {
      console.log(`📦 Processing auto-completion for order: ${job.data.orderId}`);
      // TODO: Implement auto-complete logic in next tasks
    },
    { connection }
  );

  paymentWorker.on('failed', (job, err) => {
    console.error(`❌ Payment timeout job ${job?.id} failed:`, err);
  });

  completionWorker.on('failed', (job, err) => {
    console.error(`❌ Auto completion job ${job?.id} failed:`, err);
  });

  console.log('👷 BullMQ Workers started');
};
