import { Client, IMessage, IStompSocket, IStompSocketMessageEvent, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Platform } from 'react-native';
import { SOCKET_URL, TOPIC_CONVERSATION_MESSAGES, TOPIC_PRIVATE_MESSAGES } from '@/constants/config';
import { getToken } from './apiChat';
import { Message } from '@/types';

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private messageHandlers: Map<string, ((message: Message) => void)[]> = new Map();
  private connectionPromise: Promise<void> | null = null;
  private userId: string | null = null;

  constructor() {
    this.client = null;
    this.subscriptions = new Map();
    this.messageHandlers = new Map();
  }

 async connect(userId: string): Promise<void> {
    if (this.client?.connected) {
      return;
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.userId = userId;
    this.connectionPromise = new Promise(async (resolve, reject) => {
      try {
        const token = await getToken();
        this.client = new Client({
          connectHeaders: {
            Authorization: `Bearer ${token}`,
            userId,
          },
          debug: (str) => console.log('STOMP:', str),
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        this.client.webSocketFactory = (): IStompSocket => {
          return new SockJS(`http://${SOCKET_URL}api/ws?userId=${this.userId}`) as IStompSocket;
        };

        // Thiết lập callback
        this.client.onConnect = () => {
          this.subscribeToUserMessages();
          resolve();
        };

        this.client.onStompError = (frame) => {
          console.error('STOMP error', frame);
          reject(new Error(`STOMP error: ${frame.headers.message}`));
        };

        this.client.onWebSocketError = (event) => {
          console.error('WebSocket error', event);
          reject(new Error('WebSocket connection error'));
        };

        // Kích hoạt kết nối
        this.client.activate();
      } catch (err) {
        console.error('Error connecting to WebSocket', err);
        this.connectionPromise = null;
        reject(err);
      }
    });
    return this.connectionPromise;
  }

  private subscribeToUserMessages(): void {
    if (!this.client?.connected || !this.userId) {
      console.warn('WebSocket not connected or userId not set. Cannot subscribe to user messages.');
      return;
    }
    // Subscribe to user's private messages
    const userSubscription = this.client.subscribe(
      `/user/${this.userId}/queue/messages`,
      (message: IMessage) => {
        this.handleIncomingMessage(message);
      }
      
    );
    this.subscriptions.set('user', userSubscription);
  }

  subscribeToConversation(conversationId: string): void {
    if (!this.client?.connected) {
      return;
    }

    // Unsubscribe if already subscribed
    if (this.subscriptions.has(conversationId)) {
      this.unsubscribeFromConversation(conversationId);
    }

    // Subscribe to conversation messages
    const subscription = this.client.subscribe(
      `${TOPIC_CONVERSATION_MESSAGES}${conversationId}`,
      (message: IMessage) => {
        this.handleIncomingMessage(message);
      }
    );

    this.subscriptions.set(conversationId, subscription);
  }

  unsubscribeFromConversation(conversationId: string): void {
    const subscription = this.subscriptions.get(conversationId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(conversationId);
    }
  }

  private handleIncomingMessage(stompMessage: IMessage): void {
    try {
      const message: Message = JSON.parse(stompMessage.body);
      const conversationId = message.conversationId;
      const handlers = this.messageHandlers.get(conversationId) || [];
      handlers.forEach(handler => handler(message));

      // Also notify global handlers
      const globalHandlers = this.messageHandlers.get('global') || [];
      globalHandlers.forEach(handler => handler(message));
    } catch (error) {
      console.error('Error handling incoming message', error);
    }
  }

  sendMessage(conversationId: string, content: string, messageType: string = 'text'): void {
    if (!this.client?.connected || !this.userId) {
      console.warn('WebSocket not connected. Cannot send message.');
      return;
    }

    const message = {
      conversationId,
      senderId: this.userId,
      content,
      messageType,
    };
    this.client.publish({
      destination: '/app/send-message',
      body: JSON.stringify(message)
    });
  }

  findConversationWithLeastOneContent(userId: string): StompSubscription | undefined {
    if (!this.subscriptions.has(userId)) {
      console.warn(`No subscription found for user: ${userId}`);
      return undefined;
    }
    
    return this.subscriptions.get(userId);
  }

  addMessageHandler(conversationId: string | 'global', handler: (message: Message) => void): () => void {
    if (!this.messageHandlers.has(conversationId)) {
      this.messageHandlers.set(conversationId, []);
    }

    const handlers = this.messageHandlers.get(conversationId)!;
    handlers.push(handler);
    // Return a function to remove this handler
    return () => {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    };
  }

  disconnect(): void {
    if (this.client?.connected) {
      // Unsubscribe from all topics
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
      this.subscriptions.clear();
      
      // Disconnect the client
      this.client.deactivate();
    }
    
    this.connectionPromise = null;
    this.userId = null;
  }
}

// Create a singleton instance
export const webSocketService = new WebSocketService();