import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3004').transform(Number),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  INVESTMENT_FEE_PERCENT: z.string().default('1.0').transform(Number),
  MIN_INVESTMENT_AMOUNT: z.string().default('100000').transform(Number),
  RABBITMQ_URL: z.string().url(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
