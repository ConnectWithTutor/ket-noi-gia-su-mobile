import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import colors from '@/constants/Colors';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING } from '@/constants/Theme';

interface CalendarDayProps {
  date: number;
  day: string;
  isToday?: boolean;
  isSelected?: boolean;
  hasEvents?: boolean;
  onPress: () => void;
}

export default function CalendarDay({
  date,
  day,
  isToday = false,
  isSelected = false,
  hasEvents = false,
  onPress,
}: CalendarDayProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.day,
        isSelected && styles.selectedText,
        isToday && styles.todayText,
      ]}>
        {day}
      </Text>
      
      <View style={[
        styles.dateContainer,
        isToday && styles.todayContainer,
        isSelected && styles.selectedDateContainer,
      ]}>
        <Text style={[
          styles.date,
          isToday && styles.todayText,
          isSelected && styles.selectedText,
        ]}>
          {date}
        </Text>
      </View>
      
      {hasEvents && (
        <View style={[
          styles.dot,
          isSelected && styles.selectedDot,
        ]} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: SPACING.xs,
    width: 45,
  },
  selectedContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: BORDER_RADIUS.md,
  },
  day: {
    fontSize: FONT_SIZE.xs,
    color: colors.textSecondary,
    marginBottom: SPACING.xs,
  },
  dateContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  todayContainer: {
    backgroundColor: colors.primaryLight,
  },
  selectedDateContainer: {
    backgroundColor: colors.primary,
  },
  date: {
    fontSize: FONT_SIZE.md,
    fontWeight: 600,
    color: colors.text,
  },
  todayText: {
    color: colors.primary,
    fontWeight: 700,
  },
  selectedText: {
    color: colors.white,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
  },
  selectedDot: {
    backgroundColor: colors.white,
  },
});