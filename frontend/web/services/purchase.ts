import api from '@/lib/api';

export interface PurchaseRecord {
  id: string;
  farmer_id: string;
  supplier_name: string;
  item_name: string;
  quantity: number;
  unit: string;
  total_cost: number;
  purchase_date: string;
  notes?: string;
  receipt_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePurchaseInput {
  supplier_name: string;
  item_name: string;
  quantity: number;
  unit: string;
  total_cost: number;
  purchase_date: string;
  notes?: string;
  receipt_url?: string;
}

export const purchaseService = {
  getPurchases: async (): Promise<PurchaseRecord[]> => {
    const response = await api.get('/purchases');
    return response.data.data;
  },

  getPurchaseById: async (id: string): Promise<PurchaseRecord> => {
    const response = await api.get(`/purchases/${id}`);
    return response.data.data;
  },

  createPurchase: async (data: CreatePurchaseInput): Promise<PurchaseRecord> => {
    const response = await api.post('/purchases', data);
    return response.data.data;
  },

  updatePurchase: async (
    id: string,
    data: Partial<CreatePurchaseInput>
  ): Promise<PurchaseRecord> => {
    const response = await api.patch(`/purchases/${id}`, data);
    return response.data.data;
  },

  deletePurchase: async (id: string): Promise<void> => {
    await api.delete(`/purchases/${id}`);
  },
};
