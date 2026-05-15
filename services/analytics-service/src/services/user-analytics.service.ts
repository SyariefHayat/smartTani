import { logger } from '../../../../shared/utils/logger';
import userRepository from '../repositories/user.repository';
import RedisClient from '../lib/redis';
import { UserGrowthQuery } from '../schemas/analytics.schema';

class UserService {
  private CACHE_PREFIX = 'analytics:users:';
  private TTL = 300; // 5 minutes

  async getUserGrowth(query: UserGrowthQuery) {
    const cacheKey = `${this.CACHE_PREFIX}${JSON.stringify(query)}`;

    // 1. Try to get from cache
    const cachedData = await RedisClient.get(cacheKey);
    if (cachedData) {
      logger.info('⚡ Returning user growth from cache');
      return JSON.parse(cachedData as string);
    }

    // 2. If not in cache, query DB
    const data = await userRepository.getUserGrowth(query);

    // 3. Transform data to better format for frontend if needed
    // The current query returns raw rows. Let's group by date for a cleaner time-series.
    const transformed = this.transformToTimeSeries(data);

    // 4. Save to cache
    await RedisClient.setex(cacheKey, this.TTL, JSON.stringify(transformed));

    return transformed;
  }

  private transformToTimeSeries(data: Array<{ date: Date; role: string; count: number }>) {
    const grouped: Record<string, any> = {};

    data.forEach((row) => {
      const dateStr = row.date.toISOString().split('T')[0];
      if (!grouped[dateStr]) {
        grouped[dateStr] = { date: dateStr };
      }
      grouped[dateStr][row.role] = row.count;
    });

    return Object.values(grouped);
  }
}

export default new UserService();
