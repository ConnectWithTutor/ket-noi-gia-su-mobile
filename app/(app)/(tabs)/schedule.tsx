import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
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
import { router } from "expo-router";
import { triggerHaptic } from "@/utils/haptics";
import { useClassStore } from "@/store/class-store";
import { useStatusStore } from "@/store/status-store";
import { Role, Status } from "@/types";
import { useAuthStore} from "@/store/auth-store"
import { useRoleStore } from "@/store/roleStore";
import { useAddressStore } from "@/store/address-store";
import { useUserProfileStore } from "@/store/profile-store";
import { useTranslation } from "react-i18next";
export default function ScheduleScreen() {
  const { schedules, getSchedulesByClass, isLoading: isScheduleLoading } = useScheduleStore();
  const { classes, fetchClassesByUserId, isLoading } = useClassStore();
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const { user } = useAuthStore();
  const {  getRoleById } = useRoleStore();
  const {fetchUserById,usersMap} = useUserProfileStore();
  const { fetchAddressById , addressMap} = useAddressStore();
   const [refreshing, setRefreshing] = useState(false);
     const { t } = useTranslation();
  const [role, setRole] = useState<Role>();
   const { fetchStatusesClass,StatusesClass } = useStatusStore();
  useEffect(() => {
  const fetchData = async () => {
    fetchClassesByUserId(user?.userId || "");
     fetchStatusesClass();
    const userRole = await getRoleById(user?.roleId || "");
    if (userRole) {
       setRole(userRole || null);
    }
    
    const allSchedules = [];

    const classList = useClassStore.getState().classes;
    for (const classItem of classList) {
      getSchedulesByClass(classItem.classId);
      fetchUserById(classItem.tutorId);
      fetchAddressById(classItem.classId);
      const classSchedules = useScheduleStore.getState().schedules.map(sch => ({
        ...sch,
        classInfo: {classItem}
      }));

      allSchedules.push(...classSchedules);
    }
    useScheduleStore.setState({ schedules: allSchedules });
  };

  fetchData();
  generateWeekDates(selectedDate);
}, []);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClassesByUserId(user?.userId || "");
    await fetchStatusesClass();
    const classList = useClassStore.getState().classes;
    const allSchedules = [];
    for (const classItem of classList) {
      await getSchedulesByClass(classItem.classId);
      const classSchedules = await Promise.all(
        useScheduleStore.getState().schedules.map(async sch => ({
          ...sch,
          classInfo: classItem,
          tutor: await fetchUserById(classItem.tutorId) || null,
        }))
      );
      allSchedules.push(...classSchedules);
    }
    useScheduleStore.setState({ schedules: allSchedules });
    setRefreshing(false);
  };

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
  const getStatus = (_statusID: string): Status => {
    const statusItem = StatusesClass.find(item => item.statusId === _statusID);
    if (!statusItem) {
      return StatusesClass[0];
    }
    return statusItem;
  }
    
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
  const mergedSchedules = schedules.map(sch => ({
  ...sch,
  classInfo: classes.find(cls => cls.classId === sch.classId) || null,
  
}));
const filteredClasses = mergedSchedules.filter(sch => {
  const schDate = new Date(sch.dayStudying);
  return (
    schDate.getDate() === selectedDate.getDate() &&
    schDate.getMonth() === selectedDate.getMonth() &&
    schDate.getFullYear() === selectedDate.getFullYear()
  );
});
  
  
  const hasEvents = (date: Date) => {
    return classes.some(classItem => {
      const classDate = new Date(classItem.startDate);
      return (
        classDate.getDate() === date.getDate() &&
        classDate.getMonth() === date.getMonth() &&
        classDate.getFullYear() === date.getFullYear()
      );
    });
  };
  const handleNotificationPress = () => {
    triggerHaptic('light');
    router.push('/notification-list' as any);
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <Header title={t("Lịch học")} showNotification onNotificationPress={handleNotificationPress}/>

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
                {viewMode === "list" ? t("Lịch") : t("Danh sách")}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.weekSelector}>
            <TouchableOpacity onPress={handlePrevWeek}>
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
            
            <Text style={styles.weekText}>
              {t('Tuần')} {Math.ceil(selectedDate.getDate() / 7)}
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
          refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
              {getMonthName(selectedDate.getMonth())} {selectedDate.getDate()}, {selectedDate.getFullYear()}
            </Text>
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                <Text style={styles.legendText}>{t("Lịch học")}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.secondary }]} />
                <Text style={styles.legendText}>{t("Lịch học trực tuyến")}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
                <Text style={styles.legendText}>{t("Lịch tạm ngưng")}</Text>
              </View>
            </View>
          </View>
          {isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t("Đang tải...")}</Text>
            </View>
          ) : filteredClasses.length > 0 ? (
            filteredClasses.map((classItem) => (
              
              <ClassCard
                key={classItem.classId}
                scheduleId={classItem.scheduleId}
                title={classItem.classInfo?.className_vi || t("Lớp học")}
                time={classItem.startTime && classItem.endTime
                  ? `${classItem.startTime.slice(0, 5)} - ${classItem.endTime.slice(0, 5) }`
                  : t("Chưa xác định")}
                zoomLink={classItem.zoomUrl}
                studyType={
                  classItem.classInfo?.studyType === "Online"
                    ? "Online"
                    : "Offline"
                } 
                location={addressMap[classItem.classId]?.fullAddres || t("Chưa cập nhật")}
                role={role}
                tutor={classItem.classInfo?.tutorId ? usersMap[classItem.classInfo.tutorId]?.fullName || t("Chưa có tên") : t("Chưa có tên")}
                status={getStatus(classItem.status)}
                onPress={() => { } } />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t("Không có lịch học vào ngày này")}</Text>
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