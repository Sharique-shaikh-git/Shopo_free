import React, { useEffect } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { animations } from '../theme/animations';

interface SkeletonProps {
  style?: StyleProp<ViewStyle>;
  className?: string;
}

export function Skeleton({ style, className }: SkeletonProps) {
  const shimmerProgress = useSharedValue(0);

  useEffect(() => {
    shimmerProgress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: animations.skeleton.shimmerDuration / 2 }),
        withTiming(0, { duration: animations.skeleton.shimmerDuration / 2 })
      ),
      -1, // Infinite
      true // Reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      shimmerProgress.value,
      [0, 0.5, 1],
      animations.skeleton.shimmerColors
    );
    return { backgroundColor };
  });

  return (
    <Animated.View
      style={[
        {
          borderRadius: 8,
          overflow: 'hidden',
        },
        animatedStyle,
        style,
      ]}
      className={className}
    />
  );
}
