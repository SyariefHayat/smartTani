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
            console.error('❌ Redis connection failed after 10 retries');
            return null; // stop retrying
          }
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      RedisClient.instance.on('connect', () => {
        console.log('✅ Connected to Redis');
      });

      RedisClient.instance.on('error', (err) => {
        console.error('❌ Redis Error:', err);
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
}

export default RedisClient;
