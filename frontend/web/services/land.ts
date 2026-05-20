import api from '@/lib/api';

export interface FarmLand {
  id: string;
  farmer_id: string;
  name: string;
  location_province: string;
  location_city: string;
  location_district: string;
  full_address: string;
  area_ha: number;
  soil_type?: string;
  status: 'active' | 'fallow' | 'rented';
  current_crop?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLandInput {
  name: string;
  location_province: string;
  location_city: string;
  location_district: string;
  full_address: string;
  area_ha: number;
  soil_type?: string;
  status: 'active' | 'fallow' | 'rented';
  current_crop?: string;
  notes?: string;
}

export const landService = {
  getLands: async (): Promise<FarmLand[]> => {
    const response = await api.get('/lands');
    return response.data.data;
  },

  getLandById: async (id: string): Promise<FarmLand> => {
    const response = await api.get(`/lands/${id}`);
    return response.data.data;
  },

  createLand: async (data: CreateLandInput): Promise<FarmLand> => {
    const response = await api.post('/lands', data);
    return response.data.data;
  },

  updateLand: async (id: string, data: Partial<CreateLandInput>): Promise<FarmLand> => {
    const response = await api.patch(`/lands/${id}`, data);
    return response.data.data;
  },

  deleteLand: async (id: string): Promise<void> => {
    await api.delete(`/lands/${id}`);
  },
};
