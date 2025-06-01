import AsyncStorage from '@react-native-async-storage/async-storage';
import { PREFIX,SOCKET_URL } from '@/constants/config';
import { Conversation, Message, User } from '@/types/';

const API_URL = 'http://' + SOCKET_URL + PREFIX;

export const getToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem("auth_token");
    return token;
  } catch (error) {
    console.error('Failed to get auth token', error);
    return null;
  }
};

const getHeaders = async () => {
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  let data: any = null;
  let rawText: string | null = null;

  if (isJson) {
    try {
      data = await response.json();
    } catch (err) {
      console.warn('Invalid JSON response');
    }
  } else {
    rawText = await response.text(); // chỉ đọc nếu không phải JSON
  }

  if (!response.ok) {
    throw {
      message: data?.message || rawText || 'An error occurred',
      status: response.status,
      body: data || rawText
    };
  }

  return data;
};

export const apiChat = {
  conversations: {
    getAll: async (userId: string): Promise<Conversation[]> => {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/conversations/find-chat-room-at-least-one-content/${userId}`, {
        headers
      });
      return handleResponse(response);
    },
    
    create: async (creatorUserId: string, type: 'private' | 'group' = 'private'): Promise<Conversation> => {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/conversations/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ creatorUserId, type })
      });
      
      return handleResponse(response);
    },
    
    search: async (user1Id: string, user2Id: string): Promise<Conversation | null> => {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/conversations/search?user1Id=${user1Id}&user2Id=${user2Id}`, {
        headers
      });
      if (response.status === 204) {
          return null;
      }
      return handleResponse(response);
    },
     
    addParticipant: async (conversationId: string, userId: string): Promise<Conversation> => {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/conversations/add-participant?conversationId=${conversationId}&userId=${userId}`, {
        method: 'POST',
        headers
      });
      
      return handleResponse(response);
    },
    
    removeParticipant: async (conversationId: string, userId: string): Promise<Conversation> => {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/conversations/remove-participant?conversationId=${conversationId}&userId=${userId}`, {
        method: 'POST',
        headers
      });
      
      return handleResponse(response);
    },

    getParticipants: async (conversationId: string): Promise<User[]> => {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/conversations/participants/${conversationId}`, {
        headers
      });
        
      return handleResponse(response);
    }
  },
  
  messages: {
    send: async (conversationId: string, senderId: string, content: string, messageType: string = 'text'): Promise<Message> => {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/message/send-message`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          conversationId, 
          senderId, 
          content, 
          messageType 
        }),
      });
      return handleResponse(response);
    },
    
    getByConversation: async (conversationId: string): Promise<Message[]> => {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/message/messages/${conversationId}`, {
        headers
      });
      
      return handleResponse(response);
    },
  },
};