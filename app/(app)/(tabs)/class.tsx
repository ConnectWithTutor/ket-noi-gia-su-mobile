import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useClassStore } from "@/store/class-store";
import { useAuthStore } from "@/store/auth-store";
import Colors from "@/constants/Colors";
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from "@/constants/Theme";
import { formatDate } from "@/utils/date-utils";
import { BookOpen, Users, Clock, MapPin } from "lucide-react-native";
import StatusBar from "@/components/ui/StatusBar";
import Header from "@/components/ui/Header";
import { Class } from "@/types/class";
import { triggerHaptic } from "@/utils/haptics";
import { useTranslation } from "react-i18next"; // Thêm dòng này
import { toLocaleStringVND } from "@/utils/number-utils";
import { useSubjectStore } from "@/store/subjectStore";

export default function ClassesScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    classes,
    Myclasses,
    isLoading,
    error,
    fetchClassesByUserId,
    setSelectedClass,
    fetchClasses,
  } = useClassStore();
  const { getSubjectById } = useSubjectStore(); 
  const [refreshing, setRefreshing] = useState(false);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    if (user?.userId) {
      await fetchClassesByUserId(user.userId);
      await fetchClasses();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClasses();
    setRefreshing(false);
  };

  const handleClassPress = (obj: Class) => {
    triggerHaptic("light");
    setSelectedClass(obj);
    router.push(`/class/${obj.classId}`);
  };

  // Phân loại lớp học
  const myClasses = Myclasses || [];
  const otherClasses = classes.filter(
    (item) => !myClasses.some((my) => my.classId === item.classId)
  );

  const renderSection = (title: string, data: Class[], emptyText: string) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t(emptyText)}</Text>
          {title === t("Lớp học của tôi") && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/student-request/create")}
            >
              <Text style={styles.createButtonText}>
                {t("Tìm kiếm yêu cầu gia sư")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        data.map((item) => (
          <TouchableOpacity
            key={item.classId}
            style={styles.classCard}
            onPress={() => handleClassPress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.classHeader}>
              <Text style={styles.className}>
                {currentLang === "en"
                  ? item.className_en || item.className_vi
                  : item.className_vi || item.className_en}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <BookOpen size={16} color={Colors.textSecondary} />
                <Text style={styles.infoText}>
                  {currentLang === "en"
                    ? getSubjectById(item.subjectId)?.subjectName_en || getSubjectById(item.subjectId)?.subjectName_vi
                    : getSubjectById(item.subjectId)?.subjectName_vi || t("Môn học")}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Users size={16} color={Colors.textSecondary} />
                <Text style={styles.infoText}>
                  {item.maxStudents} {t("học viên")}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Clock size={16} color={Colors.textSecondary} />
                <Text style={styles.infoText}>
                  {item.sessions} {t("buổi")}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <MapPin size={16} color={Colors.textSecondary} />
                <Text style={styles.infoText}>{item.studyType}</Text>
              </View>
            </View>
            <View style={styles.footer}>
              <Text style={styles.price}>
                {toLocaleStringVND(item.tuitionFee)}đ
              </Text>
              <Text style={styles.date}>
                {t("Bắt đầu")}: {formatDate(item.startDate)}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  if (isLoading && !refreshing && classes.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={Colors.primary} />
        <Header title={t("Lớp học")} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>{t("Đang tải lớp học...")}</Text>
        </View>
      </View>
    );
  }

  if (error && !refreshing && classes.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={Colors.primary} />
        <Header title={t("Lớp học")} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadClasses}>
            <Text style={styles.retryButtonText}>{t("Thử lại")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} />
      <Header title={t("Lớp học")} />
      <View style={{ flex: 1 }}>
        <FlatList
          data={[]}
          renderItem={null}
          keyExtractor={() => ""}
          ListHeaderComponent={
            <>
              {renderSection(
                t("Lớp học của tôi"),
                myClasses,
                "Bạn chưa có lớp học nào"
              )}
              {renderSection(
                t("Các lớp học khác"),
                otherClasses,
                "Không có lớp học khác"
              )}
            </>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  errorText: {
    fontSize: FONT_SIZE.md,
    color: Colors.danger,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  classCard: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  classHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  className: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: Colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
    color: Colors.white,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: SPACING.xs,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: SPACING.md,
    flex: 1,
  },
  infoText: {
    fontSize: FONT_SIZE.sm,
    color: Colors.textSecondary,
    marginLeft: SPACING.xs,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  price: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: Colors.primary,
  },
  date: {
    fontSize: FONT_SIZE.sm,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: Colors.textSecondary,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  createButtonText: {
    color: Colors.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  sectionContainer: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: SPACING.md,
  },
});
