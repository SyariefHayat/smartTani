import prisma from '../lib/prisma';
import { HarvestRecord, Prisma } from '@prisma/client';

export class HarvestRepository {
  async create(data: Prisma.HarvestRecordCreateInput): Promise<HarvestRecord> {
    return prisma.harvestRecord.create({
      data,
      include: { land: true },
    });
  }

  async findById(id: string): Promise<HarvestRecord | null> {
    return prisma.harvestRecord.findUnique({
      where: { id },
      include: { land: true },
    });
  }

  async findAll(farmerId: string): Promise<HarvestRecord[]> {
    return prisma.harvestRecord.findMany({
      where: { farmer_id: farmerId },
      include: { land: true },
      orderBy: { harvest_date: 'desc' },
    });
  }

  async update(id: string, data: Prisma.HarvestRecordUpdateInput): Promise<HarvestRecord> {
    return prisma.harvestRecord.update({
      where: { id },
      data,
      include: { land: true },
    });
  }

  async delete(id: string): Promise<HarvestRecord> {
    return prisma.harvestRecord.delete({
      where: { id },
    });
  }
}

export default new HarvestRepository();
