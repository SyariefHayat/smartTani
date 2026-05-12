import './config/env';
import { env } from './config/env';
import { connectMongoDB } from './lib/mongoose';

const startServer = async () => {
  try {
    // Initialize MongoDB connection
    await connectMongoDB();

    console.log(`🚀 marketplace-service is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  } catch (error) {
    console.error('Failed to start marketplace-service:', error);
    process.exit(1);
  }
};

startServer();
