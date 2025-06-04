import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useUserProfileStore } from "@/store/profile-store";
import colors from "@/constants/Colors";
import { FONT_SIZE, SPACING } from "@/constants/Theme";
import { StudentProfileUpdateRequest } from "@/types";
import { useTranslation } from "react-i18next";

export default function EditStudentProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    profileStudent,
    loading,
    error,
    getProfileStudentById,
    updateProfileStudent,
  } = useUserProfileStore();
  const { t } = useTranslation();
  const [gradeLevel, setGradeLevel] = useState("");
  const [learningGoals, setLearningGoals] = useState("");
  const [preferredStudyTime, setPreferredStudyTime] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (id) {
      getProfileStudentById(id);
    }
  }, [id]);
  useEffect(() => {
    if (profileStudent) {
      setGradeLevel(profileStudent.gradeLevel || "");
      setLearningGoals(profileStudent.learningGoals || "");
      setPreferredStudyTime(profileStudent.preferredStudyTime || "");
      setDescription(profileStudent.description || "");
    }
  }, [profileStudent]);

  const handleUpdate = async () => {
    if (!gradeLevel.trim()) {
      Alert.alert(t("Lỗi"), t("Vui lòng nhập khối lớp."));
      return;
    }
    const data: StudentProfileUpdateRequest = {
      gradeLevel,
      learningGoals,
      preferredStudyTime,
      description,
    };
    const success = await updateProfileStudent(id, data);
    if (success) {
      Alert.alert(t("Thành công"), t("Cập nhật thông tin thành công!"), [
        { text: t("OK"), onPress: () => router.back() },
      ]);
    } else {
      Alert.alert(t("Lỗi"), t("Cập nhật thất bại. Vui lòng thử lại."));
    }
  };

  if (loading && !profileStudent) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>{t("Đang tải...")}</Text>
      </View>
    );
  }

  if (!profileStudent) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || t("Không tìm thấy thông tin học viên.")}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t("Cập nhật thông tin học viên")}</Text>
      <Input
        label={t("Khối lớp")}
        value={gradeLevel}
        onChangeText={setGradeLevel}
        placeholder={t("Nhập khối lớp")}
      />
      <Input
        label={t("Mục tiêu học tập")}
        value={learningGoals}
        onChangeText={setLearningGoals}
        placeholder={t("Nhập mục tiêu học tập")}
        multiline
      />
      <Input
        label={t("Thời gian học ưu tiên")}
        value={preferredStudyTime}
        onChangeText={setPreferredStudyTime}
        placeholder={t("Ví dụ: Buổi tối, cuối tuần...")}
      />
      <Input
        label={t("Mô tả thêm")}
        value={description}
        onChangeText={setDescription}
        placeholder={t("Nhập mô tả thêm")}
        multiline
      />
      <Button
        title={t("Lưu thay đổi")}
        onPress={handleUpdate}
        loading={loading}
        fullWidth
        style={{ marginTop: SPACING.lg }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  loadingText: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.danger,
    fontSize: FONT_SIZE.md,
    textAlign: "center",
  },
});