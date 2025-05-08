import React, { useEffect, useState } from "react";
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
import { useRoleStore } from "@/store/roleStore";
import { triggerHaptic } from "@/utils/haptics";

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const { roles, loading: rolesLoading, error: rolesError, fetchRoles } = useRoleStore();
  
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [usernameError, setUsernameError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  useEffect(() => {
    // Clear any previous errors when component mounts
    clearError();
    // Fetch roles
    fetchRoles();
  }, []);

 
  const validateUsername = () => {
    if (!username) {
      setUsernameError("Tên đăng nhập là bắt buộc");
      return false;
    } else if (username.length < 3) {
      setUsernameError("Tên đăng nhập phải có ít nhất 3 ký tự");
      return false;
    }
    setUsernameError("");
    return true;
  };

  const validateFullName = () => {
    if (!fullName) {
      setFullNameError("Họ và tên là bắt buộc");
      return false;
    } else if (fullName.length < 2) {
      setFullNameError("Họ và tên phải có ít nhất 2 ký tự");
      return false;
    }
    setFullNameError("");
    return true;
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email là bắt buộc");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Vui lòng nhập email hợp lệ");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePhone = () => {
    if (!phoneNumber) {
      setPhoneError("Số điện thoại là bắt buộc");
      return false;
    } else if (phoneNumber.length < 10) {
      setPhoneError("Vui lòng nhập số điện thoại hợp lệ");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError("Vui lòng xác nhận mật khẩu");
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Mật khẩu không khớp");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Mật khẩu là bắt buộc");
      return false;
    } else if (password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateRole = () => {
    if (!selectedRoleId) {
      setRoleError("Vui lòng chọn vai trò");
      return false;
    }
    setRoleError("");
    return true;
  };

  const handleRegister = async () => {
    triggerHaptic('medium');
    
    const isUsernameValid = validateUsername();
    const isFullNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isPasswordValid = validatePassword();
    const isRoleValid = validateRole();
    if (!isUsernameValid || !isFullNameValid || !isEmailValid || !isPhoneValid || !isPasswordValid || !isRoleValid) {
      return;
    }
    
    try {
      await register({
        username,
        fullName,
        email,
        phoneNumber,
        password,
        roleId: selectedRoleId
      });
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
            placeholder="Tên đăng nhập"
            value={username}
            onChangeText={setUsername}
            icon={<User size={20} color={colors.textSecondary} />}
            error={usernameError}
          />
          <Input
            placeholder="Họ và tên"
            value={fullName}
            onChangeText={setFullName}
            icon={<User size={20} color={colors.textSecondary} />}
            error={fullNameError}
          />
          
          <Input
            placeholder="Số điện thoại"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            icon={<Phone size={20} color={colors.textSecondary} />}
            error={phoneError}
          />
          
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Mail size={20} color={colors.textSecondary} />}
            error={emailError}
          />
          
          <Input
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<Lock size={20} color={colors.textSecondary} />}
            error={passwordError}
          />
          
          <Input
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            icon={<Lock size={20} color={colors.textSecondary} />}
            error={confirmPasswordError}
          />
          <View style={styles.optionContainer}>
            <Text style={styles.optionLabel}>Vai trò</Text>
            <View style={styles.optionGroup}>
            {roles.map(role => (
              <RadioButton
                key={role.roleId}
                selected={role.roleId === selectedRoleId}
                onSelect={() => setSelectedRoleId(role.roleId)}
                label={role.roleName}
                style={styles.radioButton}
              />
            ))}
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