import prisma from '../lib/prisma';
import { PurchaseRecord, Prisma } from '@prisma/client';

export class PurchaseRepository {
  async create(data: Prisma.PurchaseRecordCreateInput): Promise<PurchaseRecord> {
    return prisma.purchaseRecord.create({ data });
  }

  async findById(id: string): Promise<PurchaseRecord | null> {
    return prisma.purchaseRecord.findUnique({
      where: { id },
    });
  }

  async findAll(farmerId: string): Promise<PurchaseRecord[]> {
    return prisma.purchaseRecord.findMany({
      where: { farmer_id: farmerId },
      orderBy: { purchase_date: 'desc' },
    });
  }

  async update(id: string, data: Prisma.PurchaseRecordUpdateInput): Promise<PurchaseRecord> {
    return prisma.purchaseRecord.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<PurchaseRecord> {
    return prisma.purchaseRecord.delete({
      where: { id },
    });
  }
}

export default new PurchaseRepository();
