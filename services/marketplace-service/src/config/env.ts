import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3002').transform(Number),
  MONGODB_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_BUCKET_NAME: z.string().min(1),
  AWS_REGION: z.string().min(1),
  RABBITMQ_URL: z.string().url(),
  SENTRY_DSN: z.string().optional(),
  AUTH_SERVICE_URL: z.string().url().default('http://localhost:3001'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
