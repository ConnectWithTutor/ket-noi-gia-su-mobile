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
import {getCurrentAddress} from "@/hooks/useCurrentAddress";
import DatePicker from "@/components/ui/DatePickerInput";
import { useAddressStore } from "@/store/address-store";
export default function PersonalInfoScreen() {
  const router = useRouter();
  const { user, updateUser, isLoading } = useAuthStore();
  const { createAddress,updateAddress,fetchAddressById } = useAddressStore();
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    birthDate: user?.birthDate || "",
    address: user?.address || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    triggerHaptic('medium');
    
    try {
      if(latitude && longitude)
      {
        await updateUser(formData);
        if (user?.userId) {
          const addressUser = await fetchAddressById(user.userId);
            if (addressUser && Array.isArray(addressUser) && addressUser.length > 0) {
            await updateAddress(
              user.userId,
              {
                ...addressUser,
                fullAddress: formData.address,
                latitude: latitude,
                longitude: longitude,
              }
            );
          } else {
            await createAddress({
              userId: user.userId,
              fullAddress: formData.address,
              latitude: latitude,
              longitude: longitude,
            });
          }
        Alert.alert("Thành công", "Thông tin cá nhân đã được cập nhật");
        }
      
        else {
          Alert.alert("Lỗi", "Không tìm thấy người dùng. Vui lòng đăng nhập lại.");
          return;
        }
      }
      else {
        Alert.alert("Lỗi", "Vui lòng lấy địa chỉ trước khi lưu thay đổi.");
        return;
      }
      router.back();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin. Vui lòng thử lại sau.");
    }
  };
  const handleGetAddress = async () => {
    triggerHaptic('medium');
    try {
      const address = await getCurrentAddress();
      if (address) {
         setFormData((prev) => ({
      ...prev,
      address: address.fullAddress,
      }));
        setLatitude(address.latitude);
        setLongitude(address.longitude);
        Alert.alert("Thành công", "Địa chỉ đã được cập nhật");

      }
      else {
        Alert.alert("Lỗi", "Không thể lấy địa chỉ mới. Vui lòng thử lại sau.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lấy địa chỉ mới. Vui lòng thử lại sau.");
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
            {user?.avatarUrl ? (
              <TouchableOpacity style={styles.avatarImage}>
                <Image 
                  src={user.avatarUrl } 
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
                  {user?.fullName?.charAt(0) || "U"}
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
            value={formData.fullName}
            onChangeText={(text) => handleChange("fullName", text)}
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
            value={formData.phoneNumber}
            onChangeText={(text) => handleChange("phoneNumber", text)}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
            containerStyle={styles.inputContainer}
          />
           <DatePicker
              value={formData.birthDate}
              onChange={(value) => handleChange('birthDate', value)}
            />

          <Input
            label="Địa chỉ"
            value={formData.address}
            onChangeText={(text) => handleChange("address", text)}
            placeholder="Nhập địa chỉ"
            editable={false}
            containerStyle={styles.inputContainer}
            textAlignVertical="top"
            
          />
          <Button
            title="Lấy địa chỉ mới"
            onPress={() => handleGetAddress()}
            style={styles.saveButton}
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
    textAlignVertical: "top",
  },
  saveButton: {
    marginTop: SPACING.md,
  }
  
});