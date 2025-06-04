import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  FlatList,
} from "react-native";
import colors from "@/constants/Colors";
import {
  BORDER_RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  SHADOWS,
  SPACING,
} from "@/constants/Theme";
import { useLocalSearchParams, useRouter, Link } from "expo-router";
import { useStudentRequestStore } from "@/store/post-store";
import { useAuthStore } from "@/store/auth-store";
import { useTutorApplicationStore } from "@/store/tutorApplicationStore";
import Colors from "@/constants/Colors";
import { formatDate } from "@/utils/date-utils";
import {
  MapPin,
  Users,
  Clock,
  DollarSign,
  Flag,
  MessageSquare,
  Share2,
  Send,
} from "lucide-react-native";
import { useRoleStore } from "@/store/roleStore";
import { useStatusStore } from "@/store/status-store";
import { triggerHaptic } from "@/utils/haptics";
import StatusBar from "@/components/ui/StatusBar";
import Header from "@/components/ui/Header";
import { useUserProfileStore } from "@/store/profile-store";
import { User, Status } from "@/types";
import Button from "@/components/ui/Button";
import TutorApplication from "@/components/tutors/TutorApplication";
import { useChat } from "@/hooks/useChat";
import { useTranslation } from "react-i18next";
export default function StudentRequestDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    statusesStudentRequest,
    fetchStatuses,
    StatusesTutorApplication,
    fetchStatusTutorApplication,
  } = useStatusStore();
  const {
    fetchStudentRequestById,
    loading,
    error,
    deleteStudentRequest,
    selectedRequest,
  } = useStudentRequestStore();
  const {
    createApplication,
    fetchApplicationsByRequest,
    updateApplication,
    applications,
    isLoading: isLoadingApplications,
  } = useTutorApplicationStore();
  const { fetchRoles, roles } = useRoleStore();
  const [showApplications, setShowApplications] = useState(false);
  const { startChat } = useChat(user!);
    const { t } = useTranslation();
  const [status, setStatus] = useState<Status | null>(null);
  const { fetchUserById } = useUserProfileStore();
  const [author, setAuthor] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const init = async () => {
      if (id) {
        await Promise.all([
          fetchRoles(),
          fetchApplicationsByRequest(id),
          fetchStudentRequestById(id),
          fetchStatuses(),
          fetchStatusTutorApplication(),
        ]);
      }
    };
    init();
  }, [id]);

  const statusPending = useMemo(
    () => StatusesTutorApplication.find((s) => s.code === "Pending"),
    [StatusesTutorApplication]
  );
  const statusAccepted = useMemo(
    () => StatusesTutorApplication.find((s) => s.code === "Accepted"),
    [StatusesTutorApplication]
  );
  const statusRejected = useMemo(
    () => StatusesTutorApplication.find((s) => s.code === "Rejected"),
    [StatusesTutorApplication]
  );
  const statusWithdrawn = useMemo(
    () => StatusesTutorApplication.find((s) => s.code === "Withdrawn"),
    [StatusesTutorApplication]
  );
  const statusCancelled = useMemo(
    () => StatusesTutorApplication.find((s) => s.code === "Cancelled"),
    [StatusesTutorApplication]
  );
  const statusCompleted = useMemo(
    () => StatusesTutorApplication.find((s) => s.code === "Completed"),
    [StatusesTutorApplication]
  );

  // Lấy thông tin người dùng từ của yêu cầu hiện tại
  useEffect(() => {
    const fetchAuthor = async () => {
      if (selectedRequest?.studentId) {
        const user = await fetchUserById(selectedRequest.studentId);
        if (user) {
          setAuthor(user);
        }
      }
    };
    fetchAuthor();
  }, [selectedRequest?.studentId]);

  // lấy status hiện tại của yêu cầu
  useEffect(() => {
    if (selectedRequest && statusesStudentRequest.length > 0) {
      const currentStatus = statusesStudentRequest.find(
        (s) => s.statusId === selectedRequest.status
      );
      setStatus(currentStatus || null);
    }
  }, [selectedRequest, statusesStudentRequest]);

  const isMyPost = user?.userId === selectedRequest?.studentId;
  const tutorRole = roles.find(
    (role) => role.roleName.toLowerCase() === "tutor"
  );
  const isTutor = user?.roleId === tutorRole?.roleId;

  // Lấy application của gia sư hiện tại (nếu không phải người đăng tin)
  const myApplication = !isMyPost
    ? applications?.find((app) => app.tutorId === user?.userId)
    : null;
  const TutorApplicationStatus = useMemo(() => {
    return myApplication
      ? StatusesTutorApplication.find(
          (s) => s.statusId === myApplication.status
        )
      : null;
  }, [myApplication, StatusesTutorApplication]);
  const hasApplied =
    applications?.some((app) => app.tutorId === user?.userId) ?? false;

  useEffect(() => {
    const currentUserRole = roles.find((role) => role.roleId === user?.roleId);
    if (isMyPost && currentUserRole?.roleName === "Student") {
      fetchApplicationsByRequest(id);
    }
  }, [isMyPost, user, roles, id]);
  const handleApply = () => {
    triggerHaptic("medium");
    Alert.alert(t("Ứng tuyển"), t("Bạn muốn ứng tuyển vào vị trí gia sư này?"), [
      {
        text: t("Hủy"),
        style: "cancel",
      },
      {
        text: t("Ứng tuyển"),
        onPress: async () => {
          try {
            if (user) {
              const applicationData = {
                requestId: postId,
                tutorId: user?.userId,
              };
              await createApplication(applicationData);
            } else {
              console.error("Tutor not found");
            }
          } catch (error) {
            console.error("Error applying for the request:", error);
          }

          Alert.alert(
            t("Thành công"),
            t("Đã gửi đơn ứng tuyển thành công. Người đăng sẽ liên hệ với bạn sớm.")
          );
          await fetchApplicationsByRequest(postId);
        },
      },
    ]);
  };
  const handleDelete = () => {
    Alert.alert(
      t("Xác nhận xóa"),
      t("Bạn có chắc chắn muốn xóa yêu cầu này? Hành động này không thể hoàn tác."),
      [
        { text: t("Hủy"), style: "cancel" },
        {
          text: t("Xóa"),
          style: "destructive",
          onPress: async () => {
            if (id) {
              const success = await deleteStudentRequest(id);
              if (success) {
                Alert.alert(t("Thành công"), t("Yêu cầu đã được xóa thành công"), [
                  { text: "OK", onPress: () => router.back() },
                ]);
              }
            }
          },
        },
      ]
    );
  };
  const handleCancelApplication = () => {
    triggerHaptic("medium");
    Alert.alert(
      t("Hủy ứng tuyển"),
      t("Bạn có chắc muốn hủy ứng tuyển vào bài đăng này?"),
      [
        {
          text: t("Hủy"),
          style: "cancel",
        },
        {
          text: t("Xác nhận"),
          onPress: async () => {
            try {
              const myApp = applications.find(
                (app) => app.tutorId === user?.userId
              );
              const applicationId = myApp?.applicationId;
              if (user && applicationId) {
                const applicationData = {
                  requestId: postId,
                  tutorId: user?.userId,
                  status: statusWithdrawn?.statusId || "",
                };
                await updateApplication(applicationId, applicationData);
              } else {
                console.error("Tutor not found");
              }
            } catch (error) {
              console.error("Error applying for the request:", error);
            }

            Alert.alert(t("Thành công"), t("Đã hủy ứng tuyển thành công."));
          },
        },
      ]
    );
  };
  const handleClosePost = async () => {
    triggerHaptic("medium");
    Alert.alert(t("Đóng bài đăng"), t("Bạn có chắc muốn đóng bài đăng này?"), [
      {
        text: t("Hủy"),
        style: "cancel",
      },
      {
        text: t("Đóng"),
        onPress: async () => {
          setIsLoading(true);
          try {
            await fetchStudentRequestById(postId);
            fetchStudentRequestById;
            Alert.alert(t("Thành công"), t("Đã đóng bài đăng thành công."));
          } catch (error) {
            Alert.alert(
              t("Lỗi"),
              t("Không thể đóng bài đăng. Vui lòng thử lại sau.")
            );
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };
  const handleCreateClass = (postId: string) => {
    triggerHaptic("medium");
    router.push(`/class/create/${postId}` as any);
  };
  const handleMessage = async () => {
    triggerHaptic("light");
    // Find existing conversation or create new one
    const existingConversation = await startChat(
      selectedRequest?.studentId || ""
    );
    if (existingConversation) {
      router.push(`/conversation/${existingConversation.conversationId}`);
    } else {
      Alert.alert(
        t("Thông báo"),
        t("Không thể tạo cuộc trò chuyện mới. Vui lòng thử lại.")
      );
    }
  };

  const handleReport = () => {
    triggerHaptic("light");
    Alert.alert(t("Báo cáo"), t("Bạn muốn báo cáo bài đăng này vì lý do gì?"), [
      {
        text: t("Hủy"),
        style: "cancel",
      },
      {
        text: t("Nội dung không phù hợp"),
        onPress: () => {
          Alert.alert(t("Thành công"), t("Đã gửi báo cáo thành công."));
        },
      },
      {
        text: t("Lừa đảo"),
        onPress: () => {
          Alert.alert(t("Thành công"), t("Đã gửi báo cáo thành công."));
        },
      },
      {
        text: t("Spam"),
        onPress: () => {
          Alert.alert(t("Thành công"), t("Đã gửi báo cáo thành công."));
        },
      },
    ]);
  };

  const handleShare = () => {
    triggerHaptic("light");
    Alert.alert(
      t("Chia sẻ"),
      t("Tính năng chia sẻ sẽ được cập nhật trong phiên bản tiếp theo.")
    );
  };
  const handleViewProfile = (userId: string) => {
    triggerHaptic("light");
    router.push(`/profile/profileTutor/${userId}`);
  };
  const handleViewStudentProfile = (userId: string) => {
    triggerHaptic("light");
    router.push(`/profile/profileStudent/${userId}`);
  };
  const displayedApplications = useMemo(() => {
    return showApplications ? applications : applications.slice(0, 3);
  }, [applications, showApplications]);
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>{t("Đang tải...")}</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Lỗi: {error || t("Không tìm thấy yêu cầu")}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchStudentRequestById(id)}
        >
          <Text style={styles.retryButtonText}>{t("Thử lại")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <Header title={t("Chi tiết bài đăng")} showBack />

      <FlatList
        data={showApplications ? displayedApplications : []}
        keyExtractor={(item) => item.applicationId}
        renderItem={({ item }) => (
          <TutorApplication
            key={item.applicationId}
            requestId={postId}
            StatusAccepted={statusAccepted?.statusId || ""}
            StatusRejected={statusRejected?.statusId || ""}
            item={item}
            statusStudentRequest={statusesStudentRequest}
            onPress={() => handleViewProfile(item.tutorId)}
          />
        )}
        ListHeaderComponent={
          <>
            {/* --- Info Section --- */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.userInfo}
                onPress={() =>
                  handleViewStudentProfile(selectedRequest?.studentId || "")
                }
              >
                <Image
                  source={
                    author?.avatarUrl
                      ? { uri: author.avatarUrl }
                      : require("@/assets/images/user_default.jpg")
                  }
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.userName}>{author?.fullName}</Text>
                  <Text style={styles.postDate}>
                    {selectedRequest?.createdAt
                      ? formatDate(selectedRequest.createdAt)
                      : "N/A"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>{selectedRequest?.title}</Text>

            {/* --- Info Card --- */}
            <View style={styles.infoCard}>
              {/* Địa điểm */}
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <MapPin size={18} color={colors.textSecondary} />
                  <Text style={styles.infoLabel}>{t("Địa điểm:")}</Text>
                  <Text style={styles.infoValue}>
                    {selectedRequest?.location}
                  </Text>
                </View>
              </View>

              {/* Số học sinh */}
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Users size={18} color={colors.textSecondary} />
                  <Text style={styles.infoLabel}>{t("Số học sinh:")}</Text>
                  <Text style={styles.infoValue}>
                    {selectedRequest?.studentCount}
                  </Text>
                </View>
              </View>

              {/* Lịch học */}
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Clock size={18} color={colors.textSecondary} />
                  <Text style={styles.infoLabel}>{t("Lịch học:")}</Text>
                  <Text style={styles.infoValue}>
                    {selectedRequest?.preferredSchedule}
                  </Text>
                </View>
              </View>

              {/* Học phí */}
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <DollarSign size={18} color={colors.textSecondary} />
                  <Text style={styles.infoLabel}>{t("Học phí:")}</Text>
                  <Text style={styles.infoValue}>
                    {selectedRequest?.tuitionFee} {t("đ/giờ")}
                  </Text>
                </View>
              </View>
            </View>

            {/* --- Mô tả --- */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("Mô tả")}</Text>
              <Text style={styles.description}>
                {selectedRequest?.description}
              </Text>
            </View>

            {/* --- Hành động --- */}
            <View style={styles.actionsContainer}>
              {!isMyPost &&
                ((isTutor && status?.code === "Pending") || hasApplied) && (
                  <>
                    {!hasApplied ? (
                      <Button
                        title={t("Ứng tuyển")}
                        onPress={handleApply}
                        fullWidth
                        style={styles.applyButton}
                      />
                    ) : (
                      <>
                        {TutorApplicationStatus?.code === "Pending" && (
                          <>
                            <View style={styles.alreadyAppliedContainer}>
                              <Text style={styles.alreadyAppliedText}>
                                {t("Bạn đã ứng tuyển vào yêu cầu này (chờ xét duyệt)")}
                              </Text>
                            </View>
                            <Button
                              title={t("Huỷ ứng tuyển")}
                              onPress={handleDelete}
                              fullWidth
                              style={styles.applyButton}
                            />
                          </>
                        )}
                        {TutorApplicationStatus?.code === "Accepted" && (
                          <>
                            <View style={styles.alreadyAppliedContainer}>
                              <Text style={styles.alreadyAppliedText}>
                                {t("Bạn đã được chấp nhận vào yêu cầu này")}
                              </Text>
                            </View>
                            <Button
                              title={t("Tạo lớp học")}
                              onPress={() => handleCreateClass(postId)}
                              fullWidth
                              style={styles.applyButton}
                            />
                          </>
                        )}
                        {TutorApplicationStatus?.code === "Rejected" && (
                          <View style={styles.normalAplliedContainer}>
                            <Text style={styles.rejectedText}>
                              {t("Hồ sơ của bạn đã bị từ chối")}
                            </Text>
                          </View>
                        )}
                        {TutorApplicationStatus?.code === "Withdrawn" && (
                          <View style={styles.normalAplliedContainer}>
                            <Text style={styles.rejectedText}>
                              {t("Bạn đã rút đơn ứng tuyển")}
                            </Text>
                          </View>
                        )}
                        {TutorApplicationStatus?.code === "Cancelled" && (
                          <Text style={styles.rejectedText}>
                            {t("Ứng tuyển đã bị huỷ do hệ thống hoặc học viên")}
                          </Text>
                        )}
                        {myApplication?.status === "Completed" && (
                          <Text style={styles.rejectedText}>
                            {t("Yêu cầu đã hoàn tất")}
                          </Text>
                        )}
                      </>
                    )}
                  </>
                )}
              
              {isMyPost && (
                <Button
                  title={t("Đóng bài đăng")}
                  onPress={handleClosePost}
                  variant="outline"
                  loading={isLoading}
                  fullWidth
                  style={styles.closeButton}
                />
              )}
            </View>

            {/* --- Toggle danh sách --- */}
            {isMyPost && applications.length > 0 && (
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setShowApplications(!showApplications)}
              >
                <Text style={styles.toggleButtonText}>
                  {showApplications
                    ? t("Ẩn danh sách ứng tuyển")
                    : t(`Hiện thị danh sách ứng tuyển (${applications.length})`)}
                </Text>
              </TouchableOpacity>
            )}
          </>
        }
        ListEmptyComponent={
          showApplications ? (
            <Text style={{ paddingHorizontal: 16 }}>
              {t("Không có ứng viên nào.")}
            </Text>
          ) : null
        }
        ListFooterComponent={
          <View style={styles.actionsContainer}>
            <View style={styles.secondaryActions}>
              {!isMyPost && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleMessage}
                >
                  <MessageSquare size={20} color={colors.primary} />
                  <Text style={styles.actionText}>{t("Nhắn tin")}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
              >
                <Share2 size={20} color={colors.primary} />
                <Text style={styles.actionText}>{t("Chia sẻ")}</Text>
              </TouchableOpacity>

              {!isMyPost && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleReport}
                >
                  <Flag size={20} color={colors.danger} />
                  <Text style={[styles.actionText, { color: colors.danger }]}>
                    {t("Báo cáo")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  alreadyAppliedContainer: {
    backgroundColor: "#e0f7fa",
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  normalAplliedContainer: {
    backgroundColor: colors.card,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  alreadyAppliedText: {
    fontSize: FONT_SIZE.md,
    color: "#00796b",
    textAlign: "center",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#d9534f",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  applicationsContainer: {
    marginTop: 8,
  },
  toggleButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  toggleButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  applicationsList: {
    marginTop: 12,
  },
  applicationItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  applicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  applicationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  applicationStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  applicationStatusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  applicationDate: {
    fontSize: 14,
    color: "#666",
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SPACING.md,
  },
  userName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: colors.text,
  },
  postDate: {
    fontSize: FONT_SIZE.xs,
    color: colors.textSecondary,
    marginTop: SPACING.xs / 2,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: colors.text,
    marginBottom: SPACING.md,
  },
  subjectContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  subjectText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: colors.primary,
    marginLeft: SPACING.xs,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: SPACING.sm,
  },
  infoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    marginLeft: SPACING.xs,
    marginRight: SPACING.xs,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: colors.text,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: colors.text,
    lineHeight: 22,
  },
  actionsContainer: {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    ...SHADOWS.small,
  },
  applyButton: {
    marginBottom: SPACING.md,
  },
  closeButton: {
    marginBottom: SPACING.md,
  },
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    alignItems: "center",
    padding: SPACING.sm,
  },
  rejectedText: {
    color: "#D32F2F",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
    textAlign: "center",
  },
  actionText: {
    fontSize: FONT_SIZE.sm,
    color: colors.primary,
    marginTop: SPACING.xs,
  },
});
