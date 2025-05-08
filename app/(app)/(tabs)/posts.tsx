import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";

import colors from "@/constants/Colors";
import { BORDER_RADIUS, FONT_SIZE, SHADOWS, SPACING } from "@/constants/Theme";
import StatusBar from "@/components/ui/StatusBar";
import Header from "@/components/ui/Header";
import PostCard from "@/components/posts/PostCard";
import PostFilter from "@/components/posts/PostFilter";
import { usePostStore } from "@/store/post-store";
import { StudentRequest } from "@/types/student-request";
import { triggerHaptic } from "@/utils/haptics";

export default function PostsScreen() {
  const router = useRouter();
  const { posts, fetchPosts, isLoading } = usePostStore();
  const [filteredPosts, setFilteredPosts] = useState<StudentRequest[]>([]);
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);
  
  const handleFilterChange = (filters: {
    subjectId?: string;
    location?: string;
    status?: string;
  }) => {
    let filtered = [...posts];
    
    if (filters.subjectId) {
      filtered = filtered.filter(post => post.subjectId === filters.subjectId);
    }
    
    if (filters.location) {
      filtered = filtered.filter(post => post.location.includes(filters.location || ''));
    }
    
    if (filters.status) {
      filtered = filtered.filter(post => post.status === filters.status);
    }
    
    setFilteredPosts(filtered);
  };
  
  const handlePostPress = (postId: string) => {
    triggerHaptic('light');
    router.push(`/post/${postId}` as any);
  };
  
  const handleCreatePost = () => {
    triggerHaptic('medium');
    router.push('/create-post' as any);
  };

  const handleNotificationPress = () => {
    triggerHaptic('light');
    router.push('/notification-list' as any);
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <Header title="Bài đăng" showNotification  onNotificationPress={handleNotificationPress}/>
      
      <PostFilter onFilterChange={handleFilterChange} />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : filteredPosts.length > 0 ? (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.requestId}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onPress={() => handlePostPress(item.requestId)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có bài đăng nào</Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.createButton}
        onPress={handleCreatePost}
        activeOpacity={0.8}
      >
        <Plus size={24} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  createButton: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
});