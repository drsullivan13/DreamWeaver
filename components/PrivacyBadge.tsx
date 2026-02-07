import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '@/constants/theme';

interface PrivacyBadgeProps {
  tier?: 'cloud' | 'hybrid' | 'local';
}

const TIER_CONFIG = {
  cloud: { icon: 'cloud-outline' as const, label: 'Cloud' },
  hybrid: { icon: 'git-compare-outline' as const, label: 'Hybrid' },
  local: { icon: 'phone-portrait-outline' as const, label: 'Local' },
};

export default function PrivacyBadge({ tier = 'cloud' }: PrivacyBadgeProps) {
  const config = TIER_CONFIG[tier];

  return (
    <View style={styles.badge}>
      <Ionicons name={config.icon} size={14} color={Colors.textSecondary} />
      <Text style={styles.label}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.surfaceLight,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
