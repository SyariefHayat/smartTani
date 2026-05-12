import './config/env';
import { env } from './config/env';
import RedisClient from './lib/redis';

// Initialize Redis connection
RedisClient.getInstance();

console.log(`investment-service is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
