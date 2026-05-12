import MessageBroker from './lib/broker';
import './config/env';
// Initialize RabbitMQ connection
MessageBroker.connect();

import RedisClient from './lib/redis';

// Initialize Redis connection
// Initialize RabbitMQ connection
MessageBroker.connect();

RedisClient.getInstance();

console.log('API Gateway is running');
