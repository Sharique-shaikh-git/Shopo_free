import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const MORE_ITEMS = [
  { label: 'Analytics', icon: 'bar-chart', route: '/(app)/(stack)/analytics', color: '#0055D4', desc: 'View sales insights' },
  { label: 'Customers', icon: 'people', route: '/(app)/(stack)/customers', color: '#006B5E', desc: 'Manage your customers' },
  { label: 'Store', icon: 'storefront', route: '/(app)/(stack)/store/share', color: '#25D366', desc: 'Share your shop link' },
  { label: 'Settings', icon: 'settings', route: '/(app)/(stack)/settings', color: '#6e7976', desc: 'App preferences' },
];

export default function MoreScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-5 py-4 bg-surface">
        <Text className="text-[28px] font-bold text-on-surface">More</Text>
        <Text className="text-[14px] text-on-surface-variant mt-1">Quick access to all features</Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Menu Items */}
        <View className="gap-3 mt-4">
          {MORE_ITEMS.map((item, i) => (
            <Animated.View key={item.label} entering={FadeInDown.duration(400).delay(i * 80).springify()}>
              <TouchableOpacity
                onPress={() => router.push(item.route as any)}
                className="flex-row items-center gap-4 bg-surface-container-lowest border border-border-subtle rounded-xl p-4"
                activeOpacity={0.7}
              >
                <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                  <MaterialIcons name={item.icon as any} size={24} color={item.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-[16px] font-semibold text-on-surface">{item.label}</Text>
                  <Text className="text-[13px] text-on-surface-variant mt-0.5">{item.desc}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color="#6e7976" />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Quick Links */}
        <View className="mt-8 mb-8">
          <Text className="text-[14px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3 px-1">Quick Links</Text>
          <View className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden">
            {[
              { label: 'Help Center', icon: 'help-center', route: '/(app)/(stack)/settings/help' },
              { label: 'Contact Support', icon: 'support-agent', route: '/(app)/(stack)/settings/contact' },
              { label: "What's New", icon: 'new-releases', route: '/(app)/(stack)/settings/whats-new' },
              { label: 'About Us', icon: 'info', route: '/(app)/(stack)/settings/about' },
            ].map((item, i, arr) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => router.push(item.route as any)}
                className={`flex-row items-center gap-4 px-4 py-4 ${
                  i < arr.length - 1 ? 'border-b border-border-subtle' : ''
                }`}
                activeOpacity={0.7}
              >
                <MaterialIcons name={item.icon as any} size={20} color="#6e7976" />
                <Text className="flex-1 text-[15px] text-on-surface">{item.label}</Text>
                <MaterialIcons name="chevron-right" size={20} color="#6e7976" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
