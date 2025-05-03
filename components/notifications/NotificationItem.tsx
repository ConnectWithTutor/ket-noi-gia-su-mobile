import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MessageSquare, Calendar, FileText, Bell } from "lucide-react-native";

import colors from "@/constants/Colors";
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from "@/constants/Theme";
import { Notification } from "@/types/notification";
import { useNotificationStore } from "@/store/notification-store";
import { formatRelativeTime } from "@/utils/date-utils";
import { triggerHaptic } from "@/utils/haptics";

interface NotificationItemProps {
  notification: Notification;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const router = useRouter();
  const { markAsRead } = useNotificationStore();
  
  const handlePress = () => {
    triggerHaptic('light');
    
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.data?.route) {
      router.push(notification.data.route as any);
    }
  };
  
  const getIcon = () => {
    switch (notification.type) {
      case "message":
        return <MessageSquare size={24} color={colors.primary} />;
      case "class":
        return <Calendar size={24} color={colors.secondary} />;
      case "post":
        return <FileText size={24} color={colors.accent} />;
      default:
        return <Bell size={24} color={colors.info} />;
    }
  };
  
  const getBackgroundColor = () => {
    return notification.read ? colors.white : colors.noticeMark;
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: getBackgroundColor() }]}
      onPress={handlePress}
    >
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message} numberOfLines={2}>{notification.message}</Text>
        <Text style={styles.time}>{formatRelativeTime(notification.createdAt)}</Text>
      </View>
      
      {!notification.read && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: SPACING.xs,
  },
  message: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: SPACING.xs,
  },
  time: {
    fontSize: FONT_SIZE.xs,
    color: colors.textLight,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: SPACING.sm,
    alignSelf: "center",
  },
});