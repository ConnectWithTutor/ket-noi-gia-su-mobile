import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image, TextInput, RefreshControl } from "react-native";
import { Search, Users, BookOpen, Calendar, Grid3X3, ArrowRight } from "lucide-react-native";
import colors from "@/constants/Colors";
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from "@/constants/Theme";
import Header from "@/components/ui/Header";
import StatusBar from "@/components/ui/StatusBar";
import { useChatStore } from "@/store/chat-store";
import { getRelativeTime } from "@/utils/date-utils";
import { useRouter } from "expo-router";
import { Conversation } from "@/types/conversation";
import { triggerHaptic } from "@/utils/haptics";
import { useAuthStore } from "@/store/auth-store";
import { useChat } from "@/hooks/useChat";
import { User } from "@/types";
import { useTranslation } from 'react-i18next';

export default function ChatScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { t } = useTranslation();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>{t('Vui lòng đăng nhập để xem cuộc trò chuyện')}</Text>
      </View>
    );
  }
    const { 
    conversations, 
    isLoading,
     fetchConversations,
  } = useChat(user);
  const { fetchParticipants } = useChatStore();
  const [conversationUsersMap, setConversationUsersMap] = useState<{ [key: string]: any }>({});
  const [searchQuery, setSearchQuery] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const loadConversationUsersOnce = async (conversationId : string) => {
    if (conversationUsersMap[conversationId]) return;
    try {
      const users = await fetchParticipants(conversationId);
      setConversationUsersMap((prev) => ({ ...prev, [conversationId]: users }));
    } catch (error) {
      console.error("Failed to load conversation users", error);
    }
  };
  
  
  const handleRefresh = async () => {
  if (!user?.userId) return;
  setRefreshing(true);
  fetchConversations(user.userId);
  setRefreshing(false);

};
const handleSelectConversation = (conversation: Conversation) => {
    router.push(`/conversation/${conversation.conversationId}`);
  };
  const handleNotificationPress = () => {
      triggerHaptic('light');
      router.push('/notification-list' as any);
    };
  const filteredConversations = searchQuery
    ? conversations.filter(conv => 
        conv.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <Header title={t('Trò Chuyện')} showNotification onNotificationPress={handleNotificationPress}/>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('Tìm kiếm tin nhắn...')}
              placeholderTextColor={colors.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
        
        
        <View style={styles.conversationsContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>{t('Đang tải...')}</Text>
            </View>
          ) : filteredConversations.length > 0 ? (
            <FlatList
              data={filteredConversations}
              keyExtractor={(item) => item.conversationId}
              renderItem={({ item }) => (
                <ConversationItem
                  conversation={item}
                  users={conversationUsersMap[item.conversationId] || []}
                  onVisible={() => loadConversationUsersOnce(item.conversationId)}
                  onPress={() => handleSelectConversation(item)}
                />
              )}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} colors={[colors.primary]} />
                      }
            />

          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? t('Không tìm thấy kết quả') : t('Không có cuộc trò chuyện nào')}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}



interface ConversationItemProps {
  conversation: Conversation;
  onPress: () => void;
  users: User[];
  onVisible?: () => void;
}

function ConversationItem({ conversation, onPress, users, onVisible }: ConversationItemProps) {
   useEffect(() => {
    onVisible?.();
  }, []);
  const userId = useAuthStore((state) => state.user?.userId);
  const { t } = useTranslation();
  const otherUser = users.find((u) => u.userId !== userId);
  const displayName = otherUser?.fullName || t('Không rõ người dùng');
  return (
    <TouchableOpacity style={styles.conversationItem} onPress={onPress}>
      <View style={styles.avatarContainer}>
        <Image
          source={
            otherUser?.avatarUrl
              ? { uri: otherUser.avatarUrl }
              : require('@/assets/images/user_default.jpg')
          }
          style={styles.avatar}
        />
      </View>
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>
            {displayName}
          </Text>
          <Text style={styles.conversationTime}>
            {getRelativeTime(conversation.lastMessage?.sentAt || conversation.createdAt)}
          </Text>
        </View>
        <View style={styles.messagePreview}>
          <Text
            style={[
              styles.messageText,
            ]}
            numberOfLines={1}
          >
              {conversation.lastMessage?.content || t('Cuộc trò chuyện mới')}
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