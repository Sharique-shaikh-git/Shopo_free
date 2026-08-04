import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const FEATURES = [
  {
    emoji: '✨',
    title: 'AI-Powered Store',
    desc: 'Upload product photos and let AI generate descriptions, prices, and organize your inventory automatically.',
  },
  {
    emoji: '📊',
    title: 'Sales Analytics',
    desc: 'Track your daily, weekly, and monthly sales performance with our intuitive dashboard.',
  },
  {
    emoji: '💬',
    title: 'WhatsApp Orders',
    desc: 'Receive and manage orders directly through WhatsApp — no complex forms needed.',
  },
  {
    emoji: '🔒',
    title: 'Secure & Private',
    desc: 'Your data is encrypted and never shared. Full control over your shop privacy settings.',
  },
];

export default function WhatsNewScreen() {
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
          What's New
        </Text>
        <View className="w-10 h-10" />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="px-gutter-mobile pt-stack-lg"
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400).delay(50).springify()} className="items-center mb-stack-lg">
          <View className="w-24 h-24 bg-primary-container rounded-full items-center justify-center mb-stack-md">
            <MaterialIcons name="rocket-launch" size={40} color="#95e8d8" />
          </View>
          <Text className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface text-center">
            Version 1.0.0
          </Text>
          <Text className="font-body-md text-body-md text-on-surface-variant text-center mt-2">
            We've been hard at work making things better for you. Check out what's new!
          </Text>
        </Animated.View>

        {/* Features */}
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="gap-stack-md">
          {FEATURES.map((f, idx) => (
            <Animated.View
              key={f.title}
              entering={FadeInDown.duration(400).delay(150 + idx * 50).springify()}
              className="flex-row items-start bg-surface-container-low rounded-xl p-stack-md border border-border-subtle"
            >
              <View className="w-12 h-12 bg-surface rounded-full items-center justify-center mr-stack-md flex-shrink-0">
                <Text className="text-2xl">{f.emoji}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-label-lg text-label-lg text-on-surface mb-1">{f.title}</Text>
                <Text className="font-body-md text-body-md text-on-surface-variant leading-tight">
                  {f.desc}
                </Text>
              </View>
            </Animated.View>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Bottom Action */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface border-t border-border-subtle p-gutter-mobile">
        <TouchableOpacity
          className="w-full min-h-[56px] bg-growth-green rounded-full items-center justify-center active:scale-[0.98]"
          onPress={() => router.back()}
        >
          <Text className="font-label-lg text-label-lg text-on-primary">Got It</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
