import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation, Message } from '@/types/chat';

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeConversationId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface ChatStore extends ChatState {
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  setActiveConversation: (conversationId: string) => void;
  markConversationAsRead: (conversationId: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      isLoading: false,
      error: null,

      fetchConversations: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Mock conversations data
          const mockConversations: Conversation[] = [
            {
              id: '1',
              participants: ['1', '2'],
              lastMessage: {
                id: '101',
                senderId: '2',
                receiverId: '1',
                content: 'Xin chào, bạn có thể giúp tôi về bài tập không?',
                timestamp: new Date().toISOString(),
                read: false,
              },
              unreadCount: 1,
            },
            {
              id: '2',
              participants: ['1', '3'],
              lastMessage: {
                id: '201',
                senderId: '1',
                receiverId: '3',
                content: 'Cảm ơn thầy về buổi học hôm nay!',
                timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                read: true,
              },
              unreadCount: 0,
            },
            {
              id: '3',
              participants: ['1', '4'],
              lastMessage: {
                id: '301',
                senderId: '4',
                receiverId: '1',
                content: 'Ngày mai chúng ta sẽ học chương 5 nhé.',
                timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                read: true,
              },
              unreadCount: 0,
            },
          ];
          
          set({ conversations: mockConversations, isLoading: false });
        } catch (error) {
          set({ 
            error: "Không thể tải cuộc trò chuyện. Vui lòng thử lại sau.", 
            isLoading: false 
          });
        }
      },

      fetchMessages: async (conversationId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Mock messages data
          const now = Date.now();
          const mockMessages: Message[] = [
            {
              id: '1',
              senderId: '2',
              receiverId: '1',
              content: 'Xin chào, bạn có thể giúp tôi về bài tập không?',
              timestamp: new Date(now - 3600000).toISOString(), // 1 hour ago
              read: true,
            },
            {
              id: '2',
              senderId: '1',
              receiverId: '2',
              content: 'Chào bạn, tôi có thể giúp gì cho bạn?',
              timestamp: new Date(now - 3540000).toISOString(), // 59 minutes ago
              read: true,
            },
            {
              id: '3',
              senderId: '2',
              receiverId: '1',
              content: 'Tôi đang gặp khó khăn với bài tập về Phương trình bậc hai.',
              timestamp: new Date(now - 3480000).toISOString(), // 58 minutes ago
              read: true,
            },
            {
              id: '4',
              senderId: '1',
              receiverId: '2',
              content: 'Không vấn đề gì. Bạn có thể gửi bài tập cho tôi xem không?',
              timestamp: new Date(now - 3420000).toISOString(), // 57 minutes ago
              read: true,
            },
            {
              id: '5',
              senderId: '2',
              receiverId: '1',
              content: 'Phòng tôi có thể học trực tiếp không? Tôi sẽ mang theo sách.',
              timestamp: new Date(now - 3360000).toISOString(), // 56 minutes ago
              read: true,
            },
            {
              id: '6',
              senderId: '1',
              receiverId: '2',
              content: 'Được chứ. Chúng ta có thể gặp nhau vào ngày mai lúc 3 giờ chiều tại thư viện.',
              timestamp: new Date(now - 3300000).toISOString(), // 55 minutes ago
              read: true,
            },
            {
              id: '7',
              senderId: '2',
              receiverId: '1',
              content: 'Tuyệt vời! Cảm ơn bạn rất nhiều.',
              timestamp: new Date(now - 3240000).toISOString(), // 54 minutes ago
              read: true,
            },
            {
              id: '8',
              senderId: '1',
              receiverId: '2',
              content: 'Không có gì. Hẹn gặp bạn ngày mai.',
              timestamp: new Date(now - 3180000).toISOString(), // 53 minutes ago
              read: true,
            },
          ];
          
          set((state) => ({
            messages: {
              ...state.messages,
              [conversationId]: mockMessages,
            },
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: "Không thể tải tin nhắn. Vui lòng thử lại sau.", 
            isLoading: false 
          });
        }
      },

      sendMessage: async (conversationId, content) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          const newMessage: Message = {
            id: Date.now().toString(),
            senderId: '1', // Current user ID
            receiverId: get().conversations.find(c => c.id === conversationId)?.participants.find(p => p !== '1') || '',
            content,
            timestamp: new Date().toISOString(),
            read: true,
          };
          
          set((state) => {
            // Update messages
            const conversationMessages = state.messages[conversationId] || [];
            const updatedMessages = {
              ...state.messages,
              [conversationId]: [...conversationMessages, newMessage],
            };
            
            // Update conversation last message
            const updatedConversations = state.conversations.map(conv => 
              conv.id === conversationId
                ? { ...conv, lastMessage: newMessage, unreadCount: 0 }
                : conv
            );
            
            return {
              messages: updatedMessages,
              conversations: updatedConversations,
              isLoading: false,
            };
          });
        } catch (error) {
          set({ 
            error: "Không thể gửi tin nhắn. Vui lòng thử lại sau.", 
            isLoading: false 
          });
        }
      },

      setActiveConversation: (conversationId) => {
        set({ activeConversationId: conversationId });
      },

      markConversationAsRead: async (conversationId) => {
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 300));
          
          set((state) => ({
            conversations: state.conversations.map(conv => 
              conv.id === conversationId
                ? { ...conv, unreadCount: 0 }
                : conv
            ),
          }));
        } catch (error) {
          console.error("Error marking conversation as read:", error);
        }
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);