import { Request, Response, NextFunction } from 'express';
import Category from '../models/category.model';
import { successResponse } from '../../../../shared/utils/response';
import RedisClient from '../lib/redis';

export class CategoryController {
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const CACHE_KEY = 'marketplace:categories:all';

      // 1. Try to get from cache
      const cachedCategories = await RedisClient.get(CACHE_KEY);
      if (cachedCategories) {
        return res.status(200).json(successResponse(cachedCategories));
      }

      // 2. Fetch from MongoDB
      const categories = await Category.find().sort({ name: 1 });

      // 3. Cache in Redis for 1 hour (3600 seconds)
      await RedisClient.setex(CACHE_KEY, 3600, categories);

      return res.status(200).json(successResponse(categories));
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
