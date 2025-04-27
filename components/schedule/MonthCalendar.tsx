import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import colors from '@/constants/Colors';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '@/constants/Theme';

interface MonthCalendarProps {
  month: string;
  year: number;
  days: Array<{
    date: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    hasEvents: boolean;
  }>;
  onDayPress: (day: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  selectedDate?: number;
}

export default function MonthCalendar({
  month,
  year,
  days,
  onDayPress,
  onPrevMonth,
  onNextMonth,
  selectedDate,
}: MonthCalendarProps) {
  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onPrevMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.monthYear}>{`${month} ${year}`}</Text>
        
        <TouchableOpacity onPress={onNextMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ChevronRight size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDay}>
            <Text style={[
              styles.weekDayText,
              (index === 0) && styles.sundayText,
            ]}>
              {day}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={styles.daysContainer}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.day,
              day.isToday && styles.today,
              selectedDate === day.date && day.isCurrentMonth && styles.selectedDay,
            ]}
            onPress={() => day.isCurrentMonth && onDayPress(day.date)}
            disabled={!day.isCurrentMonth}
          >
            <Text style={[
              styles.dayText,
              !day.isCurrentMonth && styles.otherMonthDay,
              day.isToday && styles.todayText,
              selectedDate === day.date && day.isCurrentMonth && styles.selectedDayText,
              (index % 7 === 0) && styles.sundayText,
            ]}>
              {day.date}
            </Text>
            {day.hasEvents && day.isCurrentMonth && (
              <View style={[
                styles.eventDot,
                selectedDate === day.date && styles.selectedEventDot,
              ]} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  monthYear: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 600,
    color: colors.text,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: 600,
    color: colors.textSecondary,
  },
  sundayText: {
    color: colors.danger,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: FONT_SIZE.sm,
    color: colors.text,
  },
  otherMonthDay: {
    color: colors.textLight,
  },
  today: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
  },
  todayText: {
    fontWeight: 700,
    color: colors.primary,
  },
  selectedDay: {
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  selectedDayText: {
    color: colors.white,
    fontWeight: 700,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    position: 'absolute',
    bottom: 6,
  },
  selectedEventDot: {
    backgroundColor: colors.white,
  },
});