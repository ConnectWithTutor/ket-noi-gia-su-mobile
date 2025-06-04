import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useComplaintStore } from "@/store/complaint-store";
import { useRouter } from "expo-router";
import Header from "@/components/ui/Header";
import colors from "@/constants/Colors";
import { ScrollView } from "react-native-gesture-handler";
import { useAuthStore } from "@/store/auth-store";
import { ComplaintStatus } from "@/types/complaint";
import { useTranslation } from "react-i18next";
const CreateComplaintScreen = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [complaintTypeId, setComplaintTypeId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { createComplaint, fetchComplaintTypes,fetchComplaints, complaintTypes } = useComplaintStore();
  const router = useRouter();
    const { user } = useAuthStore();
    const { t } = useTranslation(); 
  useEffect(() => {
    fetchComplaintTypes();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !complaintTypeId) {
      Alert.alert(t("Lỗi"), t("Vui lòng nhập đầy đủ thông tin."));
      return;
    }
    setLoading(true);
    try {
      await createComplaint({ userId: user?.userId, title, content, complaintTypeId, status: ComplaintStatus.Pending });
      await fetchComplaints(); // Refresh complaints list
      Alert.alert(t("Thành công"), t("Khiếu nại đã được gửi."));
      router.back();
    } catch (error) {
      Alert.alert(t("Lỗi"), t("Không thể gửi khiếu nại. Vui lòng thử lại."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={t("Tạo khiếu nại")} showBack />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.label}>{t("Loại khiếu nại")}</Text>
        <View style={styles.pickerWrapper}>
            <Picker
            selectedValue={complaintTypeId}
            onValueChange={(itemValue) => setComplaintTypeId(itemValue)}
            style={styles.picker}
            >
            <Picker.Item label={t("Chọn loại khiếu nại")} value=""  />
            {complaintTypes.map((type) => (
                <Picker.Item
                key={type.complaintTypeId}
                label={type.name}
                value={type.complaintTypeId}
                />
            ))}
            </Picker>
            {complaintTypeId && (
            <Text style={styles.pickerDesc}>
                {complaintTypes.find((t) => t.complaintTypeId === complaintTypeId)?.description}
            </Text>
            )}
        </View>
        <Text style={styles.label}>{t("Tiêu đề")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("Nhập tiêu đề khiếu nại")}
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.label}>{t("Nội dung")}</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder={t("Nhập nội dung khiếu nại")}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? t("Đang gửi...") : t("Gửi khiếu nại")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
export default CreateComplaintScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  label: {
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 4,
    color: colors.text,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  picker: {
    height: 52,
    width: "100%",
  },
  pickerDesc: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    marginLeft: 8,
  },
});