import { Review, IReview } from '../models/review.model';

export class ReviewRepository {
  async create(data: Partial<IReview>): Promise<IReview> {
    return Review.create(data);
  }

  async findByBuyerAndProduct(buyerId: string, productId: string): Promise<IReview | null> {
    return Review.findOne({ buyer_id: buyerId, product_id: productId });
  }

  async findByProductId(
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ reviews: IReview[]; total: number }> {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      Review.find({ product_id: productId }).sort({ created_at: -1 }).skip(skip).limit(limit),
      Review.countDocuments({ product_id: productId }),
    ]);
    return { reviews, total };
  }
}

export default new ReviewRepository();
