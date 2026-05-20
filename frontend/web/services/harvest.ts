import api from '@/lib/api';

export interface HarvestRecord {
  id: string;
  farmer_id: string;
  land_id: string;
  crop_name: string;
  quantity: number;
  unit: string;
  harvest_date: string;
  quality_grade: 'A' | 'B' | 'C';
  notes?: string;
  created_at: string;
  updated_at: string;
  land?: {
    id: string;
    name: string;
  };
}

export interface CreateHarvestInput {
  land_id: string;
  crop_name: string;
  quantity: number;
  unit: string;
  harvest_date: string;
  quality_grade: 'A' | 'B' | 'C';
  notes?: string;
}

export const harvestService = {
  getHarvests: async (): Promise<HarvestRecord[]> => {
    const response = await api.get('/harvests');
    return response.data.data;
  },

  createHarvest: async (data: CreateHarvestInput): Promise<HarvestRecord> => {
    const response = await api.post('/harvests', data);
    return response.data.data;
  },

  updateHarvest: async (id: string, data: Partial<CreateHarvestInput>): Promise<HarvestRecord> => {
    const response = await api.patch(`/harvests/${id}`, data);
    return response.data.data;
  },

  deleteHarvest: async (id: string): Promise<void> => {
    await api.delete(`/harvests/${id}`);
  },
};
