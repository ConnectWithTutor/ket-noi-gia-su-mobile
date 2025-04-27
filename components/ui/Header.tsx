import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell } from 'lucide-react-native';
import colors from '@/constants/Colors';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '@/constants/Theme';

// Ensure these constants are correctly defined in the imported files.
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
          {rightComponent}
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
    