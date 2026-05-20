import { Response, NextFunction } from 'express';
import harvestService from '../services/harvest.service';
import { successResponse } from '../../../../shared/utils/response';
import { AppRequest } from '../../../../shared/types/express';

export class HarvestController {
  async create(req: AppRequest, res: Response, next: NextFunction) {
    try {
      const farmerId = req.user!.id;
      const harvest = await harvestService.createHarvest(farmerId, req.body);
      res.status(201).json(successResponse(harvest, 'Catatan panen berhasil dibuat'));
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: AppRequest, res: Response, next: NextFunction) {
    try {
      const farmerId = req.user!.id;
      const harvests = await harvestService.getHarvests(farmerId);
      res.status(200).json(successResponse(harvests));
    } catch (error) {
      next(error);
    }
  }

  async update(req: AppRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const farmerId = req.user!.id;
      const harvest = await harvestService.updateHarvest(id as string, farmerId, req.body);
      res.status(200).json(successResponse(harvest, 'Catatan panen berhasil diperbarui'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AppRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const farmerId = req.user!.id;
      await harvestService.deleteHarvest(id as string, farmerId);
      res.status(200).json(successResponse(null, 'Catatan panen berhasil dihapus'));
    } catch (error) {
      next(error);
    }
  }
}

export default new HarvestController();
