import { Queue } from 'bullmq';
import { env } from '../config/env';

const connection = {
  url: env.REDIS_URL,
};

export const paymentTimeoutQueue = new Queue('payment-timeout-queue', {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: 1000,
  },
});

export const autoCompleteQueue = new Queue('auto-complete-queue', {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: 1000,
  },
});
