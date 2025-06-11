import { useEffect, useState } from 'react';
import { useChatStore } from '@/store/chat-store';
import { Message, User } from '@/types';
export const useChat = (User: User) => {
  const {
    currentUser,
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    setCurrentUser,
    fetchConversations,
    fetchParticipants,
    fetchMessages,
    sendMessage,
    setCurrentConversation,
    createConversation,
    connectWebSocket,
    disconnectWebSocket,
    SearchConversation,
  } = useChatStore();
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (User) {
      // Set current user if not already set
      if (!currentUser || currentUser.userId !== User.userId) {
        setCurrentUser(User);
      }

      // Connect to WebSocket
      connectWebSocket(User.userId)
        .catch(err => {
          console.error('WebSocket connection error:', err);
          setConnectionError('Failed to connect to chat server. Please try again later.');
        });
      
      // Fetch conversations
      fetchConversations(User.userId)
        .catch(err => {
          console.error('Error fetching conversations:', err);
        });
      
      // Cleanup on unmount
      return () => {
        disconnectWebSocket();
      };
    }
  }, [User]);

  // Get messages for the current conversation
  const currentMessages: Message[] = currentConversation 
    ? messages[currentConversation.conversationId] || []
    : [];

  // Helper function to start a chat with another user
  const startChat = async (userId:string) => {
    if (!currentUser || !userId) {
      throw new Error('Current user not set');
    }
    
    try {
      const existingConversation = await SearchConversation(userId, currentUser.userId);
      if (existingConversation) {
        setCurrentConversation(existingConversation);
        await fetchMessages(existingConversation.conversationId);
        await fetchParticipants(existingConversation.conversationId);
        return existingConversation;
      }
      const conversation = await createConversation(currentUser.userId, userId);
      setCurrentConversation(conversation);
      await fetchMessages(conversation.conversationId);
      await fetchParticipants(conversation.conversationId);
      return conversation;
    } catch (err) {
      console.error('Error starting chat:', err);
      throw err;
    }
  };

  // Helper function to open an existing conversation
  const openConversation = async (conversationId: string) => {
    try {
      const conversation = conversations.find(c => c.conversationId === conversationId);
      if (conversation) {
        setCurrentConversation(conversation);
        await fetchMessages(conversationId);
        await fetchParticipants(conversationId);
      } else {
        if (!currentUser || !currentUser.userId) {
          await fetchConversations(currentUser?.userId || '');
        }
        const refreshedConversation = conversations.find(c => c.conversationId === conversationId);
        if (refreshedConversation) {
          setCurrentConversation(refreshedConversation);
          await fetchMessages(conversationId);
        }
      }
    } catch (err) {
      console.error('Error opening conversation:', err);
    }
  };

  return {
    currentUser,
    conversations,
    currentConversation,
    messages: currentMessages,
    isLoading,
    error: error || connectionError,
    sendMessage: (content: string, messageType?: string) => {
      if (!currentConversation) {
        throw new Error('No active conversation');
      }
      return sendMessage(currentConversation.conversationId, content, messageType);
    },
    startChat,
    openConversation,
    setCurrentConversation,
    fetchConversations: (userId: string) => fetchConversations(userId),
  };
};