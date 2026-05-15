import api from '@/lib/api';

export interface User {
  id: string;
  email: string;
  role: string;
  full_name: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GetUsersParams {
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface GetUsersResponse {
  users: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const userService = {
  getUsers: async (params: GetUsersParams): Promise<GetUsersResponse> => {
    const response = await api.get('/auth/users', { params });
    return {
      users: response.data.data,
      meta: response.data.meta,
    };
  },

  verifyUser: async (id: string): Promise<User> => {
    const response = await api.patch(`/auth/users/${id}/verify`);
    return response.data.data;
  },

  updateStatus: async (id: string, status: 'active' | 'suspended' | 'pending_verification'): Promise<User> => {
    const response = await api.patch(`/auth/users/${id}/status`, { status });
    return response.data.data;
  },
};
