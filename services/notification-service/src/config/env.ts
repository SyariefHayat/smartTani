import { logger } from '../../../../shared/utils/logger';
import 'dotenv/config';
import { z } from 'zod';

const emptyToUndefined = z.preprocess(
  (val) => (val === '' ? undefined : val),
  z.string().optional()
);
const emptyToUndefinedEmail = z.preprocess(
  (val) => (val === '' ? undefined : val),
  z.string().email().optional()
);
const emptyToUndefinedUrl = z.preprocess(
  (val) => (val === '' ? undefined : val),
  z.string().url().optional()
);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3006').transform(Number),
  DATABASE_URL: emptyToUndefinedUrl,
  REDIS_URL: z.string().url(),
  SMTP_HOST: emptyToUndefined,
  SMTP_PORT: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().optional().transform(Number)
  ),
  SMTP_USER: emptyToUndefined,
  SMTP_PASS: emptyToUndefined,
  SENDGRID_API_KEY: emptyToUndefined,
  EMAIL_FROM: emptyToUndefinedEmail,
  AUTH_SERVICE_URL: z.string().url().default('http://auth-service:3001'),
  FIREBASE_PROJECT_ID: emptyToUndefined,
  FIREBASE_PRIVATE_KEY: emptyToUndefined,
  FIREBASE_CLIENT_EMAIL: emptyToUndefinedEmail,
  RABBITMQ_URL: z.string().url(),
  SENTRY_DSN: emptyToUndefined,
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  logger.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
