import harvestRepository from '../repositories/harvest.repository';
import landRepository from '../repositories/land.repository';
import { CreateHarvestInput, UpdateHarvestInput } from '../schemas/harvest.schema';

interface AppError extends Error {
  statusCode?: number;
}

export class HarvestService {
  async createHarvest(farmerId: string, input: CreateHarvestInput) {
    // Validate land ownership
    const land = await landRepository.findById(input.land_id);
    if (!land || land.farmer_id !== farmerId) {
      const error = new Error('Lahan tidak ditemukan atau akses ditolak') as AppError;
      error.statusCode = 403;
      throw error;
    }

    const { land_id, ...harvestData } = input;

    return harvestRepository.create({
      ...harvestData,
      harvest_date: new Date(input.harvest_date),
      user: { connect: { id: farmerId } },
      land: { connect: { id: land_id } },
    });
  }

  async getHarvests(farmerId: string) {
    return harvestRepository.findAll(farmerId);
  }

  async getHarvestById(id: string, farmerId: string) {
    const harvest = await harvestRepository.findById(id);
    if (!harvest) {
      const error = new Error('Data panen tidak ditemukan') as AppError;
      error.statusCode = 404;
      throw error;
    }

    if (harvest.farmer_id !== farmerId) {
      const error = new Error('Tidak memiliki akses ke data panen ini') as AppError;
      error.statusCode = 403;
      throw error;
    }

    return harvest;
  }

  async updateHarvest(id: string, farmerId: string, input: UpdateHarvestInput) {
    const harvest = await this.getHarvestById(id, farmerId);

    if (input.land_id && input.land_id !== harvest.land_id) {
      const land = await landRepository.findById(input.land_id);
      if (!land || land.farmer_id !== farmerId) {
        const error = new Error('Lahan baru tidak ditemukan atau akses ditolak') as AppError;
        error.statusCode = 403;
        throw error;
      }
    }

    return harvestRepository.update(id, {
      ...input,
      harvest_date: input.harvest_date ? new Date(input.harvest_date) : undefined,
      land: input.land_id ? { connect: { id: input.land_id } } : undefined,
    });
  }

  async deleteHarvest(id: string, farmerId: string) {
    await this.getHarvestById(id, farmerId);
    return harvestRepository.delete(id);
  }
}

export default new HarvestService();
