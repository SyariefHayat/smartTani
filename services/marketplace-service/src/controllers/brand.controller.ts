import { Request, Response, NextFunction } from 'express';
import Brand from '../models/brand.model';
import { successResponse } from '../../../../shared/utils/response';
import RedisClient from '../lib/redis';

export class BrandController {
  async getBrands(req: Request, res: Response, next: NextFunction) {
    try {
      const CACHE_KEY = 'marketplace:brands:all';

      // 1. Try to get from cache
      const cachedBrands = await RedisClient.get(CACHE_KEY);
      if (cachedBrands) {
        return res.status(200).json(successResponse(cachedBrands));
      }

      // 2. Fetch from MongoDB
      const brands = await Brand.find().sort({ name: 1 });

      // 3. Cache in Redis for 1 hour (3600 seconds)
      await RedisClient.setex(CACHE_KEY, 3600, brands);

      return res.status(200).json(successResponse(brands));
    } catch (error) {
      next(error);
    }
  }
}

export default new BrandController();
