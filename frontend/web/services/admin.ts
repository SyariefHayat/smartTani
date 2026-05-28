import api from '@/lib/api';

export interface AuditLogItem {
  id: string;
  admin_id: string;
  admin_name: string;
  action: string;
  target_type: string;
  target_id: string;
  details: string;
  created_at: string;
}

export interface GetAuditLogResponse {
  logs: AuditLogItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ReportedReviewItem {
  id: string;
  item_type: 'product' | 'course';
  item_id: string;
  item_title: string;
  student_name?: string;
  buyer_name?: string;
  rating: number;
  comment: string;
  reported: boolean;
  report_reason?: string;
  created_at: string;
}

export const adminService = {
  getAuditLog: async (params?: {
    page?: number;
    limit?: number;
    action?: string;
    from?: string;
    to?: string;
  }): Promise<GetAuditLogResponse> => {
    try {
      const response = await api.get('/audit-log', { params });
      return response.data.data;
    } catch {
      // Mock Offline Fallback
      const logs = JSON.parse(localStorage.getItem('admin-audit-logs') || '[]');
      let filtered = [...logs];
      if (params?.action) {
        filtered = filtered.filter((l: AuditLogItem) =>
          l.action.toLowerCase().includes(params.action!.toLowerCase())
        );
      }
      return {
        logs: filtered.slice(
          ((params?.page || 1) - 1) * (params?.limit || 10),
          (params?.page || 1) * (params?.limit || 10)
        ),
        meta: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          total: filtered.length,
        },
      };
    }
  },

  getAllReviews: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    rating?: number;
    reported_only?: boolean;
  }): Promise<{
    reviews: ReportedReviewItem[];
    meta: { page: number; limit: number; total: number };
  }> => {
    try {
      const response = await api.get('/reviews/all', { params });
      return response.data.data;
    } catch {
      // Mock Offline Fallback
      const reviews = JSON.parse(localStorage.getItem('admin-reviews') || '[]');
      let filtered = [...reviews];
      if (params?.type) {
        filtered = filtered.filter((r: ReportedReviewItem) => r.item_type === params.type);
      }
      if (params?.rating) {
        filtered = filtered.filter((r: ReportedReviewItem) => r.rating === params.rating);
      }
      if (params?.reported_only) {
        filtered = filtered.filter((r: ReportedReviewItem) => r.reported);
      }
      return {
        reviews: filtered.slice(
          ((params?.page || 1) - 1) * (params?.limit || 10),
          (params?.page || 1) * (params?.limit || 10)
        ),
        meta: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          total: filtered.length,
        },
      };
    }
  },

  deleteReview: async (id: string): Promise<{ success: boolean }> => {
    try {
      const response = await api.delete(`/reviews/${id}`);
      return response.data;
    } catch {
      // Mock Offline Fallback
      const reviews: ReportedReviewItem[] = JSON.parse(
        localStorage.getItem('admin-reviews') || '[]'
      );
      const updated = reviews.filter((r) => r.id !== id);
      localStorage.setItem('admin-reviews', JSON.stringify(updated));
      return { success: true };
    }
  },

  logAuditAction: (action: string, targetType: string, targetId: string, details: string) => {
    const logs = JSON.parse(localStorage.getItem('admin-audit-logs') || '[]');
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      admin_id: 'admin-1',
      admin_name: 'Super Admin',
      action,
      target_type: targetType,
      target_id: targetId,
      details,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem('admin-audit-logs', JSON.stringify([newLog, ...logs]));
  },
};
