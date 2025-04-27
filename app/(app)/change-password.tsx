import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Lock } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import colors from "@/constants/Colors";
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from "@/constants/Theme";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import StatusBar from "@/components/ui/StatusBar";
import Header from "@/components/ui/Header";
import { useAuthStore } from "@/store/auth-store";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { changePassword, isLoading } = useAuthStore();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }
    
    if (!newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChangePassword = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!validateForm()) return;
    
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      
      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Close modal after delay
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error) {
      setErrors({
        ...errors,
        general: "Không thể đổi mật khẩu. Vui lòng kiểm tra mật khẩu hiện tại.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <Header title="Đổi mật khẩu" showBack />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          {success ? (
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>Thành công!</Text>
              <Text style={styles.successMessage}>
                Mật khẩu của bạn đã được cập nhật thành công.
              </Text>
            </View>
          ) : (
            <>
              <Input
                label="Mật khẩu hiện tại"
                placeholder="Nhập mật khẩu hiện tại"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                icon={<Lock size={20} color={colors.textSecondary} />}
                error={errors.currentPassword}
              />
              
              <Input
                label="Mật khẩu mới"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                icon={<Lock size={20} color={colors.textSecondary} />}
                error={errors.newPassword}
              />
              
              <Input
                label="Xác nhận mật khẩu mới"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                icon={<Lock size={20} color={colors.textSecondary} />}
                error={errors.confirmPassword}
              />
              
              {errors.general && (
                <Text style={styles.generalError}>{errors.general}</Text>
              )}
              
              <Button
                title="Cập nhật"
                onPress={handleChangePassword}
                loading={isLoading}
                fullWidth
                style={styles.updateButton}
              />
              
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => router.back()}
              >
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  updateButton: {
    marginTop: SPACING.md,
  },
  cancelButton: {
    marginTop: SPACING.md,
    alignItems: "center",
  },
  cancelText: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
  generalError: {
    color: colors.danger,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  successContainer: {
    alignItems: "center",
    padding: SPACING.lg,
  },
  successTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
    color: colors.success,
    marginBottom: SPACING.md,
  },
  successMessage: {
    fontSize: FONT_SIZE.md,
    color: colors.text,
    textAlign: "center",
    lineHeight: 22,
  },
});