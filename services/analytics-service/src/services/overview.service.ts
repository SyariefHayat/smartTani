import { logger } from '../../../../shared/utils/logger';
import overviewRepository from '../repositories/overview.repository';
import RedisClient from '../lib/redis';

class OverviewService {
  private CACHE_KEY = 'analytics:overview';
  private TTL = 300; // 5 minutes

  async getOverview() {
    // 1. Try to get from cache
    const cachedData = await RedisClient.get(this.CACHE_KEY);
    if (cachedData) {
      logger.info('⚡ Returning analytics overview from cache');
      return JSON.parse(cachedData as string);
    }

    // 2. If not in cache, query DB
    const metrics = await overviewRepository.getGlobalMetrics();

    // 3. Save to cache
    await RedisClient.setex(this.CACHE_KEY, this.TTL, JSON.stringify(metrics));

    return metrics;
  }
}

export default new OverviewService();
