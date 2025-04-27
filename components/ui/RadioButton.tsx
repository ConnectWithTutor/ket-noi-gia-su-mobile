import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, ViewStyle } from 'react-native';
import colors from '@/constants/Colors';
import { FONT_SIZE, SPACING } from '@/constants/Theme';

interface RadioButtonProps {
  selected: boolean;
  onSelect: () => void;
  label: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function RadioButton({
  selected,
  onSelect,
  label,
  disabled = false,
  style,
}: RadioButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onSelect}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.radio,
          disabled && styles.disabled,
        ]}
      >
        {selected && <View style={styles.selected} />}
      </View>
      <Text
        style={[
          styles.label,
          disabled && styles.disabledLabel,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  selected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  disabled: {
    borderColor: colors.disabled,
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