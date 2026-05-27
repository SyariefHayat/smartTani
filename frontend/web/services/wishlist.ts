import api from '@/lib/api';

export interface WishlistItem {
  id: string;
  buyer_id: string;
  product_id: string;
  created_at: string;
  product?: {
    id: string;
    _id?: string;
    title: string;
    price_per_unit: number;
    stock: number;
    images: string[];
    description: string;
  };
}

export const wishlistService = {
  getWishlist: async (): Promise<WishlistItem[]> => {
    const response = await api.get('/wishlist');
    return response.data.data || [];
  },

  addToWishlist: async (productId: string): Promise<WishlistItem> => {
    const response = await api.post('/wishlist', { productId });
    return response.data.data;
  },

  removeFromWishlist: async (productId: string): Promise<{ success: boolean }> => {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  },
};
