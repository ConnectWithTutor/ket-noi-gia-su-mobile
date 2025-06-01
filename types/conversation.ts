import { Message } from "./message";

export interface Conversation {
  conversationId: string;
    type: 'private' | 'group';
    createdAt: string;
    updatedAt?: string;
  lastMessage?: Message;

}

export interface ConversationCreateRequest {
  type: 'private' | 'group';
  creatorUserId: string;
}