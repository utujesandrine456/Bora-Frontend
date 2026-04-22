import { apiClient } from './client';
import { Notification } from './types';

export const notificationsApi = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[] | { data: Notification[] }>('/v1/notifications');
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  markAsRead: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.patch<{ success: boolean }>(`/v1/notifications/${id}/read`);
    return response.data;
  }
};
