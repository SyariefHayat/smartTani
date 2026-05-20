import { Request, Response, NextFunction } from 'express';
import reviewService from '../services/review.service';
import { successResponse } from '../../../../shared/utils/response';
import { AppRequest } from '../../../../shared/types/express';

export class ReviewController {
  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: productId } = req.params;
      const { id: userId, full_name } = (req as AppRequest).user!;

      const review = await reviewService.createReview(
        userId,
        full_name as string,
        productId as string,
        req.body
      );

      return res.status(201).json(successResponse(review));
    } catch (error) {
      next(error);
    }
  }

  async getProductReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: productId } = req.params;
      const { page, limit } = req.query;
      const result = await (
        await import('../repositories/review.repository')
      ).default.findByProductId(
        productId as string,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 10
      );
      return res.status(200).json(successResponse(result.reviews, { total: result.total }));
    } catch (error) {
      next(error);
    }
  }
}

export default new ReviewController();
