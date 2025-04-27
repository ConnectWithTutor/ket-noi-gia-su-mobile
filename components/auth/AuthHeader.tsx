import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import colors from '@/constants/Colors';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '@/constants/Theme';

interface AuthHeaderProps {
  title: string;
  showLogo?: boolean;
}

export default function AuthHeader({ title, showLogo = true }: AuthHeaderProps) {
  return (
    <View style={styles.container}>
      {showLogo && (
          <Image
          source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  logo: {
    width: 80,
    height: 80,
    marginRight: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 700,
    color: colors.white,
    textAlign: 'center',
  },
});