import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity,Linking } from 'react-native';
import { Clock, MapPin, User } from 'lucide-react-native';
import colors from '@/constants/Colors';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from '@/constants/Theme';
import { Status } from '@/types/status';
import { useUserProfileStore } from '@/store/profile-store';
import { Role } from '@/types';
import { useZoomStore } from '@/store/zoom-store';
import { useTranslation } from 'react-i18next';
interface ClassCardProps {
  scheduleId: string;
  title: string;
  time: string;
  location: string;
  tutor: string;
  status: Status;
  zoomLink?: string;
  role?: Role;
  studyType: 'Online' | 'Offline';  
  onPress: () => void;
}

export default function ClassCard({
  scheduleId,
  title,
  time,
  location,
  tutor,
  status,
  onPress,
  zoomLink,
  studyType,
  role
}: ClassCardProps) {
  const { fetchUserById } = useUserProfileStore();
  const { createZoomMeeting } = useZoomStore();
   const [zoomCreated, setZoomCreated] = useState(false);
   const { t } = useTranslation();
  useEffect(() => {
    const fetchData = async () => {
      await fetchUserById(tutor);
    };
    fetchData();
  }, [zoomCreated]);

  const getStatusColor = () => {
    if (studyType === 'Offline')
      return colors.success;
    else
      return colors.primary;
  };

  const handleCreateZoom = async () => {
    try {
      await createZoomMeeting(scheduleId);
      alert(t('Tạo Zoom thành công!'));
      setZoomCreated(prev => !prev);
    } catch (error) {
      alert(t('Lỗi khi tạo Zoom. Vui lòng thử lại sau.'));
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: getStatusColor() }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>

        <View style={styles.infoRow}>
          <Clock size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{time}</Text>
        </View>

        <View style={styles.infoRow}>
          <MapPin size={16} color={colors.textSecondary} />
          <Text style={styles.infoText} numberOfLines={1}>{location}</Text>
        </View>

        <View style={styles.infoRow}>
          <User size={16} color={colors.textSecondary} />
          <Text style={styles.infoText} numberOfLines={1}>{tutor}</Text>
        </View>

        {studyType === 'Online' && zoomLink ? (
          <TouchableOpacity
            style={{
              marginTop: SPACING.sm,
              backgroundColor: colors.primary,
              borderRadius: BORDER_RADIUS.sm,
              paddingVertical: 8,
              alignItems: 'center',
            }}
            onPress={() => {
              if (zoomLink) {
                Linking.openURL(zoomLink);
              }
            }}
          >
            <Text style={{ color: colors.white, fontWeight: 'bold' }}>Tham gia lớp học</Text>
          </TouchableOpacity>
        ) : null}

        {role?.roleName === 'Tutor' && studyType === 'Online' ? (
          <TouchableOpacity
            style={{
              marginTop: SPACING.sm,
              backgroundColor: colors.success,
              borderRadius: BORDER_RADIUS.sm,
              paddingVertical: 8,
              alignItems: 'center',
            }}
            onPress={handleCreateZoom}
          >
          <Text style={{ color: colors.white, fontWeight: 'bold' }}>Tạo Zoom</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    ...SHADOWS.small,
  },
  content: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: "medium",
    color: colors.text,
    marginBottom: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginLeft: SPACING.sm,
  },
});