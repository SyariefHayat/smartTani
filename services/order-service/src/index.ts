import MessageBroker from './lib/broker';
import './config/env';
import { env } from './config/env';
// Initialize RabbitMQ connection
MessageBroker.connect();

import RedisClient from './lib/redis';

// Initialize Redis connection
RedisClient.getInstance();

console.log(`order-service is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
