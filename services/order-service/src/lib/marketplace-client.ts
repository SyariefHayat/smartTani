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
      console.error(
        `❌ Failed to fetch product info for ${productId}:`,
        error instanceof Error ? error.message : error
      );
      return null;
    }
  }
}

export default new MarketplaceServiceClient();
