import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image, TextInput } from "react-native";
import { Search, Users, BookOpen, Calendar, Grid3X3, ArrowRight } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import colors from "@/constants/Colors";
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from "@/constants/Theme";
import Header from "@/components/ui/Header";
import StatusBar from "@/components/ui/StatusBar";
import { useChatStore } from "@/store/chat-store";
import { getRelativeTime } from "@/utils/date-utils";
import { useRouter } from "expo-router";
import { Conversation } from "@/types/chat";

export default function ChatScreen() {
  const router = useRouter();
  const { conversations, fetchConversations, isLoading, setActiveConversation } = useChatStore();
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    fetchConversations();
  }, []);
  
  const handleConversationPress = (conversationId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveConversation(conversationId);
    router.push(`/conversation/${conversationId}`);
  };
  
  const filteredConversations = searchQuery
    ? conversations.filter(conv => 
        conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <Header title="Trò Chuyện" showNotification />
      
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm tin nhắn..."
              placeholderTextColor={colors.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
        
        <View style={styles.categoriesContainer}>
          <ScrollableCategories />
        </View>
        
        <View style={styles.conversationsContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
          ) : filteredConversations.length > 0 ? (
            <FlatList
              data={filteredConversations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ConversationItem
                  conversation={item}
                  onPress={() => handleConversationPress(item.id)}
                />
              )}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? "Không tìm thấy kết quả" : "Không có cuộc trò chuyện nào"}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function ScrollableCategories() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const categories = [
    { id: "all", icon: <Users size={20} color={colors.primary} />, label: "Tất cả" },
    { id: "tutors", icon: <Users size={20} color={colors.primary} />, label: "Gia sư" },
    { id: "students", icon: <Users size={20} color={colors.primary} />, label: "Học viên" },
    { id: "subjects", icon: <BookOpen size={20} color={colors.primary} />, label: "Môn học" },
    { id: "schedule", icon: <Calendar size={20} color={colors.primary} />, label: "Lịch học" },
    { id: "other", icon: <Grid3X3 size={20} color={colors.primary} />, label: "Khác" },
  ];
  
  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.categoryItem,
            selectedCategory === item.id && styles.selectedCategoryItem,
          ]}
          onPress={() => setSelectedCategory(item.id)}
        >
          {item.icon}
          <Text
            style={[
              styles.categoryLabel,
              selectedCategory === item.id && styles.selectedCategoryLabel,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.categoriesList}
    />
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  onPress: () => void;
}

function ConversationItem({ conversation, onPress }: ConversationItemProps) {
  return (
    <TouchableOpacity style={styles.conversationItem} onPress={onPress}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" }}
          style={styles.avatar}
        />
        {conversation.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{conversation.unreadCount}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>
            {conversation.participants.includes("2") ? "Nguyễn Văn A" : 
             conversation.participants.includes("3") ? "Lê Thị B" : "Trần Văn C"}
          </Text>
          <Text style={styles.conversationTime}>
            {getRelativeTime(conversation.lastMessage.timestamp)}
          </Text>
        </View>
        
        <View style={styles.messagePreview}>
          <Text 
            style={[
              styles.messageText,
              conversation.unreadCount > 0 && styles.unreadMessageText,
            ]}
            numberOfLines={1}
          >
            {conversation.lastMessage.content}
          </Text>
          <ArrowRight size={16} color={colors.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
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
  searchContainer: {
    padding: SPACING.md,
    backgroundColor: colors.white,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: colors.text,
  },
  categoriesContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoriesList: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: colors.card,
  },
  selectedCategoryItem: {
    backgroundColor: colors.primaryLight,
  },
  categoryLabel: {
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZE.sm,
    color: colors.text,
  },
  selectedCategoryLabel: {
    color: colors.primary,
    fontWeight: 600,
  },
  conversationsContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    textAlign: "center",
  },
  conversationItem: {
    flexDirection: "row",
    padding: SPACING.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    position: "relative",
    marginRight: SPACING.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  unreadBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.white,
  },
  unreadCount: {
    fontSize: FONT_SIZE.xs,
    color: colors.white,
    fontWeight: 700,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  conversationName: {
    fontSize: FONT_SIZE.md,
    fontWeight: 600,
    color: colors.text,
  },
  conversationTime: {
    fontSize: FONT_SIZE.xs,
    color: colors.textSecondary,
  },
  messagePreview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  messageText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginRight: SPACING.sm,
  },
  unreadMessageText: {
    fontWeight: 600,
    color: colors.text,
  },
});