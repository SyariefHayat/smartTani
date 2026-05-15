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
};
