import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useComplaintStore } from "@/store/complaint-store";
import Header from "@/components/ui/Header";
import colors from "@/constants/Colors";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react-native";
import { useTranslation } from "react-i18next";

const ComplaintDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const { getComplaintById, selectedComplaint, loading, error, clearError } = useComplaintStore();
  const { t } = useTranslation();
  useEffect(() => {
    if (id) getComplaintById(id as string);
    return () => clearError();
  }, [id]);

  if (loading || !selectedComplaint) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  const statusColor =
    selectedComplaint.status === "Done" ? "#4CAF50" : "#FF9800";
  const statusIcon =
    selectedComplaint.status === "Done" ? (
      <CheckCircle2 size={28} color={statusColor} style={{ marginRight: 10 }} />
    ) : (
      <Clock size={28} color={statusColor} style={{ marginRight: 10 }} />
    );

  return (
    <View style={styles.container}>
      <Header title={t("Chi tiết khiếu nại")} showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.row}>
          {statusIcon}
          <Text style={[styles.status, { color: statusColor }]}>
            {selectedComplaint.status === "Done" ? t("Đã xử lý") : t("Đang xử lý")}
          </Text>
        </View>
        <Text style={styles.label}>{t("Tiêu đề")}</Text>
        <Text style={styles.title}>{selectedComplaint.title}</Text>
        <Text style={styles.label}>{t("Nội dung")}</Text>
        <Text style={styles.body}>{selectedComplaint.content}</Text>
        <Text style={styles.label}>{t("Ngày gửi")}</Text>
        <Text style={styles.date}>
          {new Date(selectedComplaint.createdAt).toLocaleString()}
        </Text>
        {selectedComplaint.resolutionNote && (
          <>
            <Text style={styles.label}>{t("Phản hồi")}</Text>
            <Text style={styles.response}>{selectedComplaint.resolutionNote}</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ComplaintDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
  },
  label: {
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 4,
    color: colors.textSecondary,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  response: {
    backgroundColor: "#f6f6f6",
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: colors.error,
    fontSize: 16,
  },
});