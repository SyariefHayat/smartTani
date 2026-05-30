import wishlistRepository from '../repositories/wishlist.repository';
import productRepository from '../repositories/product.repository';
import { AppError } from '../../../../shared/types/express';

export class WishlistService {
  async addToWishlist(buyerId: string, productId: string) {
    // 1. Cek produk ada
    const product = await productRepository.findById(productId);
    if (!product) {
      const error = new Error('Produk tidak ditemukan') as AppError;
      error.statusCode = 404;
      error.code = 'MARKET_001';
      throw error;
    }

    // 2. Cek jika sudah ada di wishlist
    const existing = await wishlistRepository.findByBuyerAndProduct(buyerId, productId);
    if (existing) {
      return existing;
    }

    // 3. Tambahkan ke wishlist
    return wishlistRepository.create({
      buyer_id: buyerId,
      product_id: productId,
    });
  }

  async removeFromWishlist(buyerId: string, productId: string) {
    const result = await wishlistRepository.delete(buyerId, productId);
    return { success: result.deletedCount > 0 };
  }

  async getWishlist(buyerId: string) {
    return wishlistRepository.findByBuyerId(buyerId);
  }
}

export default new WishlistService();
