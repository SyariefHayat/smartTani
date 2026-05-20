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
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const result = await (
        await import('../repositories/review.repository')
      ).default.findByProductId(productId as string, page, limit);

      return res.status(200).json(
        successResponse(result.reviews, {
          average_rating: result.average_rating,
          total_reviews: result.total,
          rating_breakdown: result.rating_breakdown,
          page,
          limit,
          total: result.total,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async getFarmerReviewsSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const { farmer_id } = req.query;
      if (!farmer_id) {
        return res.status(400).json({ success: false, message: 'farmer_id is required' });
      }

      const cacheKey = `farmer_reviews_summary:${farmer_id}`;
      const RedisClient = (await import('../lib/redis')).default;

      const cachedData = await RedisClient.get<{
        average_rating: number;
        total_reviews: number;
        rating_breakdown: Record<number, number>;
      }>(cacheKey);
      if (cachedData) {
        return res.status(200).json(successResponse(cachedData));
      }

      const result = await (
        await import('../repositories/review.repository')
      ).default.getFarmerReviewsSummary(farmer_id as string);

      await RedisClient.setex(cacheKey, 300, result); // 5 minutes TTL

      return res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }
}

export default new ReviewController();
