export interface ConversationParticipant {
  participantId: string;
  conversationId: string;
  userId: string;
  isMuted: boolean;
}

export interface ConversationParticipantCreateRequest {
  conversationId: string;
  userId: string;
}