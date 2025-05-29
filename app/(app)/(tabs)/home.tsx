import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Bell, Search, BookOpen, Users, Calendar, MessageSquare, FileText, School } from "lucide-react-native";

import colors from "@/constants/Colors";
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from "@/constants/Theme";
import StatusBar from "@/components/ui/StatusBar";
import { useAuthStore } from "@/store/auth-store";
import { useStudentRequestStore } from "@/store/post-store";
import { useTutorStore } from "@/store/tutor-store";
import { formatDate, formatTime } from "@/utils/date-utils";
import { triggerHaptic } from "@/utils/haptics";
import PostCard from "@/components/posts/PostCard";
import TutorCard from "@/components/tutors/TutorCard";
import { StudentRequest, Tutor, User } from "@/types";
import { useClassStore } from "@/store/class-store";
import { useStatusStore } from "@/store/status-store";
import { useUserProfileStore } from "@/store/profile-store";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
 
      const { fetchUserById } = useUserProfileStore();
  const { classes, fetchClasses } = useClassStore();
  const {StatusesClass, fetchStatusesClass} = useStatusStore();
    const [authorsMap, setAuthorsMap] = useState<Map<string, any>>(new Map());
    const { statusesStudentRequest, fetchStatuses } = useStatusStore();
  const {
    recentRequests,
    loading,
    fetchRecentStudentRequests
  } = useStudentRequestStore();
  const { users, fetchTutors } = useTutorStore();
    useEffect(() => {
    fetchClasses();
    fetchStatusesClass();
    fetchRecentStudentRequests();
    fetchStatuses
    fetchTutors();
  }, []);

  const PendingClass = StatusesClass.find((status) => status.code === "Pending");
  const upcomingClasses = classes
    .filter(c => c.status === PendingClass?.statusId)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);
   const handleRequestPress = (request: StudentRequest) => {
    router.push(`/student-request/${request.requestId}` as any);
  };

   const getStatusById = useCallback(
    (statusId: string) => statusesStudentRequest.find(s => s.statusId === statusId) || null,
    [statusesStudentRequest]
  );
  const recommendedTutors = users.slice(0, 4);
   const handlePostPress = useCallback(
      (requestId: string) => {
        triggerHaptic("light");
        router.push(`/student-request/${requestId}`);
      },
      [router]
    );

  useEffect(() => {
    async function fetchAuthors() {
      const userIds = [...new Set(recentRequests.map(item => item.studentId))];
      const users = await Promise.all(userIds.map(id => 
        fetchUserById(id)

    ));

      const map = new Map();
      users.forEach(user => {
        if (user) map.set(user.userId, user);
      });
      // So sánh map mới với authorsMap cũ
      let isSame = true;
      if (map.size !== authorsMap.size) isSame = false;
      else {
        for (let [key, value] of map) {
          if (authorsMap.get(key) !== value) {
            isSame = false;
            break;
          }
        }
      }
      if (!isSame) setAuthorsMap(map);
    }
  
    if (recentRequests.length > 0) {
      fetchAuthors();
    }
  }, [recentRequests, fetchUserById]);
   
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
  const handleFindClass = () => {
    triggerHaptic('light');
    router.push("/(app)/class/find-class" as any);
  };
  const getTutor = (tutorId: string): User => {
    const tutor = users.find(user => user.userId === tutorId);
    return tutor ?? user!;
  };
  
  const handleTutorPress = (userid: string) => {
    triggerHaptic('light');
    router.push(`/tutor/${userid}` as any);
  };
  
  const handleCreatePost = () => {
    triggerHaptic('medium');
    router.push('/student-request/create' as any);
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
            <Text style={styles.userName}>{user?.fullName}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => {handleNotificationPress()}}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Bell size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.searchBar} onPress={() => {handleFindClass()}}>
          <Search size={20} color={colors.textSecondary} />
          <Text style={styles.searchText}>Tìm kiếm môn học</Text>
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
                <School size={24} color="#FF9800" />
              </View>
              <Text style={styles.featureText}>Lớp học</Text>
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
          
           {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Đang tải bài đăng...</Text>
            </View>
          ) : recentRequests.length > 0 ? (
            recentRequests.map((item) =>
              {
              const author = authorsMap.get(item.studentId);
              const status = getStatusById(item.status);
              if (!author || !status) return null;
            
              return (
                <PostCard
                  key={item.requestId}
                  post={item}
                  author={author}
                  status={status}
                  onPress={() => handlePostPress(item.requestId)}
                />
              );
              }
            )
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
            <TouchableOpacity onPress={() => router.push("/(app)/(tabs)/class")}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          {upcomingClasses.length > 0 ? (
            upcomingClasses.map((classItem) => (
              <TouchableOpacity 
                key={classItem.classId} 
                style={styles.classCard}
                onPress={() => {}}
              >
                <View style={styles.classInfo}>
                  <Text style={styles.classTitle}>{classItem.className_vi}</Text>
                  <Text style={styles.classTime}>
                    {(classItem.startDate)} 
                  </Text>
                  <Text style={styles.classLocation}>{classItem.description}</Text>
                </View>
                
                <View style={styles.tutorInfo}>
                  <Image
                    source={{ uri: getTutor(classItem.tutorId).avatarUrl ||  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" }}
                    style={styles.tutorAvatar}
                  />
                  <Text style={styles.tutorName}>{getTutor(classItem.tutorId).fullName}</Text>
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
            
            recommendedTutors.map(user => (
              <TutorCard 
                key={user.userId}
                user={user}
                onPress={() => handleTutorPress(user.userId)}  />
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