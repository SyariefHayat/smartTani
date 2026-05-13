import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import RedisClient from '../lib/redis';
import { errorResponse } from '../../../../shared/utils/response';
import { AppRequest } from '../../../../shared/types/express';

export const gatewayRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: (req) => ((req as AppRequest).user ? 100 : 1000),
  keyGenerator: (req) => {
    const user = (req as AppRequest).user;
    return user ? `user:${user.id}` : (req.ip as string);
  },
  validate: false,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  store: new RedisStore({
    // @ts-expect-error - ioredis type mismatch with rate-limit-redis, but it works
    sendCommand: (...args: string[]) => RedisClient.getInstance().call(...args),
  }),
  handler: (req, res) => {
    res
      .status(429)
      .json(errorResponse('AUTH_006', 'Terlalu banyak permintaan. Silakan coba lagi nanti.'));
  },
});
