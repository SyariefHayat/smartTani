import landRepository from '../repositories/land.repository';
import { CreateLandInput, UpdateLandInput } from '../schemas/land.schema';

interface AppError extends Error {
  statusCode?: number;
}

export class LandService {
  async createLand(farmerId: string, input: CreateLandInput) {
    return landRepository.create({
      ...input,
      user: { connect: { id: farmerId } },
    });
  }

  async getLands(farmerId: string) {
    return landRepository.findAll(farmerId);
  }

  async getLandById(id: string, farmerId: string) {
    const land = await landRepository.findById(id);
    if (!land) {
      const error = new Error('Data lahan tidak ditemukan') as AppError;
      error.statusCode = 404;
      throw error;
    }

    if (land.farmer_id !== farmerId) {
      const error = new Error('Tidak memiliki akses ke data lahan ini') as AppError;
      error.statusCode = 403;
      throw error;
    }

    return land;
  }

  async updateLand(id: string, farmerId: string, input: UpdateLandInput) {
    await this.getLandById(id, farmerId);
    return landRepository.update(id, input);
  }

  async deleteLand(id: string, farmerId: string) {
    await this.getLandById(id, farmerId);
    return landRepository.delete(id);
  }
}

export default new LandService();
