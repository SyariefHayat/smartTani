import { logger } from '../../../../shared/utils/logger';
import Redis from 'ioredis';
import { env } from '../config/env';

class RedisClient {
  private static instance: Redis;

  public static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: null,
        retryStrategy: (times) => {
          if (times > 10) {
            logger.error('❌ Redis connection failed after 10 retries');
            return null; // stop retrying
          }
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      RedisClient.instance.on('connect', () => {
        logger.info('✅ Connected to Redis');
      });

      RedisClient.instance.on('error', (err) => {
        logger.error('❌ Redis Error:', err);
      });
    }
    return RedisClient.instance;
  }

  public static async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const client = RedisClient.getInstance();
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await client.setex(key, ttl, stringValue);
    } else {
      await client.set(key, stringValue);
    }
  }

  public static async get<T>(key: string): Promise<T | null> {
    const client = RedisClient.getInstance();
    const value = await client.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  public static async del(key: string): Promise<void> {
    const client = RedisClient.getInstance();
    await client.del(key);
  }

  public static async setex(key: string, seconds: number, value: unknown): Promise<void> {
    await this.set(key, value, seconds);
  }

  public static async invalidateUserRefreshTokens(userId: string): Promise<void> {
    const client = RedisClient.getInstance();
    const stream = client.scanStream({
      match: 'refresh:*',
      count: 100,
    });

    for await (const keys of stream) {
      if (keys.length > 0) {
        const values = await client.mget(...keys);
        const keysToDelete = keys.filter((key, index) => {
          const value = values[index];
          if (!value) return false;
          try {
            return JSON.parse(value) === userId;
          } catch {
            return value === userId;
          }
        });

        if (keysToDelete.length > 0) {
          await client.del(...keysToDelete);
        }
      }
    }
  }
}

export default RedisClient;
