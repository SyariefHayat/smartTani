import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import * as Sentry from '@sentry/node';
import './config/env';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import RedisClient from './lib/redis';
import MessageBroker from './lib/broker';
import { connectMongoDB } from './lib/mongoose';

// Initialize Sentry
if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: 1.0,
  });
}

import { correlationIdMiddleware } from '../../../shared/middleware/correlationId';
import { requestLoggerMiddleware } from '../../../shared/middleware/requestLogger';
import { errorHandlerMiddleware } from '../../../shared/middleware/errorHandler';

const app = express();

app.use(express.json());
app.use(cors());
app.use(correlationIdMiddleware);
app.use(requestLoggerMiddleware);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Order Service is healthy' });
});

// Sentry Error Handler
if (env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

app.use(errorHandlerMiddleware);

const bootstrap = async () => {
  try {
    // Initialize RabbitMQ connection
    await MessageBroker.connect();

    // Initialize Redis connection
    RedisClient.getInstance();

    // Initialize MongoDB connection
    await connectMongoDB();

    app.listen(env.PORT, () => {
      console.log(`🚀 Order Service is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('Failed to start Order Service:', error);
    process.exit(1);
  }
};

bootstrap();
