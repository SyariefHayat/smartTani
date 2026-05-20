import { Request, Response, NextFunction } from 'express';
import purchaseService from '../services/purchase.service';
import { successResponse } from '../../../../shared/utils/response';

export class PurchaseController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const farmerId = req.headers['x-user-id'] as string;
      const purchase = await purchaseService.createPurchase(farmerId, req.body);
      res.status(201).json(successResponse(purchase, 'Catatan pembelian berhasil dibuat'));
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const farmerId = req.headers['x-user-id'] as string;
      const purchases = await purchaseService.getPurchases(farmerId);
      res.status(200).json(successResponse(purchases));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const farmerId = req.headers['x-user-id'] as string;
      const purchase = await purchaseService.updatePurchase(id as string, farmerId, req.body);
      res.status(200).json(successResponse(purchase, 'Catatan pembelian berhasil diperbarui'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const farmerId = req.headers['x-user-id'] as string;
      await purchaseService.deletePurchase(id as string, farmerId);
      res.status(200).json(successResponse(null, 'Catatan pembelian berhasil dihapus'));
    } catch (error) {
      next(error);
    }
  }
}

export default new PurchaseController();
