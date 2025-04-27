import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import colors from "@/constants/Colors";
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/Theme";
import Header from "@/components/ui/Header";
import StatusBar from "@/components/ui/StatusBar";
import ClassCard from "@/components/schedule/ClassCard";
import CalendarDay from "@/components/schedule/CalendarDay";
import { useScheduleStore } from "@/store/schedule-store";
import { formatDate, getDayName, getMonthName } from "@/utils/date-utils";

export default function ScheduleScreen() {
  const { classes, fetchClasses, isLoading } = useScheduleStore();
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  
  useEffect(() => {
    fetchClasses();
    generateWeekDates(selectedDate);
  }, []);
  
  const generateWeekDates = (date: Date) => {
    const currentDay = date.getDay();
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - currentDay);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(sunday);
      day.setDate(sunday.getDate() + i);
      weekDays.push(day);
    }
    
    setWeekDates(weekDays);
  };
  
  const handlePrevWeek = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
    generateWeekDates(newDate);
  };
  
  const handleNextWeek = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
    generateWeekDates(newDate);
  };
  
  const handleDaySelect = (date: Date) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDate(date);
  };
  
  const toggleViewMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode(viewMode === "list" ? "calendar" : "list");
  };
  
  const filteredClasses = classes.filter(classItem => {
    const classDate = new Date(classItem.startTime);
    return (
      classDate.getDate() === selectedDate.getDate() &&
      classDate.getMonth() === selectedDate.getMonth() &&
      classDate.getFullYear() === selectedDate.getFullYear()
    );
  });
  
  const hasEvents = (date: Date) => {
    return classes.some(classItem => {
      const classDate = new Date(classItem.startTime);
      return (
        classDate.getDate() === date.getDate() &&
        classDate.getMonth() === date.getMonth() &&
        classDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <Header title="Lịch học" showNotification />
      
      <View style={styles.content}>
        <View style={styles.calendarHeader}>
          <View style={styles.dateSelector}>
            <Text style={styles.currentDate}>
              {formatDate(selectedDate)}
            </Text>
            <TouchableOpacity 
              style={styles.viewModeButton} 
              onPress={toggleViewMode}
            >
              <Text style={styles.viewModeText}>
                {viewMode === "list" ? "Lịch" : "Danh sách"}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.weekSelector}>
            <TouchableOpacity onPress={handlePrevWeek}>
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
            
            <Text style={styles.weekText}>
              Tuần {Math.ceil(selectedDate.getDate() / 7)}
            </Text>
            
            <TouchableOpacity onPress={handleNextWeek}>
              <ChevronRight size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysContainer}
        >
          {weekDates.map((date, index) => (
            <CalendarDay
              key={index}
              date={date.getDate()}
              day={getDayName(date, true)}
              isToday={
                date.getDate() === new Date().getDate() &&
                date.getMonth() === new Date().getMonth() &&
                date.getFullYear() === new Date().getFullYear()
              }
              isSelected={
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear()
              }
              hasEvents={hasEvents(date)}
              onPress={() => handleDaySelect(date)}
            />
          ))}
        </ScrollView>
        
        <View style={styles.divider} />
        
        <ScrollView style={styles.classesContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.classesHeader}>
            <Text style={styles.classesTitle}>
              {getMonthName(selectedDate)} {selectedDate.getDate()}, {selectedDate.getFullYear()}
            </Text>
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                <Text style={styles.legendText}>Lịch học</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.secondary }]} />
                <Text style={styles.legendText}>Lịch học truyền</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
                <Text style={styles.legendText}>Lịch tạm ngưng</Text>
              </View>
            </View>
          </View>
          
          {isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Đang tải...</Text>
            </View>
          ) : filteredClasses.length > 0 ? (
            filteredClasses.map((classItem) => (
              <ClassCard
                key={classItem.id}
                title={classItem.title}
                time={`${new Date(classItem.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(classItem.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                location={classItem.location}
                tutor={classItem.tutorName}
                status={classItem.status}
                onPress={() => {}}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không có lịch học vào ngày này</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  calendarHeader: {
    padding: SPACING.md,
    backgroundColor: colors.white,
  },
  dateSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  currentDate: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 600,
    color: colors.text,
  },
  viewModeButton: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  viewModeText: {
    fontSize: FONT_SIZE.sm,
    color: colors.primary,
    fontWeight: 600,
  },
  weekSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  weekText: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    marginHorizontal: SPACING.md,
  },
  daysContainer: {
    backgroundColor: colors.white,
    paddingVertical: SPACING.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  classesContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  classesHeader: {
    marginBottom: SPACING.md,
  },
  classesTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 600,
    color: colors.text,
    marginBottom: SPACING.sm,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: SPACING.md,
    marginBottom: SPACING.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  legendText: {
    fontSize: FONT_SIZE.xs,
    color: colors.textSecondary,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
});