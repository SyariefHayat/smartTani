import { logger } from '../../../../shared/utils/logger';
import investmentAnalyticsRepository from '../repositories/investment-analytics.repository';
import RedisClient from '../lib/redis';

class InvestmentAnalyticsService {
  private CACHE_KEY = 'analytics:investments';
  private TTL = 300; // 5 minutes

  async getInvestmentAnalytics() {
    // 1. Try to get from cache
    const cachedData = await RedisClient.get(this.CACHE_KEY);
    if (cachedData) {
      logger.info('⚡ Returning investment analytics from cache');
      return JSON.parse(cachedData as string);
    }

    // 2. If not in cache, query DB
    const metrics = await investmentAnalyticsRepository.getInvestmentMetrics();

    // 3. Save to cache
    await RedisClient.setex(this.CACHE_KEY, this.TTL, JSON.stringify(metrics));

    return metrics;
  }
}

export default new InvestmentAnalyticsService();
