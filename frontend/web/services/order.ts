import api from '@/lib/api';

export interface ShippingAddress {
  recipient_name: string;
  phone_number: string;
  full_address: string;
  city: string;
  province: string;
  postal_code: string;
}

export interface CheckoutInput {
  shippingAddress: {
    recipient_name: string;
    phone_number: string;
    province: string;
    city: string;
    full_address: string;
    postal_code: string;
  };
  notes?: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  farmer_id: string;
  quantity: number;
  price_per_unit: number;
  subtotal: number;
}

export interface Order {
  id: string;
  buyer_id: string;
  total_amount: number;
  platform_fee: number;
  shipping_cost: number;
  status: string;
  payment_url?: string;
  shipping_address: ShippingAddress;
  notes?: string;
  created_at: string;
  items: OrderItem[];
}

export interface CreateOrderResponse {
  success: boolean;
  data: Order;
}

export interface InitiatePaymentResponse {
  success: boolean;
  data: {
    redirect_url: string;
    token: string;
  };
}

export interface GetOrdersParams {
  status?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}

export interface ShipmentStatus {
  status: string;
  notes?: string;
  timestamp: string;
}

export interface Shipment {
  id: string;
  order_id: string;
  status: string;
  status_history: ShipmentStatus[];
  picked_up_at?: string;
  delivered_at?: string;
}

export interface GetShipmentResponse {
  success: boolean;
  data: Shipment;
}

export const orderService = {
  checkout: async (data: CheckoutInput): Promise<CreateOrderResponse> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  initiatePayment: async (orderId: string): Promise<InitiatePaymentResponse> => {
    const response = await api.post('/payments/initiate', { orderId });
    return response.data;
  },

  getOrders: async (params?: GetOrdersParams) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getOrderById: async (id: string): Promise<CreateOrderResponse> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getTracking: async (orderId: string): Promise<GetShipmentResponse> => {
    const response = await api.get(`/shipments/${orderId}`);
    return response.data;
  },

  confirmReceipt: async (orderId: string): Promise<CreateOrderResponse> => {
    const response = await api.patch(`/orders/${orderId}/deliver`);
    return response.data;
  },

  confirmOrder: async (orderId: string): Promise<CreateOrderResponse> => {
    const response = await api.patch(`/orders/${orderId}/confirm`);
    return response.data;
  },
};
