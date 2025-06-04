import React, { useEffect } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import { ChevronLeft, Bell } from "lucide-react-native";

import colors from "@/constants/Colors";
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from "@/constants/Theme";
import { useNotificationStore } from "@/store/notification-store";
import NotificationItem from "@/components/notifications/NotificationItem";
import { triggerHaptic } from "@/utils/haptics";
import StatusBar from "@/components/ui/StatusBar";
import Header from "@/components/ui/Header";
import { useTranslation } from "react-i18next";

export default function NotificationListScreen() {
  const router = useRouter();
  const { notifications, fetchNotifications, markAllAsRead, isLoading } = useNotificationStore();
  const { t } = useTranslation();
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = () => {
    triggerHaptic('medium');
    markAllAsRead();
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.emptyText}>{t("Đang tải thông báo...")}</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Bell size={60} color={colors.textLight} />
        <Text style={styles.emptyTitle}>{t("Không có thông báo")}</Text>
        <Text style={styles.emptyText}>{t("Bạn chưa có thông báo nào")}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
        <StatusBar backgroundColor={colors.primary} />
        <Header title={t("Thông báo")} showBack/>

      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      backButton: {
        padding: SPACING.xs,
      },
      markReadButton: {
        padding: SPACING.xs,
      },
      markReadText: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "medium",
      },
      listContent: {
        padding: SPACING.md,
        flexGrow: 1,
      },
      emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: SPACING.xl,
      },
      emptyTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "semibold",
        color: colors.text,
        marginTop: SPACING.lg,
        marginBottom: SPACING.xs,
      },
      emptyText: {
        fontSize: FONT_SIZE.md,
        color: colors.textSecondary,
        textAlign: "center",
      },
});