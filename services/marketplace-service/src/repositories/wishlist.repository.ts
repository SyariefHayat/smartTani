import { Wishlist, IWishlist } from '../models/wishlist.model';

export class WishlistRepository {
  async create(data: { buyer_id: string; product_id: string }): Promise<IWishlist> {
    return Wishlist.create(data);
  }

  async findByBuyerAndProduct(buyerId: string, productId: string): Promise<IWishlist | null> {
    return Wishlist.findOne({ buyer_id: buyerId, product_id: productId });
  }

  async delete(buyerId: string, productId: string) {
    return Wishlist.deleteOne({ buyer_id: buyerId, product_id: productId });
  }

  async findByBuyerId(buyerId: string): Promise<IWishlist[]> {
    return Wishlist.find({ buyer_id: buyerId }).populate('product_id').sort({ createdAt: -1 });
  }
}

export default new WishlistRepository();
