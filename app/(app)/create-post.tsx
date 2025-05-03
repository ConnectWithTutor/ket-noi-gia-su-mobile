import React, { useState } from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useRouter } from "expo-router";
import { BookOpen, DollarSign, MapPin, Users, Clock, FileText } from "lucide-react-native";

import colors from "@/constants/Colors";
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/Theme";
import StatusBar from "@/components/ui/StatusBar";
import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";
import { usePostStore } from "@/store/post-store";
import { useAuthStore } from "@/store/auth-store";
import { PostFormData } from "@/types/post";
import { triggerHaptic } from "@/utils/haptics";

export default function CreatePostScreen() {
  const router = useRouter();
  const { createPost, isLoading } = usePostStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    description: '',
    subject: '',
    studentCount: 1,
    location: '',
    tuitionFee: 0,
    schedule: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) {
      newErrors.title = "Vui lòng nhập tiêu đề";
    }
    
    if (!formData.description) {
      newErrors.description = "Vui lòng nhập mô tả";
    }
    
    if (!formData.subject) {
      newErrors.subject = "Vui lòng nhập môn học";
    }
    
    if (!formData.location) {
      newErrors.location = "Vui lòng nhập địa điểm";
    }
    
    if (!formData.schedule) {
      newErrors.schedule = "Vui lòng nhập lịch học";
    }
    
    if (formData.tuitionFee <= 0) {
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
      
      await createPost(
        formData,
        user.id,
        user.name,
        user.avatar
      );
      
      Alert.alert(
        "Thành công",
        "Đăng bài thành công!",
        [
          {
            text: "OK",
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đăng bài. Vui lòng thử lại sau.");
    }
  };
  
  const updateFormData = (key: keyof PostFormData, value: any) => {
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
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <Header title="Đăng bài" showBack />
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Tiêu đề</Text>
              <View style={[styles.inputContainer, errors.title && styles.inputError]}>
                <FileText size={20} color={colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập tiêu đề bài đăng"
                  value={formData.title}
                  onChangeText={(text) => updateFormData('title', text)}
                />
              </View>
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Môn học</Text>
              <View style={[styles.inputContainer, errors.subject && styles.inputError]}>
                <BookOpen size={20} color={colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập môn học (VD: Toán, Lý, Hóa...)"
                  value={formData.subject}
                  onChangeText={(text) => updateFormData('subject', text)}
                />
              </View>
              {errors.subject && <Text style={styles.errorText}>{errors.subject}</Text>}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Số lượng học viên</Text>
              <View style={[styles.inputContainer, errors.studentCount && styles.inputError]}>
                <Users size={20} color={colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập số lượng học viên"
                  value={formData.studentCount.toString()}
                  onChangeText={(text) => {
                    const count = parseInt(text);
                    if (!isNaN(count) && count > 0) {
                      updateFormData('studentCount', count);
                    } else if (text === '') {
                      updateFormData('studentCount', 0);
                    }
                  }}
                  keyboardType="number-pad"
                />
              </View>
              {errors.studentCount && <Text style={styles.errorText}>{errors.studentCount}</Text>}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Địa điểm</Text>
              <View style={[styles.inputContainer, errors.location && styles.inputError]}>
                <MapPin size={20} color={colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập địa điểm học (VD: Quận 1, TP.HCM)"
                  value={formData.location}
                  onChangeText={(text) => updateFormData('location', text)}
                />
              </View>
              {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Lịch học</Text>
              <View style={[styles.inputContainer, errors.schedule && styles.inputError]}>
                <Clock size={20} color={colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập lịch học (VD: Thứ 2, 4, 6 (18:00 - 20:00))"
                  value={formData.schedule}
                  onChangeText={(text) => updateFormData('schedule', text)}
                />
              </View>
              {errors.schedule && <Text style={styles.errorText}>{errors.schedule}</Text>}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Học phí (VNĐ/giờ)</Text>
              <View style={[styles.inputContainer, errors.tuitionFee && styles.inputError]}>
                <DollarSign size={20} color={colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập học phí (VD: 200000)"
                  value={formData.tuitionFee > 0 ? formData.tuitionFee.toString() : ''}
                  onChangeText={(text) => {
                    const fee = parseInt(text.replace(/[^0-9]/g, ''));
                    if (!isNaN(fee)) {
                      updateFormData('tuitionFee', fee);
                    } else if (text === '') {
                      updateFormData('tuitionFee', 0);
                    }
                  }}
                  keyboardType="number-pad"
                />
              </View>
              {errors.tuitionFee && <Text style={styles.errorText}>{errors.tuitionFee}</Text>}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Mô tả chi tiết</Text>
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
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Yêu cầu (không bắt buộc)</Text>
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Nhập yêu cầu đối với gia sư (nếu có)..."
                  value={formData.requirements}
                  onChangeText={(text) => updateFormData('requirements', text)}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
            
            <Button
              title="Đăng bài"
              onPress={handleSubmit}
              loading={isLoading}
              fullWidth
              style={styles.submitButton}
            />
            
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => router.back()}
            >
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  inputError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: colors.text,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
  },
  textArea: {
    fontSize: FONT_SIZE.md,
    color: colors.text,
    minHeight: 100,
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    color: colors.danger,
    marginTop: SPACING.xs,
  },
  submitButton: {
    marginTop: SPACING.md,
  },
  cancelButton: {
    alignItems: 'center',
    padding: SPACING.md,
  },
  cancelText: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
});