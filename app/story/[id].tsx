import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { useStoryStore } from '@/stores/storyStore';
import { useLibraryStore } from '@/stores/libraryStore';
import PageTurner from '@/components/PageTurner';
import { loadStory } from '@/services/storage';

export default function StoryReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentStory = useStoryStore((s) => s.currentStory);
  const currentPage = useStoryStore((s) => s.currentPage);
  const setCurrentStory = useStoryStore((s) => s.setCurrentStory);
  const setCurrentPage = useStoryStore((s) => s.setCurrentPage);
  const saveStory = useLibraryStore((s) => s.saveStory);

  const [loading, setLoading] = useState(!currentStory || currentStory.id !== id);

  useEffect(() => {
    if (currentStory && currentStory.id === id) {
      setLoading(false);
      return;
    }

    loadStory(id!)
      .then((story) => {
        if (story) {
          setCurrentStory(story);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading story...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentStory) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Story not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isLastPage = currentPage === currentStory.pages.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="close" size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {currentStory.title}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <PageTurner
        pages={currentStory.pages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {isLastPage && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={async () => {
              await saveStory(currentStory);
              router.replace('/(tabs)/library');
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="heart" size={20} color={Colors.background} />
            <Text style={styles.saveText}>Save to Library</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => router.replace('/(tabs)')}
            activeOpacity={0.8}
          >
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  backLink: {
    ...Typography.body,
    color: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  title: {
    ...Typography.subtitle,
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 28,
  },
  saveText: {
    ...Typography.body,
    color: Colors.background,
    fontWeight: '600',
  },
  doneButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 28,
    backgroundColor: Colors.surface,
  },
  doneText: {
    ...Typography.body,
    color: Colors.text,
  },
});
