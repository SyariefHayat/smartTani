import api from '@/lib/api';

export interface ShipmentStatusHistory {
  status: string;
  notes?: string;
  timestamp: string;
}

export interface Shipment {
  id: string;
  order_id: string;
  logistic_id: string;
  status: 'pending_pickup' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  status_history: ShipmentStatusHistory[];
  picked_up_at?: string;
  delivered_at?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetShipmentsParams {
  status?: string;
  page?: number;
  limit?: number;
}

export interface GetShipmentsResponse {
  data: Shipment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export const logisticsService = {
  getShipments: async (params?: GetShipmentsParams): Promise<GetShipmentsResponse> => {
    const response = await api.get('/shipments', { params });
    return response.data;
  },

  pickupShipment: async (orderId: string, notes?: string): Promise<Shipment> => {
    const response = await api.patch(`/shipments/${orderId}/pickup`, { notes });
    return response.data.data;
  },

  transitShipment: async (orderId: string, notes?: string): Promise<Shipment> => {
    const response = await api.patch(`/shipments/${orderId}/transit`, { notes });
    return response.data.data;
  },

  deliverShipment: async (orderId: string, notes?: string): Promise<Shipment> => {
    const response = await api.patch(`/shipments/${orderId}/deliver`, { notes });
    return response.data.data;
  },
};
