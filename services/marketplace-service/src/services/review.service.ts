import reviewRepository from '../repositories/review.repository';
import productRepository from '../repositories/product.repository';
import orderServiceClient from '../lib/order-client';
import { CreateReviewInput } from '../schemas/review.schema';
import { AppError } from '../../../../shared/types/express';

export class ReviewService {
  async createReview(
    buyerId: string,
    buyerName: string,
    productId: string,
    input: CreateReviewInput
  ) {
    // 1. Cek produk ada
    const product = await productRepository.findById(productId);
    if (!product) {
      const error = new Error('Produk tidak ditemukan') as AppError;
      error.statusCode = 404;
      error.code = 'MARKET_001';
      throw error;
    }

    // 2. Cek buyer punya order delivered/completed yang mengandung produk ini
    const { hasPurchased, orderId } = await orderServiceClient.checkPurchase(buyerId, productId);
    if (!hasPurchased || !orderId) {
      const error = new Error(
        'Anda hanya dapat memberikan ulasan untuk produk yang telah Anda beli dan terima'
      ) as AppError;
      error.statusCode = 403;
      error.code = 'AUTH_011';
      throw error;
    }

    // 3. Cek belum pernah review produk ini
    const existingReview = await reviewRepository.findByBuyerAndProduct(buyerId, productId);
    if (existingReview) {
      const error = new Error('Anda sudah memberikan ulasan untuk produk ini') as AppError;
      error.statusCode = 409;
      error.code = 'MARKET_011';
      throw error;
    }

    // 4. Insert review
    return reviewRepository.create({
      product_id: productId,
      buyer_id: buyerId,
      buyer_name: buyerName,
      rating: input.rating,
      comment: input.comment,
      order_id: orderId,
    });
  }

  async getBuyerReviews(buyerId: string, page: number = 1, limit: number = 10) {
    return reviewRepository.findByBuyerId(buyerId, page, limit);
  }
}

export default new ReviewService();
