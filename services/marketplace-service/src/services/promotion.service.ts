import promotionRepository from '../repositories/promotion.repository';
import { CreatePromotionInput, UpdatePromotionInput } from '../schemas/promotion.schema';

interface AppError extends Error {
  statusCode?: number;
}

export class PromotionService {
  async createPromotion(farmerId: string, input: CreatePromotionInput) {
    return promotionRepository.create({
      ...input,
      farmer_id: farmerId,
    });
  }

  async getPromotions(farmerId?: string) {
    if (farmerId) {
      return promotionRepository.findByFarmerId(farmerId);
    }
    return promotionRepository.findAll();
  }

  async getPromotionById(id: string) {
    const promotion = await promotionRepository.findById(id);
    if (!promotion || promotion.status === 'deleted') {
      const error = new Error('Promosi tidak ditemukan') as AppError;
      error.statusCode = 404;
      throw error;
    }
    return promotion;
  }

  async updatePromotion(id: string, farmerId: string, input: UpdatePromotionInput) {
    const promotion = await this.getPromotionById(id);

    // Ownership check
    if (promotion.farmer_id !== farmerId) {
      const error = new Error('Tidak memiliki akses untuk mengubah promosi ini') as AppError;
      error.statusCode = 403;
      throw error;
    }

    return promotionRepository.update(id, input);
  }

  async deletePromotion(id: string, farmerId: string) {
    const promotion = await this.getPromotionById(id);

    // Ownership check
    if (promotion.farmer_id !== farmerId) {
      const error = new Error('Tidak memiliki akses untuk menghapus promosi ini') as AppError;
      error.statusCode = 403;
      throw error;
    }

    return promotionRepository.delete(id);
  }
}

export default new PromotionService();
