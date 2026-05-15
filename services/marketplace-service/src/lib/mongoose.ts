import { logger } from '../../../../shared/utils/logger';
import mongoose from 'mongoose';
import { env } from '../config/env';

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 seconds

export const connectMongoDB = async () => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      await mongoose.connect(env.MONGODB_URL);
      logger.info('✅ Connected to MongoDB');
      return;
    } catch (error) {
      retries++;
      logger.error(
        `❌ MongoDB connection attempt ${retries} failed:`,
        error instanceof Error ? error.message : error
      );

      if (retries < MAX_RETRIES) {
        logger.info(`Retrying in ${RETRY_INTERVAL / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
      } else {
        logger.error('❌ Max MongoDB connection retries reached. Exiting...');
        process.exit(1);
      }
    }
  }
};
