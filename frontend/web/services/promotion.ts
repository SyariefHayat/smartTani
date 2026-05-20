import api from '@/lib/api';

export interface Promotion {
  _id: string;
  farmer_id: string;
  title: string;
  type: 'discount_percent' | 'discount_amount';
  value: number;
  product_ids: string[];
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive' | 'expired' | 'scheduled';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromotionInput {
  title: string;
  type: 'discount_percent' | 'discount_amount';
  value: number;
  product_ids: string[];
  start_date: string;
  end_date: string;
  status?: string;
}

export const promotionService = {
  getPromotions: async (farmerId?: string): Promise<Promotion[]> => {
    const response = await api.get('/promotions', {
      params: { farmer_id: farmerId },
    });
    return response.data.data;
  },

  getPromotionById: async (id: string): Promise<Promotion> => {
    const response = await api.get(`/promotions/${id}`);
    return response.data.data;
  },

  createPromotion: async (data: CreatePromotionInput): Promise<Promotion> => {
    const response = await api.post('/promotions', data);
    return response.data.data;
  },

  updatePromotion: async (id: string, data: Partial<CreatePromotionInput>): Promise<Promotion> => {
    const response = await api.patch(`/promotions/${id}`, data);
    return response.data.data;
  },

  deletePromotion: async (id: string): Promise<void> => {
    await api.delete(`/promotions/${id}`);
  },
};
