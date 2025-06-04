import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useUserProfileStore } from "@/store/profile-store";
import colors from "@/constants/Colors";
import { FONT_SIZE, SPACING } from "@/constants/Theme";
import { useTranslation } from "react-i18next";

export default function EditTutorProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    profileTutor,
    loading,
    error,
    getProfileTutorById,
    updateProfileTutor,
  } = useUserProfileStore();
  const { t } = useTranslation();
  const [degree, setDegree] = useState("");
  const [certificate, setCertificate] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [introVideoUrl, setIntroVideoUrl] = useState("");

  useEffect(() => {
    if (id) {
      getProfileTutorById(id);
    }
  }, [id]);

  useEffect(() => {
    if (profileTutor) {
      setDegree(profileTutor.degree || "");
      setCertificate(profileTutor.certificate || "");
      setExperience(profileTutor.experience || "");
      setDescription(profileTutor.description || "");
      setIntroVideoUrl(profileTutor.introVideoUrl || "");
    }
  }, [profileTutor]);

  const handleUpdate = async () => {
    if (!degree.trim()) {
      Alert.alert(t("Lỗi"), t("Vui lòng nhập học vị."));
      return;
    }
    const data = {
      degree,
      certificate,
      experience,
      description,
      introVideoUrl,
    };
    const success = await updateProfileTutor(id, data);
    if (success) {
      Alert.alert(t("Thành công"), t("Cập nhật thông tin thành công!"), [
        { text: t("OK"), onPress: () => router.back() },
      ]);
    } else {
      Alert.alert(t("Lỗi"), t("Cập nhật thất bại. Vui lòng thử lại."));
    }
  };

  if (loading && !profileTutor) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>{t("Đang tải...")}</Text>
      </View>
    );
  }

  if (!profileTutor) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || t("Không tìm thấy thông tin gia sư.")}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t("Cập nhật thông tin gia sư")}</Text>
      <Input
        label={t("Học vị")}
        value={degree}
        onChangeText={setDegree}
        placeholder={t("Nhập học vị")}
      />
      <Input
        label={t("Chứng chỉ")}
        value={certificate}
        onChangeText={setCertificate}
        placeholder={t("Nhập chứng chỉ")}
        multiline
      />
      <Input
        label={t("Kinh nghiệm")}
        value={experience}
        onChangeText={setExperience}
        placeholder={t("Nhập kinh nghiệm")}
        multiline
      />
      <Input
        label={t("Giới thiệu")}
        value={description}
        onChangeText={setDescription}
        placeholder={t("Nhập mô tả giới thiệu")}
        multiline
      />
      <Input
        label={t("Link video giới thiệu")}
        value={introVideoUrl}
        onChangeText={setIntroVideoUrl}
        placeholder={t("Dán link video (nếu có)")}
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