import { Platform } from 'react-native';

// Import Haptics only on native platforms
let Haptics: any = null;
if (Platform.OS !== 'web') {
  Haptics = require('expo-haptics');
}

// Helper function to safely use haptics only on native platforms
export const triggerHaptic = (
  type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection'
) => {
  if (Platform.OS === 'web' || !Haptics) {
    return;
  }

  try {
    switch (type) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'selection':
        Haptics.selectionAsync();
        break;
    }
  } catch (error) {
    // Silently fail if haptics aren't available
    console.log('Haptics not available:', error);
  }
};