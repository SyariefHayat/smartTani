import api from '@/lib/api';

export type ShipmentStatus = 'pending_pickup' | 'picked_up' | 'in_transit' | 'delivered';

export interface ShipmentLocation {
  province: string;
  city: string;
  full_address: string;
  recipient_name?: string;
  phone_number?: string;
}

export interface ShipmentStatusHistory {
  status: ShipmentStatus;
  notes?: string;
  timestamp: string;
}

export interface IShipment {
  id: string;
  order_id: string;
  logistic_id: string;
  status: ShipmentStatus;
  status_history: ShipmentStatusHistory[];
  pickup_address: ShipmentLocation;
  delivery_address: ShipmentLocation;
  items_count: number;
  picked_up_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  createdAt?: string;
  updatedAt?: string;
}

export type Shipment = IShipment;

export interface GetShipmentsParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetShipmentsResponse {
  success: boolean;
  data: {
    shipments: IShipment[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface ShipmentAnalytics {
  pending_pickup_count: number;
  active_count: number;
  delivered_today: number;
  delivered_this_month: number;
  delivered_all_time: number;
  avg_delivery_hours: number;
  ontime_rate_percent: number;
  monthly_change_percent: number;
}

export interface PerformanceChartItem {
  date: string;
  deliveries: number;
  avg_hours: number;
}

export const logisticsService = {
  getShipments: async (params?: GetShipmentsParams): Promise<GetShipmentsResponse> => {
    const response = await api.get('/shipments', { params });
    return response.data;
  },
  getShipmentByOrderId: async (orderId: string): Promise<{ success: boolean; data: IShipment }> => {
    const response = await api.get(`/shipments/${orderId}`);
    return response.data;
  },
  pickupShipment: async (
    orderId: string,
    notes?: string
  ): Promise<{ success: boolean; data: IShipment }> => {
    const response = await api.patch(`/shipments/${orderId}/pickup`, { notes });
    return response.data;
  },
  transitShipment: async (
    orderId: string,
    notes?: string
  ): Promise<{ success: boolean; data: IShipment }> => {
    const response = await api.patch(`/shipments/${orderId}/transit`, { notes });
    return response.data;
  },
  deliverShipment: async (
    orderId: string,
    notes?: string
  ): Promise<{ success: boolean; data: IShipment }> => {
    const response = await api.patch(`/shipments/${orderId}/deliver`, { notes });
    return response.data;
  },
  addNotes: async (
    orderId: string,
    notes: string
  ): Promise<{ success: boolean; data: IShipment }> => {
    const response = await api.patch(`/shipments/${orderId}/notes`, { notes });
    return response.data;
  },
  getLogisticsAnalytics: async (id: string): Promise<ShipmentAnalytics> => {
    const response = await api.get(`/analytics/logistics/${id}`);
    return response.data;
  },
  getLogisticsPerformanceChart: async (
    id: string,
    params?: { from_date?: string; to_date?: string }
  ): Promise<PerformanceChartItem[]> => {
    const response = await api.get(`/analytics/logistics/${id}/performance-chart`, { params });
    return response.data;
  },
};
