import './config/env';
import RedisClient from './lib/redis';

// Initialize Redis connection
RedisClient.getInstance();

console.log('API Gateway is running');
