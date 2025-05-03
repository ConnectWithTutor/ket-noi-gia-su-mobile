export type NotificationType = 'message' | 'class' | 'post' | 'system';

export interface NotificationData {
  route?: string;
  senderId?: string;
  classId?: string;
  postId?: string;
  [key: string]: any;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  data?: NotificationData;
}

export interface NotificationPreferences {
  messages: boolean;
  classes: boolean;
  posts: boolean;
  system: boolean;
  sound: boolean;
  vibration: boolean;
}