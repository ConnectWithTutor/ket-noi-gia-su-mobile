import React, { useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Bell, Search, BookOpen, Users, Calendar, MessageSquare, FileText } from "lucide-react-native";

import colors from "@/constants/Colors";
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from "@/constants/Theme";
import StatusBar from "@/components/ui/StatusBar";
import { useAuthStore } from "@/store/auth-store";
import { useScheduleStore } from "@/store/schedule-store";
import { usePostStore } from "@/store/post-store";
import { useTutorStore } from "@/store/tutor-store";
import { formatTime } from "@/utils/date-utils";
import { triggerHaptic } from "@/utils/haptics";
import PostCard from "@/components/posts/PostCard";
import TutorCard from "@/components/tutors/TutorCard";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { classes, fetchClasses } = useScheduleStore();
  const { posts, fetchPosts } = usePostStore();
  const { tutors, fetchTutors } = useTutorStore();
  
  useEffect(() => {
    fetchClasses();
    fetchPosts();
    fetchTutors();
  }, []);
  
  const upcomingClasses = classes
    .filter(c => c.status === "upcoming")
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);
  
  const recentPosts = posts
    .filter(p => p.status === "active")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2);
  
  const recommendedTutors = tutors.slice(0, 4);
  
  const handleFeaturePress = (feature: string) => {
    triggerHaptic('light');
    
    switch (feature) {
      case "schedule":
        router.push("/(app)/(tabs)/schedule" as any);
        break;
      case "tutors":
        router.push("/(app)/(tabs)/posts" as any);
        break;
      case "chat":
        router.push("/(app)/(tabs)/chat" as any);
        break;
      case "posts":
        router.push("/(app)/(tabs)/posts" as any);
        break;
      default:
        break;
    }
  };
  
  const handlePostPress = (postId: string) => {
    triggerHaptic('light');
    router.push(`/post/${postId}` as any);
  };
  
  const handleTutorPress = (tutorId: string) => {
    triggerHaptic('light');
    router.push(`/tutor/${tutorId}` as any);
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
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Xin chào,</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => {handleNotificationPress()}}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Bell size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.searchBar} onPress={() => {}}>
          <Search size={20} color={colors.textSecondary} />
          <Text style={styles.searchText}>Tìm kiếm gia sư, môn học...</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Dịch vụ</Text>
          
          <View style={styles.featuresGrid}>
            <TouchableOpacity 
              style={styles.featureItem} 
              onPress={() => handleFeaturePress("schedule")}
            >
              <View style={[styles.featureIcon, { backgroundColor: colors.primaryLight }]}>
                <Calendar size={24} color={colors.primary} />
              </View>
              <Text style={styles.featureText}>Lịch học</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.featureItem} 
              onPress={() => handleFeaturePress("tutors")}
            >
              <View style={[styles.featureIcon, { backgroundColor: "#FFE0B2" }]}>
                <Users size={24} color="#FF9800" />
              </View>
              <Text style={styles.featureText}>Gia sư</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.featureItem} 
              onPress={() => handleFeaturePress("chat")}
            >
              <View style={[styles.featureIcon, { backgroundColor: "#E1F5FE" }]}>
                <MessageSquare size={24} color="#03A9F4" />
              </View>
              <Text style={styles.featureText}>Trò chuyện</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.featureItem} 
              onPress={() => handleFeaturePress("posts")}
            >
              <View style={[styles.featureIcon, { backgroundColor: "#E8F5E9" }]}>
                <FileText size={24} color="#4CAF50" />
              </View>
              <Text style={styles.featureText}>Bài đăng</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.recentPostsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bài đăng mới nhất</Text>
            <TouchableOpacity onPress={() => router.push("/(app)/(tabs)/posts" as any)}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          {recentPosts.length > 0 ? (
            recentPosts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onPress={() => handlePostPress(post.id)} 
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không có bài đăng mới</Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.createPostButton}
            onPress={handleCreatePost}
          >
            <FileText size={18} color={colors.primary} />
            <Text style={styles.createPostText}>Đăng bài tìm gia sư</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.upcomingClassesContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lớp học sắp tới</Text>
            <TouchableOpacity onPress={() => router.push("/(app)/(tabs)/schedule")}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          {upcomingClasses.length > 0 ? (
            upcomingClasses.map((classItem) => (
              <TouchableOpacity 
                key={classItem.id} 
                style={styles.classCard}
                onPress={() => {}}
              >
                <View style={styles.classInfo}>
                  <Text style={styles.classTitle}>{classItem.title}</Text>
                  <Text style={styles.classTime}>
                    {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
                  </Text>
                  <Text style={styles.classLocation}>{classItem.location}</Text>
                </View>
                
                <View style={styles.tutorInfo}>
                  <Image
                    source={{ uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" }}
                    style={styles.tutorAvatar}
                  />
                  <Text style={styles.tutorName}>{classItem.tutorName}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không có lớp học sắp tới</Text>
            </View>
          )}
        </View>
        
        <View style={styles.recommendedTutorsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Gia sư gợi ý</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          {recommendedTutors.length > 0 ? (
            recommendedTutors.map(tutor => (
              <TutorCard 
                key={tutor.id} 
                tutor={tutor} 
                onPress={() => handleTutorPress(tutor.id)} 
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không có gia sư gợi ý</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  greeting: {
    fontSize: FONT_SIZE.md,
    color: colors.white,
    opacity: 0.9,
  },
  userName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: colors.white,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  searchText: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: colors.placeholder,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  featuresContainer: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: SPACING.md,
  },
  seeAllText: {
    fontSize: FONT_SIZE.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureItem: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: "center",
    ...SHADOWS.small,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  featureText: {
    fontSize: FONT_SIZE.md,
    color: colors.text,
    fontWeight: '600',
  },
  recentPostsContainer: {
    marginBottom: SPACING.xl,
  },
  upcomingClassesContainer: {
    marginBottom: SPACING.xl,
  },
  loadingContainer: {
    padding: SPACING.lg,
    alignItems: "center",
  },
  loadingText: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
  emptyContainer: {
    padding: SPACING.lg,
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.small,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
  classCard: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  classInfo: {
    flex: 1,
  },
  classTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: SPACING.xs,
  },
  classTime: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: SPACING.xs,
  },
  classLocation: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
  },
  tutorInfo: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: SPACING.md,
  },
  tutorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: SPACING.xs,
  },
  tutorName: {
    fontSize: FONT_SIZE.xs,
    color: colors.textSecondary,
    textAlign: "center",
  },
  recommendedTutorsContainer: {
    marginBottom: SPACING.xl,
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  createPostText: {
    fontSize: FONT_SIZE.md,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
});