import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { MapPin, Users, Clock, DollarSign } from 'lucide-react-native';

import colors from '@/constants/Colors';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from '@/constants/Theme';
import { Post } from '@/types/post';
import { getRelativeTime } from '@/utils/date-utils';

interface PostCardProps {
  post: Post;
  onPress: () => void;
}

export default function PostCard({ post, onPress }: PostCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: post.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.userName}>{post.userName}</Text>
            <Text style={styles.postTime}>{getRelativeTime(post.createdAt)}</Text>
          </View>
        </View>
        <View style={[
          styles.statusBadge, 
          { 
            backgroundColor: post.status === 'active' 
              ? colors.primaryLight 
              : post.status === 'closed' 
                ? colors.danger + '20' 
                : colors.warning + '20'
          }
        ]}>
          <Text style={[
            styles.statusText,
            { 
              color: post.status === 'active' 
                ? colors.white 
                : post.status === 'closed' 
                  ? colors.danger 
                  : colors.warning
            }
          ]}>
            {post.status === 'active' ? 'Đang tìm' : post.status === 'closed' ? 'Đã đóng' : 'Đang xét duyệt'}
          </Text>
        </View>
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
          <Text style={styles.infoText}>{post.studentCount} học sinh</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Clock size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{post.schedule}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <DollarSign size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{post.tuitionFee.toLocaleString('vi-VN')}đ/giờ</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.subjectBadge}>
          <Text style={styles.subjectText}>{post.subject}</Text>
        </View>
        
        {post.applicants !== undefined && post.applicants > 0 && (
          <Text style={styles.applicantsText}>{post.applicants} gia sư đã ứng tuyển</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

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
    color: colors.text,
  },
  postTime: {
    fontSize: FONT_SIZE.xs,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
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
  applicantsText: {
    fontSize: FONT_SIZE.xs,
    color: colors.textSecondary,
  },
});