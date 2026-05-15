import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import RedisClient from '../lib/redis';
import { errorResponse } from '../../../../shared/utils/response';

export const loginRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100000, // Effectively disabled for performance test
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  store: new RedisStore({
    // @ts-expect-error - ioredis type mismatch with rate-limit-redis, but it works
    sendCommand: (...args: string[]) => RedisClient.getInstance().call(...args),
  }),
  handler: (req, res) => {
    res
      .status(429)
      .json(
        errorResponse(
          'AUTH_006',
          'Terlalu banyak percobaan login. Silakan coba lagi dalam 1 menit.'
        )
      );
  },
});
