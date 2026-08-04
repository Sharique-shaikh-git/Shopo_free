import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const WHATSAPP_URL = 'https://wa.me/923001234567';

export default function ContactScreen() {
  const router = useRouter();

  const contactOptions = [
    {
      id: 'whatsapp',
      icon: 'chat' as const,
      title: 'WhatsApp Chat',
      subtitle: 'Fastest response',
      onPress: () => Linking.openURL(WHATSAPP_URL),
      highlight: true,
    },
    {
      id: 'call',
      icon: 'call' as const,
      title: 'Call Us',
      subtitle: 'Mon-Sat, 9am-6pm',
      onPress: () => {},
      highlight: false,
    },
    {
      id: 'email',
      icon: 'mail' as const,
      title: 'Email',
      subtitle: 'Usually replies in 24h',
      onPress: () => {},
      highlight: false,
    },
  ];

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
        <Text className="font-headline-md text-headline-md text-on-surface">Contact Us</Text>
        <View className="w-10" />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="px-gutter-mobile pt-stack-md"
      >
        {/* Title */}
        <Animated.View entering={FadeInDown.duration(400).delay(50).springify()} className="items-center mb-stack-lg">
          <Text className="font-headline-lg-mobile text-headline-lg-mobile text-growth-green mb-2">
            We're here to help
          </Text>
          <Text className="font-body-md text-body-md text-on-surface-variant text-center">
            Choose a method below or send us a message directly.
          </Text>
        </Animated.View>

        {/* Contact Options */}
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="gap-stack-md mb-stack-md">
          {contactOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={option.onPress}
              className={`flex-row items-center p-stack-md bg-surface-container-lowest border rounded-xl active:scale-[0.98] ${
                option.highlight ? 'border-whatsapp-green' : 'border-border-subtle'
              }`}
            >
              <View
                className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
                  option.highlight ? 'bg-whatsapp-green/10' : 'bg-surface-container-low'
                }`}
              >
                <MaterialIcons name={option.icon} size={24} color={option.highlight ? '#25D366' : '#1a1c1e'} />
              </View>
              <View className="flex-1">
                <Text className="font-label-lg text-label-lg text-on-surface mb-1">{option.title}</Text>
                <Text className="font-label-sm text-label-sm text-on-surface-variant">{option.subtitle}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#6e7976" />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Divider */}
        <Animated.View entering={FadeInDown.duration(400).delay(150).springify()} className="flex-row items-center justify-center py-2 mb-stack-md">
          <View className="h-px bg-border-subtle flex-1" />
          <Text className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider px-4">
            Or
          </Text>
          <View className="h-px bg-border-subtle flex-1" />
        </Animated.View>

        {/* Support Hours */}
        <Animated.View entering={FadeInDown.duration(400).delay(200).springify()}>
          <View className="flex-row items-start gap-3 bg-surface-gray p-4 rounded-lg border border-border-subtle">
            <MaterialIcons name="info" size={24} color="#6e7976" />
            <View className="flex-1">
              <Text className="font-label-lg text-label-lg text-on-surface">Support Hours</Text>
              <Text className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                Our team is available Monday to Saturday, from 9:00 AM to 6:00 PM (PKT). Messages sent
                outside these hours will be addressed the next business day.
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
