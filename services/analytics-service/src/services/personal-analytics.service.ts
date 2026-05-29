import { logger } from '../../../../shared/utils/logger';
import farmerAnalyticsRepository from '../repositories/farmer-analytics.repository';
import investorAnalyticsRepository from '../repositories/investor-analytics.repository';
import RedisClient from '../lib/redis';

class PersonalAnalyticsService {
  private TTL = 300; // 5 minutes

  async getFarmerAnalytics(farmerId: string) {
    const cacheKey = `analytics:farmer:${farmerId}`;

    const cachedData = await RedisClient.get(cacheKey);
    if (cachedData) {
      logger.info(`⚡ Returning farmer analytics for ${farmerId} from cache`);
      return JSON.parse(cachedData as string);
    }

    const metrics = await farmerAnalyticsRepository.getFarmerMetrics(farmerId);
    await RedisClient.setex(cacheKey, this.TTL, JSON.stringify(metrics));

    return metrics;
  }

  async getFarmerRevenueChart(farmerId: string, query: { from_date?: string; to_date?: string }) {
    const cacheKey = `analytics:farmer:${farmerId}:revenue-chart:${JSON.stringify(query)}`;

    const cachedData = await RedisClient.get(cacheKey);
    if (cachedData) {
      logger.info(`⚡ Returning farmer revenue chart for ${farmerId} from cache`);
      return JSON.parse(cachedData as string);
    }

    const data = await farmerAnalyticsRepository.getRevenueChart(
      farmerId,
      query.from_date,
      query.to_date
    );
    await RedisClient.setex(cacheKey, this.TTL, JSON.stringify(data));

    return data;
  }

  async getFarmerFinance(farmerId: string, query: { page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const cacheKey = `analytics:farmer:${farmerId}:finance:${page}:${limit}`;

    const cachedData = await RedisClient.get(cacheKey);
    if (cachedData) {
      logger.info(`⚡ Returning farmer finance for ${farmerId} from cache`);
      return JSON.parse(cachedData as string);
    }

    const data = await farmerAnalyticsRepository.getFinanceAnalytics(farmerId, page, limit);
    await RedisClient.setex(cacheKey, this.TTL, JSON.stringify(data));

    return data;
  }

  async getInvestorAnalytics(investorId: string) {
    const cacheKey = `analytics:investor:${investorId}`;

    const cachedData = await RedisClient.get(cacheKey);
    if (cachedData) {
      logger.info(`⚡ Returning investor analytics for ${investorId} from cache`);
      return JSON.parse(cachedData as string);
    }

    const metrics = await investorAnalyticsRepository.getInvestorMetrics(investorId);
    await RedisClient.setex(cacheKey, this.TTL, JSON.stringify(metrics));

    return metrics;
  }
}

export default new PersonalAnalyticsService();
