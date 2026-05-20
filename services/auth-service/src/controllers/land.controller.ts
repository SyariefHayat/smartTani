import { Request, Response, NextFunction } from 'express';
import landService from '../services/land.service';
import { successResponse } from '../../../../shared/utils/response';

export class LandController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const farmerId = req.headers['x-user-id'] as string;
      const land = await landService.createLand(farmerId, req.body);
      res.status(201).json(successResponse(land, 'Data lahan berhasil dibuat'));
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const farmerId = req.headers['x-user-id'] as string;
      const lands = await landService.getLands(farmerId);
      res.status(200).json(successResponse(lands));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const farmerId = req.headers['x-user-id'] as string;
      const land = await landService.updateLand(id as string, farmerId, req.body);
      res.status(200).json(successResponse(land, 'Data lahan berhasil diperbarui'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const farmerId = req.headers['x-user-id'] as string;
      await landService.deleteLand(id as string, farmerId);
      res.status(200).json(successResponse(null, 'Data lahan berhasil dihapus'));
    } catch (error) {
      next(error);
    }
  }
}

export default new LandController();
