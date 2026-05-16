import { logger } from '../../../shared/utils/logger';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as Sentry from '@sentry/node';
import http from 'http';
import https from 'https';
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
import { xssSanitizerMiddleware } from '../../../shared/middleware/xssSanitizer';
import { gatewayAuthMiddleware } from './middleware/auth.middleware';
import { gatewayRateLimiter } from './middleware/rate-limiter.middleware';
import { AppRequest } from '../../../shared/types/express';

// Performance: Use keep-alive agents for proxying
const agentOptions = {
  keepAlive: true,
  keepAliveMsecs: 10000,
  maxSockets: 2000,
  maxFreeSockets: 256,
  timeout: 60000,
};

const httpAgent = new http.Agent(agentOptions);
const _httpsAgent = new https.Agent(agentOptions);

export const app = express();

app.use(cors({
  origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
  credentials: true
}));

// HTTPS Enforcement (for production/staging)
app.use((req, res, next) => {
  if (
    env.NODE_ENV === 'production' &&
    req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

app.use(express.json());
app.use(xssSanitizerMiddleware);
app.use(correlationIdMiddleware);
// app.use(requestLoggerMiddleware); // Keep disabled for perf
app.use(gatewayAuthMiddleware);
// app.use(gatewayRateLimiter);

// For proxying POST requests correctly when body-parser is used
// In this project, express.json() is called BEFORE proxy routes.
// We use a custom fix to ensure bodies are forwarded.

// Proxy Routes
const proxyOptions = {
  changeOrigin: true,
  agent: httpAgent, // Use keep-alive agent
  on: {
    proxyReq: (proxyReq: any, req: any) => {
      // Forward Correlation ID if present
      if (req.correlationId) {
        proxyReq.setHeader('X-Correlation-ID', req.correlationId);
      }

      // Forward User Info if present (from gatewayAuthMiddleware)
      if ((req as AppRequest).user) {
        proxyReq.setHeader('X-User-Id', (req as AppRequest).user!.id);
        proxyReq.setHeader('X-User-Role', (req as AppRequest).user!.role as string);
        proxyReq.setHeader('X-User-Email', (req as AppRequest).user!.email as string);
        if ((req as AppRequest).user!.fullName) {
          proxyReq.setHeader('X-User-Full-Name', (req as AppRequest).user!.fullName as string);
        }
      }

      // Fix for POST bodies if they were already parsed
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
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

// Internal Gateway Routes
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
        logger.info(`🚀 API Gateway is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      });
    }
  } catch (error) {
    logger.error('Failed to start API Gateway:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  bootstrap();
}

export default app;
