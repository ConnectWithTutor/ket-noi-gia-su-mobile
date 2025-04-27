import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { Mail, Lock, User, Facebook } from "lucide-react-native";

import colors from "@/constants/Colors";
import { FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/Theme";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import AuthHeader from "@/components/auth/AuthHeader";
import SocialButton from "@/components/auth/SocialButton";
import { useAuthStore } from "@/store/auth-store";
import { triggerHaptic } from "@/utils/haptics";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState("");

  const handleLogin = async () => {
    triggerHaptic('medium');
    
    if (!phone || !password) {
      setFormError("Vui lòng nhập số điện thoại và mật khẩu");
      return;
    }
    
    try {
      await login(phone, password);
      router.replace("/(app)/(tabs)/home");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleGoogleLogin = () => {
    triggerHaptic('light');
    // Implement Google login
  };

  const handleFacebookLogin = () => {
    triggerHaptic('light');
    // Implement Facebook login
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Kết Nối Gia Sư</Text>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
          
          <Input
            placeholder="Số điện thoại"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            icon={<User size={20} color={colors.textSecondary} />}
            error={formError && !phone ? "Vui lòng nhập số điện thoại" : ""}
          />
          
          <Input
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<Lock size={20} color={colors.textSecondary} />}
            error={formError && !password ? "Vui lòng nhập mật khẩu" : ""}
          />
          
          <View style={styles.optionsContainer}>
            <Checkbox
              checked={rememberMe}
              onToggle={() => setRememberMe(!rememberMe)}
              label="Ghi nhớ đăng nhập"
            />
            
            <Link href="/forgot-password" asChild>
              <TouchableOpacity>
          <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          {error && <Text style={styles.errorText}>{error}</Text>}
          
          <Button
            title="Đăng nhập"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
          />
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Chưa có tài khoản? </Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
          <Text style={styles.registerLink}>Tạo tài khoản</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Hoặc</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <SocialButton
            title="Đăng nhập với Google"
            icon={<Mail size={20} color={colors.danger} />}
            onPress={handleGoogleLogin}
          />
          
          <SocialButton
            title="Đăng nhập với Facebook"
            icon={<Facebook size={20} color="#1877F2" />}
            onPress={handleFacebookLogin}
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
  illustration: {
    width: "100%",
    height: 150,
    marginBottom: SPACING.lg,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  forgotPassword: {
    color: colors.primary,
    fontSize: FONT_SIZE.sm,
  },
  errorText: {
    color: colors.danger,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SPACING.md,
  },
  registerText: {
    color: colors.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  registerLink: {
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
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
});