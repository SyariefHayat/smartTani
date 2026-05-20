import { Request, Response, NextFunction } from 'express';
import promotionService from '../services/promotion.service';
import { successResponse } from '../../../../shared/utils/response';

export class PromotionController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const farmerId = req.headers['x-user-id'] as string;
      const promotion = await promotionService.createPromotion(farmerId, req.body);
      res.status(201).json(successResponse(promotion, 'Promosi berhasil dibuat'));
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { farmer_id } = req.query;
      const promotions = await promotionService.getPromotions(farmer_id as string);
      res.status(200).json(successResponse(promotions));
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const promotion = await promotionService.getPromotionById(id as string);
      res.status(200).json(successResponse(promotion));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const farmerId = req.headers['x-user-id'] as string;
      const promotion = await promotionService.updatePromotion(id as string, farmerId, req.body);
      res.status(200).json(successResponse(promotion, 'Promosi berhasil diperbarui'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const farmerId = req.headers['x-user-id'] as string;
      await promotionService.deletePromotion(id as string, farmerId);
      res.status(200).json(successResponse(null, 'Promosi berhasil dihapus'));
    } catch (error) {
      next(error);
    }
  }
}

export default new PromotionController();
