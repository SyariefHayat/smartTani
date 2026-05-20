import api from '@/lib/api';

export interface OverviewMetrics {
  total_gmv: number;
  today_gmv: number;
  active_users: number;
  today_orders: number;
  disbursed_investment: number;
  order_breakdown: Record<string, number>;
  pending_users: number;
  pending_proposals: number;
}

export interface UserGrowthData {
  date: string;
  farmer?: number;
  buyer?: number;
  investor?: number;
  admin?: number;
}

export interface OrderAnalyticsData {
  date: string;
  volume: number;
  value: number;
}

export interface FarmerAnalytics {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  pending_orders: number;
  monthly_revenue: number;
  prev_month_revenue: number;
  revenue_change_percent: number;
  top_products: Record<string, unknown>[];
}

export const analyticsService = {
  getOverview: async (): Promise<OverviewMetrics> => {
    const response = await api.get('/analytics/overview');
    return response.data.data;
  },

  getUserGrowth: async (days: number = 7): Promise<UserGrowthData[]> => {
    const response = await api.get('/analytics/users', { params: { days } });
    return response.data.data;
  },

  getOrderAnalytics: async (days: number = 7): Promise<OrderAnalyticsData[]> => {
    const response = await api.get('/analytics/orders', { params: { days } });
    return response.data.data;
  },

  getInvestmentAnalytics: async () => {
    const response = await api.get('/analytics/investments');
    return response.data.data;
  },

  getFarmerAnalytics: async (id: string): Promise<FarmerAnalytics> => {
    const response = await api.get(`/analytics/farmer/${id}`);
    return response.data.data;
  },

  getFarmerRevenueChart: async (
    id: string,
    params?: { from_date?: string; to_date?: string }
  ): Promise<Record<string, unknown>[]> => {
    const response = await api.get(`/analytics/farmer/${id}/revenue-chart`, { params });
    return response.data.data;
  },
};
