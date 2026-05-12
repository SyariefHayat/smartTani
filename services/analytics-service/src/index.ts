import './config/env';
import { env } from './config/env';
import RedisClient from './lib/redis';
import MessageBroker from './lib/broker';

// Initialize RabbitMQ connection
MessageBroker.connect();

// Initialize Redis connection
RedisClient.getInstance();

console.log(`analytics-service is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
