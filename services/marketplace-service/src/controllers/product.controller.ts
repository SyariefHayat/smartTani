import { Request, Response, NextFunction } from 'express';
import productService from '../services/product.service';
import { successResponse } from '../../../../shared/utils/response';
import { AppRequest } from '../../../../shared/types/express';

export class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AppRequest).user!.id;
      const product = await productService.createProduct(userId, req.body);
      return res.status(201).json(successResponse(product));
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
