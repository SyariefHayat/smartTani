import api from '@/lib/api';

export interface Supplier {
  farmer_id: string;
  name: string;
  location: string;
  total_transactions: number;
  total_amount: number;
  products_count: number;
  last_order_date: string;
  joined_at?: string;
}

export interface InventoryItem {
  id: string;
  distributor_id: string;
  product_id: string;
  product_title: string;
  product_image?: string;
  quantity_received: number;
  quantity_distributed: number;
  quantity_remaining?: number; // quantity_received - quantity_distributed
  unit: string;
  last_received_at: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DistributorAnalytics {
  total_spending: number;
  monthly_spending: number;
  spending_change_percent: number;
  active_orders: number;
  total_orders: number;
  unique_suppliers: number;
  unique_products_bought: number;
  avg_order_value: number;
  top_products: Array<{
    product_id: string;
    title: string;
    buy_count: number;
    total_qty: number;
    image?: string;
  }>;
  top_suppliers: Array<{
    farmer_id: string;
    name: string;
    total_transactions: number;
    total_amount: number;
  }>;
}

export interface SpendingChartItem {
  month: string;
  spending: number;
  orders_count: number;
}

export interface GetSuppliersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetSuppliersResponse {
  suppliers: Supplier[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetInventoryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetInventoryResponse {
  inventory: InventoryItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const distributorService = {
  getSuppliers: async (params?: GetSuppliersParams): Promise<GetSuppliersResponse> => {
    const response = await api.get('/distributor/suppliers', { params });
    return response.data.data;
  },

  getSupplierById: async (
    id: string
  ): Promise<
    Supplier & { products?: Record<string, unknown>[]; transactions?: Record<string, unknown>[] }
  > => {
    const response = await api.get(`/distributor/suppliers/${id}`);
    return response.data.data;
  },

  getInventory: async (params?: GetInventoryParams): Promise<GetInventoryResponse> => {
    const response = await api.get('/distributor/inventory', { params });
    return response.data.data;
  },

  updateInventory: async (
    id: string,
    data: { quantity_distributed: number; notes?: string }
  ): Promise<InventoryItem> => {
    const response = await api.patch(`/distributor/inventory/${id}`, data);
    return response.data.data;
  },

  getAnalytics: async (id?: string): Promise<DistributorAnalytics> => {
    const response = await api.get(
      id ? `/analytics/distributor/${id}` : '/analytics/distributor/me'
    );
    return response.data.data;
  },

  getSpendingChart: async (
    id?: string,
    params?: { from_date?: string; to_date?: string }
  ): Promise<SpendingChartItem[]> => {
    const response = await api.get(
      id
        ? `/analytics/distributor/${id}/spending-chart`
        : '/analytics/distributor/me/spending-chart',
      { params }
    );
    return response.data.data;
  },
};
