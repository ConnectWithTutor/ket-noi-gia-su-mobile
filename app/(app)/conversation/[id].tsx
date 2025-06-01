import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator,Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

import colors from "@/constants/Colors";
import StatusBar from "@/components/ui/StatusBar";
import Header from "@/components/ui/Header";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatInput from "@/components/chat/ChatInput";
import { useChatStore } from "@/store/chat-store";
import { formatTime } from "@/utils/date-utils";
import { Message } from "@/types/message";
import { triggerHaptic } from "@/utils/haptics";
import { User } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import { useChat } from "@/hooks/useChat";
export default function ConversationScreen() {
  const { id } = useLocalSearchParams();
  const conversationId = Array.isArray(id) ? id[0] : id;
  const { user } = useAuthStore();
  if (!user) {
    throw new Error("User not found. Please log in.");
  }
const [sendingMessage, setSendingMessage] = useState(false);
 const { 
    messages,
    sendMessage,
    openConversation,
    isLoading,
    error,
  } = useChat(user);
  useEffect(() => {
    if (conversationId) {
      openConversation(conversationId);
    }
  }, [conversationId])
  const flatListRef = useRef<FlatList<Message>>(null);
;


useEffect(() => {
  if (messages.length > 0) {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }
}, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    triggerHaptic('light');
     setSendingMessage(true);
    try {
      await sendMessage(content);
      
      // Scroll to bottom after sending
      setTimeout(() => {
        if (flatListRef.current && messages.length > 0) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSendingMessage(false);
    }
  };
   
  const getConversationName = () => {
   
  
    return "Trò chuyện";
    }
return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <Header title={getConversationName()} showBack showNotification />

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : isLoading && messages.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading messages...</Text>
          </View>
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.messageId}
              renderItem={({ item, index }) => (
                <MessageBubble
                  message={item.content}
                  time={formatTime(item.sentAt)}
                  isMe={item.senderId === user?.userId}
                  avatar={
                    item.senderId !== user?.userId
                      ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                      : user?.avatarUrl ?? undefined
                  }
                  showAvatar={
                    index === 0 ||
                    (index > 0 &&
                      messages[index - 1]?.senderId !== item.senderId)
                  }
                />
              )}
              contentContainerStyle={styles.messagesContainer}
              onLayout={() => {
                flatListRef.current?.scrollToEnd({ animated: false });
              }}
            />
            <ChatInput
              onSend={handleSendMessage}
              onAttach={() => {}}
              onVoice={() => {}}
            />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
   centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messagesContainer: {
    padding: 16,
    flexGrow: 1,
  },
});