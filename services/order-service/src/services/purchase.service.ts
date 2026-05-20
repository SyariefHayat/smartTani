import purchaseRepository from '../repositories/purchase.repository';
import { CreatePurchaseInput, UpdatePurchaseInput } from '../schemas/purchase.schema';

interface AppError extends Error {
  statusCode?: number;
}

export class PurchaseService {
  async createPurchase(farmerId: string, input: CreatePurchaseInput) {
    return purchaseRepository.create({
      ...input,
      farmer_id: farmerId,
    });
  }

  async getPurchases(farmerId: string) {
    return purchaseRepository.findAll(farmerId);
  }

  async getPurchaseById(id: string, farmerId: string) {
    const purchase = await purchaseRepository.findById(id);
    if (!purchase) {
      const error = new Error('Catatan pembelian tidak ditemukan') as AppError;
      error.statusCode = 404;
      throw error;
    }

    if (purchase.farmer_id !== farmerId) {
      const error = new Error('Tidak memiliki akses ke catatan ini') as AppError;
      error.statusCode = 403;
      throw error;
    }

    return purchase;
  }

  async updatePurchase(id: string, farmerId: string, input: UpdatePurchaseInput) {
    await this.getPurchaseById(id, farmerId);
    return purchaseRepository.update(id, input);
  }

  async deletePurchase(id: string, farmerId: string) {
    await this.getPurchaseById(id, farmerId);
    return purchaseRepository.delete(id);
  }
}

export default new PurchaseService();
