import React from 'react';
import { StatusBar as RNStatusBar, StatusBarProps, View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '@/constants/Colors';

interface CustomStatusBarProps extends StatusBarProps {
  backgroundColor?: string;
}

export default function StatusBar({
  backgroundColor = colors.primary,
  barStyle = 'light-content',
  ...props
}: CustomStatusBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ 
      height: Platform.OS === 'ios' ? insets.top : 0,
      backgroundColor 
    }}>
      <RNStatusBar
        translucent
        backgroundColor={backgroundColor}
        barStyle={barStyle}
        {...props}
      />
    </View>
  );
}