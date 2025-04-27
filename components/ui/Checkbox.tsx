import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, ViewStyle } from 'react-native';
import { Check } from 'lucide-react-native';
import colors from '@/constants/Colors';
import { BORDER_RADIUS, FONT_SIZE, SPACING } from '@/constants/Theme';
import { triggerHaptic } from '@/utils/haptics';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function Checkbox({
  checked,
  onToggle,
  label,
  disabled = false,
  style,
}: CheckboxProps) {
  const handleToggle = () => {
    triggerHaptic('light');
    onToggle();
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handleToggle}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          checked && styles.checked,
          disabled && styles.disabled,
        ]}
      >
        {checked && <Check size={14} color={colors.white} />}
      </View>
      {label && (
        <Text
          style={[
            styles.label,
            disabled && styles.disabledLabel,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: BORDER_RADIUS.xs,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  checked: {
    backgroundColor: colors.primary,
  },
  disabled: {
    borderColor: colors.disabled,
    backgroundColor: colors.disabled,
  },
  label: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.sm,
    color: colors.text,
  },
  disabledLabel: {
    color: colors.textLight,
  },
});