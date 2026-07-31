import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { apiFetch, removeToken } from '../../../lib/api';

const SETTINGS_SECTIONS = [
  {
    title: 'Account',
    items: [
      { label: 'Account Settings', icon: 'person', route: '/(app)/settings/account', color: '#0055D4' },
      { label: 'Notifications', icon: 'notifications', route: '/(app)/settings/notifications', color: '#006B5E' },
      { label: 'Language', icon: 'language', route: '/(app)/settings/language', color: '#003fa3' },
    ],
  },
  {
    title: 'Shop',
    items: [
      { label: 'Shop Configuration', icon: 'store', route: '/(app)/settings/shop-config', color: '#006B5E' },
      { label: 'Payment Methods', icon: 'payment', route: '/(app)/settings/payments', color: '#006d2f' },
      { label: 'Share Shop', icon: 'share', route: '/(app)/store/share', color: '#25D366' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Help Center', icon: 'help-center', route: '/(app)/settings/help', color: '#0055D4' },
      { label: 'Contact Support', icon: 'support-agent', route: '/(app)/settings/contact', color: '#006B5E' },
      { label: 'Report a Problem', icon: 'bug-report', route: '/(app)/settings/report', color: '#BA1A1A' },
      { label: 'FAQ', icon: 'question-answer', route: '/(app)/settings/faq', color: '#003fa3' },
      { label: 'About Us', icon: 'info', route: '/(app)/settings/about', color: '#6e7976' },
      { label: "What's New", icon: 'new-releases', route: '/(app)/settings/whats-new', color: '#E8A33D' },
      { label: 'App Version', icon: 'system-update', route: '/(app)/settings/app-version', color: '#6e7976' },
    ],
  },
  {
    title: 'Privacy',
    items: [
      { label: 'Privacy Settings', icon: 'shield', route: '/(app)/settings/privacy-settings', color: '#0B57A4' },
      { label: 'Terms of Service', icon: 'description', route: '/(app)/settings/terms', color: '#6e7976' },
      { label: 'Privacy Policy', icon: 'policy', route: '/(app)/settings/privacy', color: '#6e7976' },
      { label: 'Dark Mode', icon: 'dark-mode', route: '/(app)/settings/dark-mode', color: '#2f3133' },
      { label: 'Delete Account', icon: 'delete-forever', route: null, color: '#BA1A1A', isDanger: true },
    ],
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const [storeName, setStoreName] = useState('My Store');

  useEffect(() => {
    async function loadStore() {
      try {
        const stores = await apiFetch('/stores');
        if (Array.isArray(stores) && stores.length > 0) {
          setStoreName(stores[0].name || 'My Store');
        }
      } catch (err) {}
    }
    loadStore();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
        await removeToken();
        router.replace('/(auth)/login');
      }},
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-5 pt-6 pb-4 bg-surface z-40">
        <Text className="text-[28px] font-bold text-on-surface">Settings</Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Store Info Card */}
        <Animated.View entering={FadeInDown.duration(600).springify()} className="bg-surface-container-lowest border border-border-subtle rounded-xl p-4 flex-row items-center gap-4 mb-6">
          <View className="w-14 h-14 rounded-full bg-primary-container items-center justify-center">
            <MaterialIcons name="storefront" size={28} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-[18px] font-bold text-on-surface">{storeName}</Text>
            <Text className="text-[14px] text-on-surface-variant">Merchant Account</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#6e7976" />
        </Animated.View>

        {/* Settings Sections */}
        {SETTINGS_SECTIONS.map((section, sIdx) => (
          <Animated.View key={section.title} entering={FadeInDown.duration(600).delay((sIdx + 1) * 100).springify()} className="mb-6">
            <Text className="text-[14px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3 px-1">{section.title}</Text>
            <View className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden">
              {section.items.map((item, iIdx) => (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => {
                    if (item.route) router.push(item.route as any);
                    else if (item.isDanger) {
                      Alert.alert('Delete Account', 'This action cannot be undone.');
                    }
                  }}
                  className={`flex-row items-center px-4 py-4 gap-4 ${
                    iIdx < section.items.length - 1 ? 'border-b border-border-subtle' : ''
                  }`}
                  activeOpacity={0.7}
                >
                  <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: `${item.color}20` }}>
                    <MaterialIcons name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <Text className={`flex-1 text-[16px] ${item.isDanger ? 'text-error-red' : 'text-on-surface'}`}>{item.label}</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#6e7976" />
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* Logout Button */}
        <Animated.View entering={FadeInDown.duration(600).delay(500).springify()}>
          <TouchableOpacity onPress={handleLogout} className="w-full py-4 rounded-xl border border-error-red items-center mb-8" activeOpacity={0.8}>
            <Text className="text-[16px] font-semibold text-error-red">Logout</Text>
          </TouchableOpacity>
        </Animated.View>

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
