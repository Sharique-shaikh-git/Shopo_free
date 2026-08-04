import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SettingsRow, SettingsSection } from '../../../../components/settings-row';

export default function AppVersionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        className="w-full flex-row justify-between items-center px-gutter-mobile py-4"
      >
        <TouchableOpacity
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full active:scale-95"
        >
          <MaterialIcons name="arrow-back" size={24} color="#3e4946" />
        </TouchableOpacity>
        <Text className="font-headline-md text-headline-md font-bold text-growth-green">
          App Version
        </Text>
        <View className="w-10 h-10" />
      </Animated.View>

      {/* Main */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="px-gutter-mobile pt-stack-lg"
      >
        {/* Logo & Version */}
        <Animated.View entering={FadeInDown.duration(400).delay(50).springify()} className="items-center pt-stack-md pb-stack-lg">
          <View className="w-32 h-32 rounded-xl bg-primary-container items-center justify-center mb-stack-md border border-border-subtle overflow-hidden">
            <MaterialIcons name="storefront" size={64} color="#95e8d8" />
          </View>
          <Text className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-stack-sm text-center">
            Shop Builder
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="font-body-md text-on-surface-variant">Version 1.0.0</Text>
            <View className="w-1 h-1 rounded-full bg-outline-variant" />
            <Text className="font-body-md text-on-surface-variant">Build 123</Text>
          </View>
          <View className="mt-stack-md px-4 py-2 rounded-full bg-surface-container-high border border-border-subtle flex-row items-center gap-2">
            <MaterialIcons name="verified" size={16} color="#006B5E" />
            <Text className="font-label-sm text-label-sm text-on-surface-variant">Up to date</Text>
          </View>
        </Animated.View>

        {/* Links */}
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()}>
          <SettingsSection>
            <SettingsRow icon="new-releases" label="What's New" onPress={() => router.push('/(app)/(stack)/settings/whats-new' as never)} />
            <SettingsRow icon="star-rate" label="Rate Us" onPress={() => {}} divider />
            <SettingsRow icon="policy" label="Privacy Policy" onPress={() => router.push('/(app)/(stack)/settings/privacy' as never)} divider />
            <SettingsRow icon="description" label="Terms of Service" onPress={() => router.push('/(app)/(stack)/settings/terms' as never)} />
          </SettingsSection>
        </Animated.View>

        <View className="items-center mt-stack-md">
          <Text className="font-label-sm text-label-sm text-on-surface-variant text-center opacity-70">
            © 2024 Shop Builder Inc.{`\n`}All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
