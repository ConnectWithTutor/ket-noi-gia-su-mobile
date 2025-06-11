import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useStudentRequestStore } from "@/store/post-store";
import { useAuthStore } from "@/store/auth-store";
import { useSubjectStore } from "@/store/subjectStore";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/Colors";
import { BORDER_RADIUS, FONT_SIZE, SPACING } from "@/constants/Theme";
import { Users, BookOpen, DollarSign, MapPin, Clock, FileText } from "lucide-react-native";
import CustomAlertModal from "@/components/ui/AlertModal";
import Header from "@/components/ui/Header";

const STUDY_TYPES = [
  { id: "online", label: "Online" },
  { id: "offline", label: "Offline" },
  { id: "hybrid", label: "Hybrid" }
];

export default function EditStudentRequestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const requestId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { subjects, fetchSubjects } = useSubjectStore();
  const {
    fetchStudentRequestById,
    selectedRequest,
    updateStudentRequest,
    loading,
    error,
  } = useStudentRequestStore();

  const [formData, setFormData] = useState({
    title: "",
    subjectId: "",
    studyType: "offline",
    preferredSchedule: "",
    tuitionFee: "",
    location: "",
    description: "",
    studentCount: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertOptions, setAlertOptions] = useState<{ title?: string; message?: string; buttons?: any[] }>({});

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (requestId) {
      fetchStudentRequestById(requestId);
    }
  }, [requestId]);

  useEffect(() => {
    if (selectedRequest) {
      setFormData({
        title: selectedRequest.title || "",
        subjectId: selectedRequest.subjectId || "",
        studyType: selectedRequest.studyType || "offline",
        preferredSchedule: selectedRequest.preferredSchedule || "",
        tuitionFee: selectedRequest.tuitionFee || "",
        location: selectedRequest.location || "",
        description: selectedRequest.description || "",
        studentCount: selectedRequest.studentCount || 1,
      });
    }
  }, [selectedRequest]);

  const showAlert = (title: string, message: string, buttons?: any[]) => {
    setAlertOptions({ title, message, buttons });
    setAlertVisible(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) {
      newErrors.title = t("Vui lòng nhập tiêu đề");
    }
    if (!formData.description) {
      newErrors.description = t("Vui lòng nhập mô tả");
    }
    if (!formData.subjectId) {
      newErrors.subjectId = t("Vui lòng chọn môn học");
    }
    if (formData.studyType !== 'online' && !formData.location) {
      newErrors.location = t("Vui lòng nhập địa điểm");
    }
    if (!formData.preferredSchedule) {
      newErrors.preferredSchedule = t("Vui lòng nhập lịch học");
    }
    if (!formData.tuitionFee || isNaN(Number(formData.tuitionFee)) || Number(formData.tuitionFee) <= 0) {
      newErrors.tuitionFee = t("Vui lòng nhập học phí hợp lệ");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateFormData = (key: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    try {
      const success = await updateStudentRequest(requestId, {
        ...formData,
        studentCount: Number(formData.studentCount),
      });
      if (success) {
        showAlert(
          t("Thành công"),
          t("Cập nhật bài viết thành công!"),
          [
            {
              text: "OK",
              onPress: () => {
                setAlertVisible(false);
                router.back();
              },
            },
          ]
        );
      } else {
        showAlert(t("Lỗi"), t("Không thể cập nhật bài viết. Vui lòng thử lại sau."));
      }
    } catch (e) {
      showAlert(t("Lỗi"), t("Không thể cập nhật bài viết. Vui lòng thử lại sau."));
    }
  };

  if (loading && !selectedRequest) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 12 }}>{t("Đang tải...")}</Text>
      </View>
    );
  }

  if (error && !selectedRequest) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <Header title={t("Chỉnh sửa bài viết")} showBack />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formContainer}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>{t("Thông tin cơ bản")}</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t("Tiêu đề")}</Text>
              <View style={[styles.inputContainer, errors.title && styles.inputError]}>
                <FileText size={20} color={Colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t("Nhập tiêu đề bài đăng")}
                  value={formData.title}
                  onChangeText={(text) => updateFormData('title', text)}
                  maxLength={100}
                />
              </View>
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t("Môn học")}</Text>
              {subjects.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.subjectsContainer}
                >
                  {subjects.map((subject, index) => (
                    <TouchableOpacity
                      key={`${subject.subjectId}-${index}`}
                      style={[
                        styles.subjectChip,
                        formData.subjectId === subject.subjectId && styles.selectedSubjectChip
                      ]}
                      onPress={() => updateFormData('subjectId', subject.subjectId)}
                    >
                      <Text
                        style={[
                          styles.subjectChipText,
                          formData.subjectId === subject.subjectId && styles.selectedSubjectChipText
                        ]}
                      >
                        {subject.subjectName_vi}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.inputContainer}>
                  <BookOpen size={20} color={Colors.textLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={t("Nhập môn học (VD: Toán, Lý, Hóa...)")}
                    value={formData.subjectId}
                    onChangeText={(text) => updateFormData('subjectId', text)}
                  />
                </View>
              )}
              {errors.subjectId && <Text style={styles.errorText}>{errors.subjectId}</Text>}
            </View>
          </View>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>{t("Thông tin lớp học")}</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t("Hình thức học")}</Text>
              <View style={styles.optionsContainer}>
                {STUDY_TYPES.map(type => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.optionButton,
                      formData.studyType === type.id && styles.selectedOptionButton
                    ]}
                    onPress={() => updateFormData('studyType', type.id)}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        formData.studyType === type.id && styles.selectedOptionButtonText
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t("Số lượng học viên")}</Text>
              <View style={[styles.inputContainer, errors.studentCount && styles.inputError]}>
                <Users size={20} color={Colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t("Nhập số lượng học viên")}
                  value={formData.studentCount?.toString()}
                  onChangeText={(text) => {
                    const count = parseInt(text);
                    if (!isNaN(count) && count > 0) {
                      updateFormData('studentCount', count);
                    } else if (text === '') {
                      updateFormData('studentCount', 1);
                    }
                  }}
                  keyboardType="number-pad"
                />
              </View>
              {errors.studentCount && <Text style={styles.errorText}>{errors.studentCount}</Text>}
            </View>
            {formData.studyType !== 'online' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Địa điểm</Text>
                <View style={[styles.inputContainer, errors.location && styles.inputError]}>
                  <MapPin size={20} color={Colors.textLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={t("Nhập địa điểm học (VD: Quận 1, TP.HCM)")}
                    value={formData.location}
                    onChangeText={(text) => updateFormData('location', text)}
                  />
                </View>
                {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
              </View>
            )}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t("Lịch học")}</Text>
              <View style={[styles.inputContainer, errors.preferredSchedule && styles.inputError]}>
                <Clock size={20} color={Colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t("Nhập lịch học (VD: Thứ 2, 4, 6 (18:00 - 20:00))")}
                  value={formData.preferredSchedule}
                  onChangeText={(text) => updateFormData('preferredSchedule', text)}
                />
              </View>
              {errors.preferredSchedule && <Text style={styles.errorText}>{errors.preferredSchedule}</Text>}
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t("Học phí (VNĐ/giờ)")}</Text>
              <View style={[styles.inputContainer, errors.tuitionFee && styles.inputError]}>
                <DollarSign size={20} color={Colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t("Nhập học phí (VD: 200000)")}
                  value={formData.tuitionFee}
                  onChangeText={(text) => {
                    const fee = text.replace(/[^0-9]/g, '');
                    updateFormData('tuitionFee', fee);
                  }}
                  keyboardType="number-pad"
                />
              </View>
              {errors.tuitionFee && <Text style={styles.errorText}>{errors.tuitionFee}</Text>}
            </View>
          </View>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>{t("Mô tả chi tiết")}</Text>
            <View style={styles.formGroup}>
              <View style={[
                styles.textAreaContainer,
                errors.description && styles.inputError
              ]}>
                <TextInput
                  style={styles.textArea}
                  placeholder={t("Nhập mô tả chi tiết về yêu cầu lớp học...")}
                  value={formData.description}
                  onChangeText={(text) => updateFormData('description', text)}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>
          </View>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>{t("Cập nhật")}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelText}>{t("Hủy")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <CustomAlertModal
        visible={alertVisible}
        title={alertOptions.title}
        message={alertOptions.message}
        onClose={() => setAlertVisible(false)}
        buttons={alertOptions.buttons}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 40,
  },
  formContainer: {
    marginBottom: SPACING.xl,
  },
  formSection: {
    backgroundColor: Colors.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: SPACING.md,
    color: Colors.text,
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: Colors.background,
  },
  inputIcon: {
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: FONT_SIZE.md,
    color: Colors.text,
  },
  inputError: {
    borderColor: Colors.error,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: Colors.background,
    padding: SPACING.sm,
  },
  textArea: {
    fontSize: FONT_SIZE.md,
    color: Colors.text,
    minHeight: 100,
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    color: Colors.error,
    marginTop: SPACING.xs,
    marginLeft: 4,
  },
  subjectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 8,
  },
  subjectChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedSubjectChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  subjectChipText: {
    color: Colors.primary,
    fontSize: 14,
  },
  selectedSubjectChipText: {
    color: "white",
    fontWeight: "500",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: Colors.background,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedOptionButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionButtonText: {
    color: Colors.text,
    fontWeight: "500",
  },
  selectedOptionButtonText: {
    color: "white",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: BORDER_RADIUS.md,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.md,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "white",
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  cancelButton: {
    alignItems: 'center',
    padding: SPACING.md,
  },
  cancelText: {
    fontSize: FONT_SIZE.md,
    color: Colors.textSecondary,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});