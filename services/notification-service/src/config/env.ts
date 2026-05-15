import { logger } from '../../../../shared/utils/logger';
import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3006').transform(Number),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional().transform(Number),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email(),
  AUTH_SERVICE_URL: z.string().url().default('http://auth-service:3001'),
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_PRIVATE_KEY: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  RABBITMQ_URL: z.string().url(),
  SENTRY_DSN: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  logger.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
