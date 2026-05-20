import prisma from '../lib/prisma';
import { FarmLand, Prisma } from '@prisma/client';

export class LandRepository {
  async create(data: Prisma.FarmLandCreateInput): Promise<FarmLand> {
    return prisma.farmLand.create({ data });
  }

  async findById(id: string): Promise<FarmLand | null> {
    return prisma.farmLand.findUnique({
      where: { id },
    });
  }

  async findAll(farmerId: string): Promise<FarmLand[]> {
    return prisma.farmLand.findMany({
      where: { farmer_id: farmerId },
      orderBy: { created_at: 'desc' },
    });
  }

  async update(id: string, data: Prisma.FarmLandUpdateInput): Promise<FarmLand> {
    return prisma.farmLand.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<FarmLand> {
    return prisma.farmLand.delete({
      where: { id },
    });
  }
}

export default new LandRepository();
