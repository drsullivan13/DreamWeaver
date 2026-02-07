import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { Story } from '@/engine/types';

interface BookShelfProps {
  stories: Story[];
  onSelect: (story: Story) => void;
  onDelete: (id: string) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = Spacing.md;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_GAP * 3) / 2;

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function BookShelf({ stories, onSelect, onDelete }: BookShelfProps) {
  const handleDelete = useCallback(
    (story: Story) => {
      Alert.alert(
        'Delete Story',
        `Are you sure you want to delete "${story.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => onDelete(story.id),
          },
        ]
      );
    },
    [onDelete]
  );

  const renderStoryCard = ({ item }: { item: Story }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onSelect(item)}
      onLongPress={() => handleDelete(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTheme}>{item.theme}</Text>
        <TouchableOpacity
          onPress={() => handleDelete(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="trash-outline" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
      <View style={styles.cardFooter}>
        <Ionicons name="book-outline" size={14} color={Colors.textSecondary} />
        <Text style={styles.cardPages}>
          {item.pages.length} {item.pages.length === 1 ? 'page' : 'pages'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (stories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📚</Text>
        <Text style={styles.emptyTitle}>No stories yet</Text>
        <Text style={styles.emptySubtitle}>
          Create your first bedtime story above!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={stories}
      renderItem={renderStoryCard}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: CARD_GAP,
    gap: CARD_GAP,
  },
  row: {
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    gap: Spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTheme: {
    ...Typography.caption,
    color: Colors.secondary,
    textTransform: 'capitalize',
  },
  cardTitle: {
    ...Typography.subtitle,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  cardDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  cardPages: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.title,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
