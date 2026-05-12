import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import * as Sentry from '@sentry/node';
import './config/env';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import RedisClient from './lib/redis';
import MessageBroker from './lib/broker';

// Initialize Sentry
Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.NODE_ENV,
  tracesSampleRate: 1.0,
});

import { correlationIdMiddleware } from '../../../shared/middleware/correlationId';
import { requestLoggerMiddleware } from '../../../shared/middleware/requestLogger';
import { errorHandlerMiddleware } from '../../../shared/middleware/errorHandler';
import healthRoutes from './routes/health.routes';

const app = express();

app.use(express.json());
app.use(cors());
app.use(correlationIdMiddleware);
app.use(requestLoggerMiddleware);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/health', healthRoutes);

// Sentry Error Handler
Sentry.setupExpressErrorHandler(app);

app.use(errorHandlerMiddleware);

const bootstrap = async () => {
  try {
    // Initialize Redis
    RedisClient.getInstance();

    // Initialize RabbitMQ
    await MessageBroker.connect();

    app.listen(env.PORT, () => {
      console.log(`🚀 Auth Service is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('Failed to start Auth Service:', error);
    process.exit(1);
  }
};

bootstrap();
