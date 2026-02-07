import React, { useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { StoryPage as StoryPageType } from '@/engine/types';
import StoryPage from '@/components/StoryPage';

interface PageTurnerProps {
  pages: StoryPageType[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PageTurner({ pages, currentPage, onPageChange }: PageTurnerProps) {
  const scrollRef = useRef<ScrollView>(null);

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const page = Math.round(offsetX / SCREEN_WIDTH);
      if (page !== currentPage) {
        onPageChange(page);
      }
    },
    [currentPage, onPageChange]
  );

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      x: currentPage * SCREEN_WIDTH,
      animated: true,
    });
  }, [currentPage]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        decelerationRate="fast"
        style={styles.scrollView}
      >
        {pages.map((page, index) => (
          <StoryPage key={index} page={page} pageNumber={index + 1} />
        ))}
      </ScrollView>

      <View style={styles.dotsContainer}>
        {pages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentPage ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotInactive: {
    backgroundColor: Colors.surfaceLight,
  },
});
