import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Alert 
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { 
  MapPin, 
  Users, 
  Clock, 
  DollarSign, 
  BookOpen, 
  MessageSquare, 
  Share2, 
  Flag 
} from "lucide-react-native";

import colors from "@/constants/Colors";
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from "@/constants/Theme";
import StatusBar from "@/components/ui/StatusBar";
import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";
import { usePostStore } from "@/store/post-store";
import { useAuthStore } from "@/store/auth-store";
import { useChatStore } from "@/store/chat-store";
import { formatDate } from "@/utils/date-utils";
import { triggerHaptic } from "@/utils/haptics";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const postId = Array.isArray(id) ? id[0] : id;
  
  const router = useRouter();
  const { getPostById, closePost } = usePostStore();
  const { user } = useAuthStore();
  const { conversations, setActiveConversation } = useChatStore();
  
  const [post, setPost] = useState(getPostById(postId));
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!post) {
      router.back();
    }
  }, [post]);
  
  if (!post) {
    return null;
  }
  
  const isMyPost = user?.id === post.userId;
  
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
          onPress: () => {
            Alert.alert(
              "Thành công",
              "Đã gửi đơn ứng tuyển thành công. Người đăng sẽ liên hệ với bạn sớm."
            );
          }
        }
      ]
    );
  };
  
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
              await closePost(postId);
              setPost(getPostById(postId));
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
  
  const handleMessage = () => {
    triggerHaptic('light');
    // Find existing conversation or create new one
    const existingConversation = conversations.find(conv => 
      conv.participants.includes(user?.id || '') && 
      conv.participants.includes(post.userId)
    );
    
    if (existingConversation) {
      setActiveConversation(existingConversation.id);
      router.push(`/conversation/${existingConversation.id}`);
    } else {
      // In a real app, you would create a new conversation here
      Alert.alert(
        "Thông báo",
        "Tính năng nhắn tin sẽ được cập nhật trong phiên bản tiếp theo."
      );
    }
  };
  
  const handleShare = () => {
    triggerHaptic('light');
    Alert.alert(
      "Chia sẻ",
      "Tính năng chia sẻ sẽ được cập nhật trong phiên bản tiếp theo."
    );
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
  
  const handleViewProfile = () => {
    triggerHaptic('light');
    router.push(`/tutor/${post.userId}` as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <Header title="Chi tiết bài đăng" showBack />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <TouchableOpacity onPress={handleViewProfile}>
              <Image 
                source={{ uri: post.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }} 
                style={styles.avatar} 
              />
            </TouchableOpacity>
            <View>
              <TouchableOpacity onPress={handleViewProfile}>
                <Text style={styles.userName}>{post.userName}</Text>
              </TouchableOpacity>
              <Text style={styles.postDate}>Đăng ngày {formatDate(post.createdAt)}</Text>
            </View>
          </View>
          
          <View style={[
            styles.statusBadge, 
            { 
              backgroundColor: post.status === 'active' 
                ? colors.primaryLight 
                : post.status === 'closed' 
                  ? colors.danger + '20' 
                  : colors.warning + '20'
            }
          ]}>
            <Text style={[
              styles.statusText,
              { 
                color: post.status === 'active' 
                  ? colors.white 
                  : post.status === 'closed' 
                    ? colors.danger 
                    : colors.warning
              }
            ]}>
              {post.status === 'active' ? 'Đang tìm' : post.status === 'closed' ? 'Đã đóng' : 'Đang xét duyệt'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.title}>{post.title}</Text>
        
        <View style={styles.subjectContainer}>
          <BookOpen size={18} color={colors.primary} />
          <Text style={styles.subjectText}>{post.subject}</Text>
        </View>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MapPin size={18} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>Địa điểm:</Text>
              <Text style={styles.infoValue}>{post.location}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Users size={18} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>Số học sinh:</Text>
              <Text style={styles.infoValue}>{post.studentCount}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Clock size={18} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>Lịch học:</Text>
              <Text style={styles.infoValue}>{post.schedule}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <DollarSign size={18} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>Học phí:</Text>
              <Text style={styles.infoValue}>{post.tuitionFee.toLocaleString('vi-VN')}đ/giờ</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.description}>{post.description}</Text>
        </View>
        
        {post.requirements && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yêu cầu</Text>
            <Text style={styles.description}>{post.requirements}</Text>
          </View>
        )}
        
        <View style={styles.actionsContainer}>
          {!isMyPost && post.status === 'active' && (
            <Button
              title="Ứng tuyển"
              onPress={handleApply}
              fullWidth
              style={styles.applyButton}
            />
          )}
          
          {isMyPost && post.status === 'active' && (
            <Button
              title="Đóng bài đăng"
              onPress={handleClosePost}
              variant="outline"
              loading={isLoading}
              fullWidth
              style={styles.closeButton}
            />
          )}
          
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