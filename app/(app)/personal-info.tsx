import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import { ChevronLeft, Camera } from "lucide-react-native";

import colors from "@/constants/Colors";
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from "@/constants/Theme";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth-store";
import { triggerHaptic } from "@/utils/haptics";
import Header from "@/components/ui/Header";
import StatusBar from "@/components/ui/StatusBar";

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { user, updateUser, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    triggerHaptic('medium');
    
    try {
      await updateUser(formData);
      Alert.alert("Thành công", "Thông tin cá nhân đã được cập nhật");
      router.back();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin. Vui lòng thử lại sau.");
    }
  };

  return (
    <View style={styles.container}>
        <StatusBar backgroundColor={colors.primary} />
        <Header title="Thông tin cá nhân" showBack />
      <Stack.Screen 
        options={{
          title: "Thông tin cá nhân",
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => {
                triggerHaptic('light');
                router.back();
              }}
              style={styles.backButton}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {user?.avatar ? (
              <TouchableOpacity style={styles.avatarImage}>
                <Image 
                  src={user.avatar} 
                  alt="User avatar" 
                  style={{ width: '100%', height: '100%', borderRadius: 60 }} 
                />
                <View style={styles.cameraButton}>
                  <Camera size={20} color={colors.white} />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>
                  {user?.name?.charAt(0) || "U"}
                </Text>
                <View style={styles.cameraButton}>
                  <Camera size={20} color={colors.white} />
                </View>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.changePhotoText}>Thay đổi ảnh đại diện</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Input
            label="Họ và tên"
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
            placeholder="Nhập họ và tên"
            containerStyle={styles.inputContainer}
          />
          
          <Input
            label="Email"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            placeholder="Nhập email"
            keyboardType="email-address"
            containerStyle={styles.inputContainer}
          />
          
          <Input
            label="Số điện thoại"
            value={formData.phone}
            onChangeText={(text) => handleChange("phone", text)}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
            containerStyle={styles.inputContainer}
          />
          
          <Input
            label="Giới thiệu bản thân"
            value={formData.bio}
            onChangeText={(text) => handleChange("bio", text)}
            placeholder="Nhập giới thiệu bản thân"
            multiline
            numberOfLines={4}
            containerStyle={styles.inputContainer}
          />
          
          <Button
            title="Lưu thay đổi"
            onPress={handleSubmit}
            style={styles.saveButton}
            loading={isLoading}
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
  backButton: {
    padding: SPACING.xs,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: SPACING.sm,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarPlaceholderText: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: "bold",
    color: colors.white,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  changePhotoText: {
    fontSize: FONT_SIZE.md,
    color: colors.primary,
    fontWeight: "medium",
    marginTop: SPACING.sm,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    marginTop: SPACING.md,
  },
});