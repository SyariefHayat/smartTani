import api from '@/lib/api';

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

export interface GetProductResponse {
  success: boolean;
  data: Product;
}

export const marketplaceService = {
  getProducts: async (params: GetProductsParams): Promise<GetProductsResponse> => {
    const response = await api.get('/products', { params });
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
    const response = await api.patch(`/products/${id}/deactivate`);
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
  }
};
