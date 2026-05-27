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
  total_customers: number;
  pending_orders: number;
  monthly_revenue: number;
  prev_month_revenue: number;
  revenue_change_percent: number;
  top_products: Record<string, unknown>[];
  orders_change_percent: number;
  products_change_percent: number;
  customers_change_percent: number;
}

export interface FarmerFinance {
  current_balance: number;
  total_earnings: number;
  pending_balance: number;
  earnings_change_percent: number;
  transactions: {
    id: string;
    date: string;
    type: 'revenue' | 'fee';
    amount: number;
    description: string;
    order_id: string;
  }[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface BuyerAnalytics {
  total_spending: number;
  active_orders: number;
  total_products_bought: number;
  total_reviews_given: number;
  monthly_spending: number;
  spending_change_percent: number;
  top_products: {
    product_id: string;
    title: string;
    image: string;
    buy_count: number;
  }[];
}

export interface BuyerFinance {
  total_spending: number;
  monthly_spending: number;
  avg_per_order: number;
  spending_change_percent: number;
  transactions: {
    id: string;
    date: string;
    order_id: string;
    amount: number;
    status: string;
    items_summary: string;
  }[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface InvestorAnalytics {
  total_invested: number;
  projected_return: number;
  actual_return: number;
  active_investments_count: number;
  completed_investments_count: number;
  avg_roi_percent: number;
  monthly_trend: { month: string; invested: number; returns: number }[];
}

export interface InvestorFinance {
  total_invested: number;
  projected_return: number;
  actual_return: number;
  transactions: {
    id: string;
    date: string;
    type: 'investment' | 'return' | 'fee';
    proposal_title: string;
    amount: number;
    status: string;
  }[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
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

  getFarmerFinance: async (
    id: string,
    params?: { page?: number; limit?: number }
  ): Promise<FarmerFinance> => {
    const response = await api.get(`/analytics/farmer/${id}/finance`, { params });
    return response.data.data;
  },

  getBuyerAnalytics: async (id: string): Promise<BuyerAnalytics> => {
    const response = await api.get(`/analytics/buyer/${id}`);
    return response.data.data;
  },

  getBuyerSpendingChart: async (
    id: string,
    params?: { from_date?: string; to_date?: string }
  ): Promise<Record<string, unknown>[]> => {
    const response = await api.get(`/analytics/buyer/${id}/spending-chart`, { params });
    return response.data.data;
  },

  getBuyerFinance: async (
    id: string,
    params?: { page?: number; limit?: number }
  ): Promise<BuyerFinance> => {
    const response = await api.get(`/analytics/buyer/${id}/finance`, { params });
    return response.data.data;
  },

  getInvestorAnalytics: async (id: string): Promise<InvestorAnalytics> => {
    const response = await api.get(`/analytics/investor/${id}`);
    return response.data.data;
  },

  getInvestorROIChart: async (
    id: string,
    params?: { months?: number }
  ): Promise<{ month: string; invested: number; return: number }[]> => {
    const response = await api.get(`/analytics/investor/${id}/roi-chart`, { params });
    return response.data.data;
  },

  getInvestorFinance: async (
    id: string,
    params?: { page?: number; limit?: number }
  ): Promise<InvestorFinance> => {
    const response = await api.get(`/analytics/investor/${id}/finance`, { params });
    return response.data.data;
  },
};

export const farmerAnalyticsService = analyticsService;
