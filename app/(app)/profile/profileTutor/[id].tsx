import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Alert, 
  Linking 
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { 
  MapPin, 
  Star, 
  DollarSign, 
  Clock, 
  BookOpen, 
  MessageSquare, 
  Share2, 
  Award, 
  Briefcase,
  User
} from "lucide-react-native";

import colors from "@/constants/Colors";
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from "@/constants/Theme";
import StatusBar from "@/components/ui/StatusBar";
import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";
import { useTutorStore } from "@/store/tutor-store";
import { triggerHaptic } from "@/utils/haptics";
import { useUserProfileStore } from "@/store/profile-store"
import { TutorProfile } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import { useChat } from "@/hooks/useChat";
import { useTranslation } from "react-i18next";
import { useClassStore } from "@/store/class-store";

export default function TutorProfileScreen() {
  const { id } = useLocalSearchParams();
  const userId = id as string;
  const router = useRouter();
  const {  getTutorById } = useTutorStore();
  const {user} = useAuthStore();
  const {startChat,isLoading} = useChat(user!);
  const [tutor, setTutor] = useState<TutorProfile | undefined>();
  const [userTutor, setUserTutor] = useState<any>(null);
  const { fetchUserById } = useUserProfileStore();
  const { getClassEvaluationsByUserId, Evaluations } = useClassStore();
  const { t } = useTranslation();
  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        const tutorData = await getTutorById(userId);
        const user = await fetchUserById(userId);
        if (tutorData && user) {
          setUserTutor(user);
          setTutor(tutorData);
        } else {
          Alert.alert(t("Thông báo"), t("Không tìm thấy gia sư."));
        }
      } catch (error) {
        console.error("Error fetching tutor data:", error);
        Alert.alert(t("Thông báo"), t("Đã xảy ra lỗi khi lấy dữ liệu."));
      }
    };

    fetchTutorData();
    getClassEvaluationsByUserId(userId);
  }, [userId]);
  // Tính ratingVote
  const ratingVote = React.useMemo(() => {
    if (!Evaluations || Evaluations.length === 0) return null;
    const totalScore = Evaluations.reduce(
      (sum, ev) => sum + (ev.criteria1 + ev.criteria2 + ev.criteria3) / 3,
      0
    );
    return (totalScore / Evaluations.length).toFixed(1);
  }, [Evaluations]);
  
  if (!tutor) {
    return null;
  }
  const handleMessage = async () => {
    triggerHaptic('medium');
    if (!user?.userId) {
      Alert.alert(t("Thông báo"), t("Bạn cần đăng nhập để sử dụng tính năng nhắn tin."));
    }
    const existingConversation = await startChat(userId);
    if (existingConversation) {
      router.push(`/conversation/${existingConversation.conversationId}`);
    } else {
      Alert.alert(
        t("Thông báo"),
        t("Không thể tạo cuộc trò chuyện mới. Vui lòng thử lại.")
      );
    }
  };
  const handleShare = () => {
    triggerHaptic('light');
    Alert.alert(
      t("Chia sẻ"),
      t("Tính năng chia sẻ sẽ được cập nhật trong phiên bản tiếp theo.")
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <Header title={t("Thông tin gia sư")} showBack />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: userTutor?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }} 
            style={styles.avatar} 
          />
          
          <Text style={styles.name}>{userTutor?.fullName }</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={18} color="#FFB400" fill="#FFB400" />
            <Text style={styles.rating}>
              {ratingVote ? ratingVote : t("Chưa có đánh giá")}
            </Text>
          </View>
          <View style={styles.sectionHeader}>
            <MapPin size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>{userTutor?.address}</Text>
            </View>
        </View>

       
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>{t("Giới thiệu")}</Text>
          </View>
          <Text style={styles.bioText}>{tutor.description}</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Award size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>{t("Bằng cấp")}</Text>
          </View>
          <Text style={styles.bioText}>{tutor.degree}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Award size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>{t("Học vấn")}</Text>
          </View>
          <Text style={styles.educationText}>{tutor.certificate}</Text>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Briefcase size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>{t("Kinh nghiệm")}</Text>
          </View>
           <Text style={styles.bioText}>{tutor.experience}</Text>
        </View>
        
        {tutor.introVideoUrl ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("Video giới thiệu")}</Text>
            {/* Nếu là link YouTube, có thể dùng WebView hoặc chỉ hiển thị link */}
            <TouchableOpacity
              onPress={() => {
                // Mở link video bằng trình duyệt ngoài
                if (tutor.introVideoUrl) {
                  Linking.openURL(tutor.introVideoUrl);
                }
              }}
            >
              <Text style={[styles.bioText, { color: colors.primary, textDecorationLine: 'underline' }]}>
                {t("Xem video giới thiệu")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        
        <View style={styles.actionsContainer}>
          {user?.userId === userTutor?.userId ? (
            <Button
              title={t("Chỉnh sửa thông tin")}
              onPress={() => router.push(`/profile/profileTutor/edit?id=${userTutor.userId}` as any)}
              icon={<Award size={20} color={colors.white} />}
              iconPosition="left"
              fullWidth
              style={styles.messageButton}
            />
          ) : (
            <Button
              title={t("Nhắn tin")}
              onPress={handleMessage}
              icon={<MessageSquare size={20} color={colors.white} />}
              iconPosition="left"
              fullWidth
              loading={isLoading}
              style={styles.messageButton}
            />
          )}

          <TouchableOpacity 
            style={styles.shareButton} 
            onPress={handleShare}
          >
            <Share2 size={20} color={colors.primary} />
            <Text style={styles.shareText}>{t("Chia sẻ")}</Text>
          </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SPACING.md,
  },
  name: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: SPACING.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  rating: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    marginLeft: SPACING.xs,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  subjectBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
    margin: SPACING.xs / 2,
  },
  subjectText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: colors.primary,
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
    width: 70,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: colors.text,
    marginLeft: SPACING.xs,
  },
  bioText: {
    fontSize: FONT_SIZE.md,
    color: colors.text,
    lineHeight: 22,
  },
  educationText: {
    fontSize: FONT_SIZE.md,
    color: colors.text,
    lineHeight: 22,
  },
  experienceItem: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: SPACING.sm,
  },
  experienceText: {
    fontSize: FONT_SIZE.md,
    color: colors.text,
    lineHeight: 22,
    flex: 1,
  },
  actionsContainer: {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    ...SHADOWS.small,
    alignItems: 'center',
  },
  messageButton: {
    marginBottom: SPACING.md,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  shareText: {
    fontSize: FONT_SIZE.md,
    color: colors.primary,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
});