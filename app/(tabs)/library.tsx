import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { useLibraryStore } from '@/stores/libraryStore';
import BookShelf from '@/components/BookShelf';
import { Story } from '@/engine/types';

export default function LibraryScreen() {
  const stories = useLibraryStore((s) => s.stories);
  const isLoading = useLibraryStore((s) => s.isLoading);
  const loadStories = useLibraryStore((s) => s.loadStories);
  const deleteStory = useLibraryStore((s) => s.deleteStory);

  useEffect(() => {
    loadStories();
  }, []);

  function handleSelect(story: Story): void {
    router.push(`/story/${story.id}`);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Library</Text>
        <Text style={styles.count}>
          {stories.length} {stories.length === 1 ? 'story' : 'stories'}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <BookShelf
          stories={stories}
          onSelect={handleSelect}
          onDelete={deleteStory}
        />
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
    alignItems: 'baseline',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: {
    ...Typography.hero,
    color: Colors.text,
  },
  count: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
