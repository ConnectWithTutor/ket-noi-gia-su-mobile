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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Calendar, Clock, Info } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import StatusBar from '@/components/ui/StatusBar';
import Header from '@/components/ui/Header';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useScheduleStore } from '@/store/schedule-store';
import colors from '@/constants/Colors';
import { BORDER_RADIUS, FONT_SIZE, SHADOWS, SPACING } from '@/constants/Theme';
import { formatDate } from '@/utils/date-utils';
import { triggerHaptic } from '@/utils/haptics';
import { useTranslation } from 'react-i18next';

export default function CreateScheduleScreen() {
  const router = useRouter();
  const { classId } = useLocalSearchParams<{ classId: string }>();
  const { createSchedule, isLoading } = useScheduleStore();
  const { t } = useTranslation();
  // State cho form
  const [dayStudying, setDayStudying] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [endTime, setEndTime] = useState(new Date(new Date().setHours(new Date().getHours() + 2)));
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDayStudying(selectedDate);
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
    if (endTime <= startTime) {
      Alert.alert(t('Lỗi'), t('Thời gian kết thúc phải sau thời gian bắt đầu'));
      return false;
    }
    return true;
  };

  const handleCreateSchedule = async () => {
    if (!validateForm()) return;
    triggerHaptic('medium');
    try {
      const scheduleData = {
        classId: classId,
        dayStudying: dayStudying.toISOString().split('T')[0],
        startTime: startTime.toTimeString().slice(0, 5),
        endTime: endTime.toTimeString().slice(0, 5),
      };
      const result = await createSchedule(scheduleData);
      if (result) {
        Alert.alert(t('Thành công'), t('Đã thêm buổi học!'), [
          {
            text: t('OK'),
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert(t('Lỗi'), t('Không thể thêm buổi học. Vui lòng thử lại sau.'));
      }
    } catch {
      Alert.alert(t('Lỗi'), t('Đã xảy ra lỗi khi thêm buổi học.'));
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <Header title={t("Thêm buổi học")} showBack />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("Thông tin buổi học")}</Text>

          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color={colors.primary} />
            <Text style={styles.datePickerButtonText}>
              {t("Ngày học")}: {formatDate(dayStudying)}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dayStudying}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

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
            title={t("Thêm buổi học")}
            onPress={handleCreateSchedule}
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
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  datePickerButtonText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: colors.text,
  },
  timePickersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
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
});