import api from '@/lib/api';

export interface ProductReview {
  id: string;
  buyer_id: string;
  buyer_name?: string;
  product_id: string;
  product_title?: string;
  product_image?: string;
  rating: number;
  comment: string;
  created_at: string;
}

export const reviewService = {
  createReview: async (
    productId: string,
    data: { rating: number; comment: string }
  ): Promise<ProductReview> => {
    const response = await api.post(`/products/${productId}/reviews`, data);
    return response.data.data;
  },

  getProductReviews: async (
    productId: string,
    params?: { page?: number; limit?: number }
  ): Promise<ProductReview[]> => {
    const response = await api.get(`/products/${productId}/reviews`, { params });
    return response.data.data || [];
  },

  getMyReviews: async (params?: { page?: number; limit?: number }): Promise<ProductReview[]> => {
    const response = await api.get('/reviews/me', { params });
    return response.data.data || [];
  },
};
