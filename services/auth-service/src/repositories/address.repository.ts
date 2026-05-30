import prisma from '../lib/prisma';
import { SavedAddress, Prisma } from '@prisma/client';

export class AddressRepository {
  async create(data: Prisma.SavedAddressUncheckedCreateInput): Promise<SavedAddress> {
    return prisma.savedAddress.create({ data });
  }

  async findById(id: string): Promise<SavedAddress | null> {
    return prisma.savedAddress.findUnique({
      where: { id },
    });
  }

  async findAll(userId: string): Promise<SavedAddress[]> {
    return prisma.savedAddress.findMany({
      where: { user_id: userId },
      orderBy: [
        { is_default: 'desc' },
        { created_at: 'desc' }
      ],
    });
  }

  async update(id: string, data: Prisma.SavedAddressUpdateInput): Promise<SavedAddress> {
    return prisma.savedAddress.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<SavedAddress> {
    return prisma.savedAddress.delete({
      where: { id },
    });
  }

  async unsetDefaults(userId: string): Promise<Prisma.BatchPayload> {
    return prisma.savedAddress.updateMany({
      where: { user_id: userId, is_default: true },
      data: { is_default: false },
    });
  }
}

export default new AddressRepository();
