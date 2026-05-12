import MessageBroker from './lib/broker';
import './config/env';
import { env } from './config/env';
import { connectMongoDB } from './lib/mongoose';
// Initialize RabbitMQ connection
MessageBroker.connect();

import RedisClient from './lib/redis';

const startServer = async () => {
  try {
    // Initialize Redis connection
    RedisClient.getInstance();

    // Initialize MongoDB connection
    await connectMongoDB();

    console.log(`🚀 marketplace-service is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  } catch (error) {
    console.error('Failed to start marketplace-service:', error);
    process.exit(1);
  }
};

startServer();
