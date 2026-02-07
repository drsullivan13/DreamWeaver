import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { useSettingsStore } from '@/stores/settingsStore';
import { useStoryStore } from '@/stores/storyStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { AdaptiveEngine } from '@/engine/AdaptiveEngine';
import { ClaudeStoryProvider } from '@/engine/story/ClaudeStoryProvider';
import { ReplicateImageProvider } from '@/engine/image/ReplicateImageProvider';
import PromptStarters from '@/components/PromptStarters';
import VoiceInput from '@/components/VoiceInput';
import LoadingDream from '@/components/LoadingDream';
import PrivacyBadge from '@/components/PrivacyBadge';
import { PromptStarter } from '@/engine/story/prompts';

const engine = new AdaptiveEngine(
  new ClaudeStoryProvider(),
  new ReplicateImageProvider(),
);

export default function CreateScreen() {
  const [prompt, setPrompt] = useState('');
  const [theme, setTheme] = useState('');

  const childName = useSettingsStore((s) => s.childName);
  const ageRange = useSettingsStore((s) => s.ageRange);
  const isGenerating = useStoryStore((s) => s.isGenerating);
  const setGenerating = useStoryStore((s) => s.setGenerating);
  const setCurrentStory = useStoryStore((s) => s.setCurrentStory);
  const error = useStoryStore((s) => s.error);
  const setError = useStoryStore((s) => s.setError);
  const saveStory = useLibraryStore((s) => s.saveStory);

  const handleStarterSelect = useCallback((starter: PromptStarter) => {
    setPrompt(starter.prompt);
    setTheme(starter.theme);
  }, []);

  const handleVoiceResult = useCallback((text: string) => {
    setPrompt(text);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    const name = childName || 'Little One';
    setGenerating(true);
    setError(null);

    try {
      const story = await engine.generateStory({
        prompt: prompt.trim(),
        childName: name,
        ageRange,
        theme: theme || 'adventure',
      });

      setCurrentStory(story);
      await saveStory(story);
      router.push(`/story/${story.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate story');
    } finally {
      setGenerating(false);
    }
  }, [prompt, theme, childName, ageRange, setGenerating, setError, setCurrentStory, saveStory]);

  return (
    <SafeAreaView style={styles.container}>
      {isGenerating && <LoadingDream />}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create a Story</Text>
            <PrivacyBadge />
          </View>

          <Text style={styles.sectionLabel}>Pick a theme</Text>
          <PromptStarters onSelect={handleStarterSelect} />

          <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>
            Or describe your own
          </Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="A magical adventure about..."
              placeholderTextColor={Colors.textSecondary}
              value={prompt}
              onChangeText={setPrompt}
              multiline
            />
            <VoiceInput onResult={handleVoiceResult} />
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => setError(null)}>
                <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.nameRow}>
            <Ionicons name="person-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.nameLabel}>
              Hero: {childName || 'Little One'}
            </Text>
            <TouchableOpacity onPress={() => router.push('/settings')}>
              <Text style={styles.changeLink}>Change</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.generateButton, !prompt.trim() && styles.generateButtonDisabled]}
            onPress={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            activeOpacity={0.8}
          >
            <Ionicons name="sparkles" size={22} color={Colors.background} />
            <Text style={styles.generateText}>Create My Story</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  title: {
    ...Typography.hero,
    color: Colors.text,
  },
  sectionLabel: {
    ...Typography.subtitle,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.lg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    color: Colors.text,
    ...Typography.body,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 12,
  },
  nameLabel: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
  },
  changeLink: {
    ...Typography.body,
    color: Colors.primary,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 28,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.error,
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 12,
  },
  errorText: {
    ...Typography.body,
    color: Colors.error,
    flex: 1,
  },
  generateText: {
    ...Typography.subtitle,
    color: Colors.background,
    fontWeight: '600',
  },
});
