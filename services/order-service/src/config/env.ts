import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3003').transform(Number),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  RABBITMQ_URL: z.string().url(),
  MIDTRANS_SERVER_KEY: z.string().min(1),
  MIDTRANS_CLIENT_KEY: z.string().min(1),
  MIDTRANS_IS_PRODUCTION: z
    .string()
    .default('false')
    .transform((v) => v === 'true'),
  PLATFORM_FEE_PERCENT: z.string().default('2.0').transform(Number),
  ORDER_PAYMENT_TIMEOUT_MINUTES: z.string().default('15').transform(Number),
  ORDER_AUTO_COMPLETE_DAYS: z.string().default('7').transform(Number),
  SENTRY_DSN: z.string().optional(),
  MARKETPLACE_SERVICE_URL: z.string().url().default('http://localhost:3002'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
