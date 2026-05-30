import addressRepository from '../repositories/address.repository';
import { CreateAddressInput, UpdateAddressInput } from '../schemas/address.schema';

interface AppError extends Error {
  statusCode?: number;
}

export class AddressService {
  async createAddress(userId: string, input: CreateAddressInput) {
    const existing = await addressRepository.findAll(userId);
    const isDefault = existing.length === 0;

    return addressRepository.create({
      ...input,
      user_id: userId,
      is_default: isDefault,
    });
  }

  async getAddresses(userId: string) {
    return addressRepository.findAll(userId);
  }

  async getAddressById(id: string, userId: string) {
    const address = await addressRepository.findById(id);
    if (!address) {
      const error = new Error('Alamat tidak ditemukan') as AppError;
      error.statusCode = 404;
      throw error;
    }

    if (address.user_id !== userId) {
      const error = new Error('Tidak memiliki akses ke alamat ini') as AppError;
      error.statusCode = 403;
      throw error;
    }

    return address;
  }

  async updateAddress(id: string, userId: string, input: UpdateAddressInput) {
    await this.getAddressById(id, userId);
    return addressRepository.update(id, input);
  }

  async deleteAddress(id: string, userId: string) {
    const address = await this.getAddressById(id, userId);
    const deleted = await addressRepository.delete(id);

    // Jika yang dihapus adalah alamat utama dan masih ada alamat lain, jadikan alamat berikutnya sebagai utama
    if (address.is_default) {
      const remaining = await addressRepository.findAll(userId);
      if (remaining.length > 0) {
        await addressRepository.update(remaining[0].id, { is_default: true });
      }
    }

    return deleted;
  }

  async setDefault(id: string, userId: string) {
    await this.getAddressById(id, userId);

    // 1. Reset default alamat lain
    await addressRepository.unsetDefaults(userId);

    // 2. Set alamat ini sebagai default
    return addressRepository.update(id, { is_default: true });
  }
}

export default new AddressService();
