import { Response, NextFunction } from 'express';
import addressService from '../services/address.service';
import { successResponse } from '../../../../shared/utils/response';
import { AppRequest } from '../../../../shared/types/express';

export class AddressController {
  async create(req: AppRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const address = await addressService.createAddress(userId, req.body);
      res.status(201).json(successResponse(address, 'Alamat berhasil ditambahkan'));
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: AppRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const addresses = await addressService.getAddresses(userId);
      res.status(200).json(successResponse(addresses));
    } catch (error) {
      next(error);
    }
  }

  async update(req: AppRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const address = await addressService.updateAddress(id as string, userId, req.body);
      res.status(200).json(successResponse(address, 'Alamat berhasil diperbarui'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AppRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      await addressService.deleteAddress(id as string, userId);
      res.status(200).json(successResponse(null, 'Alamat berhasil dihapus'));
    } catch (error) {
      next(error);
    }
  }

  async setDefault(req: AppRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const address = await addressService.setDefault(id as string, userId);
      res.status(200).json(successResponse(address, 'Alamat utama berhasil diubah'));
    } catch (error) {
      next(error);
    }
  }
}

export default new AddressController();
