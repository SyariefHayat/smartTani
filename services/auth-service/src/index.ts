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

// Initialize Sentry
Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.NODE_ENV,
  tracesSampleRate: 1.0,
});

import { correlationIdMiddleware } from '../../../shared/middleware/correlationId';
import { _requestLoggerMiddleware } from '../../../shared/middleware/requestLogger';
import { errorHandlerMiddleware } from '../../../shared/middleware/errorHandler';
import healthRoutes from './routes/health.routes';
import metricsRoutes from './routes/metrics.routes';
import authRoutes from './routes/auth.routes';
import { _metricsMiddleware } from './middleware/metrics.middleware';

import cluster from 'cluster';
import os from 'os';

export const app = express();

app.use(express.json());
app.use(cors());
app.use(correlationIdMiddleware);
// app.use(requestLoggerMiddleware); // Disabled for max performance, uncomment for debugging
// app.use(metricsMiddleware);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/health', healthRoutes);
app.use('/metrics', metricsRoutes);
app.use('/auth', authRoutes);

// Sentry Error Handler
Sentry.setupExpressErrorHandler(app);

app.use(errorHandlerMiddleware);

export const bootstrap = async () => {
  if (cluster.isPrimary && env.NODE_ENV === 'production') {
    const numCPUs = os.cpus().length;
    logger.info(`🚀 Primary ${process.pid} is running. Forking ${numCPUs} workers...`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      logger.info(`Worker ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    });
  } else {
    try {
      // Initialize Redis
      RedisClient.getInstance();

      // Initialize RabbitMQ
      await MessageBroker.connect();

      if (process.env.NODE_ENV !== 'test') {
        app.listen(env.PORT, () => {
          logger.info(
            `🚀 Auth Service worker ${process.pid} is running on port ${env.PORT} in ${env.NODE_ENV} mode`
          );
        });
      }
    } catch (error) {
      logger.error(`Failed to start Auth Service worker ${process.pid}:`, error);
      process.exit(1);
    }
  }
};

if (require.main === module) {
  bootstrap();
}

export default app;
