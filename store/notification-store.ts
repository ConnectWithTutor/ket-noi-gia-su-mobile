import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notification, NotificationPreferences } from '@/types/notification';

interface NotificationState {
  notifications: Notification[];
  preferences: NotificationPreferences;
  isLoading: boolean;
  error: string | null;
}

interface NotificationActions {
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
}

export const useNotificationStore = create<NotificationState & NotificationActions>()(
  persist(
    (set, get) => ({
      notifications: [],
      preferences: {
        messages: true,
        classes: true,
        posts: true,
        system: true,
        sound: true,
        vibration: true,
      },
      isLoading: false,
      error: null,

      fetchNotifications: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Mock notifications data
          const mockNotifications: Notification[] = [
            {
              id: '1',
              title: 'Tin nhắn mới',
              message: 'Bạn có tin nhắn mới từ Nguyễn Văn B',
              type: 'message',
              read: false,
              createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
              data: {
                route: '/conversation/2',
                senderId: '2',
              },
            },
            {
              id: '2',
              title: 'Lớp học sắp diễn ra',
              message: 'Lớp học Toán của bạn sẽ bắt đầu trong 30 phút nữa',
              type: 'class',
              read: false,
              createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
              data: {
                route: '/schedule',
                classId: '3',
              },
            },
            {
              id: '3',
              title: 'Bài viết mới',
              message: 'Có bài viết mới phù hợp với bạn: "Tìm gia sư Tiếng Anh tại Hà Nội"',
              type: 'post',
              read: true,
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
              data: {
                route: '/post/5',
                postId: '5',
              },
            },
            {
              id: '4',
              title: 'Cập nhật hệ thống',
              message: 'Hệ thống sẽ bảo trì vào ngày 15/07/2023 từ 23:00 - 01:00',
              type: 'system',
              read: true,
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            },
          ];
          
          set({ notifications: mockNotifications, isLoading: false });
        } catch (error) {
          set({ 
            error: "Không thể tải thông báo. Vui lòng thử lại sau.", 
            isLoading: false 
          });
        }
      },

      markAsRead: (id: string) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true,
          })),
        }));
      },

      addNotification: (notification: Notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
        }));
      },

      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter((notification) => notification.id !== id),
        }));
      },

      updatePreferences: (preferences: Partial<NotificationPreferences>) => {
        set((state) => ({
          preferences: { ...state.preferences, ...preferences },
        }));
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ preferences: state.preferences }),
    }
  )
);