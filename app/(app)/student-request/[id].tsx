import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert ,Image } from 'react-native';
import colors from "@/constants/Colors";
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from "@/constants/Theme";
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { useStudentRequestStore } from '@/store/post-store';
import { useAuthStore } from '@/store/auth-store';
import { useTutorApplicationStore } from '@/store/tutorApplicationStore';
import Colors from '@/constants/Colors';
import { formatDate } from '@/utils/date-utils';
import {  MapPin, Users, Clock, DollarSign, Flag, MessageSquare, Share2, Send } from 'lucide-react-native';
import { useRoleStore } from '@/store/roleStore';
import { useStatusStore } from '@/store/status-store';
import PostStatus from '@/components/posts/PostStatus';
import { triggerHaptic } from '@/utils/haptics';
import { useChatStore } from '@/store/chat-store';
import StatusBar from '@/components/ui/StatusBar';
import Header from '@/components/ui/Header';
import { useUserProfileStore } from '@/store/profile-store';
import { User,Status } from '@/types';
import Button from '@/components/ui/Button';
import TutorApplication from '@/components/tutors/TutorApplication';
export default function StudentRequestDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { user } = useAuthStore();
  const { statusesStudentRequest,fetchStatuses ,StatusesTutorApplication,fetchStatusTutorApplication} = useStatusStore();
  const { createApplication } = useTutorApplicationStore();
  const { 
    fetchStudentRequestById, 
    loading, 
    error, 
    deleteStudentRequest,
    selectedRequest,
    
  } = useStudentRequestStore();
  const { 
    fetchApplicationsByRequest, 
    applications, 
    isLoading: isLoadingApplications 
  } = useTutorApplicationStore();
  const { fetchRoles,roles } = useRoleStore();
  const [showApplications, setShowApplications] = useState(false);
const { conversations, setActiveConversation } = useChatStore();
const [status, setStatus] = useState<Status| null>(null);
 const { fetchUserById } = useUserProfileStore();
   const [author, setAuthor] = React.useState<User | null>(null);
   const [isLoading, setIsLoading] = useState(false);
  useEffect( () => {
     const init = async () => {
    if (id) {
      fetchRoles();
      fetchApplicationsByRequest(id);
      fetchStudentRequestById(id);
      fetchStatuses();
      fetchStatusTutorApplication();
    }
    }
    init();
  }, [id]);
  useEffect(() => {
  if (selectedRequest?.studentId) {
    fetchUserById(selectedRequest.studentId).then(user => setAuthor(useUserProfileStore.getState().user));
  }
}, [selectedRequest?.studentId]);
  useEffect(() => {
  if (selectedRequest && statusesStudentRequest.length > 0) {
    const currentStatus = statusesStudentRequest.find(
      s => s.statusId === selectedRequest.status
    );
    setStatus(currentStatus || null);
  }
}, [selectedRequest, statusesStudentRequest]);
 const isMyPost = user?.userId === selectedRequest?.studentId;
   const isApplied =  StatusesTutorApplication.find(s => s.code === 'Accepted');
 const hasAcceptedApplication = applications?.some(
  (app) => app.tutorId === user?.userId && app.status === isApplied?.statusId
);
  useEffect(() => {
    const currentUserRole = roles.find(role => role.roleId === user?.roleId);
    if (isMyPost && currentUserRole?.roleName === 'Student') {
      fetchApplicationsByRequest(id);
    }
  }, [isMyPost, user, roles, id]);
  const handleApply = () => {
    triggerHaptic('medium');
    Alert.alert(
      "Ứng tuyển",
      "Bạn muốn ứng tuyển vào vị trí gia sư này?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Ứng tuyển",
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
            }
            catch (error) {
              console.error("Error applying for the request:", error);
            }

            Alert.alert(
              "Thành công",
              "Đã gửi đơn ứng tuyển thành công. Người đăng sẽ liên hệ với bạn sớm."
            );
          }
        }
      ]
    );
  };
  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa yêu cầu này? Hành động này không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            if (id) {
              const success = await deleteStudentRequest(id);
              if (success) {
                Alert.alert('Thành công', 'Yêu cầu đã được xóa thành công', [
                  { text: 'OK', onPress: () => router.back() }
                ]);
              }
            }
          }
        }
      ]
    );
  };
  const handleCancelApplication = () => {
    triggerHaptic('medium');
    Alert.alert(
      "Hủy ứng tuyển",
      "Bạn có chắc muốn hủy ứng tuyển vào bài đăng này?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Hủy",
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
            }
            catch (error) {
              console.error("Error applying for the request:", error);
            }

            Alert.alert(
              "Thành công",
              "Đã hủy ứng tuyển thành công."
            );
          }
        }
      ]
    );
    }
const handleClosePost = async () => {
    triggerHaptic('medium');
    Alert.alert(
      "Đóng bài đăng",
      "Bạn có chắc muốn đóng bài đăng này?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Đóng",
          onPress: async () => {
            setIsLoading(true);
            try {
              await fetchStudentRequestById(postId);
              fetchStudentRequestById
              Alert.alert("Thành công", "Đã đóng bài đăng thành công.");
            } catch (error) {
              Alert.alert("Lỗi", "Không thể đóng bài đăng. Vui lòng thử lại sau.");
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };
  const handleCreateClass =( postId:string) => {
    triggerHaptic('medium');
    router.push(`/class/create/${postId}` as any);
  };
 const handleMessage = () => {
    triggerHaptic('light');
    // Find existing conversation or create new one
    const existingConversation = conversations.find(conv => 
      conv.participants.includes(user?.userId || '') && 
      conv.participants.includes(selectedRequest?.studentId || '')
    );
    
    if (existingConversation) {
      setActiveConversation(existingConversation.id);
      router.push(`/conversation/${existingConversation.id}`);
    } else {
      Alert.alert(
        "Thông báo",
        "Tính năng nhắn tin sẽ được cập nhật trong phiên bản tiếp theo."
      );
    }
  };

  const handleReport = () => {
    triggerHaptic('light');
    Alert.alert(
      "Báo cáo",
      "Bạn muốn báo cáo bài đăng này vì lý do gì?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Nội dung không phù hợp",
          onPress: () => {
            Alert.alert("Thành công", "Đã gửi báo cáo thành công.");
          }
        },
        {
          text: "Lừa đảo",
          onPress: () => {
            Alert.alert("Thành công", "Đã gửi báo cáo thành công.");
          }
        },
        {
          text: "Spam",
          onPress: () => {
            Alert.alert("Thành công", "Đã gửi báo cáo thành công.");
          }
        }
      ]
    );
  };
  
  const handleShare = () => {
    triggerHaptic('light');
    Alert.alert(
      "Chia sẻ",
      "Tính năng chia sẻ sẽ được cập nhật trong phiên bản tiếp theo."
    );
  };
  const handleViewProfile = (userId:string) => {
    triggerHaptic('light');
    router.push(`/tutor/${userId}`);
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Đang tải....</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Lỗi: {error || 'Không tìm thấy yêu cầu'}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => fetchStudentRequestById(id)}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isOwner = user?.userId === selectedRequest?.studentId;
  const tutorRole = roles.find(role => role.roleName.toLowerCase() === 'tutor');
  const isTutor = user?.roleId === tutorRole?.roleId;
  const hasApplied = applications?.some(app => app.tutorId === user?.userId);

  return (
     <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <Header title="Chi tiết bài đăng" showBack />
    
      
    <ScrollView  style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
            <TouchableOpacity >
              <Image 
                source={{ uri: author?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }} 
                style={styles.avatar} 
              />
            </TouchableOpacity>
            <View>
              <TouchableOpacity >
                <Text style={styles.userName}>{author?.fullName}</Text>
              </TouchableOpacity>
              <Text style={styles.postDate}>{selectedRequest?.createdAt ? formatDate(selectedRequest.createdAt) : 'N/A'}</Text>

            </View>
        </View>

        <PostStatus statusId={selectedRequest?.status || ''} />
        </View> 
        <Text style={styles.title}>{selectedRequest?.title}</Text>    
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MapPin size={18} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>Địa điểm:</Text>
              <Text style={styles.infoValue}>{selectedRequest?.location}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Users size={18} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>Số học sinh:</Text>
              <Text style={styles.infoValue}>{selectedRequest?.studentCount}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Clock size={18} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>Lịch học:</Text>
              <Text style={styles.infoValue}>{selectedRequest?.preferredSchedule}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <DollarSign size={18} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>Học phí:</Text>
              <Text style={styles.infoValue}>{selectedRequest?.tuitionFee}đ/giờ</Text>
            </View>
          </View>
        </View>
       <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.description}>{selectedRequest?.description}</Text>
        </View>
       <View style={styles.actionsContainer}>
        {isTutor && !isMyPost && status?.code === 'Pending' && !hasApplied && (
          <Button
              title="Ứng tuyển"
              onPress={handleApply}
              fullWidth
              style={styles.applyButton}
            />
        )}
         {isMyPost && status?.code === 'Pending' && (
            <Button
              title="Đóng bài đăng"
              onPress={handleClosePost}
              variant="outline"
              loading={isLoading}
              fullWidth
              style={styles.closeButton}
            />
          )}
        {isTutor && hasApplied && (
        <>
          <View style={styles.alreadyAppliedContainer}>
            <Text style={styles.alreadyAppliedText}>
              Bạn đã ứng tuyển vào yêu cầu này
            </Text>
          </View>

          <Button
            title="Huỷ ứng tuyển"
            onPress={handleCancelApplication}
            fullWidth
            style={styles.applyButton}
          />

          {hasAcceptedApplication && (
            <Button
              title="Tạo lớp học"
              onPress={() => handleCreateClass(postId)} // Hàm xử lý tạo lớp học bạn định nghĩa ở chỗ khác
              fullWidth
              style={styles.applyButton} // Bạn nên định nghĩa thêm style này
            />
          )}
        </>
      )}
      </View>

        {isOwner && applications && applications.length > 0 && (
          <View style={styles.applicationsContainer}>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => setShowApplications(!showApplications)}
            >
              <Text style={styles.toggleButtonText}>
                {showApplications ? 'Ẩn danh sách ứng tuyển' : `Hiện thị danh sách ứng tuyển (${applications.length})`}
              </Text>
            </TouchableOpacity>
            
            {showApplications && (
              <View style={styles.applicationsList}>
                {isLoadingApplications ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  applications.map((application) => (
                    <TutorApplication
                      key={application.applicationId}
                      userId={application.tutorId}
                      status={ application.status}
                      date={application.applicationDate}
                      onPress={() => handleViewProfile(application.tutorId)}
                      />
                  ))
                )}
              </View>
            )}
          </View>
          )}
        <View style={styles.actionsContainer}>
          <View style={styles.secondaryActions}>
            {!isMyPost && (
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleMessage}
              >
                <MessageSquare size={20} color={colors.primary} />
                <Text style={styles.actionText}>Nhắn tin</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleShare}
            >
              <Share2 size={20} color={colors.primary} />
              <Text style={styles.actionText}>Chia sẻ</Text>
            </TouchableOpacity>
            
            {!isMyPost && (
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleReport}
              >
                <Flag size={20} color={colors.danger} />
                <Text style={[styles.actionText, { color: colors.danger }]}>Báo cáo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
    </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  alreadyAppliedContainer: {
    backgroundColor: "#e0f7fa",
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  alreadyAppliedText: {
    fontSize: FONT_SIZE.md,
    color: "#00796b",
    textAlign: 'center',
  },

 
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d9534f',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  applicationsContainer: {
    marginTop: 8,
  },
  toggleButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  applicationsList: {
    marginTop: 12,
  },
  applicationItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  applicationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  applicationStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  applicationStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  applicationDate: {
    fontSize: 14,
    color: '#666',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SPACING.md,
  },
  userName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
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
    fontWeight: '600',
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: SPACING.md,
  },
  subjectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  subjectText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
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
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    marginLeft: SPACING.xs,
    marginRight: SPACING.xs,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
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
    fontWeight: '700',
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
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: SPACING.sm,
  },
  actionText: {
    fontSize: FONT_SIZE.sm,
    color: colors.primary,
    marginTop: SPACING.xs,
  },
});