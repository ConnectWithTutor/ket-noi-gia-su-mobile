import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { MapPin, Users, Clock, DollarSign } from 'lucide-react-native';

import colors from '@/constants/Colors';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from '@/constants/Theme';
import { StudentRequest } from '@/types/student-request';
import { User } from '@/types/user';
import { getRelativeTime } from '@/utils/date-utils';
import { useUserProfileStore } from '@/store/profile-store';
import PostStatus from './PostStatus';
import { useSubjectStore } from '@/store/subjectStore';
import { Subject } from '@/types';

interface PostCardProps {
  post: StudentRequest;
  onPress: () => void;
}

function PostCardComponent({ post, onPress }: PostCardProps) {
  const { fetchUserById } = useUserProfileStore();
  const [author, setAuthor] = useState<User | null>(null);
  const { fetchSubjects, getSubjectById, subjects, loading } = useSubjectStore();
  const [subject, setSubject] = useState<Subject | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    async function fetchAuthor() {
      await fetchUserById(post.studentId);
      setAuthor(useUserProfileStore.getState().user);
    }
    fetchAuthor();
  }, [fetchUserById, post.studentId]);

  useEffect(() => {
    if (!loading && subjects.length > 0) {
      const sub = getSubjectById(post.subjectId);
      if (sub) setSubject(sub);
      else console.error(`Subject with ID ${post.subjectId} not found`);
    }
  }, [loading, subjects, getSubjectById, post.subjectId]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: author?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.userName}>{author?.fullName}</Text>
            <Text style={styles.postTime}>{getRelativeTime(post.createdAt)}</Text>
          </View>
        </View>
        <PostStatus statusId={post.status} />
      </View>
      
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{post.description}</Text>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <MapPin size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{post.location}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Users size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>2 học sinh</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Clock size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{post.preferredSchedule}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <DollarSign size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{post.tuitionFee}đ/giờ</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.subjectBadge}>
          <Text style={styles.subjectText}>{subject?.subjectName_vi}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Memo hóa component, so sánh props đơn giản
export default React.memo(PostCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.post.requestId === nextProps.post.requestId &&
    prevProps.onPress === nextProps.onPress
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.sm,
  },
  userName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: colors.primary,
  },
  postTime: {
    fontSize: FONT_SIZE.xs,
    color: colors.textSecondary,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: SPACING.md,
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONT_SIZE.xs,
    color: colors.textSecondary,
    marginLeft: SPACING.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  subjectText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: colors.white,
  },
});
