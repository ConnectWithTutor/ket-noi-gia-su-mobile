import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { useRouter } from "expo-router";
import { useStudentRequestStore } from "@/store/post-store";
import { useAuthStore } from "@/store/auth-store";
import Colors from "@/constants/Colors";
import { Plus, Book, MapPin, Clock, DollarSign, Users } from "lucide-react-native";
import { StudentRequest } from "@/types";
import StatusBar from "@/components/ui/StatusBar";
import Header from "@/components/ui/Header";
import { triggerHaptic } from "@/utils/haptics";
import PostCard from "@/components/posts/PostCard";

export default function RequestsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    requests, 
    myRequests,
    loading, 
    error, 
    fetchStudentRequests,
    fetchMyStudentRequests,
    pagination,
    nextPage,
    prevPage
  } = useStudentRequestStore();
  
  const [showMyRequests, setShowMyRequests] = useState(false);
  
  useEffect(() => {
    fetchStudentRequests();
    if (user) {
      fetchMyStudentRequests(user.userId);
    }
  }, [user]);

  const handleCreateRequest = () => {
    router.push("/student-request/create");
  };

  // const handleRequestPress = (request: StudentRequest) => {
  //   router.push(`/student-request/${request.requestId}`);
  // };

  const toggleView = () => {
    setShowMyRequests(!showMyRequests);
  };
const handlePostPress = (requestId: string) => {
    triggerHaptic('light');
    router.push(`/student-request/${requestId}`);
  };
 
 const handleNotificationPress = () => {
    triggerHaptic('light');
    router.push('/notification-list' as any);
  };
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>
      {showMyRequests ? "Bạn chưa tạo yêu cầu nào" : "Không tìm thấy yêu cầu nào"}
      </Text>
      <Text style={styles.emptyText}>
      {showMyRequests 
        ? "Tạo một yêu cầu mới để tìm gia sư phù hợp với nhu cầu học tập của bạn" 
        : "Quay lại sau để xem các yêu cầu học tập mới"}
      </Text>
      {showMyRequests && (
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateRequest}
        >
          <Text style={styles.createButtonText}>Create Request</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} />
       <Header title="Bài đăng" showNotification onNotificationPress={handleNotificationPress}/>
      <View style={styles.header}>
        <View style={styles.tabButtons}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              !showMyRequests && styles.activeTabButton
            ]}
            onPress={() => setShowMyRequests(false)}
          >
            <Text 
              style={[
                styles.tabButtonText,
                !showMyRequests && styles.activeTabButtonText
              ]}
            >
              Tất cả yêu cầu
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              showMyRequests && styles.activeTabButton
            ]}
            onPress={() => setShowMyRequests(true)}
          >
            <Text 
              style={[
                styles.tabButtonText,
                showMyRequests && styles.activeTabButtonText
              ]}
            >
              Yêu cầu của tôi
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleCreateRequest}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      {loading && (requests.length === 0 && myRequests.length === 0) ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              if (showMyRequests && user?.userId) {
                fetchMyStudentRequests(user.userId);
              } else {
                fetchStudentRequests();
              }
            }}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={showMyRequests ? myRequests : requests}
           renderItem={({ item }) => (
            <PostCard
              post={item}
              onPress={() => handlePostPress(item.requestId)}
            />
          )}
          keyExtractor={(item) => item.requestId}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => showMyRequests && user?.userId ? fetchMyStudentRequests(user.userId) : fetchStudentRequests()}
              colors={[Colors.primary]}
            />
          }
          ListFooterComponent={
            !showMyRequests && requests.length > 0 ? (
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    pagination.page <= 1 && styles.paginationButtonDisabled
                  ]}
                  onPress={prevPage}
                  disabled={pagination.page <= 1 || loading}
                >
                  <Text 
                    style={[
                      styles.paginationButtonText,
                      pagination.page <= 1 && styles.paginationButtonTextDisabled
                    ]}
                  >
                    trước
                  </Text>
                </TouchableOpacity>
                
                <Text style={styles.paginationText}>
                  trang {pagination.page}/{pagination.totalPages || 1}
                </Text>
                
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    pagination.page >= pagination.totalPages && styles.paginationButtonDisabled
                  ]}
                  onPress={nextPage}
                  disabled={pagination.page >= pagination.totalPages || loading}
                >
                  <Text 
                    style={[
                      styles.paginationButtonText,
                      pagination.page >= pagination.totalPages && styles.paginationButtonTextDisabled
                    ]}
                  >
                    tiếp
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
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
  requestCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  requestDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  requestDescription: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 12,
    lineHeight: 20,
  },
  requestDate: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: "right",
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
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 8,
  },
  paginationButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  paginationButtonDisabled: {
    backgroundColor: Colors.background,
  },
  paginationButtonText: {
    color: "white",
    fontWeight: "500",
  },
  paginationButtonTextDisabled: {
    color: Colors.textLight,
  },
  paginationText: {
    fontSize: 14,
    color: Colors.text,
  },
});