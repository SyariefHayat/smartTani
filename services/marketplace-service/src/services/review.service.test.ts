import reviewService from './review.service';
import reviewRepository from '../repositories/review.repository';
import productRepository from '../repositories/product.repository';
import orderServiceClient from '../lib/order-client';

jest.mock('../repositories/review.repository');
jest.mock('../repositories/product.repository');
jest.mock('../lib/order-client');

describe('ReviewService', () => {
  const buyerId = 'buyer-123';
  const buyerName = 'John Doe';
  const productId = 'prod-123';
  const input = { rating: 5, comment: 'Sangat memuaskan, kualitas premium!' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a review successfully', async () => {
    (productRepository.findById as jest.Mock).mockResolvedValue({ _id: productId });
    (orderServiceClient.checkPurchase as jest.Mock).mockResolvedValue({
      hasPurchased: true,
      orderId: 'order-123',
    });
    (reviewRepository.findByBuyerAndProduct as jest.Mock).mockResolvedValue(null);
    (reviewRepository.create as jest.Mock).mockResolvedValue({ _id: 'rev-1', ...input });

    const result = await reviewService.createReview(buyerId, buyerName, productId, input);

    expect(result).toBeDefined();
    expect(reviewRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        product_id: productId,
        buyer_id: buyerId,
        order_id: 'order-123',
      })
    );
  });

  it('should throw 404 if product not found', async () => {
    (productRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(reviewService.createReview(buyerId, buyerName, productId, input)).rejects.toThrow(
      'Produk tidak ditemukan'
    );
  });

  it('should throw 403 if product not purchased', async () => {
    (productRepository.findById as jest.Mock).mockResolvedValue({ _id: productId });
    (orderServiceClient.checkPurchase as jest.Mock).mockResolvedValue({ hasPurchased: false });

    await expect(reviewService.createReview(buyerId, buyerName, productId, input)).rejects.toThrow(
      'Anda hanya dapat memberikan ulasan untuk produk yang telah Anda beli dan terima'
    );
  });

  it('should throw 409 if review already exists', async () => {
    (productRepository.findById as jest.Mock).mockResolvedValue({ _id: productId });
    (orderServiceClient.checkPurchase as jest.Mock).mockResolvedValue({
      hasPurchased: true,
      orderId: 'order-123',
    });
    (reviewRepository.findByBuyerAndProduct as jest.Mock).mockResolvedValue({ _id: 'rev-0' });

    await expect(reviewService.createReview(buyerId, buyerName, productId, input)).rejects.toThrow(
      'Anda sudah memberikan ulasan untuk produk ini'
    );
  });
});
