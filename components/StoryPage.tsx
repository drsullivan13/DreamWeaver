import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { StoryPage as StoryPageType } from '@/engine/types';

interface StoryPageProps {
  page: StoryPageType;
  pageNumber: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function StoryPage({ page, pageNumber }: StoryPageProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.imageSection}>
        {page.imageUrl ? (
          <Image
            source={{ uri: page.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <LinearGradient
            colors={[Colors.surfaceLight, Colors.surface, Colors.background]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.imagePlaceholder}
          >
            <Text style={styles.placeholderEmoji}>✨</Text>
            <Text style={styles.placeholderText}>Illustration loading...</Text>
          </LinearGradient>
        )}
        <View style={styles.pageIndicator}>
          <Text style={styles.pageNumber}>{pageNumber}</Text>
        </View>
      </View>

      <View style={styles.textSection}>
        <Text style={styles.storyText}>{page.text}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    backgroundColor: Colors.background,
  },
  imageSection: {
    flex: 0.6,
    padding: Spacing.md,
    position: 'relative',
  },
  image: {
    flex: 1,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  imagePlaceholder: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  placeholderText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  pageIndicator: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.surface,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNumber: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  textSection: {
    flex: 0.4,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    justifyContent: 'center',
  },
  storyText: {
    ...Typography.storyText,
    color: Colors.text,
  },
});
