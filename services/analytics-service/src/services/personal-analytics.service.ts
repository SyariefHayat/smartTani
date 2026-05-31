import { logger } from '../../../../shared/utils/logger';
import farmerAnalyticsRepository from '../repositories/farmer-analytics.repository';
import investorAnalyticsRepository from '../repositories/investor-analytics.repository';
import buyerAnalyticsRepository from '../repositories/buyer-analytics.repository';
import distributorAnalyticsRepository from '../repositories/distributor-analytics.repository';
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

  async getInvestorROIChart(investorId: string) {
    const cacheKey = `analytics:investor:${investorId}:roi-chart`;

    const cachedData = await RedisClient.get(cacheKey);
    if (cachedData) {
      logger.info(`⚡ Returning investor ROI chart for ${investorId} from cache`);
      return JSON.parse(cachedData as string);
    }

    const chartData = await investorAnalyticsRepository.getROIChart(investorId);
    await RedisClient.setex(cacheKey, this.TTL, JSON.stringify(chartData));

    return chartData;
  }

  async getInvestorFinance(investorId: string, query: { page?: number; limit?: number }) {
    const cacheKey = `analytics:investor:${investorId}:finance:${JSON.stringify(query)}`;

    const cachedData = await RedisClient.get(cacheKey);
    if (cachedData) {
      logger.info(`⚡ Returning investor finance for ${investorId} from cache`);
      return JSON.parse(cachedData as string);
    }

    const financeData = await investorAnalyticsRepository.getInvestorFinance(
      investorId,
      query?.page,
      query?.limit
    );
    await RedisClient.setex(cacheKey, this.TTL, JSON.stringify(financeData));

    return financeData;
  }

  async getBuyerAnalytics(buyerId: string) {
    const cacheKey = `analytics:buyer:${buyerId}`;

    const cachedData = await RedisClient.get(cacheKey);
    if (cachedData) {
      logger.info(`⚡ Returning buyer analytics for ${buyerId} from cache`);
      return JSON.parse(cachedData as string);
    }

    const metrics = await buyerAnalyticsRepository.getBuyerMetrics(buyerId);
    await RedisClient.setex(cacheKey, this.TTL, JSON.stringify(metrics));

    return metrics;
  }

  async getBuyerSpendingChart(buyerId: string, query: { from_date?: string; to_date?: string }) {
    const cacheKey = `analytics:buyer:${buyerId}:spending-chart:${JSON.stringify(query)}`;

    const cachedData = await RedisClient.get(cacheKey);
    if (cachedData) {
      logger.info(`⚡ Returning buyer spending chart for ${buyerId} from cache`);
      return JSON.parse(cachedData as string);
    }

    const data = await buyerAnalyticsRepository.getSpendingChart(
      buyerId,
      query.from_date,
      query.to_date
    );
    await RedisClient.setex(cacheKey, this.TTL, JSON.stringify(data));

    return data;
  }

  async getBuyerFinance(buyerId: string, query: { page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const cacheKey = `analytics:buyer:${buyerId}:finance:${page}:${limit}`;

    const cachedData = await RedisClient.get(cacheKey);
    if (cachedData) {
      logger.info(`⚡ Returning buyer finance for ${buyerId} from cache`);
      return JSON.parse(cachedData as string);
    }

    const data = await buyerAnalyticsRepository.getFinanceAnalytics(buyerId, page, limit);
    await RedisClient.setex(cacheKey, this.TTL, JSON.stringify(data));

    return data;
  }

  async getDistributorAnalytics(distributorId: string) {
    const cacheKey = `analytics:distributor:${distributorId}`;

    const cachedData = await RedisClient.get(cacheKey);
    if (cachedData) {
      logger.info(`⚡ Returning distributor analytics for ${distributorId} from cache`);
      return JSON.parse(cachedData as string);
    }

    const metrics = await distributorAnalyticsRepository.getDistributorMetrics(distributorId);
    await RedisClient.setex(cacheKey, this.TTL, JSON.stringify(metrics));

    return metrics;
  }

  async getDistributorSpendingChart(
    distributorId: string,
    query: { from_date?: string; to_date?: string }
  ) {
    const cacheKey = `analytics:distributor:${distributorId}:spending-chart:${JSON.stringify(query)}`;

    const cachedData = await RedisClient.get(cacheKey);
    if (cachedData) {
      logger.info(`⚡ Returning distributor spending chart for ${distributorId} from cache`);
      return JSON.parse(cachedData as string);
    }

    const data = await distributorAnalyticsRepository.getSpendingChart(
      distributorId,
      query.from_date,
      query.to_date
    );
    await RedisClient.setex(cacheKey, this.TTL, JSON.stringify(data));

    return data;
  }
}

export default new PersonalAnalyticsService();
