import { Request, Response, NextFunction } from 'express';
import Category from '../models/category.model';
import { successResponse } from '../../../../shared/utils/response';

export class CategoryController {
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await Category.find().sort({ name: 1 });
      return res.status(200).json(successResponse(categories));
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
