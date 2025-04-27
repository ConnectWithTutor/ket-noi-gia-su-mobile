import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Clock, MapPin, User } from 'lucide-react-native';
import colors from '@/constants/Colors';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from '@/constants/Theme';

export type ClassStatus = 'upcoming' | 'completed' | 'cancelled';

interface ClassCardProps {
  title: string;
  time: string;
  location: string;
  tutor: string;
  status: ClassStatus;
  onPress: () => void;
}

export default function ClassCard({
  title,
  time,
  location,
  tutor,
  status,
  onPress,
}: ClassCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'upcoming':
        return colors.primary;
      case 'completed':
        return colors.secondary;
      case 'cancelled':
        return colors.danger;
      default:
        return colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: getStatusColor() }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        
        <View style={styles.infoRow}>
          <Clock size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{time}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <MapPin size={16} color={colors.textSecondary} />
          <Text style={styles.infoText} numberOfLines={1}>{location}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <User size={16} color={colors.textSecondary} />
          <Text style={styles.infoText} numberOfLines={1}>{tutor}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    ...SHADOWS.small,
  },
  content: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: "medium",
    color: colors.text,
    marginBottom: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginLeft: SPACING.sm,
  },
});