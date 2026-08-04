import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const CATEGORIES: { label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { label: 'Electronics', icon: 'devices' },
  { label: 'Apparel', icon: 'checkroom' },
  { label: 'Home & Living', icon: 'weekend' },
  { label: 'Groceries', icon: 'shopping-basket' },
  { label: 'Beauty', icon: 'content-cut' },
  { label: 'Food & Beverage', icon: 'restaurant' },
  { label: 'Jewellery', icon: 'diamond' },
  { label: 'Other', icon: 'more-horiz' },
];

export default function StoreCategoriesScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (label: string) =>
    setSelected((prev) => (prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]));

  const handleContinue = () => {
    const primary = selected[0] || '';
    router.push(`/(app)/(stack)/store/create?category=${encodeURIComponent(primary)}` as never);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Top App Bar */}
      <View className="flex-row items-center gap-2 px-gutter-mobile py-4 bg-surface sticky top-0 z-50">
        <MaterialIcons name="storefront" size={28} color="#006B5E" />
        <Text className="font-headline-md text-headline-md font-bold text-growth-green">Shop Builder</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 130 }}
        className="flex-1"
      >
        {/* Progress indicator */}
        <View className="flex-row gap-2 mb-stack-lg">
          <View className="h-1.5 flex-1 bg-growth-green rounded-full" />
          <View className="h-1.5 flex-1 bg-growth-green rounded-full" />
          <View className="h-1.5 flex-1 bg-surface-variant rounded-full" />
        </View>

        {/* Headline */}
        <Animated.View entering={FadeInDown.duration(400).springify()} className="mb-stack-lg">
          <Text className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">What do you sell?</Text>
          <Text className="font-body-md text-body-md text-on-surface-variant">
            Select all categories that apply to your business. This helps us tailor your store's features.
          </Text>
        </Animated.View>

        {/* Category multi-select grid */}
        <View className="flex-row flex-wrap -mx-1">
          {CATEGORIES.map((c, i) => {
            const active = selected.includes(c.label);
            return (
              <Animated.View
                key={c.label}
                entering={FadeInDown.duration(400).delay(80 + i * 50).springify()}
                className="w-1/2 px-1 mb-3"
              >
                <TouchableOpacity
                  onPress={() => toggle(c.label)}
                  activeOpacity={0.85}
                  className={`p-4 rounded-xl border ${
                    active ? 'bg-primary-fixed border-growth-green' : 'bg-surface-container-lowest border-border-subtle'
                  }`}
                >
                  <View className={`w-12 h-12 rounded-full items-center justify-center mb-3 ${active ? 'bg-white' : 'bg-surface-container-low'}`}>
                    <MaterialIcons name={c.icon} size={24} color="#006B5E" />
                  </View>
                  <Text className="font-label-lg text-label-lg text-on-surface">{c.label}</Text>
                  {active && (
                    <View className="absolute top-3 right-3">
                      <MaterialIcons name="check-circle" size={20} color="#006B5E" />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* AI Tip */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(500).springify()}
          className="mt-stack-md p-4 bg-surface-container-lowest border border-border-subtle rounded-xl flex-row gap-3 items-start"
        >
          <MaterialIcons name="auto-awesome" size={22} color="#0055D4" />
          <View className="flex-1">
            <Text className="font-label-lg text-label-lg text-on-surface mb-1">Pro tip</Text>
            <Text className="font-body-md text-body-md text-on-surface-variant leading-5">
              Choosing the right categories lets our AI write better product descriptions for you automatically.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Continue CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface border-t border-border-subtle px-gutter-mobile pt-4 pb-8">
        <TouchableOpacity
          onPress={handleContinue}
          activeOpacity={0.9}
          className="w-full h-14 bg-growth-green rounded-xl flex-row items-center justify-center gap-2 active:scale-95"
        >
          <Text className="text-white font-label-lg text-label-lg font-bold">
            {selected.length > 0 ? `Continue (${selected.length} selected)` : 'Continue'}
          </Text>
          <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
