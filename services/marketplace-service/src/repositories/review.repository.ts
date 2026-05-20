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
  ): Promise<{
    reviews: IReview[];
    total: number;
    average_rating: number;
    rating_breakdown: Record<number, number>;
  }> {
    const skip = (page - 1) * limit;

    const [reviews, total, stats] = await Promise.all([
      Review.find({ product_id: productId }).sort({ created_at: -1 }).skip(skip).limit(limit),
      Review.countDocuments({ product_id: productId }),
      Review.aggregate([
        { $match: { product_id: productId } },
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalScore = 0;
    let totalCount = 0;

    stats.forEach((stat) => {
      breakdown[stat._id] = stat.count;
      totalScore += stat._id * stat.count;
      totalCount += stat.count;
    });

    return {
      reviews,
      total,
      average_rating: totalCount > 0 ? parseFloat((totalScore / totalCount).toFixed(1)) : 0,
      rating_breakdown: breakdown,
    };
  }
}

export default new ReviewRepository();
