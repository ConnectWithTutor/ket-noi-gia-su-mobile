import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiChat } from '@/services/apiChat';
import {webSocketService } from '@/services/websocket';
import { Message, User, Conversation, MessageCreateRequest } from '@/types';

interface ChatState {
  currentUser: User | null;
  conversations: Conversation[];
  participants: User[];
  currentConversation: Conversation | null;
  messages: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
  
  setCurrentUser: (user: User) => void;
  fetchConversations: (userId: string) => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  fetchParticipants: (conversationId: string) => Promise<User[]>;
  sendMessage: (conversationId: string, content: string, messageType?: string) => Promise<void>;
  setCurrentConversation: (conversation: Conversation | null) => void;
  createConversation: (userId: string, otherUserId: string) => Promise<Conversation>;
  SearchConversation: (user1Id: string, user2Id: string) => Promise<Conversation | null>;
  addParticipant: (conversationId: string, userId: string) => Promise<void>;
  addMessageToConversation: (message: Message) => void;
  connectWebSocket: (userId: string) => Promise<void>;
  disconnectWebSocket: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
       currentUser: null,
      conversations: [],
      participants: [],
      currentConversation: null,
      messages: {},
      isLoading: false,
      error: null,

      setCurrentConversation: (conversation) => {
        set({ currentConversation: conversation });
        
        // If setting a new conversation, unsubscribe from the previous one
        const prevConversation = get().currentConversation;
        if (prevConversation && prevConversation.conversationId !== conversation?.conversationId) {
          webSocketService.unsubscribeFromConversation(prevConversation.conversationId);
        }
        
        // Subscribe to the new conversation
        if (conversation) {
          webSocketService.subscribeToConversation(conversation.conversationId);
        }
      },
      setCurrentUser: (user) => set({ currentUser: user }),
      fetchConversations: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const conversations = await apiChat.conversations.getAll(userId);
          set({ conversations, isLoading: false });
        } catch (error) {
          console.error('Lỗi khi lấy danh sách cuộc trò chuyện:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Không thể lấy danh sách cuộc trò chuyện', 
            isLoading: false 
          });
          throw error;
        }
      },

      fetchMessages: async (conversationId) => {
        set({ isLoading: true, error: null });
        try {
          const messages = await apiChat.messages.getByConversation(conversationId);
          set(state => ({
            messages: {
              ...state.messages,
              [conversationId]: messages
            },
            isLoading: false
          }));
          
          webSocketService.subscribeToConversation(conversationId);
        } catch (error) {
          console.error('Lỗi khi lấy tin nhắn:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Không thể lấy tin nhắn', 
            isLoading: false 
          });
          throw error;
        }
      },
      fetchParticipants: async (conversationId) => {
        set({ isLoading: true, error: null });
        try {
          const participants = await apiChat.conversations.getParticipants(conversationId);
          set({ isLoading: false });
          return participants;
        } catch (error) {
          console.error('Lỗi khi lấy thành viên:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Không thể lấy thành viên', 
            isLoading: false 
          });
          throw error;
        }
      },
      sendMessage: async (conversationId, content, messageType = 'text') => {
        const { currentUser } = get();
        if (!currentUser) {
          const error = 'Người dùng chưa đăng nhập';
          set({ error });
          throw new Error(error);
        }

        try {
          // Generate a temporary ID for optimistic updates
           const tempId = `temp-${Date.now()}`;
          const tempMessage: Message = {
            messageId: tempId,
            conversationId,
            senderId: currentUser.userId,
            content,
            messageType: messageType as 'text' | 'image' | 'file',
            sentAt: new Date().toISOString(),
            isEdited: false,
            isDeleted: false,

          };
          
          // Optimistically add message to the local state

          // Send via WebSocket for real-time delivery
          webSocketService.sendMessage(conversationId, content, messageType);
          
        
          get().addMessageToConversation(tempMessage);
          
          set(state => {
              const conversationMessages = state.messages[conversationId] || [];
              return {
                messages: {
                  ...state.messages,
                  [conversationId]: [...conversationMessages, tempMessage]  // Append
                }
              };
            });
          
        } catch (error) {
          console.error('Lỗi khi gửi tin nhắn:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Không thể gửi tin nhắn'
          });
          throw error;
        }
      },

      createConversation: async (userId, otherUserId) => {
        set({ isLoading: true, error: null });
        try {
          if( userId === otherUserId) {
            const error = 'Không thể tạo cuộc trò chuyện với chính mình';
            set({ error, isLoading: false });
            throw new Error(error);
          }
          const newConversation = await apiChat.conversations.create(userId, 'private');
          
          // Add the other user to the conversation
          await apiChat.conversations.addParticipant(newConversation.conversationId, otherUserId);
          
          const participants = await apiChat.conversations.getParticipants(newConversation.conversationId);
          
          const conversationWithParticipants = {
            ...newConversation,
            participants: participants,
          };
          
          // Update the conversations list
          set(state => ({
            conversations: [...state.conversations, conversationWithParticipants],
            isLoading: false
          }));
          
          return conversationWithParticipants;
        } catch (error) {
          console.error('Lỗi khi tạo cuộc trò chuyện:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Không thể tạo cuộc trò chuyện', 
            isLoading: false 
          });
          throw error;
        }
      },
      SearchConversation: async (user1Id, user2Id) => {
        set({ isLoading: true, error: null });
        try {
          const conversation = await apiChat.conversations.search(user1Id, user2Id);
          set({ isLoading: false });
          return conversation || null;
        } catch (error) {
          console.error('Lỗi khi tìm kiếm cuộc trò chuyện:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Không thể tìm kiếm cuộc trò chuyện', 
            isLoading: false 
          });
          throw error;
        }
      },
      addParticipant: async (conversationId, userId) => {
        set({ isLoading: true, error: null });
        try {
          const updatedConversation = await apiChat.conversations.addParticipant(conversationId, userId);
          
          set(state => ({
            conversations: state.conversations.map(conv =>
              conv.conversationId === conversationId ? updatedConversation : conv
            ),
            isLoading: false
          }));
          
        } catch (error) {
          console.error('Lỗi khi thêm thành viên:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Không thể thêm thành viên', 
            isLoading: false 
          });
          throw error;
        }
      },

      addMessageToConversation: (message) => {
        const { conversations, messages } = get();
        const conversationId = message.conversationId;
        set(state => {
          const conversationMessages = state.messages[conversationId] || [];
          if ((message.senderId !== state.currentUser?.userId) && !conversationMessages.some(m => m.messageId === message.messageId)) {
            return {
              messages: {
                ...state.messages,
                [conversationId]: [
                  ...conversationMessages,
                  message
                ]
              }
            };
          }
          return state;
        });
        const updatedConversations = conversations.map(conv => {
          if (conv.conversationId === conversationId) {
            return {
              ...conv,
              lastMessage: message,
              updatedAt: message.sentAt|| new Date().toISOString()
            };
          }
          return conv;
        });
        
        // Sort conversations by most recent message
        updatedConversations.sort((a, b) => {
          const aTime = a.lastMessage?.sentAt || a.updatedAt;
          const bTime = b.lastMessage?.sentAt || b.updatedAt;
          return new Date(bTime ?? '').getTime() - new Date(aTime ?? '').getTime();
        });
        
        set({ conversations: updatedConversations });
      },

      connectWebSocket: async (userId) => {
        try {
          await webSocketService.connect(userId);
          webSocketService.addMessageHandler('global', (message) => {
            get().addMessageToConversation(message);
          });
          
          return;
        } catch (error) {
          console.error('Lỗi khi kết nối WebSocket:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Không thể kết nối WebSocket'
          });
          throw error;
        }
      },

      disconnectWebSocket: () => {
        webSocketService.disconnect();
      }
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
      }),
    }
  )
);
