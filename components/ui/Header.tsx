import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { router, useRouter } from 'expo-router';
import { ArrowLeft, Bell } from 'lucide-react-native';
import colors from '@/constants/Colors';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '@/constants/Theme';
import { Menu, Provider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { triggerHaptic } from '@/utils/haptics';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showNotification?: boolean;
  onNotificationPress?: () => void;
  rightComponent?: React.ReactNode;
  style?: ViewStyle;
}

export default function Header({
  title,
  showBack = false,
  showNotification = false,
  onNotificationPress,
  rightComponent,
  style,
}: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Hỗ trợ truyền 1 phần tử hoặc mảng phần tử cho rightComponent
  const renderRightComponents = () => {
    if (!rightComponent) return null;
    if (Array.isArray(rightComponent)) {
      return rightComponent.map((item, idx) => (
        <View key={idx} style={styles.rightItem}>
          {item} 
        </View>
      ));
    }
    return <View style={styles.rightItem}>{rightComponent}</View>;
  };

  return (
    <View style={[
      styles.container, 
      { paddingTop: insets.top },
      style
    ]}>
      <View style={styles.content}>
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft size={24} color={colors.white} />
            </TouchableOpacity>
          )}
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>
        <View style={styles.rightContainer}>
          {renderRightComponents()}
          {showNotification && (
            <TouchableOpacity 
              style={styles.notificationButton} 
              onPress={onNotificationPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Bell size={24} color={colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
  },
  content: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightItem: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 36,
    minHeight: 36,
    color: colors.white,
  },
  backButton: {
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: colors.white,
    flex: 1,
  },
  notificationButton: {
    marginLeft: SPACING.md,
  }
});
