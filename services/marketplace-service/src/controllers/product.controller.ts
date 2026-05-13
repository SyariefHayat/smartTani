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

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { GetProductsSchema } = await import('../schemas/product.schema');
      const query = GetProductsSchema.parse(req.query);
      const result = await productService.getProducts(query);
      return res.status(200).json(successResponse(result.products, result.meta));
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id as string);
      return res.status(200).json(successResponse(product));
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as AppRequest).user!.id;
      const role = (req as AppRequest).user!.role as string;
      const product = await productService.updateProduct(userId, role, id as string, req.body);
      return res.status(200).json(successResponse(product));
    } catch (error) {
      next(error);
    }
  }

  async deactivateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as AppRequest).user!.id;
      const role = (req as AppRequest).user!.role as string;
      const result = await productService.deactivateProduct(userId, role, id as string);
      return res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
