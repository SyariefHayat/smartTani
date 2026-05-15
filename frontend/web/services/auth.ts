import api from '@/lib/api';

export interface RegisterInput {
  email: string;
  password: string;
  full_name: string;
  role: string;
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
};
