import api from '@/lib/api';

export interface AddToCartInput {
  productId: string;
  quantity: number;
}

export interface ICartItem {
  productId: string;
  farmerId: string;
  title: string;
  price_per_unit: number;
  unit: string;
  quantity: number;
  subtotal: number;
  image?: string;
  isAvailable?: boolean;
  reason?: string;
}

export interface GetCartResponse {
  success: boolean;
  data: {
    items: ICartItem[];
    total: number;
  };
}

export const cartService = {
  getCart: async (): Promise<GetCartResponse> => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (data: AddToCartInput) => {
    const response = await api.post('/cart/items', data);
    return response.data;
  },

  updateCartItem: async (productId: string, quantity: number) => {
    const response = await api.patch(`/cart/items/${productId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (id: string) => {
    const response = await api.delete(`/cart/items/${id}`);
    return response.data;
  },
};
