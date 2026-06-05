import { apiClient } from '../api-client';
import type {
  NotificationEntry,
  NotificationListResponse,
} from './notifications.types';

export const notificationsApi = {
  async list(skip = 0, take = 20): Promise<NotificationListResponse> {
    const res = await apiClient.get<NotificationListResponse>('/notifications', {
      params: { skip, take },
    });
    return res.data;
  },

  async unreadCount(): Promise<number> {
    const res = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return res.data.count;
  },

  async markRead(id: string): Promise<{ success: true; unreadCount: number }> {
    const res = await apiClient.patch<{ success: true; unreadCount: number }>(
      `/notifications/${id}/read`,
    );
    return res.data;
  },

  async markAllRead(): Promise<{ success: true; count: number; unreadCount: number }> {
    const res = await apiClient.post<{ success: true; count: number; unreadCount: number }>(
      '/notifications/read-all',
    );
    return res.data;
  },

  async delete(id: string): Promise<{ success: true; unreadCount: number }> {
    const res = await apiClient.delete<{ success: true; unreadCount: number }>(
      `/notifications/${id}`,
    );
    return res.data;
  },

  async deleteAll(): Promise<{ success: true; count: number; unreadCount: number }> {
    const res = await apiClient.delete<{ success: true; count: number; unreadCount: number }>(
      '/notifications',
    );
    return res.data;
  },
};

export type { NotificationEntry };
