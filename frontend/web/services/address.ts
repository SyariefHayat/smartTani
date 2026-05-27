import api from '@/lib/api';

export interface SavedAddress {
  id: string;
  user_id: string;
  label: string; // 'Rumah', 'Kantor', 'Toko'
  recipient_name: string;
  phone_number: string;
  province: string;
  city: string;
  district: string;
  full_address: string;
  postal_code: string;
  is_default: boolean;
  created_at: string;
}

export const addressService = {
  getAddresses: async (): Promise<SavedAddress[]> => {
    const response = await api.get('/auth/me/addresses');
    return response.data.data || [];
  },

  createAddress: async (
    data: Omit<SavedAddress, 'id' | 'user_id' | 'is_default' | 'created_at'>
  ): Promise<SavedAddress> => {
    const response = await api.post('/auth/me/addresses', data);
    return response.data.data;
  },

  updateAddress: async (id: string, data: Partial<SavedAddress>): Promise<SavedAddress> => {
    const response = await api.patch(`/auth/me/addresses/${id}`, data);
    return response.data.data;
  },

  deleteAddress: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete(`/auth/me/addresses/${id}`);
    return response.data;
  },

  setDefault: async (id: string): Promise<SavedAddress> => {
    const response = await api.patch(`/auth/me/addresses/${id}/default`);
    return response.data.data;
  },
};
