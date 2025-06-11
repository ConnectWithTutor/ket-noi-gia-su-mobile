import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useClassStore } from "@/store/class-store";
import { useAuthStore } from "@/store/auth-store";
import Colors from "@/constants/Colors";

import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from "@/constants/Theme";
import { formatDate, formatTimeRange } from "@/utils/date-utils";
import { toLocaleStringVND } from "@/utils/number-utils";
import {
  BookOpen,
  Users,
  Clock,
  Calendar,
  MapPin,
  DollarSign,
  Edit,
  Trash2,
  MessageSquare,
  Share2,
  User,
} from "lucide-react-native";
import StatusBar from "@/components/ui/StatusBar";
import Header from "@/components/ui/Header";
import { triggerHaptic } from "@/utils/haptics";
import Button from "@/components/ui/Button";
import { useScheduleStore } from "@/store/schedule-store";
import { useClassRegistrationStore } from "@/store/classRegistration-store";
import { useSubjectStore } from "@/store/subjectStore";
import { Subject } from "@/types";
import { useRoleStore } from "@/store/roleStore";
import { useUserProfileStore } from "@/store/profile-store";
import { useTranslation } from "react-i18next";
import CustomAlertModal from "@/components/ui/AlertModal";

export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const classId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { fetchRegistrationsByClass, registrations, createRegistration, createClassRegistrationWithUsername, error: registrationError } =
    useClassRegistrationStore();
const { usersMap, fetchUserById } = useUserProfileStore();
  const { getSubjectById } = useSubjectStore();
  const { roles } = useRoleStore();
  const { user } = useAuthStore();
  const {
    selectedClass,
    isLoading,
    error,
    fetchClassById,
    updateClass,
    deleteClass,
  } = useClassStore();
  const { t } = useTranslation();
  const { schedules, getSchedulesByClass } = useScheduleStore();
  const [showAll, setShowAll] = useState(false);
  const [showStudentList, setShowStudentList] = useState(false);
 const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [newStudentUsername, setNewStudentUsername] = useState("");
  const [addingStudent, setAddingStudent] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertOptions, setAlertOptions] = useState<{
    title?: string;
    message?: string;
    buttons?: any[];
  }>({
    title: "",
    message: "",
    buttons: [],
  });

  if(!selectedClass) {

    return
  }
  useEffect(() => {
    if (classId) {
      fetchClassById(classId);
      getSchedulesByClass(classId);
      fetchRegistrationsByClass(classId);
    }
  }, [classId]);
  useEffect(() => {
    if (classId) {
      fetchClassById(classId);
    }
  }, [classId]);
  useEffect(() => {
  if (showStudentList) {
    registrations.forEach((reg) => {
      if (!usersMap[reg.studentId]) {
        fetchUserById(reg.studentId);
      }
    });
  }
}, [showStudentList, registrations]);
useEffect(() => {
  if (selectedClass && selectedClass.tutorId && !usersMap[selectedClass.tutorId]) {
    fetchUserById(selectedClass.tutorId);
  }
}, [selectedClass]);
  const handleEditClass = () => {
    triggerHaptic("medium");
    // router.push(`/class/edit/${classId}`);
  };

  const handleDeleteClass = () => {
    triggerHaptic("medium");
    setAlertOptions({
      title: t("Xác nhận xóa"),
      message: t("Bạn có chắc chắn muốn xóa lớp học này? Hành động này không thể hoàn tác."),
      buttons: [
        { text: t("Hủy"), style: "cancel" },
        {
          text: t("Xóa"),
          style: "destructive",
          onPress: async () => {
            if (classId) {
              const success = await deleteClass(classId);
              if (success) {
                setAlertOptions({
                  title: t("Thành công"),
                  message: t("Lớp học đã được xóa thành công"),
                  buttons: [{ text: t("OK"), onPress: () => router.back() }],
                });
                setAlertVisible(true);
              }
            }
          },
        },
      ],
    });
    setAlertVisible(true);
  };
  const handleAddStudent = () => {
    triggerHaptic("light");
    setShowAddStudentDialog(true);
  };
  const handleAddSchedule = () => {
    triggerHaptic("light");
    router.push(`/class/schedule/create?classId=${classId}`);
  };
  const showAlert = (title: string, message: string, buttons?: any[]) => {
    setAlertOptions({ title, message, buttons });
    setAlertVisible(true);
  };
  const handleConfirmAddStudent = async () => {
    if (!newStudentUsername.trim()) {
      showAlert(t("Lỗi"), t("Vui lòng nhập tên đăng nhập học viên"));
      return;
    }
    setAddingStudent(true);
    const success = await createClassRegistrationWithUsername({
      classId: selectedClass.classId,
      username: newStudentUsername.trim(),
    });
    if (success) {
      showAlert(t("Thành công"), t("Đã thêm học viên vào lớp"));
      fetchRegistrationsByClass(selectedClass.classId);
      setShowAddStudentDialog(false);
      setNewStudentUsername("");
    } else {
      showAlert(t("Lỗi"), t("Không tìm thấy học viên này. Vui lòng thử lại."));
    }
    setAddingStudent(false);
  };


  const handleShareClass = () => {
    triggerHaptic("light");
    showAlert(
      t("Chia sẻ lớp học"),
      t("Chức năng chia sẻ sẽ sớm được cập nhật."),
      [{ text: t("Đóng"), onPress: () => setAlertVisible(false) }]
    );
  };
  const handleAddScheduleBulk = () => {
    triggerHaptic("light");
    router.push(`/class/schedule/create-bulk?classId=${classId}`);
  };

  const handleMarkComplete = async () => {
    triggerHaptic("medium");
    setAlertOptions({
      title: t("Xác nhận hoàn thành"),
      message: t("Bạn có chắc chắn muốn đánh dấu lớp học này là đã hoàn thành?"),
      buttons: [
        { text: t("Hủy"), style: "cancel" },
        {
          text: t("Xác nhận"),
          onPress: async () => {
            if (classId && selectedClass) {
              const success = await updateClass(classId, {
                status: "completed",
              });
              if (success) {
                showAlert(
                  t("Thành công"),
                  t("Lớp học đã được đánh dấu hoàn thành")
                );
                fetchClassById(classId);
              }
            }
          },
        },
      ],
    });
    setAlertVisible(true);
  };
  const isUpcoming = (schedule: any) => {
    const now = new Date();
    const scheduleDateTime = new Date(
      `${schedule.dayStudying}T${schedule.startTime}`
    );
    return scheduleDateTime >= now;
  };
  const upcomingSchedules = schedules.filter(isUpcoming).sort((a, b) => {
    const dateA = new Date(`${a.dayStudying}T${a.startTime}`);
    const dateB = new Date(`${b.dayStudying}T${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });
  const displayedSchedules = showAll
    ? upcomingSchedules
    : upcomingSchedules.slice(0, 3);
  const userRole = roles.find((r) => r.roleId === user?.roleId)?.roleName;
  // console.log('userRole', roles);
  const isStudent = userRole === "Student";
  const isTutor = userRole === "Tutor";
  const isOwner = isTutor && user?.userId === selectedClass.tutorId;

  const isRegistered = selectedClass
    ? registrations.some(
        (reg) =>
          reg.classId === selectedClass.classId &&
          reg.studentId === user?.userId
      )
    : false;

  const canJoinStudent = isStudent && !isRegistered && selectedClass;
  const canJoinTutor = isTutor && !selectedClass.tutorId
  // && Date(selectedClass.startDate) > new Date();
  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={Colors.primary} />
        <Header title={t("Chi tiết lớp học")} showBack />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>{t("Đang tải thông tin lớp học...")}</Text>
        </View>
      </View>
    );
  }
  if (error || !selectedClass) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={Colors.primary} />
        <Header title={t("Chi tiết lớp học")} showBack />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || t("Không tìm thấy thông tin lớp học")}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchClassById(classId)}
          >
            <Text style={styles.retryButtonText}>{t("Thử lại")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} />
      <Header title={t("Chi tiết lớp học")} showBack />

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 32 }} // hoặc SPACING.xl
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.className}>{selectedClass.className_vi}</Text>
          {/* <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  selectedClass.status === "active"
                    ? Colors.success
                    : selectedClass.status === "completed"
                    ? Colors.info
                    : selectedClass.status === "cancelled"
                    ? Colors.danger
                    : Colors.warning,
              },
            ]}
          >
            <Text style={styles.statusText}>
              {selectedClass.status === "active"
                ? "Đang diễn ra"
                : selectedClass.status === "completed"
                ? "Đã hoàn thành"
                : selectedClass.status === "cancelled"
                ? "Đã hủy"
                : "Chờ xác nhận"}
            </Text>
          </View> */}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <BookOpen size={18} color={Colors.textSecondary} />
            <Text style={styles.infoLabel}>{t("Môn học")}</Text>
            <Text style={styles.infoValue}>
              {getSubjectById(selectedClass.subjectId)?.subjectName_vi || t("Chưa có môn học")}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <User size={18} color={Colors.textSecondary} />
            <Text style={styles.infoLabel}>{t("Gia sư")}</Text>
            <Text style={styles.infoValue}>
              {usersMap[selectedClass.tutorId]?.fullName || t("Chưa có thông tin")}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MapPin size={18} color={Colors.textSecondary} />
            <Text style={styles.infoLabel}>{t("Hình thức")}</Text>
            <Text style={styles.infoValue}>{selectedClass.studyType}</Text>
          </View>

          <View style={styles.infoRow}>
            <Calendar size={18} color={Colors.textSecondary} />
            <Text style={styles.infoLabel}>{t("Ngày bắt đầu")}</Text>
            <Text style={styles.infoValue}>
              {formatDate(selectedClass.startDate)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Clock size={18} color={Colors.textSecondary} />
            <Text style={styles.infoLabel}>{t("Số buổi")}</Text>
            <Text style={styles.infoValue}>{selectedClass.sessions} buổi</Text>
          </View>

          <View style={styles.infoRow}>
            <Users size={18} color={Colors.textSecondary} />
            <Text style={styles.infoLabel}>{t("Số học viên")}</Text>
            <Text style={styles.infoValue}>
               {registrations.length}/{selectedClass.maxStudents} {t('học viên')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <DollarSign size={18} color={Colors.textSecondary} />
            <Text style={styles.infoLabel}>{t("Học phí")}</Text>
            <Text style={styles.infoValue}>
              {toLocaleStringVND(selectedClass.tuitionFee)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("Mô tả")}</Text>
          <Text style={styles.description}>{selectedClass.description}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={{ flex: 1 }}>
               <Text style={styles.sectionTitle}>{t("Lịch học")}</Text>
            <Text style={{ color: Colors.warning, fontSize: FONT_SIZE.sm}}>
              {t("Buổi học sắp tới")}
            </Text>
              </View>
           
            {isOwner && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddSchedule}
              >
                <Text style={styles.addButtonText}>{t("+ Thêm buổi học")}</Text>
              </TouchableOpacity>
            )}
            
          </View>

          {displayedSchedules.length > 0 ? (
            <>
              {displayedSchedules.map((schedule) => (
                <View key={schedule.scheduleId} style={styles.scheduleItem}>
                  <View style={styles.scheduleDate}>
                    <Calendar size={16} color={Colors.primary} />
                    <Text style={styles.scheduleDateText}>
                      {formatDate(schedule.dayStudying)}
                    </Text>
                  </View>
                  <View style={styles.scheduleTime}>
                    <Clock size={16} color={Colors.textSecondary} />
                    <Text style={styles.scheduleTimeText}>
                      {schedule.startTime} -- {schedule.endTime}
                    </Text>
                  </View>
                </View>
              ))}

              {upcomingSchedules.length > 3 && (
                <TouchableOpacity
                  onPress={() => setShowAll(!showAll)}
                  style={{ marginTop: 8 }}
                >
                  <Text style={{ color: Colors.primary }}>
                    {showAll ? t("Thu gọn") : t("Xem tất cả")}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              <Text style={styles.emptyText}>{t("Không có buổi học sắp tới")}</Text>
              <View style={{ flexDirection: "row", justifyContent: "center", gap: 12 }}>
      {isOwner && (
        <>
          <TouchableOpacity
            style={[styles.addButton, { flex: 1 }]}
            onPress={handleAddScheduleBulk} // hoặc handleCreateWeeklySchedules
          >
            <Text style={styles.addButtonText}>{t("Tạo lịch học nhanh")}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("Học viên")}</Text>
            {isOwner && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddStudent}
              >
                <Text style={styles.addButtonText}>+ {t("Thêm học viên")}</Text>
              </TouchableOpacity>
            )}
            
          </View>

          {registrations.length > 0 ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: SPACING.sm,
              }}
            >
              <Text style={{ fontSize: FONT_SIZE.md, color: Colors.text }}>
                {registrations.length} {t('học viên')}
              </Text>
              <TouchableOpacity
                style={[styles.addButton, { marginLeft: SPACING.md }]}
                onPress={() => setShowStudentList((prev) => !prev)}
              >
                <Text style={styles.addButtonText}>
                  {showStudentList ? t("Ẩn danh sách") : t("Xem danh sách")}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.emptyText}>{t("Chưa có học viên nào trong lớp")}</Text>
          )}

          {showStudentList && (
            <View style={{ marginTop: SPACING.sm }}>
              {registrations.map((reg, idx) => (
                <View key={reg.studentId || idx} style={styles.studentItem}>
                  <View>
                    <Text style={styles.studentName}>
                      {usersMap[reg.studentId]?.fullName || t("Chưa có tên")}
                    </Text>
                    <Text style={styles.studentEmail}>
                      {usersMap[reg.studentId]?.email || t("Chưa có email")}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.actionsContainer}>
          {selectedClass.status === "active" && isOwner && (
            <Button
              title={t("Đánh dấu hoàn thành")}
              onPress={handleMarkComplete}
              fullWidth
              style={styles.completeButton}
            />
          )}

          <View style={styles.actionButtonsRow}>
            {isOwner && (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={handleEditClass}
                >
                  <Edit size={18} color={Colors.white} />
                  <Text style={styles.actionButtonText}>{t("Chỉnh sửa")}</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={handleDeleteClass}
                >
                  <Trash2 size={18} color={Colors.white} />
                  <Text style={styles.actionButtonText}>{t("Xóa lớp")}</Text>
                </TouchableOpacity> */}
              </>
            )}

            <TouchableOpacity
              style={[styles.actionButton, styles.shareButton]}
              onPress={handleShareClass}
            >
              <Share2 size={18} color={Colors.white} />
              <Text style={styles.actionButtonText}>{t("Chia sẻ")}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {canJoinStudent && user  && registrations.length < selectedClass.maxStudents && (
          <Button
            title={t("Tham gia lớp học")}
            style={{ marginTop: 16, marginBottom: 24 }} // thêm marginBottom nếu cần
            onPress={async () => {
              const success = await createRegistration({
                classId: selectedClass.classId,
                studentId: user.userId,
                registrationDate: new Date().toISOString(),
              });
              if (success) {
                showAlert(t("Thành công"), t("Bạn đã tham gia lớp học!"));
                fetchRegistrationsByClass(selectedClass.classId);
              } else {
                showAlert(t("Lỗi"), t("Không thể tham gia lớp học."));
              }
            }}
            fullWidth
          />
        )}
        {/* {canJoinTutor && ( 
          <Button
            title={t("Đăng ký làm gia sư lớp này")}
            style={{ marginTop: 16, marginBottom: 24 }} // thêm marginBottom nếu cần
            onPress={async () => {
              const success = await updateClass( selectedClass.classId {
                ...selectedClass,
                tutorId: user?.userId
              });
              if (success) {
                showAlert(t("Thành công"), t("Bạn đã tham gia lớp học!"));
                fetchRegistrationsByClass(selectedClass.classId);
              } else {
                showAlert(t("Lỗi"), t("Không thể tham gia lớp học."));
              }
            }}
            fullWidth
          />

        )} */}
      </ScrollView>
      {showAddStudentDialog && (
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogContainer}>
            <Text style={styles.dialogTitle}>{t("Thêm học viên")}</Text>
            <TextInput
              style={styles.dialogInput}
              placeholder={t("Vui lòng nhập tên đăng nhập học viên")}
              value={newStudentUsername}
              onChangeText={setNewStudentUsername}
              autoCapitalize="none"
              autoFocus
            />
            <View style={styles.dialogActions}>
              <TouchableOpacity
                style={[styles.dialogButton, { backgroundColor: "#ccc" }]}
                onPress={() => setShowAddStudentDialog(false)}
                disabled={addingStudent}
              >
                <Text style={styles.dialogButtonText}>{t("Hủy")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogButton, { backgroundColor: Colors.primary }]}
                onPress={handleConfirmAddStudent}
                disabled={addingStudent}
              >
                <Text style={styles.dialogButtonText}>
                  {addingStudent ? t("Đang gửi...") : t("Xác nhận")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      <CustomAlertModal
        visible={alertVisible}
        title={alertOptions.title}
        message={alertOptions.message}
        onClose={() => setAlertVisible(false)}
        buttons={alertOptions.buttons}
      />
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
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  className: {
    fontSize: FONT_SIZE.xl,
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
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  infoLabel: {
    fontSize: FONT_SIZE.md,
    color: Colors.textSecondary,
    marginLeft: SPACING.xs,
    marginRight: SPACING.xs,
    width: 100,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: Colors.text,
    flex: 1,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: Colors.text,
    lineHeight: 22,
  },
  addButton: {
    backgroundColor: Colors.primary + "20",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  addButtonText: {
    fontSize: FONT_SIZE.sm,
    color: Colors.primary,
    fontWeight: "600",
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  scheduleDate: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  scheduleDateText: {
    fontSize: FONT_SIZE.md,
    color: Colors.text,
    marginLeft: SPACING.xs,
  },
  scheduleTime: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  scheduleTimeText: {
    fontSize: FONT_SIZE.md,
    color: Colors.textSecondary,
    marginLeft: SPACING.xs,
  },
  scheduleStatus: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  scheduleStatusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
  },
  studentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  studentName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: Colors.text,
  },
  studentEmail: {
    fontSize: FONT_SIZE.sm,
    color: Colors.textSecondary,
    marginTop: SPACING.xs / 2,
  },
  messageButton: {
    padding: SPACING.xs,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingVertical: SPACING.md,
  },
  actionsContainer: {
    marginBottom: SPACING.xl,
  },
  completeButton: {
    marginBottom: SPACING.md,
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    flex: 1,
    marginHorizontal: SPACING.xs / 2,
  },
  editButton: {
    backgroundColor: Colors.info,
  },
  deleteButton: {
    backgroundColor: Colors.danger,
  },
  shareButton: {
    backgroundColor: Colors.secondary,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    marginLeft: SPACING.xs,
  },
    dialogOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  dialogContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  dialogInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  dialogActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  dialogButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginLeft: 8,
  },
  dialogButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  }
});
