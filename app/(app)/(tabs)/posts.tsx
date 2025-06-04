import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useStudentRequestStore } from "@/store/post-store";
import { useAuthStore } from "@/store/auth-store";
import Colors from "@/constants/Colors";
import { Plus } from "lucide-react-native";
import StatusBar from "@/components/ui/StatusBar";
import Header from "@/components/ui/Header";
import { triggerHaptic } from "@/utils/haptics";
import PostCard from "@/components/posts/PostCard";
import { useSubjectStore } from '@/store/subjectStore';
import { useUserProfileStore } from '@/store/profile-store';
import { useStatusStore } from '@/store/status-store';
import { StudentRequest } from '@/types';
import { useTranslation } from 'react-i18next';
export default function RequestsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
const { t } = useTranslation();
  const {
    requests,
    myRequests,
    loading,
    error,
    fetchStudentRequests,
    fetchMyStudentRequests,
    pagination,
    nextPage,
  } = useStudentRequestStore();
  const { fetchUserById } = useUserProfileStore();
  const { getSubjectById } = useSubjectStore();
  const { statusesStudentRequest, fetchStatuses } = useStatusStore();
  const [showMyRequests, setShowMyRequests] = useState(false);
  const [authorsMap, setAuthorsMap] = useState<Map<string, any>>(new Map());

  const data = useMemo(() => (showMyRequests ? myRequests : requests), [showMyRequests, myRequests, requests]);
  useEffect(() => {
    fetchStudentRequests();
    fetchStatuses();
  }, []);

  useEffect(() => {
    if (showMyRequests && user?.userId) {
      fetchMyStudentRequests(user.userId);
    }
  }, [showMyRequests, user]);
  useEffect(() => {
  async function fetchAuthors() {
    const userIds = [...new Set(data.map(item => item.studentId))];
    const users = await Promise.all(userIds.map(id => fetchUserById(id)));
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

  if (data.length > 0) {
    fetchAuthors();
  }
}, [data, fetchUserById]);
  const handleCreateRequest = useCallback(() => {
    triggerHaptic("light");
    router.push("/student-request/create");
  }, [router]);

  const handlePostPress = useCallback(
    (requestId: string) => {
      triggerHaptic("light");
      router.push(`/student-request/${requestId}`);
    },
    [router]
  );

  const handleNotificationPress = useCallback(() => {
    triggerHaptic("light");
    router.push("/notification-list" as any);
  }, [router]);

  const onRefresh = useCallback(() => {
    if (showMyRequests && user?.userId) {
      fetchMyStudentRequests(user.userId);
    } else {
      fetchStudentRequests();
    }
  }, [showMyRequests, user]);

  const loadMore = useCallback(() => {
    if (!loading && !showMyRequests && pagination.page < (pagination.totalPages || 1)) {
      nextPage();
    }
  }, [loading, showMyRequests, pagination]);
  const getStatusById = useCallback(
  (statusId: string) => statusesStudentRequest.find(s => s.statusId === statusId) || null,
  [statusesStudentRequest]
);
const listFooter = useMemo(() => {
  if (!showMyRequests && data.length > 0 && pagination.page >= (pagination.totalPages || 1)) {
    return <Text style={styles.paginationEndText}>{t('Đã tải hết trang')}</Text>;
  }
  return null;
}, [showMyRequests, data.length, pagination.page, pagination.totalPages]);
const renderSeparator = useCallback(() => <View style={styles.separator} />, []);
  const { subjects } = useSubjectStore();

  const renderItem = useCallback(({ item }: { item: StudentRequest }) => {
  const author = authorsMap.get(item.studentId);
  const status = getStatusById(item.status);
  // Lấy subject trực tiếp từ mảng subjects
  const subject = subjects.find(s => s.subjectId === item.subjectId);
  if (!author || !status || !subject) return null;

  return (
    <PostCard
      post={item}
      author={author}
      status={status}
      subject={subject}
      onPress={() => handlePostPress(item.requestId)}
    />
  );
}, [authorsMap, handlePostPress, getStatusById, subjects]);
  const renderEmptyList = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>
        {showMyRequests ? t("Bạn chưa tạo yêu cầu nào") : t("Không tìm thấy yêu cầu nào")}
      </Text>
      <Text style={styles.emptyText}>
        {showMyRequests
          ? t("Tạo một yêu cầu mới để tìm gia sư phù hợp với nhu cầu học tập của bạn")
          : t("Quay lại sau để xem các yêu cầu học tập mới")}
      </Text>
      {showMyRequests && (
        <TouchableOpacity style={styles.createButton} onPress={handleCreateRequest}>
          <Text style={styles.createButtonText}>{t("Tạo yêu cầu")}</Text>
        </TouchableOpacity>
      )}
    </View>
  ), [showMyRequests]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} />
      <Header title={t("Bài đăng")} showNotification onNotificationPress={handleNotificationPress} />

      <View style={styles.header}>
        <View style={styles.tabButtons}>
          <TouchableOpacity
            style={[styles.tabButton, !showMyRequests && styles.activeTabButton]}
            onPress={() => setShowMyRequests(false)}
          >
            <Text style={[styles.tabButtonText, !showMyRequests && styles.activeTabButtonText]}>
              {t("Tất cả yêu cầu")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, showMyRequests && styles.activeTabButton]}
            onPress={() => setShowMyRequests(true)}
          >
            <Text style={[styles.tabButtonText, showMyRequests && styles.activeTabButtonText]}>
              {t("Yêu cầu của tôi")}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleCreateRequest}>
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      {loading && data.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>{t("Đang tải...")}</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryButtonText}>{t("Thử lại")}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
        
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.requestId}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={listFooter}
      />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabButtons: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: 8,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTabButton: {
    backgroundColor: Colors.primary,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  activeTabButtonText: {
    color: "white",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  separator: {
    height: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textLight,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: "center",
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonText: {
    color: "white",
    fontWeight: "500",
  },
  paginationEndText: {
    textAlign: 'center',
    padding: 10,
    color: Colors.textLight,
  },
});
