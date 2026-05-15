import { logger } from '../../../shared/utils/logger';
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
Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.NODE_ENV,
  tracesSampleRate: 1.0,
});

import { correlationIdMiddleware } from '../../../shared/middleware/correlationId';
import { requestLoggerMiddleware } from '../../../shared/middleware/requestLogger';
import { errorHandlerMiddleware } from '../../../shared/middleware/errorHandler';
import { initEvents } from './events';
import shipmentRoutes from './routes/shipment.routes';

const app = express();

app.use(express.json());
app.use(cors());
app.use(correlationIdMiddleware);
app.use(requestLoggerMiddleware);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/shipments', shipmentRoutes);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Logistics Service is healthy' });
});

// Sentry Error Handler
Sentry.setupExpressErrorHandler(app);

app.use(errorHandlerMiddleware);

const bootstrap = async () => {
  try {
    // Initialize Redis
    RedisClient.getInstance();

    // Initialize RabbitMQ
    await MessageBroker.connect();

    // Initialize events
    await initEvents();

    // Initialize MongoDB
    await connectMongoDB();

    app.listen(env.PORT, () => {
      logger.info(`🚀 Logistics Service is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Failed to start Logistics Service:', error);
    process.exit(1);
  }
};

bootstrap();
