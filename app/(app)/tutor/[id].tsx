import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Alert 
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { 
  MapPin, 
  Star, 
  DollarSign, 
  Clock, 
  BookOpen, 
  MessageSquare, 
  Share2, 
  Award, 
  Briefcase 
} from "lucide-react-native";

import colors from "@/constants/Colors";
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from "@/constants/Theme";
import StatusBar from "@/components/ui/StatusBar";
import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";
import { useTutorStore } from "@/store/tutor-store";
import { useChatStore } from "@/store/chat-store";
import { useAuthStore } from "@/store/auth-store";
import { triggerHaptic } from "@/utils/haptics";

export default function TutorProfileScreen() {
  const { id } = useLocalSearchParams();
  const tutorId = Array.isArray(id) ? id[0] : id;
  
  const router = useRouter();
  const { fetchTutors, getTutorById } = useTutorStore();
  const { user } = useAuthStore();
  const { conversations, setActiveConversation } = useChatStore();
  
  const [tutor, setTutor] = useState(getTutorById(tutorId));
  
  useEffect(() => {
    if (!tutor) {
      fetchTutors().then(() => {
        setTutor(getTutorById(tutorId));
      });
    }
  }, [tutorId]);
  
  useEffect(() => {
    if (!tutor && !useTutorStore.getState().isLoading) {
      router.back();
    }
  }, [tutor]);
  
  if (!tutor) {
    return null;
  }
  
  const handleMessage = () => {
    triggerHaptic('medium');
    // Find existing conversation or create new one
    const existingConversation = conversations.find(conv => 
      conv.participants.includes(user?.id || '') && 
      conv.participants.includes(tutorId)
    );
    
    if (existingConversation) {
      setActiveConversation(existingConversation.id);
      router.push(`/conversation/${existingConversation.id}`);
    } else {
      // In a real app, you would create a new conversation here
      Alert.alert(
        "Thông báo",
        "Tính năng nhắn tin sẽ được cập nhật trong phiên bản tiếp theo."
      );
    }
  };
  
  const handleShare = () => {
    triggerHaptic('light');
    Alert.alert(
      "Chia sẻ",
      "Tính năng chia sẻ sẽ được cập nhật trong phiên bản tiếp theo."
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <Header title="Thông tin gia sư" showBack />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: tutor.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }} 
            style={styles.avatar} 
          />
          
          <Text style={styles.name}>{tutor.name}</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={18} color="#FFB400" fill="#FFB400" />
            <Text style={styles.rating}>
              {tutor.rating} ({tutor.reviewCount} đánh giá)
            </Text>
          </View>
          
          <View style={styles.subjectsContainer}>
            {tutor.subjects.map((subject, index) => (
              <View key={index} style={styles.subjectBadge}>
                <Text style={styles.subjectText}>{subject}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MapPin size={18} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>Khu vực:</Text>
              <Text style={styles.infoValue}>{tutor.location}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <DollarSign size={18} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>Học phí:</Text>
              <Text style={styles.infoValue}>{tutor.hourlyRate.toLocaleString('vi-VN')}đ/giờ</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Clock size={18} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>Lịch dạy:</Text>
              <Text style={styles.infoValue}>{tutor.availability}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giới thiệu</Text>
          <Text style={styles.bioText}>{tutor.bio}</Text>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Award size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Học vấn</Text>
          </View>
          <Text style={styles.educationText}>{tutor.education}</Text>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Briefcase size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Kinh nghiệm</Text>
          </View>
          {tutor.experience.map((exp, index) => (
            <View key={index} style={styles.experienceItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.experienceText}>{exp}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.actionsContainer}>
          <Button
            title="Nhắn tin"
            onPress={handleMessage}
            icon={<MessageSquare size={20} color={colors.white} />}
            iconPosition="left"
            fullWidth
            style={styles.messageButton}
          />
          
          <TouchableOpacity 
            style={styles.shareButton} 
            onPress={handleShare}
          >
            <Share2 size={20} color={colors.primary} />
            <Text style={styles.shareText}>Chia sẻ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SPACING.md,
  },
  name: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: SPACING.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  rating: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    marginLeft: SPACING.xs,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  subjectBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
    margin: SPACING.xs / 2,
  },
  subjectText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    marginLeft: SPACING.xs,
    marginRight: SPACING.xs,
    width: 70,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: colors.text,
    marginLeft: SPACING.xs,
  },
  bioText: {
    fontSize: FONT_SIZE.md,
    color: colors.text,
    lineHeight: 22,
  },
  educationText: {
    fontSize: FONT_SIZE.md,
    color: colors.text,
    lineHeight: 22,
  },
  experienceItem: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: SPACING.sm,
  },
  experienceText: {
    fontSize: FONT_SIZE.md,
    color: colors.text,
    lineHeight: 22,
    flex: 1,
  },
  actionsContainer: {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    ...SHADOWS.small,
    alignItems: 'center',
  },
  messageButton: {
    marginBottom: SPACING.md,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  shareText: {
    fontSize: FONT_SIZE.md,
    color: colors.primary,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
});