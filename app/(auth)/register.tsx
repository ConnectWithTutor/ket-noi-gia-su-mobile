import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { Mail, Lock, User, Phone, Facebook } from "lucide-react-native";

import colors from "@/constants/Colors";
import { FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/Theme";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import RadioButton from "@/components/ui/RadioButton";
import AuthHeader from "@/components/auth/AuthHeader";
import SocialButton from "@/components/auth/SocialButton";
import { useAuthStore } from "@/store/auth-store";
import { UserRole } from "@/types/user";
import { triggerHaptic } from "@/utils/haptics";

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [role, setRole] = useState<UserRole>("student");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!name) errors.name = "Vui lòng nhập họ tên";
    if (!phone) errors.phone = "Vui lòng nhập số điện thoại";
    if (!email) errors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email không hợp lệ";
    
    if (!password) errors.password = "Vui lòng nhập mật khẩu";
    else if (password.length < 6) errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    
    if (!confirmPassword) errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    else if (password !== confirmPassword) errors.confirmPassword = "Mật khẩu không khớp";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    triggerHaptic('medium');
    
    if (!validateForm()) return;
    
    try {
      await register(name, phone, email, password, role);
      router.replace("/(app)/(tabs)/home");
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  const handleGoogleRegister = () => {
    triggerHaptic('light');
    // Implement Google registration
  };

  const handleFacebookRegister = () => {
    triggerHaptic('light');
    // Implement Facebook registration
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <AuthHeader title="Kết Nối Gia Sư" />
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Đăng ký</Text>
          
          <Input
            placeholder="Họ và tên"
            value={name}
            onChangeText={setName}
            icon={<User size={20} color={colors.textSecondary} />}
            error={formErrors.name}
          />
          
          <Input
            placeholder="Số điện thoại"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            icon={<Phone size={20} color={colors.textSecondary} />}
            error={formErrors.phone}
          />
          
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Mail size={20} color={colors.textSecondary} />}
            error={formErrors.email}
          />
          
          <Input
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<Lock size={20} color={colors.textSecondary} />}
            error={formErrors.password}
          />
          
          <Input
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            icon={<Lock size={20} color={colors.textSecondary} />}
            error={formErrors.confirmPassword}
          />
          
          <View style={styles.optionContainer}>
            <Text style={styles.optionLabel}>Giới tính</Text>
            <View style={styles.optionGroup}>
              <RadioButton
                selected={gender === "male"}
                onSelect={() => setGender("male")}
                label="Nam"
                style={styles.radioButton}
              />
              <RadioButton
                selected={gender === "female"}
                onSelect={() => setGender("female")}
                label="Nữ"
                style={styles.radioButton}
              />
            </View>
          </View>
          
          <View style={styles.optionContainer}>
            <Text style={styles.optionLabel}>Vai trò</Text>
            <View style={styles.optionGroup}>
              <RadioButton
                selected={role === "tutor"}
                onSelect={() => setRole("tutor")}
                label="Gia sư"
                style={styles.radioButton}
              />
              <RadioButton
                selected={role === "student"}
                onSelect={() => setRole("student")}
                label="Học viên"
                style={styles.radioButton}
              />
            </View>
          </View>
          
          {error && <Text style={styles.errorText}>{error}</Text>}
          
          <Button
            title="Đăng ký"
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
          />
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Đã có tài khoản? </Text>
            <Link href="/" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Đăng nhập</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Hoặc</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <SocialButton
            title="Đăng ký với Google"
            icon={<Mail size={20} color={colors.danger} />}
            onPress={handleGoogleRegister}
          />
          
          <SocialButton
            title="Đăng ký với Facebook"
            icon={<Facebook size={20} color="#1877F2" />}
            onPress={handleFacebookRegister}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: SPACING.lg,
    width: "100%",
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 700,
    color: colors.text,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  optionContainer: {
    marginBottom: SPACING.md,
  },
  optionLabel: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: SPACING.xs,
  },
  optionGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    marginRight: SPACING.lg,
  },
  errorText: {
    color: colors.danger,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SPACING.md,
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  loginLink: {
    color: colors.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: 600,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textSecondary,
    paddingHorizontal: SPACING.sm,
    fontSize: FONT_SIZE.sm,
  },
});