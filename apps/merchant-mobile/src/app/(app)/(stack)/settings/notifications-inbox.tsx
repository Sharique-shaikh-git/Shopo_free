import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function NotificationsInboxScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        className="w-full flex-row justify-between items-center px-gutter-mobile py-4 border-b border-border-subtle"
      >
        <TouchableOpacity
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="w-10 h-10 items-start justify-center rounded-full active:scale-95"
        >
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="font-headline-md text-headline-md font-bold text-growth-green">
          Notifications
        </Text>
        <View className="w-10 h-10" />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}
        className="px-gutter-mobile pt-stack-md"
      >
        {/* Empty State */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(100).springify()}
          className="flex-1 items-center justify-center py-stack-lg"
        >
          <View className="w-24 h-24 rounded-full bg-surface-container-low items-center justify-center mb-stack-md">
            <MaterialIcons name="notifications-none" size={48} color="#6e7976" />
          </View>
          <Text className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface text-center mb-stack-sm">
            No new alerts
          </Text>
          <Text className="font-body-md text-body-md text-on-surface-variant text-center px-stack-md">
            You're all caught up. New order notifications, tips, and updates will appear here.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
