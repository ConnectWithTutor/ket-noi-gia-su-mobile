import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

import colors from "@/constants/Colors";
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from "@/constants/Theme";
import { useNotificationStore } from "@/store/notification-store";
import { triggerHaptic } from "@/utils/haptics";
import StatusBar from "@/components/ui/StatusBar";
import Header from "@/components/ui/Header";
import { useTranslation } from "react-i18next";

export default function NotificationsScreen() {
  const router = useRouter();
  const { preferences, updatePreferences } = useNotificationStore();
 const { t } = useTranslation();
  const handleToggle = (key: string, value: boolean) => {
    triggerHaptic('light');
    updatePreferences({ [key]: value });
  };

  return (
    <View style={styles.container}>
        <StatusBar backgroundColor={colors.primary} />
        <Header title={t("Cài đặt thông báo")} showBack />
              
      <Stack.Screen 
        options={{
          title: t("Thông báo"),
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => {
                triggerHaptic('light');
                router.back();
              }}
              style={styles.backButton}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          
          
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t("Thông báo tin nhắn")}</Text>
                <Text style={styles.settingDescription}>{t("Nhận thông báo khi có tin nhắn mới")}</Text>
              </View>
              <Switch
                value={preferences.messages}
                onValueChange={(value) => handleToggle("messages", value)}
                trackColor={{ false: colors.disabled, true: colors.primaryLight }}
                thumbColor={preferences.messages ? colors.primary : colors.white}
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t("Thông báo lớp học")}</Text>
                <Text style={styles.settingDescription}>{t("Nhận thông báo về lịch học và thay đổi")}</Text>
              </View>
              <Switch
                value={preferences.classes}
                onValueChange={(value) => handleToggle("classes", value)}
                trackColor={{ false: colors.disabled, true: colors.primaryLight }}
                thumbColor={preferences.classes ? colors.primary : colors.white}
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t("Thông báo bài viết")}</Text>
                <Text style={styles.settingDescription}>{t("Nhận thông báo khi có bài viết mới phù hợp")}</Text>
              </View>
              <Switch
                value={preferences.posts}
                onValueChange={(value) => handleToggle("posts", value)}
                trackColor={{ false: colors.disabled, true: colors.primaryLight }}
                thumbColor={preferences.posts ? colors.primary : colors.white}
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t("Thông báo hệ thống")}</Text>
                <Text style={styles.settingDescription}>{t("Nhận thông báo về cập nhật và bảo trì hệ thống")}</Text>
              </View>
              <Switch
                value={preferences.system}
                onValueChange={(value) => handleToggle("system", value)}
                trackColor={{ false: colors.disabled, true: colors.primaryLight }}
                thumbColor={preferences.system ? colors.primary : colors.white}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("Thông báo đẩy")}</Text>

          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t("Âm thanh")}</Text>
                <Text style={styles.settingDescription}>{t("Phát âm thanh khi có thông báo mới")}</Text>
              </View>
              <Switch
                value={preferences.sound}
                onValueChange={(value) => handleToggle("sound", value)}
                trackColor={{ false: colors.disabled, true: colors.primaryLight }}
                thumbColor={preferences.sound ? colors.primary : colors.white}
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t("Rung")}</Text>
                <Text style={styles.settingDescription}>{t("Rung khi có thông báo mới")}</Text>
              </View>
              <Switch
                value={preferences.vibration}
                onValueChange={(value) => handleToggle("vibration", value)}
                trackColor={{ false: colors.disabled, true: colors.primaryLight }}
                thumbColor={preferences.vibration ? colors.primary : colors.white}
              />
            </View>
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
    backButton: {
        padding: SPACING.xs,
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
        fontWeight: "semibold",
        color: colors.text,
        marginBottom: SPACING.md,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: BORDER_RADIUS.md,
        ...SHADOWS.small,
    },
    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: SPACING.md,
    },
    settingText: {
        marginRight: SPACING.md,
        flex: 1,
    },
    settingTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: "medium",
        color: colors.text,
        marginBottom: SPACING.xs,
    },
    settingDescription: {
        fontSize: FONT_SIZE.sm,
        color: colors.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.divider,
        marginHorizontal: SPACING.md,
    },
});