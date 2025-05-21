import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useClassStore } from '@/store/class-store';
import { useAuthStore } from '@/store/auth-store';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@/constants/Theme';
import { formatDate, formatTimeRange } from '@/utils/date-utils';
import { BookOpen, Users, Clock, Calendar, MapPin, DollarSign, Edit, Trash2, MessageSquare, Share2 } from 'lucide-react-native';
import StatusBar from '@/components/ui/StatusBar';
import Header from '@/components/ui/Header';
import { triggerHaptic } from '@/utils/haptics';
import Button from '@/components/ui/Button';
import { useScheduleStore } from '@/store/schedule-store';
import { useClassRegistrationStore } from '@/store/classRegistration-store';
import { useSubjectStore } from '@/store/subjectStore';
export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const classId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
const { fetchRegistrationsByClass,registrations } = useClassRegistrationStore();
const {  getSubjectById} = useSubjectStore();
  const { user } = useAuthStore();
  const { 
    selectedClass, 
    isLoading, 
    error, 
    fetchClassById,
    updateClass,
    deleteClass
  } = useClassStore();
  const {schedules , getSchedulesByClass} =useScheduleStore();
 const [showAll, setShowAll] = useState(false);

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

  const handleEditClass = () => {
    triggerHaptic('medium');
    // router.push(`/class/edit/${classId}`);
  };

  const handleDeleteClass = () => {
    triggerHaptic('medium');
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa lớp học này? Hành động này không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            if (classId) {
              const success = await deleteClass(classId);
              if (success) {
                Alert.alert('Thành công', 'Lớp học đã được xóa thành công', [
                  { text: 'OK', onPress: () => router.back() }
                ]);
              }
            }
          }
        }
      ]
    );
  };
  const handleAddSchedule = () => {
    triggerHaptic('light');
    // router.push(`/class/schedule/create?classId=${classId}`);
  };

  const handleAddStudent = () => {
    triggerHaptic('light');
    // router.push(`/class/student/add?classId=${classId}`);
  };

  const handleShareClass = () => {
    triggerHaptic('light');
    Alert.alert(
      'Chia sẻ',
      'Tính năng chia sẻ sẽ được cập nhật trong phiên bản tiếp theo.'
    );
  };

  const handleMarkComplete = async () => {
    triggerHaptic('medium');
    Alert.alert(
      'Xác nhận hoàn thành',
      'Bạn có chắc chắn muốn đánh dấu lớp học này là đã hoàn thành?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xác nhận', 
          onPress: async () => {
            if (classId && selectedClass) {
              const success = await updateClass(classId, { status: 'completed' });
              if (success) {
                Alert.alert('Thành công', 'Lớp học đã được đánh dấu hoàn thành');
                fetchClassById(classId);
              }
            }
          }
        }
      ]
    );
  };
  const isUpcoming = (schedule: any) => {
  const now = new Date();
  const scheduleDateTime = new Date(`${schedule.dayStudying}T${schedule.startTime}`);
  return scheduleDateTime >= now;
};
const upcomingSchedules = schedules
  .filter(isUpcoming)
  .sort((a, b) => {
    const dateA = new Date(`${a.dayStudying}T${a.startTime}`);
    const dateB = new Date(`${b.dayStudying}T${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });
  const displayedSchedules = showAll ? upcomingSchedules : upcomingSchedules.slice(0, 3);
  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={Colors.primary} />
        <Header title="Chi tiết lớp học" showBack />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Đang tải thông tin lớp học...</Text>
        </View>
      </View>
    );
  }

  if (error || !selectedClass) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={Colors.primary} />
        <Header title="Chi tiết lớp học" showBack />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Không tìm thấy thông tin lớp học'}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => fetchClassById(classId)}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} />
      <Header title="Chi tiết lớp học" showBack />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.className}>{selectedClass.className_vi}</Text>
          <View style={[styles.statusBadge, { 
            backgroundColor: selectedClass.status === 'active' ? Colors.success : 
                            selectedClass.status === 'completed' ? Colors.info : 
                            selectedClass.status === 'cancelled' ? Colors.danger : 
                            Colors.warning
          }]}>
            <Text style={styles.statusText}>
              {selectedClass.status === 'active' ? 'Đang diễn ra' : 
              selectedClass.status === 'completed' ? 'Đã hoàn thành' : 
              selectedClass.status === 'cancelled' ? 'Đã hủy' : 
              'Chờ xác nhận'}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <BookOpen size={18} color={Colors.textSecondary} />
            <Text style={styles.infoLabel}>Môn học:</Text>
            <Text style={styles.infoValue}>
            {getSubjectById(selectedClass.subjectId)?.subjectName_vi || 'Chưa có môn học'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <MapPin size={18} color={Colors.textSecondary} />
            <Text style={styles.infoLabel}>Hình thức:</Text>
            <Text style={styles.infoValue}>{selectedClass.studyType}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Calendar size={18} color={Colors.textSecondary} />
            <Text style={styles.infoLabel}>Ngày bắt đầu:</Text>
            <Text style={styles.infoValue}>{formatDate(selectedClass.startDate)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Clock size={18} color={Colors.textSecondary} />
            <Text style={styles.infoLabel}>Số buổi:</Text>
            <Text style={styles.infoValue}>{selectedClass.sessions} buổi</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Users size={18} color={Colors.textSecondary} />
            <Text style={styles.infoLabel}>Số học viên:</Text>
            <Text style={styles.infoValue}>{selectedClass.maxStudents} học viên</Text>
          </View>
          
          <View style={styles.infoRow}>
            <DollarSign size={18} color={Colors.textSecondary} />
            <Text style={styles.infoLabel}>Học phí:</Text>
            <Text style={styles.infoValue}>{selectedClass.tuitionFee.toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.description}>{selectedClass.description}</Text>
        </View>

        <View style={styles.section}>
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Lịch học</Text>
    <TouchableOpacity 
      style={styles.addButton}
      onPress={handleAddSchedule}
    >
      <Text style={styles.addButtonText}>+ Thêm buổi học</Text>
    </TouchableOpacity>
  </View>

  {displayedSchedules.length > 0 ? (
    <>
      {displayedSchedules.map((schedule) => (
        <View key={schedule.scheduleId} style={styles.scheduleItem}>
          <View style={styles.scheduleDate}>
            <Calendar size={16} color={Colors.primary} />
            <Text style={styles.scheduleDateText}>{formatDate(schedule.dayStudying)}</Text>
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
        <TouchableOpacity onPress={() => setShowAll(!showAll)} style={{ marginTop: 8 }}>
          <Text style={{ color: Colors.primary }}>
            {showAll ? "Thu gọn" : "Xem tất cả"}
          </Text>
        </TouchableOpacity>
      )}
    </>
  ) : (
    <>
      <Text style={styles.emptyText}>Không có buổi học sắp tới</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddSchedule}>
        <Text style={styles.addButtonText}>Tạo lịch học</Text>
      </TouchableOpacity>
    </>
  )}
</View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Học viên</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddStudent}
            >
              <Text style={styles.addButtonText}>+ Thêm học viên</Text>
            </TouchableOpacity>
          </View>
          
          
          {registrations.length > 0 ? (
           <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm }}>
            <Text style={{ fontSize: FONT_SIZE.md, color: Colors.text }}>
              {registrations.length} học viên
            </Text>
            <TouchableOpacity
              style={[styles.addButton, { marginLeft: SPACING.md }]}
              onPress={() => {
                // TODO: Implement navigation to student list screen
                Alert.alert('Danh sách học viên', 'Tính năng xem danh sách học viên sẽ được cập nhật trong phiên bản tiếp theo.');
              }}
            >
              <Text style={styles.addButtonText}>Xem danh sách</Text>
            </TouchableOpacity>
          </View>
          ) : (
            <Text style={styles.emptyText}>Chưa có học viên nào trong lớp</Text>
          )}
        </View>

        <View style={styles.actionsContainer}>
          {selectedClass.status === 'active' && (
            <Button
              title="Đánh dấu hoàn thành"
              onPress={handleMarkComplete}
              fullWidth
              style={styles.completeButton}
            />
          )}
          
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]} 
              onPress={handleEditClass}
            >
              <Edit size={18} color={Colors.white} />
              <Text style={styles.actionButtonText}>Chỉnh sửa</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]} 
              onPress={handleDeleteClass}
            >
              <Trash2 size={18} color={Colors.white} />
              <Text style={styles.actionButtonText}>Xóa lớp</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.shareButton]} 
              onPress={handleShareClass}
            >
              <Share2 size={18} color={Colors.white} />
              <Text style={styles.actionButtonText}>Chia sẻ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    fontSize: FONT_SIZE.md,
    color: Colors.danger,
    textAlign: 'center',
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
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  className: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
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
    fontWeight: '600',
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
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '600',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: Colors.text,
    lineHeight: 22,
  },
  addButton: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  addButtonText: {
    fontSize: FONT_SIZE.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  scheduleDate: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scheduleDateText: {
    fontSize: FONT_SIZE.md,
    color: Colors.text,
    marginLeft: SPACING.xs,
  },
  scheduleTime: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '600',
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  studentName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
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
    textAlign: 'center',
    paddingVertical: SPACING.md,
  },
  actionsContainer: {
    marginBottom: SPACING.xl,
  },
  completeButton: {
    marginBottom: SPACING.md,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
});