import React, { useEffect } from "react";
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { 
  User, 
  Settings, 
  Bell, 
  Lock, 
  HelpCircle, 
  LogOut, 
  FileText, 
  Star, 
  BookOpen
} from "lucide-react-native";

import colors from "@/constants/Colors";
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from "@/constants/Theme";
import StatusBar from "@/components/ui/StatusBar";
import ProfileItem from "@/components/profile/ProfileItem";
import { useAuthStore } from "@/store/auth-store";
import { triggerHaptic } from "@/utils/haptics";
import { useRoleStore } from "@/store/roleStore";
import { useChatStore } from "@/store/chat-store";
import { useTranslation } from "react-i18next";
export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { roles,fetchRoles } = useRoleStore();
  const { disconnectWebSocket } = useChatStore();
  const { t } = useTranslation();
  useEffect(() => {
    const fetchUserRole = async () => {
      await fetchRoles();
    };
    fetchUserRole();
  }, []);
  const role =roles.find((role) => role.roleId === user?.roleId);
  const handleLogout = () => {
    disconnectWebSocket();
    triggerHaptic('medium');
    logout();
    router.replace("/");
  };
  
  const handlepush = (path: string) => {
    triggerHaptic('light');
    router.push(path as any);
  };
  const handleChangePassword = () => {
    handlepush("/change-password");
  };
  const handleProfile = () => {
    if (role?.roleName === "Student") {
      handlepush(`/profile/profileStudent/${user?.userId}`);
    } else if (role?.roleName === "Tutor") {
      handlepush(`/profile/profileTutor/${user?.userId}`);
    } else {
      handlepush("/profile");
    }
  }
  const handleSettings = () => {
    handlepush("/settings/settings");
  };
  const handlePersonalInfo = () => {
    handlepush("/personal-info");
  };
  const handleEvaluation = () => {
    handlepush("/evaluation");
  };
  const handleNotifications = () => {
    handlepush("/notifications");
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            source={{ uri: user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" }}
            style={styles.avatar}
          />
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.fullName}</Text>
            <Text style={styles.userRole}>{role?.roleName === "Tutor" ? t("Gia sư") : t("Học viên")}</Text>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={handlePersonalInfo}
            >
              <Text style={styles.editButtonText}>{t("Chỉnh sửa")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("Tài khoản")}</Text>

          <View style={styles.sectionContent}>
            <ProfileItem
              icon={<User size={20} color={colors.primary} />}
              title={t("Thông tin cá nhân")}
              subtitle={t("Cập nhật thông tin cá nhân của bạn")}
              onPress={handleProfile}
            />
            
            <ProfileItem
              icon={<Lock size={20} color={colors.primary} />}
              title={t("Đổi mật khẩu")}
              subtitle={t("Cập nhật mật khẩu của bạn")}
              onPress={handleChangePassword}
            />
            
            <ProfileItem
              icon={<Bell size={20} color={colors.primary} />}
              title={t("Thông báo")}
              subtitle={t("Quản lý thông báo")}
              onPress={handleNotifications}
            />
          </View>
        </View>
        
        {role?.roleName === "Tutor" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("Gia sư")}</Text>

            <View style={styles.sectionContent}>
             
              <ProfileItem
                icon={<Star size={20} color={colors.primary} />}
                title={t("Đánh giá")}
                subtitle={t("Xem đánh giá từ học viên")}
                onPress={handleEvaluation}
              />
            </View>
          </View>
        )}

        {role?.roleName === "Student" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("Học viên")}</Text>

            <View style={styles.sectionContent}>
              <ProfileItem
                icon={<BookOpen size={20} color={colors.primary} />}
                title={t("Danh sách hoá đơn")}
                subtitle={t("Xem các hoá đơn của bạn")}
                onPress={() => router.push("/(app)/invoice/invoices")}
              />
            </View>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('Hỗ trợ')}</Text>

          <View style={styles.sectionContent}>
            <ProfileItem
              icon={<HelpCircle size={20} color={colors.primary} />}
              title={t("Khiếu nại")}
              subtitle={t("Bạn gặp vấn đề gì?")}
              onPress={() => {handlepush("/(app)/complaint/complaints")}}
            />
            <ProfileItem
              icon={<HelpCircle size={20} color={colors.primary} />}
              title={t("Trợ giúp")}
              subtitle={t("Câu hỏi thường gặp")}
              onPress={() => {}}
            />
            
            <ProfileItem
              icon={<FileText size={20} color={colors.primary} />}
              title={t("Điều khoản sử dụng")}
              onPress={() => {}}
            />

            <ProfileItem
              icon={<Settings size={20} color={colors.primary} />}
              title={t("Cài đặt")}
              onPress={() => {handleSettings()}}
            />
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={colors.danger} />
          <Text style={styles.logoutText}>{t("Đăng xuất")}</Text>
        </TouchableOpacity>
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
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.white,
  },
  userInfo: {
    marginLeft: SPACING.md,
  },
  userName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 700,
    color: colors.white,
    marginBottom: SPACING.xs,
  },
  userRole: {
    fontSize: FONT_SIZE.md,
    color: colors.white,
    opacity: 0.9,
    marginBottom: SPACING.sm,
  },
  editButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: "flex-start",
  },
  editButtonText: {
    color: colors.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: 500,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 600,
    color: colors.text,
    marginBottom: SPACING.md,
  },
  sectionContent: {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.small,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    ...SHADOWS.small,
  },
  logoutText: {
    fontSize: FONT_SIZE.md,
    color: colors.danger,
    fontWeight: 600,
    marginLeft: SPACING.sm,
  },
});