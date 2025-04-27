import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Mail } from "lucide-react-native";

import colors from "@/constants/Colors";
import { FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/Theme";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthHeader from "@/components/auth/AuthHeader";
import { triggerHaptic } from "@/utils/haptics";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    triggerHaptic('medium');
    
    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email không hợp lệ");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (error) {
      setError("Không thể gửi email khôi phục. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <AuthHeader title="Kết Nối Gia Sư" />
        
        <View style={styles.formContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.title}>Quên mật khẩu</Text>
          
          {!success ? (
            <>
              <Text style={styles.description}>
                Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn để đặt lại mật khẩu.
              </Text>
              
              <Input
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                icon={<Mail size={20} color={colors.textSecondary} />}
                error={error}
              />
              
              <Button
                title="Gửi hướng dẫn"
                onPress={handleResetPassword}
                loading={isLoading}
                fullWidth
                style={styles.button}
              />
            </>
          ) : (
            <>
              <Text style={styles.successText}>
                Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu đến {email}. Vui lòng kiểm tra hộp thư của bạn.
              </Text>
              
              <Button
                title="Quay lại đăng nhập"
                onPress={() => router.replace("/")}
                variant="outline"
                fullWidth
                style={styles.button}
              />
            </>
          )}
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
  backButton: {
    alignSelf: "flex-start",
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  button: {
    marginTop: SPACING.md,
  },
  successText: {
    fontSize: FONT_SIZE.md,
    color: colors.success,
    marginBottom: SPACING.lg,
    textAlign: "center",
    lineHeight: 22,
  },
});