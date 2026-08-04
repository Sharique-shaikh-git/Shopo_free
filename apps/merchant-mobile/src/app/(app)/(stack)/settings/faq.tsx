import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const FAQ_ITEMS = [
  {
    q: 'How does AI Shop Builder help my business?',
    a: 'AI Shop Builder lets you create a professional online storefront in minutes. Upload your product photos, and our AI generates descriptions, pricing suggestions, and organizes your inventory automatically.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes! You can set up your basic storefront completely free. We only charge a small transaction fee when you make a sale.',
  },
  {
    q: 'How do I connect WhatsApp?',
    a: 'Go to Settings > Shop Configuration and enter your WhatsApp number. Customers can then click the chat button on your storefront to message you directly.',
  },
];

export default function FAQScreen() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
          className="w-10 h-10 items-start justify-center rounded-full active:scale-95"
        >
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="font-headline-md text-headline-md font-bold text-on-surface">FAQ</Text>
        <View className="w-10" />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="px-gutter-mobile pt-stack-md"
      >
        {/* Search */}
        <Animated.View entering={FadeInDown.duration(400).delay(50).springify()} className="mb-stack-lg">
          <View className="flex-row items-center bg-surface-container-low rounded-xl px-4 h-[56px] border border-transparent">
            <MaterialIcons name="search" size={24} color="#6e7976" />
            <TextInput
              placeholder="Search for answers..."
              placeholderTextColor="#6e7976"
              className="flex-1 ml-3 font-body-md text-body-md text-on-surface"
            />
          </View>
        </Animated.View>

        {/* Section Title */}
        <Animated.View entering={FadeInDown.duration(400).delay(75).springify()}>
          <Text className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider mb-stack-md">
            Frequently Asked Questions
          </Text>
        </Animated.View>

        {/* Accordions */}
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()}>
          {FAQ_ITEMS.map((item, idx) => (
            <View key={item.q} className="border-b border-border-subtle">
              <TouchableOpacity
                className="w-full flex-row justify-between items-center py-5 min-h-[48px]"
                onPress={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <Text className="font-body-lg text-body-lg text-on-surface pr-4 font-medium flex-1">
                  {item.q}
                </Text>
                <MaterialIcons
                  name={openIndex === idx ? 'expand-less' : 'expand-more'}
                  size={24}
                  color="#6e7976"
                />
              </TouchableOpacity>
              {openIndex === idx ? (
                <View className="pb-5 pr-8">
                  <Text className="font-body-md text-body-md text-on-surface-variant">{item.a}</Text>
                </View>
              ) : null}
            </View>
          ))}
        </Animated.View>

        <View className="h-stack-lg" />

        {/* Still Need Help Card */}
        <Animated.View entering={FadeInDown.duration(400).delay(200).springify()}>
          <View className="mt-stack-lg bg-surface-container-low rounded-xl p-stack-md border border-border-subtle flex-row items-center justify-between">
            <View>
              <Text className="font-label-lg text-label-lg text-on-surface font-semibold mb-1">
                Still need help?
              </Text>
              <Text className="font-label-sm text-label-sm text-on-surface-variant">
                Chat with our support team.
              </Text>
            </View>
            <TouchableOpacity
              className="h-[48px] px-4 rounded-lg border-2 border-whatsapp-green flex-row items-center gap-2 active:scale-95"
              onPress={() => router.push('/(app)/(stack)/settings/contact' as never)}
            >
              <MaterialIcons name="chat" size={20} color="#25D366" />
              <Text className="font-label-lg text-label-lg text-whatsapp-green">WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
