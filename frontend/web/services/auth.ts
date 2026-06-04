import api from '@/lib/api';

export interface RegisterInput {
  email: string;
  password: string;
  full_name: string;
  role: string;
  phone?: string;
  farm_name?: string;
  farm_address?: string;
  farm_size_ha?: number;
  commodities?: string[];
  nik?: string;
  variety?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  register: async (data: RegisterInput) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (data: LoginInput) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  updateProfile: async (data: Record<string, unknown>) => {
    const response = await api.patch('/auth/me', data);
    return response.data;
  },
  changePassword: async (data: Record<string, string>) => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },
};
