import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useClassStore } from '@/store/class-store';
import { useAuthStore } from '@/store/auth-store';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@/constants/Theme';
import { formatDate } from '@/utils/date-utils';
import { BookOpen, Users, Clock, MapPin } from 'lucide-react-native';
import StatusBar from '@/components/ui/StatusBar';
import Header from '@/components/ui/Header';
import { Class } from '@/types/class';
import { triggerHaptic } from '@/utils/haptics';
import { useTranslation } from 'react-i18next'; // Thêm dòng này

export default function ClassesScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { classes, isLoading, error, fetchClasses } = useClassStore();
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation(); // Thêm dòng này

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    if (user?.userId) {
      await fetchClasses();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClasses();
    setRefreshing(false);
  };

  const handleClassPress = (classId: string) => {
    triggerHaptic('light');
    router.push(`/class/${classId}` as any);
  };

  // Phân loại lớp học
  const myClasses = classes.filter(
    (item) => item.tutorId === user?.userId 
  );
  const otherClasses = classes.filter(
    (item) => item.tutorId !== user?.userId 
  );

  const renderClassItem = ({ item }: { item: Class }) => (
    <TouchableOpacity 
      style={styles.classCard} 
      onPress={() => handleClassPress(item.classId)}
      activeOpacity={0.7}
    >
      <View style={styles.classHeader}>
        <Text style={styles.className}>{item.className_vi}</Text>
        <View style={[styles.statusBadge, { 
          backgroundColor: item.status === 'active' ? Colors.success : 
                          item.status === 'completed' ? Colors.info : 
                          item.status === 'cancelled' ? Colors.danger : 
                          Colors.warning
        }]}>
        </View>
      </View>
      {/* ...giữ nguyên các dòng khác */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <BookOpen size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>
            {item.subjectId === '1' ? t('Tiếng Anh') : 
             item.subjectId === '2' ? t('Toán học') : 
             t('Môn học')}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Users size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{item.maxStudents} {t('học viên')}</Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Clock size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{item.sessions} {t('buổi')}</Text>
        </View>
        <View style={styles.infoItem}>
          <MapPin size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{item.studyType}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.price}>{item.tuitionFee.toLocaleString()}đ</Text>
        <Text style={styles.date}>{t('Bắt đầu')}: {formatDate(item.startDate)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = (text: string) => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{t(text)}</Text>
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => router.push('/student-request/create')}
      >
        <Text style={styles.createButtonText}>{t('Tìm kiếm yêu cầu gia sư')}</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading && !refreshing && classes.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={Colors.primary} />
        <Header title={t('Lớp học')} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>{t('Đang tải lớp học...')}</Text>
        </View>
      </View>
    );
  }

  if (error && !refreshing && classes.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={Colors.primary} />
        <Header title={t('Lớp học')} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadClasses}>
            <Text style={styles.retryButtonText}>{t('Thử lại')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} />
      <Header title={t('Lớp học')} />
      <FlatList
        data={myClasses}
        renderItem={renderClassItem}
        keyExtractor={(item) => item.classId}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListHeaderComponent={
          <Text style={{...styles.className, marginBottom: 8}}>{t('Lớp học của tôi')}</Text>
        }
        ListEmptyComponent={renderEmptyComponent( t('Bạn chưa có lớp học nào'))}
      />
      <FlatList
        data={otherClasses}
        renderItem={renderClassItem}
        keyExtractor={(item) => item.classId}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={{...styles.className, marginBottom: 8}}>{t('Các lớp học khác')}</Text>
        }
        ListEmptyComponent={renderEmptyComponent(t('Không có lớp học khác'))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  className: {
    fontSize: FONT_SIZE.lg,
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
  infoRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
    flex: 1,
  },
  infoText: {
    fontSize: FONT_SIZE.sm,
    color: Colors.textSecondary,
    marginLeft: SPACING.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  price: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: Colors.primary,
  },
  date: {
    fontSize: FONT_SIZE.sm,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: Colors.textSecondary,
    marginBottom: SPACING.md,
    textAlign: 'center',
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
    fontWeight: '600',
  },
});