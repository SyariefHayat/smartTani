import { logger } from '../../../../shared/utils/logger';
import orderAnalyticsRepository from '../repositories/order-analytics.repository';
import RedisClient from '../lib/redis';
import { OrderAnalyticsQuery } from '../schemas/analytics.schema';

class OrderAnalyticsService {
  private CACHE_PREFIX = 'analytics:orders:';
  private TTL = 300; // 5 minutes

  async getOrderAnalytics(query: OrderAnalyticsQuery) {
    const cacheKey = `${this.CACHE_PREFIX}${JSON.stringify(query)}`;

    // 1. Try to get from cache
    const cachedData = await RedisClient.get(cacheKey);
    if (cachedData) {
      logger.info('⚡ Returning order analytics from cache');
      return JSON.parse(cachedData as string);
    }

    // 2. If not in cache, query DB
    const data = await orderAnalyticsRepository.getOrderVolumeAndValue(query);

    // 3. Transform data
    const transformed = data.map(row => ({
      date: row.date.toISOString().split('T')[0],
      volume: row.volume,
      value: row.value
    }));

    // 4. Save to cache
    await RedisClient.setex(cacheKey, this.TTL, JSON.stringify(transformed));

    return transformed;
  }
}

export default new OrderAnalyticsService();
