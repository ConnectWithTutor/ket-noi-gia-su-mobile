import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { MapPin, Star, DollarSign } from 'lucide-react-native';

import colors from '@/constants/Colors';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from '@/constants/Theme';
import { TutorProfile } from '@/types/tutor';

interface TutorCardProps {
  tutor: TutorProfile;
  onPress: () => void;
}

export default function TutorCard({ tutor, onPress }: TutorCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Image 
          source={{ uri: tutor.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }} 
          style={styles.avatar} 
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{tutor.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFB400" fill="#FFB400" />
            <Text style={styles.rating}>
              {tutor.rating} ({tutor.reviewCount} đánh giá)
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.subjectsContainer}>
        {tutor.subjects.map((subject, index) => (
          <View key={index} style={styles.subjectBadge}>
            <Text style={styles.subjectText}>{subject}</Text>
          </View>
        ))}
      </View>
      
      <Text style={styles.bio} numberOfLines={2}>{tutor.bio}</Text>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <MapPin size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{tutor.location}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <DollarSign size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{tutor.hourlyRate.toLocaleString('vi-VN')}đ/giờ</Text>
        </View>
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
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: SPACING.md,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: SPACING.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginLeft: SPACING.xs,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.sm,
  },
  subjectBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  subjectText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: colors.primary,
  },
  bio: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: SPACING.md,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginLeft: SPACING.xs,
  },
});