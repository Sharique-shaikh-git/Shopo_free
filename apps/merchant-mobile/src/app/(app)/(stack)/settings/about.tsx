import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        className="w-full flex-row items-center px-gutter-mobile py-4"
      >
        <TouchableOpacity
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="w-10 h-10 items-start justify-center rounded-full active:scale-95"
        >
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="font-headline-md text-headline-md text-on-surface ml-2">About Us</Text>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="px-gutter-mobile pt-stack-md"
      >
        {/* Hero */}
        <Animated.View entering={FadeInDown.duration(400).delay(50).springify()} className="items-center mb-stack-lg">
          <View className="w-32 h-32 rounded-3xl bg-surface-container-low border border-border-subtle items-center justify-center mb-stack-md">
            <MaterialIcons name="storefront" size={64} color="#006B5E" />
          </View>
          <Text className="font-headline-lg-mobile text-headline-lg-mobile text-growth-green text-center mb-stack-sm tracking-tight">
            Empowering Pakistani shopkeepers
          </Text>
          <Text className="font-body-md text-body-md text-on-surface-variant text-center">
            We are building the digital bridge for traditional retail. Our mission is to transform everyday commerce with radical simplicity, giving power back to local merchants through accessible technology.
          </Text>
        </Animated.View>

        {/* Value Cards */}
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="gap-stack-md mb-stack-lg">
          <View className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md flex-row items-start gap-stack-md">
            <View className="bg-primary-container p-3 rounded-lg items-center justify-center">
              <MaterialIcons name="verified-user" size={24} color="#95e8d8" />
            </View>
            <View className="flex-1">
              <Text className="font-label-lg text-label-lg text-on-surface">Reliability Built-in</Text>
              <Text className="font-body-md text-body-md text-on-surface-variant mt-1">
                Systems you can trust to run your business, every single day without fail.
              </Text>
            </View>
          </View>

          <View className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md flex-row items-start gap-stack-md">
            <View className="bg-tertiary-container p-3 rounded-lg items-center justify-center">
              <MaterialIcons name="touch-app" size={24} color="#ccd8ff" />
            </View>
            <View className="flex-1">
              <Text className="font-label-lg text-label-lg text-on-surface">Radical Simplicity</Text>
              <Text className="font-body-md text-body-md text-on-surface-variant mt-1">
                Technology designed for humans. No complex manuals, just intuitive actions.
              </Text>
            </View>
          </View>

          <View className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md flex-row items-start gap-stack-md">
            <View className="bg-secondary-container p-3 rounded-lg items-center justify-center">
              <MaterialIcons name="trending-up" size={24} color="#007232" />
            </View>
            <View className="flex-1">
              <Text className="font-label-lg text-label-lg text-on-surface">Partner in Growth</Text>
              <Text className="font-body-md text-body-md text-on-surface-variant mt-1">
                We succeed only when you succeed. Tools designed to scale your revenue.
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Social Links */}
        <Animated.View entering={FadeInDown.duration(400).delay(200).springify()} className="items-center pt-stack-lg gap-stack-sm border-t border-border-subtle">
          <Text className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-2">
            Connect with us
          </Text>
          <View className="flex-row items-center justify-center gap-stack-lg">
            <TouchableOpacity className="w-12 h-12 rounded-full bg-surface-container-high items-center justify-center active:scale-90">
              <MaterialIcons name="thumb-up" size={24} color="#0055D4" />
            </TouchableOpacity>
            <TouchableOpacity className="w-12 h-12 rounded-full bg-surface-container-high items-center justify-center active:scale-90">
              <MaterialIcons name="photo-camera" size={24} color="#BA1A1A" />
            </TouchableOpacity>
            <TouchableOpacity className="w-12 h-12 rounded-full bg-surface-container-high items-center justify-center active:scale-90">
              <MaterialIcons name="music-note" size={24} color="#1a1c1e" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
