import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { PromptStarter, promptStarters } from '@/engine/story/prompts';

interface PromptStartersProps {
  onSelect: (starter: PromptStarter) => void;
}

export default function PromptStarters({ onSelect }: PromptStartersProps) {
  const renderCard = ({ item }: { item: PromptStarter }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={promptStarters}
      renderItem={renderCard}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      snapToInterval={128 + Spacing.sm}
      decelerationRate="fast"
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  card: {
    width: 128,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  emoji: {
    fontSize: 36,
  },
  title: {
    ...Typography.caption,
    color: Colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
});
