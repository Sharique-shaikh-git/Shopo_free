import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Switch, Share, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { removeToken, apiFetch } from '../../lib/api';

import { StatusBar } from 'react-native';

export default function SettingsMainScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [merchant, setMerchant] = useState<any>(null);
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [meData, storesData] = await Promise.all([
          apiFetch('/auth/me').catch(() => null),
          apiFetch('/stores').catch(() => [])
        ]);
        if (meData) setMerchant(meData);
        if (Array.isArray(storesData) && storesData.length > 0) {
          setStore(storesData[0]);
        }
      } catch (err) {
        // Fallback gracefully
      }
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await removeToken();
            router.replace('/(auth)/welcome');
          }
        }
      ]
    );
  };

  const handleShareApp = () => {
    Share.share({
      message: 'Build your online shop in 5 minutes with Shopo! Download now.',
    });
  };

  const headerPadding = Math.max(insets.top, StatusBar.currentHeight || 24, 12);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View 
        style={{ paddingTop: headerPadding }}
        className="px-5 pb-3 bg-surface border-b border-border-subtle flex-row justify-between items-center"
      >
        <Text className="text-[28px] font-bold text-on-surface">Settings</Text>
        <TouchableOpacity 
          onPress={() => router.push('/(app)/(stack)/settings/profile' as any)}
          className="px-3 py-1.5 rounded-lg bg-surface-container-high"
        >
          <Text className="text-[14px] font-semibold text-growth-green">Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* 1. Account Owner Profile Card */}
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()}>
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => router.push('/(app)/(stack)/settings/profile' as any)}
            className="flex-row items-center justify-between p-4 bg-surface-container-lowest border border-border-subtle rounded-xl shadow-sm mb-6"
          >
            <View className="flex-row items-center gap-4">
              <View className="w-14 h-14 rounded-full bg-primary-container items-center justify-center border border-border-subtle">
                <Text className="text-[20px] font-bold text-white">
                  {merchant?.name ? merchant.name.substring(0, 2).toUpperCase() : 'ME'}
                </Text>
              </View>
              <View>
                <Text className="text-[18px] font-bold text-on-surface">{merchant?.name || 'Shop Owner'}</Text>
                <Text className="text-[14px] text-on-surface-variant mt-0.5">{merchant?.phone || store?.name || 'My Business'}</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#6e7976" />
          </TouchableOpacity>
        </Animated.View>

        {/* 2. Top Management Shortcuts */}
        <Text className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 px-1">Management</Text>
        <View className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden mb-6 shadow-sm">
          {/* Store management */}
          <TouchableOpacity
            onPress={() => router.push(store ? '/(app)/(stack)/store/share' : '/(app)/(stack)/store/create' as any)}
            className="flex-row items-center justify-between p-4 border-b border-border-subtle"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="storefront" size={22} color="#006B5E" />
              <View>
                <Text className="text-[16px] font-semibold text-on-surface">{store ? 'My Store' : 'Create Store'}</Text>
                <Text className="text-[12px] text-on-surface-variant">{store ? store.name : 'Set up your online shop'}</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#6e7976" />
          </TouchableOpacity>

          {/* Analytics */}
          <TouchableOpacity
            onPress={() => router.push('/(app)/(stack)/analytics' as any)}
            className="flex-row items-center justify-between p-4 border-b border-border-subtle"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="bar-chart" size={22} color="#0055D4" />
              <View>
                <Text className="text-[16px] font-semibold text-on-surface">Sales & Analytics</Text>
                <Text className="text-[12px] text-on-surface-variant">View sales trends & Insights</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#6e7976" />
          </TouchableOpacity>

          {/* Customers */}
          <TouchableOpacity
            onPress={() => router.push('/(app)/(stack)/customers' as any)}
            className="flex-row items-center justify-between p-4"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="people" size={22} color="#006B5E" />
              <View>
                <Text className="text-[16px] font-semibold text-on-surface">Customers</Text>
                <Text className="text-[12px] text-on-surface-variant">Manage customer records</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#6e7976" />
          </TouchableOpacity>
        </View>

        {/* 3. App Preferences */}
        <Text className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 px-1">App Preferences</Text>
        <View className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden mb-6 shadow-sm">
          {/* Notifications Toggle */}
          <View className="flex-row items-center justify-between p-4 border-b border-border-subtle">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="notifications" size={22} color="#6e7976" />
              <Text className="text-[16px] font-medium text-on-surface">Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e2e2e5', true: '#006B5E' }}
              thumbColor="white"
            />
          </View>

          {/* Language */}
          <TouchableOpacity
            onPress={() => router.push('/(app)/(stack)/settings/language' as any)}
            className="flex-row items-center justify-between p-4 border-b border-border-subtle"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="language" size={22} color="#6e7976" />
              <Text className="text-[16px] font-medium text-on-surface">Language</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-[14px] text-on-surface-variant">English</Text>
              <MaterialIcons name="chevron-right" size={22} color="#6e7976" />
            </View>
          </TouchableOpacity>

          {/* Payment Methods */}
          <TouchableOpacity
            onPress={() => router.push('/(app)/(stack)/settings/payments' as any)}
            className="flex-row items-center justify-between p-4 border-b border-border-subtle"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="credit-card" size={22} color="#6e7976" />
              <Text className="text-[16px] font-medium text-on-surface">Payment Methods</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#6e7976" />
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity
            onPress={() => router.push('/(app)/(stack)/settings/help' as any)}
            className="flex-row items-center justify-between p-4 border-b border-border-subtle"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="help-outline" size={22} color="#6e7976" />
              <Text className="text-[16px] font-medium text-on-surface">Help & Support</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#6e7976" />
          </TouchableOpacity>

          {/* Share App */}
          <TouchableOpacity
            onPress={handleShareApp}
            className="flex-row items-center justify-between p-4 border-b border-border-subtle"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="share" size={22} color="#6e7976" />
              <Text className="text-[16px] font-medium text-on-surface">Share App</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#6e7976" />
          </TouchableOpacity>

          {/* About App */}
          <TouchableOpacity
            onPress={() => router.push('/(app)/(stack)/settings/about' as any)}
            className="flex-row items-center justify-between p-4"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="info-outline" size={22} color="#6e7976" />
              <Text className="text-[16px] font-medium text-on-surface">About App</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#6e7976" />
          </TouchableOpacity>
        </View>

        {/* 4. Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="w-full h-14 bg-error-container rounded-xl flex-row items-center justify-center gap-2 mb-8"
          activeOpacity={0.8}
        >
          <MaterialIcons name="logout" size={22} color="#BA1A1A" />
          <Text className="text-[16px] font-bold text-error-red">Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
