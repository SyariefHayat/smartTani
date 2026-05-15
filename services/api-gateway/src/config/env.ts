import { logger } from '../../../../shared/utils/logger';
import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000').transform(Number),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
  SENTRY_DSN: z.string().optional(),
  RABBITMQ_URL: z.string().url(),

  // Downstream Services
  AUTH_SERVICE_URL: z.string().default('http://127.0.0.1:3001'),
  MARKETPLACE_SERVICE_URL: z.string().default('http://127.0.0.1:3002'),
  ORDER_SERVICE_URL: z.string().default('http://127.0.0.1:3003'),
  INVESTMENT_SERVICE_URL: z.string().default('http://127.0.0.1:3004'),
  LOGISTICS_SERVICE_URL: z.string().default('http://127.0.0.1:3005'),
  NOTIFICATION_SERVICE_URL: z.string().default('http://127.0.0.1:3006'),
  ANALYTICS_SERVICE_URL: z.string().default('http://127.0.0.1:3007'),
  CORS_ORIGIN: z.string().default('*'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  logger.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
