import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

export function AnimatedSplashScreen() {
  const logoScale = useSharedValue(0.9);
  const logoOpacity = useSharedValue(0);
  
  const titleTranslateY = useSharedValue(20);
  const titleOpacity = useSharedValue(0);
  
  const footerTranslateY = useSharedValue(20);
  const footerOpacity = useSharedValue(0);

  const dot1Y = useSharedValue(0);
  const dot2Y = useSharedValue(0);
  const dot3Y = useSharedValue(0);
  
  const initOpacity = useSharedValue(0.7);

  useEffect(() => {
    // Logo entrance: scale-in 1s cubic-bezier(0.16, 1, 0.3, 1)
    logoScale.value = withTiming(1, { duration: 1000, easing: Easing.bezier(0.16, 1, 0.3, 1) });
    logoOpacity.value = withTiming(1, { duration: 1000 });

    // Title entrance: fade-in-up delay 200ms
    titleTranslateY.value = withDelay(200, withTiming(0, { duration: 800, easing: Easing.bezier(0.16, 1, 0.3, 1) }));
    titleOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));

    // Footer entrance: fade-in-up delay 400ms
    footerTranslateY.value = withDelay(400, withTiming(0, { duration: 800, easing: Easing.bezier(0.16, 1, 0.3, 1) }));
    footerOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));

    // Loading dots bounce animation
    const bounceConfig = { duration: 500, easing: Easing.inOut(Easing.ease) };
    const createBounce = (delay: number) => 
      withDelay(delay, withRepeat(
        withSequence(
          withTiming(-6, bounceConfig),
          withTiming(0, bounceConfig)
        ),
        -1,
        true
      ));
    
    dot1Y.value = createBounce(100);
    dot2Y.value = createBounce(200);
    dot3Y.value = createBounce(300);

    // "INITIALISING" text pulse: opacity 1 → 0.7 loop
    initOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.7, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleTranslateY.value }],
    opacity: titleOpacity.value,
  }));

  const footerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: footerTranslateY.value }],
    opacity: footerOpacity.value,
  }));

  return (
    <View className="flex-1 bg-surface items-center justify-center">
      {/* Top Glow Ornament — gradient hint from Stitch */}
      <View className="absolute top-0 left-0 right-0 h-64 bg-primary-fixed/10 opacity-50" />

      {/* Main Branding Content */}
      <View className="items-center z-10">
        {/* App Logo Container */}
        <Animated.View 
          className="w-24 h-24 rounded-3xl bg-surface-container-lowest border border-border-subtle items-center justify-center shadow-sm mb-2"
          style={logoStyle}
        >
          <MaterialIcons name="storefront" size={48} color="#006B5E" />
        </Animated.View>

        {/* App Name */}
        <Animated.View style={titleStyle}>
          <Text className="text-[28px] font-bold text-primary tracking-tight text-center">
            Shop Builder
          </Text>
        </Animated.View>
      </View>

      {/* Bottom Content — Tagline & Loading */}
      <Animated.View 
        className="absolute bottom-16 w-full items-center px-5"
        style={footerStyle}
      >
        {/* Tagline */}
        <Text className="text-[16px] text-on-surface-variant text-center max-w-[280px] mb-4">
          Build your online business in seconds.
        </Text>
        
        {/* Loading Indicator */}
        <View className="items-center gap-3">
          <View className="flex-row space-x-1.5">
            <Animated.View 
              className="w-2 h-2 rounded-full bg-primary/20" 
              style={{ transform: [{ translateY: dot1Y }] }} 
            />
            <Animated.View 
              className="w-2 h-2 rounded-full bg-primary/40" 
              style={{ transform: [{ translateY: dot2Y }] }} 
            />
            <Animated.View 
              className="w-2 h-2 rounded-full bg-primary/60" 
              style={{ transform: [{ translateY: dot3Y }] }} 
            />
          </View>
          <Animated.Text 
            className="text-[12px] font-medium text-outline uppercase tracking-widest"
            style={{ opacity: initOpacity }}
          >
            INITIALISING
          </Animated.Text>
        </View>
      </Animated.View>

      {/* Background Dot Pattern — 3% opacity from Stitch */}
      <View 
        className="absolute inset-0 opacity-[0.03] z-0"
        pointerEvents="none"
      />
    </View>
  );
}
