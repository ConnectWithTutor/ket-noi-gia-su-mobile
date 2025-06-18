import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useClassStore } from "@/store/class-store";
import { useAuthStore } from "@/store/auth-store";
import { useTranslation } from "react-i18next";
import Header from "@/components/ui/Header";
import Colors from "@/constants/Colors";
import { Star } from "lucide-react-native";

export default function TutorEvaluationsScreen() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { Evaluations, isLoading, getClassEvaluationsByUserId } = useClassStore();

  useEffect(() => {
    if (user?.userId) {
      getClassEvaluationsByUserId(user.userId);
    }
  }, [user?.userId]);

  const renderStars = (score: number) => (
    <View style={{ flexDirection: "row" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={18}
          color={i <= score ? Colors.primary : Colors.border}
          fill={i <= score ? Colors.primary : "none"}
          style={{ marginRight: 2 }}
        />
      ))}
    </View>
  );

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.className}>{t("Lớp học")}: {item.classId}</Text>
      <View style={styles.criteriaRow}>
        <Text style={styles.criteriaLabel}>{t("Chất lượng giảng dạy")}:</Text>
        {renderStars(item.criteria1)}
      </View>
      <View style={styles.criteriaRow}>
        <Text style={styles.criteriaLabel}>{t("Thái độ & hỗ trợ")}:</Text>
        {renderStars(item.criteria2)}
      </View>
      <View style={styles.criteriaRow}>
        <Text style={styles.criteriaLabel}>{t("Mức độ hài lòng về lớp học")}:</Text>
        {renderStars(item.criteria3)}
      </View>
      {item.comment ? (
        <Text style={styles.comment}>"{item.comment}"</Text>
      ) : null}
      <Text style={styles.date}>{t("Ngày đánh giá")}: {new Date(item.evaluationDate).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header title={t("Đánh giá của tôi")} showBack />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={Evaluations}
          keyExtractor={(item) => item.evaluationId}
          renderItem={renderItem}
          contentContainerStyle={Evaluations.length === 0 ? styles.emptyContainer : { padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>{t("Bạn chưa có đánh giá nào.")}</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  className: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: Colors.primary,
  },
  criteriaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  criteriaLabel: {
    width: 150,
    fontSize: 14,
    color: Colors.text,
  },
  comment: {
    fontStyle: "italic",
    color: Colors.textSecondary,
    marginTop: 8,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: "right",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
});