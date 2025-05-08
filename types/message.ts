import { SearchParams } from './common';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface MessageCreateRequest {
  receiverId: string;
  content: string;
}

export interface ConversationPreview {
  userId: string;
  name: string;
  lastMessage: string;
  unreadCount: number;
  updatedAt: string;
}

export interface MessageSearchParams extends SearchParams {
  userId: string;
}