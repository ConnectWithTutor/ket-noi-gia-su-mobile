import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import colors from '@/constants/Colors';
import { FONT_SIZE, SPACING } from '@/constants/Theme';

interface ProfileItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  showChevron?: boolean;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
}

export default function ProfileItem({
  icon,
  title,
  subtitle,
  showChevron = true,
  onPress,
  rightComponent,
}: ProfileItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.iconContainer}>{icon}</View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      
      {rightComponent || (showChevron && (
        <ChevronRight size={20} color={colors.textSecondary} />
      ))}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: colors.white,
  },
  iconContainer: {
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.md,
    color: colors.text,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginTop: SPACING.xs,
  },
});