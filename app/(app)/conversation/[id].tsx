import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";

import colors from "@/constants/Colors";
import StatusBar from "@/components/ui/StatusBar";
import Header from "@/components/ui/Header";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatInput from "@/components/chat/ChatInput";
import { useChatStore } from "@/store/chat-store";
import { formatTime } from "@/utils/date-utils";
import { Message } from "@/types/chat";

export default function ConversationScreen() {
  const { id } = useLocalSearchParams();
  const conversationId = Array.isArray(id) ? id[0] : id;
  
  const { 
    messages, 
    fetchMessages, 
    sendMessage, 
    isLoading, 
    conversations,
    markConversationAsRead
  } = useChatStore();
  
  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);
  
  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
      markConversationAsRead(conversationId);
    }
  }, [conversationId]);
  
  useEffect(() => {
    if (messages[conversationId]) {
      setConversationMessages(messages[conversationId]);
    }
  }, [messages, conversationId]);
  
  const handleSendMessage = async (content: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await sendMessage(conversationId, content);
    
    // Scroll to bottom after sending message
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };
  
  const getConversationName = () => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return "Trò chuyện";
    
    const otherParticipantId = conversation.participants.find(p => p !== "1");
    return otherParticipantId === "2" ? "Nguyễn Văn A" : 
           otherParticipantId === "3" ? "Lê Thị B" : "Trần Văn C";
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <Header title={getConversationName()} showBack showNotification />
      
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={conversationMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <MessageBubble
              message={item.content}
              time={formatTime(item.timestamp)}
              isMe={item.senderId === "1"}
              avatar={item.senderId !== "1" ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" : undefined}
              showAvatar={
                index === 0 || 
                (index > 0 && conversationMessages[index - 1]?.senderId !== item.senderId)
              }
            />
          )}
          contentContainerStyle={styles.messagesContainer}
          onLayout={() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToEnd({ animated: false });
            }
          }}
        />
        
        <ChatInput
          onSend={handleSendMessage}
          onAttach={() => {}}
          onVoice={() => {}}
        />
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
  messagesContainer: {
    padding: 16,
    flexGrow: 1,
  },
});