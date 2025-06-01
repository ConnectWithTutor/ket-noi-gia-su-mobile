export interface Message {
  messageId: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  sentAt: string;
  isEdited: boolean;
  isDeleted: boolean;
}

export interface MessageCreateRequest {
  conversationId: string;
  senderId: string;
  messageType: 'text' | 'image' | 'file';
  content: string;
}

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'read' | 'participant_added' | 'participant_removed';
  payload: any;
}