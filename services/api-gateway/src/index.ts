import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { createProxyMiddleware } from 'http-proxy-middleware';
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
import { gatewayAuthMiddleware } from './middleware/auth.middleware';
import { gatewayRateLimiter } from './middleware/rate-limiter.middleware';
import { AppRequest } from '../../../shared/types/express';

export const app = express();

app.use(cors());
app.use(correlationIdMiddleware);
app.use(requestLoggerMiddleware);
app.use(gatewayAuthMiddleware);
app.use(gatewayRateLimiter);

// Proxy Routes
// NOTE: Must be defined BEFORE express.json() if we want to forward bodies correctly without complex fixes
const proxyOptions = {
  changeOrigin: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onProxyReq: (proxyReq: any, req: any) => {
    // Forward Correlation ID if present
    if (req.correlationId) {
      proxyReq.setHeader('X-Correlation-ID', req.correlationId);
    }

    // Forward User Info if present (from gatewayAuthMiddleware)
    if ((req as AppRequest).user) {
      proxyReq.setHeader('X-User-Id', (req as AppRequest).user!.id);
      proxyReq.setHeader('X-User-Role', (req as AppRequest).user!.role as string);
    }
  },
};

// Auth Service
app.use(
  createProxyMiddleware({ ...proxyOptions, target: env.AUTH_SERVICE_URL, pathFilter: '/auth' })
);

// Marketplace Service
app.use(
  createProxyMiddleware({
    ...proxyOptions,
    target: env.MARKETPLACE_SERVICE_URL,
    pathFilter: ['/products', '/categories'],
  })
);

// Order Service
app.use(
  createProxyMiddleware({
    ...proxyOptions,
    target: env.ORDER_SERVICE_URL,
    pathFilter: ['/cart', '/orders', '/payments'],
  })
);

// Investment Service
app.use(
  createProxyMiddleware({
    ...proxyOptions,
    target: env.INVESTMENT_SERVICE_URL,
    pathFilter: ['/proposals', '/investments'],
  })
);

// Logistics Service
app.use(
  createProxyMiddleware({
    ...proxyOptions,
    target: env.LOGISTICS_SERVICE_URL,
    pathFilter: '/shipments',
  })
);

// Notification Service
app.use(
  createProxyMiddleware({
    ...proxyOptions,
    target: env.NOTIFICATION_SERVICE_URL,
    pathFilter: '/notifications',
  })
);

// Analytics Service
app.use(
  createProxyMiddleware({
    ...proxyOptions,
    target: env.ANALYTICS_SERVICE_URL,
    pathFilter: '/analytics',
  })
);

// Internal Gateway Routes (require JSON parsing)
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'API Gateway is healthy' });
});

// Sentry Error Handler
Sentry.setupExpressErrorHandler(app);

app.use(errorHandlerMiddleware);

export const bootstrap = async () => {
  try {
    // Initialize Redis
    RedisClient.getInstance();

    // Initialize RabbitMQ
    await MessageBroker.connect();

    if (process.env.NODE_ENV !== 'test') {
      app.listen(env.PORT, () => {
        console.log(`🚀 API Gateway is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      });
    }
  } catch (error) {
    console.error('Failed to start API Gateway:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  bootstrap();
}

export default app;
