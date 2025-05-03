import React from "react";
import { StyleSheet, View, Text } from "react-native";
import colors from "@/constants/Colors";
import { FONT_SIZE, FONT_WEIGHT } from "@/constants/Theme";

interface NotificationBadgeProps {
  count: number;
  size?: "small" | "medium" | "large";
}

export default function NotificationBadge({ count, size = "medium" }: NotificationBadgeProps) {
  if (count <= 0) return null;
  
  const getBadgeSize = () => {
    switch (size) {
      case "small":
        return { width: 16, height: 16, fontSize: FONT_SIZE.xs - 2 };
      case "large":
        return { width: 24, height: 24, fontSize: FONT_SIZE.xs };
      default:
        return { width: 20, height: 20, fontSize: FONT_SIZE.xs };
    }
  };
  
  const { width, height, fontSize } = getBadgeSize();
  
  return (
    <View style={[styles.badge, { width, height }]}>
      <Text style={[styles.text, { fontSize }]}>
        {count > 99 ? "99+" : count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.danger,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -5,
    right: -5,
    zIndex: 1,
    borderWidth: 1,
    borderColor: colors.white,
  },
  text: {
    color: colors.white,
    fontWeight: "bold",
    textAlign: "center",
  },
});