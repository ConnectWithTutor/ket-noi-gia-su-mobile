import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useClassStore } from "@/store/class-store";
import { useAuthStore } from "@/store/auth-store";
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react-native";
import Button from "@/components/ui/Button";
import CustomAlertModal from "@/components/ui/AlertModal";
import Header from "@/components/ui/Header";
import Colors from "@/constants/Colors";

const CRITERIA_LABELS = [
  "Chất lượng giảng dạy",
  "Thái độ & hỗ trợ",
  "Mức độ hài lòng về lớp học"
];

const SCORE_LABELS = [
  "Tệ",
  "Chưa tốt",
  "Bình thường",
  "Tốt",
  "Vô cùng tốt"
];

export default function ClassReviewScreen() {
  const { classId } = useLocalSearchParams<{ classId: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { rateClass, isLoading } = useClassStore();

  const [criteria1, setCriteria1] = useState(5);
  const [criteria2, setCriteria2] = useState(5);
  const [criteria3, setCriteria3] = useState(5);
  const [comment, setComment] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertOptions, setAlertOptions] = useState<{ title?: string; message?: string; buttons?: any[] }>({});

  const showAlert = (title: string, message: string, buttons?: any[]) => {
    setAlertOptions({ title, message, buttons });
    setAlertVisible(true);
  };

  const handleSubmit = async () => {
    if (!classId) {
      showAlert(t("Lỗi"), t("Không tìm thấy lớp học."));
      return;
    }
    if (!user?.userId) {
      showAlert(t("Lỗi"), t("Bạn cần đăng nhập để đánh giá."));
      return;
    }
    if (![criteria1, criteria2, criteria3].every((c) => c >= 1 && c <= 5)) {
      showAlert(t("Lỗi"), t("Vui lòng chấm điểm từ 1 đến 5 cho tất cả tiêu chí."));
      return;
    }
    const success = await rateClass(
      classId as string,
      criteria1,
      criteria2,
      criteria3,
      comment
    );
    if (success) {
      showAlert(
        t("Thành công"),
        t("Cảm ơn bạn đã đánh giá lớp học!"),
        [
          {
            text: t("OK"),
            onPress: () => {
              setAlertVisible(false);
              router.back();
            },
          },
        ]
      );
    } else {
      showAlert(t("Lỗi"), t("Không thể gửi đánh giá. Vui lòng thử lại sau."));
    }
  };

  const renderStars = (value: number, onChange: (v: number) => void) => (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <TouchableOpacity key={i} onPress={() => onChange(i)} activeOpacity={0.7}>
          <View style={styles.starItem}>
            <Star
              size={32}
              color={i <= value ? Colors.primary : Colors.border}
              fill={i <= value ? Colors.primary : "none"}
              style={styles.star}
            />
            <Text style={[
              styles.scoreLabel,
              i === value && styles.scoreLabelActive
            ]}>
              {SCORE_LABELS[i - 1]}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header title={t("Đánh giá lớp học")} showBack />
      <View style={styles.container}>
        <Text style={styles.title}>{t("Đánh giá trải nghiệm lớp học")}</Text>
        {CRITERIA_LABELS.map((label, idx) => (
          <View style={styles.criteriaBlock} key={label}>
            <Text style={styles.criteriaLabel}>{t(label)}</Text>
            {renderStars(
              idx === 0 ? criteria1 : idx === 1 ? criteria2 : criteria3,
              idx === 0 ? setCriteria1 : idx === 1 ? setCriteria2 : setCriteria3
            )}
          </View>
        ))}
        <Text style={styles.commentLabel}>{t("Nhận xét (không bắt buộc)")}</Text>
        <TextInput
          style={styles.commentInput}
          placeholder={t("Nhập nhận xét của bạn...")}
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        <Button
          title={t("Gửi đánh giá")}
          onPress={handleSubmit}
          loading={isLoading}
          style={{ marginTop: 24 }}
          fullWidth
        />
      </View>
      <CustomAlertModal
        visible={alertVisible}
        title={alertOptions.title}
        message={alertOptions.message}
        onClose={() => setAlertVisible(false)}
        buttons={alertOptions.buttons}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: Colors.primary,
  },
  criteriaBlock: {
    marginBottom: 20,
  },
  criteriaLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: Colors.text,
  },
 
  starsRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  starItem: {
    alignItems: "center",
    marginHorizontal: 4,
  },
  star: {
    marginHorizontal: 4,
  },
  commentLabel: {
    fontSize: 15,
    fontWeight: "500",
    marginTop: 8,
    marginBottom: 4,
    color: Colors.text,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 80,
    backgroundColor: "#fafafa",
    color: Colors.text,
  },
  criteriaNote: {
  fontSize: 13,
  fontWeight: "400",
  color: Colors.textSecondary,
},
scoreLabel: {
  fontSize: 12,
  color: Colors.textSecondary,
  marginTop: 2,
},
scoreLabelActive: {
  color: Colors.primary,
  fontWeight: "bold",
},
});