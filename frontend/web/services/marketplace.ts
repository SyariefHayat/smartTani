import api from '@/lib/api';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

export interface Product {
  _id: string;
  id?: string;
  farmer_id: string;
  title: string;
  description: string;
  category: string;
  price_per_unit: number;
  unit: string;
  stock: number;
  min_stock: number;
  min_order: number;
  location: {
    province: string;
    city: string;
  };
  images: string[];
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  farmer?: {
    id: string;
    full_name: string;
    email: string;
    location?: string;
  };
}

export interface GetProductsParams {
  category?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  farmer_id?: string;
  page?: number;
  limit?: number;
}

export interface GetProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface GetCategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface GetBrandsResponse {
  success: boolean;
  data: Brand[];
}

export interface GetProductResponse {
  success: boolean;
  data: Product;
}

export interface Review {
  _id: string;
  product_id: string;
  order_id: string;
  buyer_id: string;
  buyer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  product_title?: string;
}

export interface ReviewSummary {
  average_rating: number;
  total_reviews: number;
  rating_breakdown: Record<string, number>;
}

export interface GetReviewsResponse {
  success: boolean;
  data: Review[];
  meta: {
    total: number;
    page: number;
    limit: number;
    average_rating?: number;
    rating_breakdown?: Record<string, number>;
  };
}

export interface GetSummaryResponse {
  success: boolean;
  data: ReviewSummary;
}

export const marketplaceService = {
  getReviewsSummary: async (farmerId: string): Promise<GetSummaryResponse> => {
    const response = await api.get('/products/reviews/summary', {
      params: { farmer_id: farmerId },
    });
    return response.data;
  },

  getFarmerReviews: async (
    farmerId: string,
    params?: { page?: number; limit?: number }
  ): Promise<GetReviewsResponse> => {
    const response = await api.get('/products/reviews', {
      params: { ...params, farmer_id: farmerId },
    });
    return response.data;
  },

  getProductReviews: async (
    productId: string,
    params?: { page?: number; limit?: number }
  ): Promise<GetReviewsResponse> => {
    const response = await api.get(`/products/${productId}/reviews`, { params });
    return response.data;
  },

  getProducts: async (params: GetProductsParams): Promise<GetProductsResponse> => {
    const response = await api.get('/products', { params });
    // Transform backend's { success: true, data: Product[], meta: any }
    // into frontend's expected { success: true, data: { products: Product[], pagination: ... } }
    if (response.data && Array.isArray(response.data.data)) {
      return {
        success: response.data.success,
        data: {
          products: response.data.data,
          pagination: {
            total: response.data.meta?.total || 0,
            page: response.data.meta?.page || 1,
            limit: response.data.meta?.limit || 20,
            pages: response.data.meta?.totalPages || 1,
          },
        },
      };
    }
    return response.data;
  },

  getProductById: async (id: string): Promise<GetProductResponse> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data: unknown) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  updateProduct: async (id: string, data: unknown) => {
    const response = await api.patch(`/products/${id}`, data);
    return response.data;
  },

  deactivateProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  uploadImage: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post(`/products/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getCategories: async (): Promise<GetCategoriesResponse> => {
    const response = await api.get('/categories');
    return response.data;
  },

  getBrands: async (): Promise<GetBrandsResponse> => {
    const response = await api.get('/brands');
    return response.data;
  },
};
