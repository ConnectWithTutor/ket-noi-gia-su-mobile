import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewStyle } from 'react-native';
import colors from '@/constants/Colors';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING } from '@/constants/Theme';

interface SocialButtonProps {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
}

export default function SocialButton({
  title,
  icon,
  onPress,
  style,
}: SocialButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: SPACING.md,
  },
  text: {
    fontSize: FONT_SIZE.md,
    fontWeight: "medium",
    color: colors.text,
    marginLeft: SPACING.md,
  },
});