import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '@/constants/Colors';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '@/constants/Theme';

interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabKey: string) => void;
  rightActions?: React.ReactNode; // Thêm prop này
}

export default function TabBar({ tabs, activeTab, onTabPress, rightActions }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || SPACING.sm }]}>
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              onPress={() => onTabPress(tab.key)}
              activeOpacity={0.7}
            >
              {isActive ? tab.activeIcon : tab.icon}
              <Text
                style={[
                  styles.label,
                  isActive ? styles.activeLabel : styles.inactiveLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
        {/* Hiển thị actions bên phải */}
        {rightActions && (
          <View style={styles.rightActions}>
            {rightActions}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  rightActions: {
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  label: {
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: '600',
  },
  inactiveLabel: {
    color: colors.textSecondary,
  },
});