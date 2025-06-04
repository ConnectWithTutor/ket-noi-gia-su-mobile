import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Button from "@/components/ui/Button";
import { useUserProfileStore } from "@/store/profile-store";
import colors from "@/constants/Colors";
import { FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from "@/constants/Theme";
import { MapPin, User as UserIcon } from "lucide-react-native";
import { User as UserType } from "@/types";
import { useChat } from "@/hooks/useChat";
import { useAuthStore } from "@/store/auth-store";
import StatusBar from "@/components/ui/StatusBar";
import Header from "@/components/ui/Header";
import { useTranslation } from "react-i18next";
export default function StudentProfileDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    profileStudent,
    loading,
    error,
    usersMap,
    getProfileStudentById,
    fetchUserById
  } = useUserProfileStore();
  const { user } = useAuthStore();
  const { startChat, isLoading } = useChat(user!);
    const { t } = useTranslation();
  useEffect(() => {
    const fetchProfile = async () => {
      if (id) {
        getProfileStudentById(id);
      }
    };
    fetchProfile();
  }, [id]);

  useEffect(() => {
    if (profileStudent && profileStudent.userId && !usersMap[profileStudent.userId]) {
      fetchUserById(profileStudent.userId);
    }
  }, [profileStudent]);

  const handleSendMessage = async (userId: string) => {
    if (!user) {
      Alert.alert(t("Thông báo"), t("Bạn cần đăng nhập để gửi tin nhắn."));
      return;
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

  const handleEdit = (userId: string) => {
    router.push(`/profile/profileStudent/edit?id=${userId}`);
  };

  // Kiểm tra quyền
  const isOwner = user && user.userId === id;
  if (loading && !profileStudent) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!profileStudent) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || t("Không tìm thấy thông tin học viên.")}</Text>
      </View>
    );
  }

  const userInfo = usersMap[profileStudent.userId];
  const fullName = userInfo?.fullName || t("Chưa có tên");
  const avatarUrl = userInfo?.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(fullName);
  const address = userInfo?.address || t("Chưa cập nhật");

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.primary} />
      <Header title={t("Thông tin học viên")} showBack />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <UserIcon size={64} color={colors.textSecondary} />
            )}
          </View>
        <Text style={styles.name}>{fullName}</Text>
        <View style={styles.addressRow}>
          <MapPin size={18} color={colors.textSecondary} />
          <Text style={styles.address}>{address}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{t("Thông tin học viên")}</Text>
        <View style={styles.infoGrid}>
          {/* <View style={styles.infoItem}>
            <Text style={styles.label}>
              <UserIcon size={18} color={colors.primary} /> Mã học viên
            </Text>
            <Text style={styles.valueLarge}>{profileStudent.studentId}</Text>
          </View> */}
          <View style={styles.infoItem}>
            <Text style={styles.label}>
              <MapPin size={18} color={colors.primary} /> {t("Khối lớp")}
            </Text>
            <Text style={styles.valueLarge}>{profileStudent.gradeLevel}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>
              🎯 {t("Mục tiêu học tập")}
            </Text>
            <Text style={styles.valueLarge}>{profileStudent.learningGoals}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>
              🕒 {t("Thời gian ưu tiên")}
            </Text>
            <Text style={styles.valueLarge}>{profileStudent.preferredStudyTime}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>
              📝 {t("Mô tả thêm")}
            </Text>
            <Text style={styles.valueLarge}>{profileStudent.description}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionContainer}>
        {isOwner ? (
          <Button
            title={t("Chỉnh sửa thông tin")}
            onPress={() => handleEdit(profileStudent.userId)}
            style={{ marginTop: SPACING.lg }}
            fullWidth
          />
        ) : (
          <Button
            title={t("Nhắn tin")}
            onPress={() => handleSendMessage(profileStudent.userId)}
            style={{ marginTop: SPACING.lg }}
            fullWidth
          />
        )}
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  profileHeader: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SPACING.sm,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: colors.text,
    marginBottom: SPACING.xs,
    marginTop: 2,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  address: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    elevation: 2,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  infoGrid: {
    gap: SPACING.sm,
  },
  infoItem: {
    marginBottom: SPACING.sm,
  },
  label: {
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 2,
  },
  value: {
    color: colors.text,
    fontSize: FONT_SIZE.md,
    flexWrap: "wrap",
  },
  valueLarge: {
    color: colors.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "500",
    flexWrap: "wrap",
  },
  actionContainer: {
    marginBottom: SPACING.xl,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  errorText: {
    color: colors.danger,
    fontSize: FONT_SIZE.md,
    textAlign: "center",
  },
});