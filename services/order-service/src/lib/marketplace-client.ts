import { logger } from '../../../../shared/utils/logger';
import axios from 'axios';
import { env } from '../config/env';

export interface IProductInfo {
  _id: string;
  farmer_id: string;
  title: string;
  price_per_unit: number;
  unit: string;
  stock: number;
  min_order: number;
  status: string;
}

export class MarketplaceServiceClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.MARKETPLACE_SERVICE_URL;
  }

  async getProductInfo(productId: string): Promise<IProductInfo | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/products/${productId}`);
      if (response.data && response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      logger.error(
        `❌ Failed to fetch product info for ${productId}:`,
        error instanceof Error ? error.message : error
      );
      return null;
    }
  }

  async reduceStock(items: { productId: string; quantity: number }[]): Promise<boolean> {
    try {
      const response = await axios.patch(`${this.baseUrl}/products/reduce-stock`, { items });
      return !!(response.data && response.data.success);
    } catch (error) {
      logger.error('❌ Failed to reduce stock:', error instanceof Error ? error.message : error);
      return false;
    }
  }

  async restoreStock(items: { productId: string; quantity: number }[]): Promise<boolean> {
    try {
      // Use the same reduce-stock endpoint but with negative quantity?
      // Actually, marketplace-service reduceStock uses $inc with -quantity.
      // So we need a proper restore-stock endpoint or use negative values if allowed.
      // Let's implement restore-stock in marketplace-service for clarity.
      const response = await axios.patch(`${this.baseUrl}/products/restore-stock`, { items });
      return !!(response.data && response.data.success);
    } catch (error) {
      logger.error('❌ Failed to restore stock:', error instanceof Error ? error.message : error);
      return false;
    }
  }
}

export default new MarketplaceServiceClient();
