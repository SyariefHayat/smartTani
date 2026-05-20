import { logger } from '../../../../shared/utils/logger';
import axios from 'axios';
import { env } from '../config/env';

export class OrderServiceClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.ORDER_SERVICE_URL;
  }

  async checkPurchase(
    buyerId: string,
    productId: string
  ): Promise<{ hasPurchased: boolean; orderId?: string }> {
    try {
      const response = await axios.get(`${this.baseUrl}/orders/check-purchase`, {
        params: { buyerId, productId },
      });
      if (response.data && response.data.success) {
        return {
          hasPurchased: response.data.data.hasPurchased,
          orderId: response.data.data.orderId,
        };
      }
      return { hasPurchased: false };
    } catch (error) {
      logger.error(
        `❌ Failed to check purchase for buyer ${buyerId} and product ${productId}:`,
        error instanceof Error ? error.message : error
      );
      return { hasPurchased: false };
    }
  }
}

export default new OrderServiceClient();
