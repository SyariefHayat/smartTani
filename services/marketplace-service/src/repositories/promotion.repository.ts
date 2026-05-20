import { Promotion, IPromotion } from '../models/promotion.model';

export class PromotionRepository {
  async create(data: Partial<IPromotion>): Promise<IPromotion> {
    return Promotion.create(data);
  }

  async findById(id: string): Promise<IPromotion | null> {
    return Promotion.findById(id);
  }

  async findAll(filter: Record<string, unknown> = {}): Promise<IPromotion[]> {
    return Promotion.find({ ...filter, status: { $ne: 'deleted' } }).sort({ createdAt: -1 });
  }

  async update(id: string, data: Partial<IPromotion>): Promise<IPromotion | null> {
    return Promotion.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IPromotion | null> {
    // Soft delete
    return Promotion.findByIdAndUpdate(id, { status: 'deleted' }, { new: true });
  }

  async findByFarmerId(farmerId: string): Promise<IPromotion[]> {
    return Promotion.find({ farmer_id: farmerId, status: { $ne: 'deleted' } }).sort({
      createdAt: -1,
    });
  }
}

export default new PromotionRepository();
