import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Clock } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import StatusBar from '@/components/ui/StatusBar';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';
import { useScheduleStore } from '@/store/schedule-store';
import colors from '@/constants/Colors';
import { BORDER_RADIUS, FONT_SIZE, SHADOWS, SPACING } from '@/constants/Theme';
import { formatDate } from '@/utils/date-utils';
import { triggerHaptic } from '@/utils/haptics';
import { useTranslation } from 'react-i18next';

export default function CreateBulkScheduleScreen() {
  const router = useRouter();
  const { classId } = useLocalSearchParams<{ classId: string }>();
  const { createWeeklySchedules, isLoading } = useScheduleStore();
  const { t } = useTranslation(); 
  // State cho form
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [sessions, setSessions] = useState('12');
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [endTime, setEndTime] = useState(new Date(new Date().setHours(new Date().getHours() + 2)));
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleWeekdayToggle = (day: number) => {
    triggerHaptic('light');
    if (weekdays.includes(day)) {
      setWeekdays(weekdays.filter(d => d !== day));
    } else {
      setWeekdays([...weekdays, day].sort());
    }
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setStartTime(selectedTime);
      // Tự động set endTime sau startTime 2 tiếng
      const newEndTime = new Date(selectedTime);
      newEndTime.setHours(selectedTime.getHours() + 2);
      setEndTime(newEndTime);
    }
  };

  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(false);
    if (selectedTime) setEndTime(selectedTime);
  };

  const validateForm = () => {
    if (!classId) {
      Alert.alert(t('Lỗi'), t('Không tìm thấy lớp học.'));
      return false;
    }
    if (isNaN(parseInt(sessions)) || parseInt(sessions) <= 0) {
      Alert.alert(t('Lỗi'), t('Số buổi học phải là số dương'));
      return false;
    }
    if (weekdays.length === 0) {
      Alert.alert(t('Lỗi'), t('Vui lòng chọn ít nhất một ngày học trong tuần'));
      return false;
    }
    if (endTime <= startTime) {
      Alert.alert(t('Lỗi'), t('Thời gian kết thúc phải sau thời gian bắt đầu'));
      return false;
    }
    return true;
  };

  const handleCreateBulkSchedules = async () => {
    if (!validateForm()) return;
    triggerHaptic('medium');
    try {
      const scheduleData = {
        classId: classId,
        startDate: startDate.toISOString().split('T')[0],
        sessions: parseInt(sessions),
        weekdays,
        startTime: startTime.toTimeString().slice(0, 5),
        endTime: endTime.toTimeString().slice(0, 5),
      };
      const result = await createWeeklySchedules(scheduleData);
      if (result) {
        Alert.alert(t('Thành công'), t('Đã tạo lịch học nhanh!'), [
          {
            text: ('OK'),
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert(t('Lỗi'), t('Không thể tạo lịch học nhanh. Vui lòng thử lại sau.'));
      }
    } catch {
      Alert.alert(t('Lỗi'), t('Đã xảy ra lỗi khi tạo lịch học nhanh.'));
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <Header title={t("Tạo lịch học nhanh")} showBack />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("Lịch học hàng tuần")}</Text>

          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Calendar size={20} color={colors.primary} />
            <Text style={styles.datePickerText}>
              {t("Ngày bắt đầu")}: {formatDate(startDate)}
            </Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleStartDateChange}
              minimumDate={new Date()}
            />
          )}

          <Text style={styles.label}>Số buổi học</Text>
          <View style={styles.inputRow}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setSessions(s => Math.max(1, parseInt(s) - 1).toString())}
            >
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.sessionsText}>{sessions}</Text>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setSessions(s => (parseInt(s) + 1).toString())}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>{t("Chọn ngày học trong tuần")}</Text>
          <View style={styles.weekdaysContainer}>
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.weekdayButton,
                  weekdays.includes(index) && styles.weekdayButtonSelected,
                ]}
                onPress={() => handleWeekdayToggle(index)}
              >
                <Text
                  style={[
                    styles.weekdayButtonText,
                    weekdays.includes(index) && styles.weekdayButtonTextSelected,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.timePickersContainer}>
            <TouchableOpacity
              style={styles.timePicker}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Clock size={20} color={colors.primary} />
              <Text style={styles.timePickerText}>
                {t("Bắt đầu")}: {startTime.getHours().toString().padStart(2, '0')}:
                {startTime.getMinutes().toString().padStart(2, '0')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timePicker}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Clock size={20} color={colors.primary} />
              <Text style={styles.timePickerText}>
                {t("Kết thúc")}: {endTime.getHours().toString().padStart(2, '0')}:
                {endTime.getMinutes().toString().padStart(2, '0')}
              </Text>
            </TouchableOpacity>
          </View>
          {showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleStartTimeChange}
              is24Hour={true}
            />
          )}
          {showEndTimePicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleEndTimeChange}
              is24Hour={true}
            />
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={t("Tạo lịch học nhanh")}
            onPress={handleCreateBulkSchedules}
            loading={isLoading}
            fullWidth
          />
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
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  counterButtonText: {
    fontSize: FONT_SIZE.xl,
    color: colors.white,
    fontWeight: 'bold',
  },
  sessionsText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: colors.text,
    minWidth: 32,
    textAlign: 'center',
  },
  weekdaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  weekdayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  weekdayButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  weekdayButtonText: {
    fontSize: FONT_SIZE.sm,
    color: colors.text,
  },
  weekdayButtonTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  timePickersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timePicker: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.xs / 2,
  },
  timePickerText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: colors.text,
  },
  buttonContainer: {
    marginVertical: SPACING.md,
  },
 datePickerButton: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 12,
    borderWidth: 1,
  backgroundColor: colors.background,
  borderRadius: BORDER_RADIUS.md,
  borderColor: colors.border,
  marginBottom: SPACING.sm,
},
datePickerText: {
  marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: colors.text,
},
  
});