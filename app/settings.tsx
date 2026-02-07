import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { useSettingsStore } from '@/stores/settingsStore';
import PrivacyBadge from '@/components/PrivacyBadge';

const AGE_RANGES = ['2-3', '3-5', '5-7', '7-9'];

export default function SettingsScreen() {
  const childName = useSettingsStore((s) => s.childName);
  const ageRange = useSettingsStore((s) => s.ageRange);
  const setChildName = useSettingsStore((s) => s.setChildName);
  const setAgeRange = useSettingsStore((s) => s.setAgeRange);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Child's Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter child's name"
          placeholderTextColor={Colors.textSecondary}
          value={childName}
          onChangeText={setChildName}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Age Range</Text>
        <View style={styles.ageRow}>
          {AGE_RANGES.map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.ageChip,
                ageRange === range && styles.ageChipActive,
              ]}
              onPress={() => setAgeRange(range)}
            >
              <Text
                style={[
                  styles.ageChipText,
                  ageRange === range && styles.ageChipTextActive,
                ]}
              >
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Engine Status</Text>
        <PrivacyBadge tier="cloud" />
        <Text style={styles.hint}>
          Stories are generated using cloud AI services.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: {
    ...Typography.title,
    color: Colors.text,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  label: {
    ...Typography.subtitle,
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    color: Colors.text,
    ...Typography.body,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  ageRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  ageChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  ageChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  ageChipText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  ageChipTextActive: {
    color: Colors.background,
    fontWeight: '600',
  },
  hint: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
