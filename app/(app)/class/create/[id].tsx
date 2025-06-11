import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  BookOpen,
  Info,
} from "lucide-react-native";

import StatusBar from "@/components/ui/StatusBar";
import Header from "@/components/ui/Header";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useClassStore } from "@/store/class-store";
import { useScheduleStore } from "@/store/schedule-store";
import { useAuthStore } from "@/store/auth-store";
import { useStudentRequestStore } from "@/store/post-store";
import colors from "@/constants/Colors";
import { BORDER_RADIUS, FONT_SIZE, SHADOWS, SPACING } from "@/constants/Theme";
import { formatDate } from "@/utils/date-utils";
import { triggerHaptic } from "@/utils/haptics";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useStatusStore } from "@/store/status-store";
import { useClassRegistrationStore } from "@/store/classRegistration-store";
import { useAddressStore } from "@/store/address-store";
import { AddressAutoComplete } from "@/types";
import { useTranslation } from "react-i18next";

export default function CreateClassScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const requestId = id;
  const router = useRouter();
  const { user } = useAuthStore();
  const { fetchStudentRequestById, selectedRequest, updateStudentRequest } =
    useStudentRequestStore();
  const { createClass, isLoading: isCreatingClass } = useClassStore();
  const { fetchStatusesClass, StatusesClass, statusesStudentRequest } =
    useStatusStore();
  const { createWeeklySchedules, isLoading: isCreatingSchedule } =
    useScheduleStore();
  const { fetchAddressAutoComplete, addressAutoComplete, createAddress } =
    useAddressStore();
  const { createRegistration } = useClassRegistrationStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Class form state
  const [className_vi, setClassName_vi] = useState("");
  const [className_en, setClassName_en] = useState("");
  const [studyType, setStudyType] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [sessions, setSessions] = useState("12");
  const [tuitionFee, setTuitionFee] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [maxStudents, setMaxStudents] = useState("1");
  const [address, setAddress] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Schedule form state
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [endTime, setEndTime] = useState(
    new Date(new Date().setHours(new Date().getHours() + 2))
  );
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const { t } = useTranslation();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (requestId) {
      fetchStatusesClass();
      fetchStudentRequestById(requestId)
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => {
          setError(t("Không thể tải thông tin yêu cầu. Vui lòng thử lại sau."));
          setIsLoading(false);
        });
    } else {
      setError(t("Không tìm thấy ID yêu cầu."));
      setIsLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    if (selectedRequest) {
      setClassName_vi(`Lớp ${selectedRequest.title}`);
      setClassName_en(`Class ${selectedRequest.title}`);
      setStudyType(selectedRequest.studyType || "offline");
      setTuitionFee(selectedRequest.tuitionFee?.toString() || "0");
      setDescription(selectedRequest.description || "");
      setMaxStudents(selectedRequest.studentCount?.toString() || "1");
      setAddress(selectedRequest.location || "");

      // Parse preferred schedule to set weekdays
      if (selectedRequest.preferredSchedule) {
        const scheduleParts = selectedRequest.preferredSchedule
          .toLowerCase()
          .split(",");
        const weekdayMap: Record<string, number> = {
          "chủ nhật": 0,
          cn: 0,
          sunday: 0,
          "thứ hai": 1,
          t2: 1,
          monday: 1,
          "thứ ba": 2,
          t3: 2,
          tuesday: 2,
          "thứ tư": 3,
          t4: 3,
          wednesday: 3,
          "thứ năm": 4,
          t5: 4,
          thursday: 4,
          "thứ sáu": 5,
          t6: 5,
          friday: 5,
          "thứ bảy": 6,
          t7: 6,
          saturday: 6,
        };

        const detectedWeekdays: number[] = [];
        scheduleParts.forEach((part) => {
          Object.entries(weekdayMap).forEach(([key, value]) => {
            if (part.trim().includes(key)) {
              detectedWeekdays.push(value);
            }
          });
        });

        if (detectedWeekdays.length > 0) {
          setWeekdays(detectedWeekdays);
        } else {
          setWeekdays([1, 3, 5]);
        }
      } else {
        setWeekdays([1, 3, 5]);
      }
    }
  }, [selectedRequest]);

  const handleWeekdayToggle = (day: number) => {
    triggerHaptic("light");
    if (weekdays.includes(day)) {
      setWeekdays(weekdays.filter((d) => d !== day));
    } else {
      setWeekdays([...weekdays, day].sort());
    }
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setStartTime(selectedTime);

      // Automatically set end time to 2 hours after start time
      const newEndTime = new Date(selectedTime);
      newEndTime.setHours(selectedTime.getHours() + 2);
      setEndTime(newEndTime);
    }
  };

  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      setEndTime(selectedTime);
    }
  };

  const formatTimeString = (date: Date): string => {
    return date.toTimeString().split(" ")[0].substring(0, 5);
  };

  const validateForm = (): boolean => {
    if (!className_vi.trim()) {
      Alert.alert(t('Lỗi'), t("Vui lòng nhập tên lớp học (tiếng Việt)"));
      return false;
    }

    if (!className_en.trim()) {
      Alert.alert(t('Lỗi'), t("Vui lòng nhập tên lớp học (tiếng Anh)"));
      return false;
    }

    if (!studyType.trim()) {
      Alert.alert(t('Lỗi'), t("Vui lòng chọn hình thức học"));
      return false;
    }

    if (isNaN(parseInt(sessions)) || parseInt(sessions) <= 0) {
      Alert.alert(t('Lỗi'), t("Số buổi học phải là số dương"));
      return false;
    }

    if (isNaN(parseInt(tuitionFee)) || parseInt(tuitionFee) <= 0) {
      Alert.alert(t('Lỗi'), t("Học phí phải là số dương"));
      return false;
    }

    if (isNaN(parseInt(maxStudents)) || parseInt(maxStudents) <= 0) {
      Alert.alert(t('Lỗi'), t("Số học sinh tối đa phải là số dương"));
      return false;
    }

    if (weekdays.length === 0) {
      Alert.alert(t('Lỗi'), t("Vui lòng chọn ít nhất một ngày học trong tuần"));
      return false;
    }

    if (endTime <= startTime) {
      Alert.alert(t('Lỗi'), t("Thời gian kết thúc phải sau thời gian bắt đầu"));
      return false;
    }

    if (!address.trim()) {
      Alert.alert(t('Lỗi'), t("Vui lòng nhập địa chỉ lớp học"));
      return false;
    }

    return true;
  };

  const handleCreateClass = async () => {
    if (!validateForm()) return;

    triggerHaptic("medium");

    try {
      const StatusClass = StatusesClass.find((s) => s.code === "Pending");
      if (!StatusClass) {
        Alert.alert(
          t("Lỗi"),
          t("Không tìm thấy trạng thái lớp học. Vui lòng thử lại sau.")
        );
        return;
      }
      // Create class
      const classData = {
        className_vi,
        className_en,
        tutorId: user?.userId || "",
        createdBy: user?.userId || "",
        subjectId: selectedRequest?.subjectId || "",
        studyType,
        startDate: startDate.toISOString(),
        sessions: parseInt(sessions),
        tuitionFee: tuitionFee,
        description,
        maxStudents: parseInt(maxStudents),
        status: StatusClass.statusId,
        address,
        latitude,
        longitude,
      };

      const classId = await createClass(classData);
      console.log("Class created with ID:", classId);
      if (classId && selectedRequest) {
        const scheduleData = {
          classId: classId,
          weekdays: weekdays,
          startTime: formatTimeString(startTime),
          endTime: formatTimeString(endTime),
        };
        const schedulesCreated = await createWeeklySchedules(scheduleData);
        if (schedulesCreated) {
          Alert.alert(t("Thành công"), t("Đã tạo lớp học thành công!"), [
            {
              text: t("OK"),
              onPress: () => router.push(`/class`),
            },
          ]);
        } else {
          Alert.alert(t("Lỗi"), t("Không thể tạo lịch học. Vui lòng thử lại sau."));
        }
        await createRegistration({
          classId: classId,
          studentId: selectedRequest?.studentId || "",
          registrationDate: new Date().toISOString(),
        });
        if(studyType !== "Online") {
          createAddressClass(classId);
        }
        const Status = statusesStudentRequest?.find(
          (st) => st.code.toLowerCase() === "completed"
        );
        await updateStudentRequest(requestId, {
          status: Status?.statusId || "",
        });
        
      } else {
        Alert.alert(t("Lỗi"), t("Không thể tạo lớp học. Vui lòng thử lại sau."));
      }
    } catch (error) {
      Alert.alert(
        t("Lỗi"),
        t("Đã xảy ra lỗi khi tạo lớp học. Vui lòng thử lại sau.")
      );
    }
  };
  const createAddressClass = async (classId: string) => {
    try {
      if (latitude && longitude) {
        await createAddress({
          classId: classId,
          fullAddress: address,
          latitude: latitude,
          longitude: longitude,
        });
      } else {
        Alert.alert(t("Lỗi"), t("Vui lòng lấy địa chỉ trước khi lưu thay đổi."));
        return;
      }
    } catch (error) {
      Alert.alert(t("Lỗi"), t("Không thể cập nhật thông tin. Vui lòng thử lại sau."));
    }
  };
  const handleAddressChange = (text: string) => {
    setAddress(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.length > 2) {
      debounceRef.current = setTimeout(async () => {
        setShowSuggestions(true);
        await fetchAddressAutoComplete(text);
      }, 400); // 400ms delay
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionPress = (item: AddressAutoComplete) => {
    setAddress(item.display_name);
    setShowSuggestions(false);
    setLatitude(item.lat ? parseFloat(item.lat) : null);
    setLongitude(item.lon ? parseFloat(item.lon) : null);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>{t("Đang tải...")}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title={t("Quay lại")}
          onPress={() => router.back()}
          style={styles.errorButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <Header title={t("Tạo lớp học mới")} showBack />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("Thông tin cơ bản")}</Text>

          <Input
            label={t("Tên lớp (Tiếng Việt)")}
            value={className_vi}
            onChangeText={setClassName_vi}
            placeholder={t("Nhập tên lớp học bằng tiếng Việt")}
            icon={<BookOpen size={20} color={colors.primary} />}
          />

          <Input
            label={t("Tên lớp (Tiếng Anh)")}
            value={className_en}
            onChangeText={setClassName_en}
            placeholder={t("Nhập tên lớp học bằng tiếng Anh")}
            icon={<BookOpen size={20} color={colors.primary} />}
          />

          <Text style={styles.label}>{t("Hình thức học")}</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                studyType === "offline" && styles.radioButtonSelected,
              ]}
              onPress={() => setStudyType("offline")}
            >
              <Text
                style={[
                  styles.radioButtonText,
                  studyType === "offline" && styles.radioButtonTextSelected,
                ]}
              >
                Trực tiếp
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.radioButton,
                studyType === "online" && styles.radioButtonSelected,
              ]}
              onPress={() => setStudyType("online")}
            >
              <Text
                style={[
                  styles.radioButtonText,
                  studyType === "online" && styles.radioButtonTextSelected,
                ]}
              >
                Trực tuyến
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Calendar size={20} color={colors.primary} />
            <Text style={styles.datePickerButtonText}>
              Ngày bắt đầu: {formatDate(startDate)}
            </Text>
          </TouchableOpacity>
          {/* Bọc Input và suggestion trong View có position: 'relative' để gợi ý nổi lên đúng */}
          <View style={{ position: "relative", zIndex: 100 }}>
            <Input
              label="Địa chỉ"
              value={address}
              onChangeText={handleAddressChange}
              placeholder={t("Nhập địa chỉ")}
              editable={true}
              textAlignVertical="top"
              autoComplete="off"
              autoCorrect={false}
              textContentType="none"
            />
            {showSuggestions && addressAutoComplete.length > 0 && (
              <View style={styles.suggestionAbsolute}>
                {addressAutoComplete.map(
                  (item: AddressAutoComplete, idx: number) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.suggestionItem}
                      onPress={() => handleSuggestionPress(item)}
                    >
                      <Text style={styles.suggestionText}>
                        {item.display_name}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            )}
          </View>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleStartDateChange}
              minimumDate={new Date()}
            />
          )}

          <Input
            label={t("Số buổi học")}
            value={sessions}
            onChangeText={setSessions}
            placeholder={t("Nhập số buổi học")}
            keyboardType="numeric"
            icon={<Calendar size={20} color={colors.primary} />}
          />

          <Input
            label={t("Học phí (VNĐ/giờ)")}
            value={tuitionFee}
            onChangeText={setTuitionFee}
            placeholder={t("Nhập học phí")}
            keyboardType="numeric"
            icon={<DollarSign size={20} color={colors.primary} />}
          />

          <Input
            label={t("Số học sinh tối đa")}
            value={maxStudents}
            onChangeText={setMaxStudents}
            placeholder={t("Nhập số học sinh tối đa")}
            keyboardType="numeric"
            icon={<Users size={20} color={colors.primary} />}
          />

          <Input
            label={t("Mô tả lớp học")}
            value={description}
            onChangeText={setDescription}
            placeholder={t("Nhập mô tả chi tiết về lớp học")}
            multiline
            numberOfLines={4}
            icon={<Info size={20} color={colors.primary} />}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("Lịch học hàng tuần")}</Text>

          <Text style={styles.label}>{t("Chọn ngày học trong tuần")}</Text>
          <View style={styles.weekdaysContainer}>
            {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day, index) => (
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
                    weekdays.includes(index) &&
                      styles.weekdayButtonTextSelected,
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
                Bắt đầu: {startTime.getHours().toString().padStart(2, "0")}:
                {startTime.getMinutes().toString().padStart(2, "0")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.timePicker}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Clock size={20} color={colors.primary} />
              <Text style={styles.timePickerText}>
                Kết thúc: {endTime.getHours().toString().padStart(2, "0")}:
                {endTime.getMinutes().toString().padStart(2, "0")}
              </Text>
            </TouchableOpacity>
          </View>

          {showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleStartTimeChange}
              is24Hour={true}
            />
          )}

          {showEndTimePicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleEndTimeChange}
              is24Hour={true}
            />
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={t("Tạo lớp học")}
            onPress={handleCreateClass}
            loading={isCreatingClass || isCreatingSchedule}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.md,
  },
  errorText: {
    fontSize: FONT_SIZE.md,
    color: colors.danger,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  errorButton: {
    marginTop: SPACING.md,
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
    fontWeight: "700",
    color: colors.text,
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: colors.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  radioButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: "center",
    marginHorizontal: SPACING.xs / 2,
  },
  radioButtonSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  radioButtonText: {
    fontSize: FONT_SIZE.sm,
    color: colors.text,
  },
  radioButtonTextSelected: {
    color: colors.primary,
    fontWeight: "600",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
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
  weekdaysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  weekdayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
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
    fontWeight: "600",
  },
  timePickersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timePicker: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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
  suggestionAbsolute: {
    position: "absolute",
    top: 70, // hoặc lớn hơn nếu Input có label
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 8,
    ...SHADOWS.small,
    zIndex: 20,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    fontSize: FONT_SIZE.md,
    color: colors.text,
  },
});
