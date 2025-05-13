import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { BookOpen, DollarSign, MapPin, Users, Clock, FileText } from "lucide-react-native";

import Colors from "@/constants/Colors";
import { BORDER_RADIUS, FONT_SIZE, SPACING } from "@/constants/Theme";
import { useStudentRequestStore } from "@/store/post-store";
import { useAuthStore } from "@/store/auth-store";
import { useSubjectStore } from "@/store/subjectStore";
import { StudentRequestCreateRequest } from "@/types";
import { triggerHaptic } from "@/utils/haptics";
import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/ui/Header";

const STUDY_TYPES = [
  { id: "online", label: "Online" },
  { id: "offline", label: "Offline" },
  { id: "hybrid", label: "Hybrid" }
];

export default function CreateStudentRequestScreen() {
  const router = useRouter();
  const { createStudentRequest, loading } = useStudentRequestStore();
  const { user } = useAuthStore();
  const { subjects, fetchSubjects } = useSubjectStore();
  
  const [formData, setFormData] = useState<Partial<StudentRequestCreateRequest>>({
    subjectId: '',
    studyType: 'offline',
    preferredSchedule: '',
    tuitionFee: '',
    location: '',
    description: '',
    title: '',
    studentCount: 1,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    fetchSubjects();
  }, []);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) {
      newErrors.title = "Vui lòng nhập tiêu đề";
    }
    
    if (!formData.description) {
      newErrors.description = "Vui lòng nhập mô tả";
    }
    
    if (!formData.subjectId) {
      newErrors.subjectId = "Vui lòng chọn môn học";
    }
    
    if (formData.studyType !== 'online' && !formData.location) {
      newErrors.location = "Vui lòng nhập địa điểm";
    }
    
    if (!formData.preferredSchedule) {
      newErrors.preferredSchedule = "Vui lòng nhập lịch học";
    }
    
    if (!formData.tuitionFee || isNaN(Number(formData.tuitionFee)) || Number(formData.tuitionFee) <= 0) {
      newErrors.tuitionFee = "Vui lòng nhập học phí hợp lệ";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    triggerHaptic('medium');
    
    if (!validateForm()) return;
    
    try {
      if (!user) {
        Alert.alert("Lỗi", "Bạn cần đăng nhập để đăng bài.");
        return;
      }
      const requestData = {
        ...formData,
        studentId: user.userId,
        location: formData.studyType === 'online' ? 'Online' : formData.location,
        studentCount: Number(formData.studentCount),
      } as StudentRequestCreateRequest;
      const success = await createStudentRequest(requestData);
      
      if (success) {
        Alert.alert(
          "Thành công",
          "Đăng bài thành công!",
          [
            {
              text: "OK",
              onPress: () => router.push("(app)/(tabs)/posts" as any),
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đăng bài. Vui lòng thử lại sau.");
    }
  };
  
  const updateFormData = (key: keyof StudentRequestCreateRequest, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  return (
    
    <AuthGuard>
      <Stack.Screen 
        options={{
          title: "Đăng bài tìm gia sư",
          headerTitleAlign: "center",
        }}
      />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
          <Header title="Đăng bài tìm gia sư"  showBack/>
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
        
          <View style={styles.formContainer}>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Tiêu đề</Text>
                <View style={[styles.inputContainer, errors.title && styles.inputError]}>
                  <FileText size={20} color={Colors.textLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập tiêu đề bài đăng"
                    value={formData.title}
                    onChangeText={(text) => updateFormData('title', text)}
                    maxLength={100}
                  />
                </View>
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Môn họcs</Text>
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
                          { subject.subjectName_vi }
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <View style={styles.inputContainer}>
                    <BookOpen size={20} color={Colors.textLight} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập môn học (VD: Toán, Lý, Hóa...)"
                      value={formData.subjectId}
                      onChangeText={(text) => updateFormData('subjectId', text)}
                    />
                    
                  </View>
                )}
                {errors.subjectId && <Text style={styles.errorText}>{errors.subjectId}</Text>}
              </View>
            </View>
            
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Thông tin lớp học</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Hình thức học</Text>
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
                <Text style={styles.label}>Số lượng học viên</Text>
                <View style={[styles.inputContainer, errors.studentCount && styles.inputError]}>
                  <Users size={20} color={Colors.textLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập số lượng học viên"
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
                      placeholder="Nhập địa điểm học (VD: Quận 1, TP.HCM)"
                      value={formData.location}
                      onChangeText={(text) => updateFormData('location', text)}
                    />
                  </View>
                  {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
                </View>
              )}
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Lịch học</Text>
                <View style={[styles.inputContainer, errors.preferredSchedule && styles.inputError]}>
                  <Clock size={20} color={Colors.textLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập lịch học (VD: Thứ 2, 4, 6 (18:00 - 20:00))"
                    value={formData.preferredSchedule}
                    onChangeText={(text) => updateFormData('preferredSchedule', text)}
                  />
                </View>
                {errors.preferredSchedule && <Text style={styles.errorText}>{errors.preferredSchedule}</Text>}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Học phí (VNĐ/giờ)</Text>
                <View style={[styles.inputContainer, errors.tuitionFee && styles.inputError]}>
                  <DollarSign size={20} color={Colors.textLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập học phí (VD: 200000)"
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
              <Text style={styles.sectionTitle}>Mô tả chi tiết</Text>
              
              <View style={styles.formGroup}>
                <View style={[
                  styles.textAreaContainer, 
                  errors.description && styles.inputError
                ]}>
                  <TextInput
                    style={styles.textArea}
                    placeholder="Nhập mô tả chi tiết về yêu cầu lớp học..."
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
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Đăng bài</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => router.back()}
            >
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthGuard>
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
});