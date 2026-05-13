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
import { seedCategories } from './scripts/seed-categories';

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
import { getHealth } from './controllers/health.controller';
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';

export const app = express();

app.use(express.json());
app.use(cors());
app.use(correlationIdMiddleware);
app.use(requestLoggerMiddleware);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', getHealth);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);

// Sentry Error Handler
if (env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

app.use(errorHandlerMiddleware);

export const bootstrap = async () => {
  try {
    // Initialize RabbitMQ connection
    await MessageBroker.connect();

    // Initialize Redis connection
    RedisClient.getInstance();

    // Initialize MongoDB connection
    await connectMongoDB();

    // Seed categories
    await seedCategories();

    if (process.env.NODE_ENV !== 'test') {
      app.listen(env.PORT, () => {
        console.log(
          `🚀 Marketplace Service is running on port ${env.PORT} in ${env.NODE_ENV} mode`
        );
      });
    }
  } catch (error) {
    console.error('Failed to start Marketplace Service:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  bootstrap();
}

export default app;
