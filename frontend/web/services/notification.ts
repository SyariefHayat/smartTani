import api from '@/lib/api';

export interface NotificationItem {
  id: string;
  user_id: string;
  type: 'order' | 'promo' | 'system';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const notificationService = {
  getNotifications: async (): Promise<NotificationItem[]> => {
    const response = await api.get('/notifications');
    return response.data;
  },
  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },
  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  },
};
