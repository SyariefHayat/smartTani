import RedisClient from '../lib/redis';
import marketplaceClient from '../lib/marketplace-client';
import { AddToCartInput } from '../schemas/cart.schema';
import { AppError } from '../../../../shared/types/express';

export interface ICartItem {
  productId: string;
  farmerId: string;
  title: string;
  price_per_unit: number;
  unit: string;
  quantity: number;
  subtotal: number;
  image?: string;
}

export class CartService {
  async addToCart(userId: string, input: AddToCartInput) {
    const { productId, quantity } = input;

    // 1. Fetch product info and validate
    const product = await marketplaceClient.getProductInfo(productId);
    if (!product) {
      const error = new Error('Produk tidak ditemukan') as AppError;
      error.statusCode = 404;
      error.code = 'MARKET_001';
      throw error;
    }

    if (product.status !== 'active') {
      const error = new Error('Produk tidak tersedia') as AppError;
      error.statusCode = 400;
      error.code = 'MARKET_006';
      throw error;
    }

    if (quantity < product.min_order) {
      const error = new Error(
        `Minimal order adalah ${product.min_order} ${product.unit}`
      ) as AppError;
      error.statusCode = 400;
      error.code = 'MARKET_007';
      throw error;
    }

    if (quantity > product.stock) {
      const error = new Error(`Stok tidak mencukupi (Tersedia: ${product.stock})`) as AppError;
      error.statusCode = 400;
      error.code = 'MARKET_008';
      throw error;
    }

    // 2. Get current cart from Redis
    const cacheKey = `cart:${userId}`;
    const cart = (await RedisClient.get<ICartItem[]>(cacheKey)) || [];

    // 3. Update or Add item
    const existingItemIndex = cart.findIndex((item) => item.productId === productId);

    const itemData: ICartItem = {
      productId,
      farmerId: product.farmer_id,
      title: product.title,
      price_per_unit: product.price_per_unit,
      unit: product.unit,
      quantity, // Task says "update quantity", usually adding to it or replacing. Let's replace for now or add?
      // Usually "Add to cart" adds to existing quantity.
      subtotal: product.price_per_unit * quantity,
    };

    if (existingItemIndex > -1) {
      const newQuantity = cart[existingItemIndex].quantity + quantity;

      // Re-validate stock for combined quantity
      if (newQuantity > product.stock) {
        const error = new Error(`Stok tidak mencukupi (Tersedia: ${product.stock})`) as AppError;
        error.statusCode = 400;
        error.code = 'MARKET_008';
        throw error;
      }

      cart[existingItemIndex].quantity = newQuantity;
      cart[existingItemIndex].subtotal = product.price_per_unit * newQuantity;
    } else {
      cart.push(itemData);
    }

    // 4. Save to Redis with 7 days TTL (604800 seconds)
    await RedisClient.setex(cacheKey, 604800, cart);

    return cart;
  }

  async getCart(userId: string) {
    const cacheKey = `cart:${userId}`;
    return (await RedisClient.get<ICartItem[]>(cacheKey)) || [];
  }
}

export default new CartService();
