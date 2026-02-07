import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';

const LOADING_MESSAGES = [
  'Gathering stardust...',
  'Painting dreams...',
  'Sprinkling moonlight...',
  'Weaving magic...',
  'Adding sparkles...',
];

export default function LoadingDream() {
  const [messageIndex, setMessageIndex] = useState(0);
  const textOpacity = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Rotate loading messages
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [textOpacity]);

  // Pulsing emoji animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <Animated.Text
          style={[styles.emoji, { transform: [{ scale: pulseAnim }] }]}
        >
          🌙
        </Animated.Text>

        <Animated.Text style={[styles.message, { opacity: textOpacity }]}>
          {LOADING_MESSAGES[messageIndex]}
        </Animated.Text>

        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <PulsingDot key={i} delay={i * 200} />
          ))}
        </View>
      </View>
    </View>
  );
}

function PulsingDot({ delay }: { delay: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [delay, opacity]);

  return <Animated.View style={[styles.dot, { opacity }]} />;
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 22, 40, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  content: {
    alignItems: 'center',
    gap: Spacing.lg,
  },
  emoji: {
    fontSize: 64,
  },
  message: {
    ...Typography.title,
    color: Colors.primary,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
});
