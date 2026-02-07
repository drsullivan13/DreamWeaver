import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { useSettingsStore } from '@/stores/settingsStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { Story } from '@/engine/types';

export default function HomeScreen() {
  const childName = useSettingsStore((s) => s.childName);
  const stories = useLibraryStore((s) => s.stories);
  const loadStories = useLibraryStore((s) => s.loadStories);

  useEffect(() => {
    loadStories();
  }, []);

  const recentStories = stories.slice(0, 4);

  const greeting = childName
    ? `Good evening, ${childName}!`
    : 'Good evening!';

  function handleStoryPress(story: Story): void {
    router.push(`/story/${story.id}`);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.heroEmoji}>🌙</Text>
        <Text style={styles.heroTitle}>Ready for a bedtime story?</Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/(tabs)/create')}
          activeOpacity={0.8}
        >
          <Ionicons name="sparkles" size={20} color={Colors.background} />
          <Text style={styles.ctaText}>Create a Story</Text>
        </TouchableOpacity>
      </View>

      {recentStories.length > 0 && (
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Stories</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/library')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentStories}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.recentCard}
                onPress={() => handleStoryPress(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.recentTheme}>{item.theme}</Text>
                <Text style={styles.recentTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.recentPages}>
                  {item.pages.length} pages
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  greeting: {
    ...Typography.title,
    color: Colors.text,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  heroEmoji: {
    fontSize: 72,
  },
  heroTitle: {
    ...Typography.hero,
    color: Colors.text,
    textAlign: 'center',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 28,
    marginTop: Spacing.md,
  },
  ctaText: {
    ...Typography.subtitle,
    color: Colors.background,
    fontWeight: '600',
  },
  recentSection: {
    flex: 1,
    paddingTop: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.subtitle,
    color: Colors.text,
  },
  seeAll: {
    ...Typography.body,
    color: Colors.primary,
  },
  recentList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  recentCard: {
    width: 160,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  recentTheme: {
    ...Typography.caption,
    color: Colors.secondary,
    textTransform: 'capitalize',
  },
  recentTitle: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '500',
  },
  recentPages: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
