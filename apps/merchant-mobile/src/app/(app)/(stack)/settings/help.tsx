import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SettingsRow, SettingsSection } from '../../../../components/settings-row';

const ARTICLES = [
  { icon: 'rocket-launch' as const, label: 'Getting Started with Shopo', route: 'help-articles' },
  { icon: 'add-a-photo' as const, label: 'Adding Your First Product', route: 'help-articles' },
  { icon: 'payments' as const, label: 'Setting Up Payment Methods', route: 'help-articles' },
  { icon: 'receipt-long' as const, label: 'Managing Your Orders', route: 'help-articles' },
];

const CATEGORIES = [
  { icon: 'storefront' as const, label: 'Store Setup', route: 'help-articles' },
  { icon: 'inventory-2' as const, label: 'Products & Stock', route: 'help-articles' },
  { icon: 'local-shipping' as const, label: 'Orders & Delivery', route: 'help-articles' },
  { icon: 'credit-card' as const, label: 'Payments', route: 'help-articles' },
];

export default function HelpCenterScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <Animated.View entering={FadeInDown.duration(400).springify()} className="flex-row items-center justify-between px-gutter-mobile py-4 border-b border-border-subtle">
        <TouchableOpacity onPress={() => router.back()} className="w-touch-target-min h-touch-target-min justify-center">
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="font-headline-md text-headline-md font-bold text-growth-green">Help Center</Text>
        <View className="w-touch-target-min h-touch-target-min" />
      </Animated.View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="mb-stack-lg">
          <Text className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-stack-sm px-1">Popular Articles</Text>
          <SettingsSection>
            {ARTICLES.map((a, i) => (
              <SettingsRow
                key={a.label}
                icon={a.icon}
                label={a.label}
                onPress={() => router.push('/(app)/(stack)/settings/help-articles' as never)}
                divider={i < ARTICLES.length - 1}
              />
            ))}
          </SettingsSection>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(200).springify()} className="mb-stack-lg">
          <Text className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-stack-sm px-1">Categories</Text>
          <View className="flex-row flex-wrap -mx-1">
            {CATEGORIES.map((c, i) => (
              <View key={c.label} className="w-1/2 px-1 mb-2">
                <TouchableOpacity
                  onPress={() => router.push('/(app)/(stack)/settings/help-articles' as never)}
                  activeOpacity={0.8}
                  className="bg-surface-container-lowest border border-border-subtle rounded-xl p-4 items-start gap-3 min-h-[100px]"
                >
                  <View className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
                    <MaterialIcons name={c.icon} size={20} color="#006B5E" />
                  </View>
                  <Text className="font-label-lg text-label-lg text-on-surface">{c.label}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* More help */}
        <Animated.View entering={FadeInDown.duration(400).delay(300).springify()} className="bg-growth-green rounded-xl p-stack-md overflow-hidden">
          <View className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
          <Text className="font-headline-md text-headline-md text-white mb-2">Need more help?</Text>
          <Text className="font-body-md text-body-md text-white/90 mb-4 leading-5">
            Our support team is available from 9 AM to 6 PM to assist you directly.
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push('/(app)/(stack)/settings/contact' as never)}
              activeOpacity={0.9}
              className="flex-1 h-12 bg-white rounded-xl flex-row items-center justify-center gap-2"
            >
              <MaterialIcons name="support-agent" size={20} color="#006B5E" />
              <Text className="text-growth-green font-label-lg text-label-lg font-bold">Contact Us</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://wa.me/923001234567')}
              activeOpacity={0.9}
              className="w-12 h-12 bg-white rounded-xl items-center justify-center"
            >
              <MaterialIcons name="chat" size={22} color="#25D366" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
