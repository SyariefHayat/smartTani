import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import './config/env';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import RedisClient from './lib/redis';
import MessageBroker from './lib/broker';
import { correlationIdMiddleware } from '../../../shared/middleware/correlationId';
import { requestLoggerMiddleware } from '../../../shared/middleware/requestLogger';
import { errorHandlerMiddleware } from '../../../shared/middleware/errorHandler';

const app = express();

// Initialize RabbitMQ connection
MessageBroker.connect();

// Initialize Redis connection
RedisClient.getInstance();

app.use(express.json());
app.use(cors());
app.use(correlationIdMiddleware);
app.use(requestLoggerMiddleware);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Analytics Service is healthy' });
});

app.use(errorHandlerMiddleware);

app.listen(env.PORT, () => {
  console.log(`🚀 Analytics Service is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});
