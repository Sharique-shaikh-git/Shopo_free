import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SettingsRow, SettingsSection } from '../../../../components/settings-row';

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Top App Bar */}
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        className="flex-row items-center justify-between px-gutter-mobile py-4 border-b border-border-subtle bg-surface-gray"
      >
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="storefront" size={24} color="#006B5E" />
          <Text className="font-headline-md text-[24px] font-bold text-growth-green">Shop Builder</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center active:scale-95">
          <MaterialIcons name="language" size={24} color="#006B5E" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="flex-1 px-gutter-mobile py-stack-md flex-col gap-stack-lg"
      >
        {/* Screen Title */}
        <Animated.View entering={FadeInDown.duration(400).delay(50).springify()}>
          <Text className="font-headline-lg-mobile text-[28px] font-bold text-on-surface">Profile & Settings</Text>
        </Animated.View>

        {/* 1. Account Owner Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="flex-col gap-stack-sm">
          <Text className="font-label-lg text-[14px] font-semibold text-on-surface-variant uppercase tracking-wider pl-1">
            Account Owner
          </Text>
          <View className="border border-border-subtle rounded-xl p-stack-md flex-row items-center justify-between bg-surface-container-lowest">
            <View className="flex-row items-center gap-stack-md">
              <View className="w-16 h-16 rounded-full bg-surface-container-highest overflow-hidden items-center justify-center border border-border-subtle">
                <MaterialIcons name="person" size={32} color="#6e7976" />
              </View>
              <View className="flex-col">
                <Text className="font-headline-md text-[18px] text-on-surface leading-tight">Ahmed Khan</Text>
                <Text className="font-body-md text-[16px] text-on-surface-variant mt-1">+92 300 1234567</Text>
              </View>
            </View>
            <TouchableOpacity className="text-trust-blue font-label-lg text-[14px] py-2 px-3 bg-surface-container-low rounded-lg active:scale-95">
              <Text className="text-trust-blue font-label-lg text-[14px]">Edit</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* 2. Shop Details Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(200).springify()} className="flex-col gap-stack-sm">
          <Text className="font-label-lg text-[14px] font-semibold text-on-surface-variant uppercase tracking-wider pl-1">
            Shop Details
          </Text>
          <SettingsSection>
            <SettingsRow
              icon="store"
              label="Shop Name"
              value="Ahmed's Electronics"
              onPress={() => router.push('/(app)/(stack)/settings/shop-config' as never)}
              divider
            />
            <SettingsRow
              icon="image"
              label="Shop Logo"
              onPress={() => router.push('/(app)/(stack)/settings/shop-config' as never)}
              divider
            />
            <View className="flex-row items-center justify-between p-stack-md bg-surface-container-lowest">
              <View className="flex-row items-center gap-stack-md w-full flex-1">
                <MaterialIcons name="link" size={22} color="#6e7976" />
                <View className="flex-col flex-1 overflow-hidden">
                  <Text className="font-body-lg text-[18px] text-on-surface">Store URL</Text>
                  <Text className="font-body-md text-[14px] text-growth-green truncate" numberOfLines={1}>
                    ahmeds-electronics.shop.pk
                  </Text>
                </View>
              </View>
              <TouchableOpacity className="w-12 h-12 items-center justify-center rounded-full bg-surface-container-highest active:scale-90">
                <MaterialIcons name="content-copy" size={22} color="#006B5E" />
              </TouchableOpacity>
            </View>
          </SettingsSection>
        </Animated.View>

        {/* 3. Preferences Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(300).springify()} className="flex-col gap-stack-sm">
          <Text className="font-label-lg text-[14px] font-semibold text-on-surface-variant uppercase tracking-wider pl-1">
            Preferences
          </Text>
          <SettingsSection>
            <SettingsRow
              icon="translate"
              label="Language"
              value="English"
              onPress={() => router.push('/(app)/(stack)/settings/language' as never)}
              divider
            />
            <View className="flex-row items-center justify-between p-stack-md bg-surface-container-lowest">
              <View className="flex-row items-center gap-stack-md">
                <MaterialIcons name="notifications" size={22} color="#6e7976" />
                <Text className="font-body-lg text-[18px] text-on-surface">Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#e2e2e5', true: '#006B5E' }}
                thumbColor="#fff"
              />
            </View>
          </SettingsSection>
        </Animated.View>

        {/* 4. Support & Legal Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(400).springify()} className="flex-col gap-stack-sm mb-stack-lg">
          <Text className="font-label-lg text-[14px] font-semibold text-on-surface-variant uppercase tracking-wider pl-1">
            Support & Legal
          </Text>
          <SettingsSection>
            <SettingsRow
              icon="forum"
              label="Help Center (WhatsApp)"
              iconColor="#25D366"
              onPress={() => Alert.alert('WhatsApp', 'Open WhatsApp support chat')}
              right={<MaterialIcons name="open-in-new" size={22} color="#6e7976" />}
              divider
            />
            <SettingsRow
              icon="description"
              label="Terms of Service"
              onPress={() => router.push('/(app)/(stack)/settings/terms' as never)}
            />
          </SettingsSection>
          <TouchableOpacity className="mt-stack-md w-full min-h-[56px] flex-row items-center justify-center gap-2 rounded-xl bg-error-container active:scale-95">
            <MaterialIcons name="logout" size={20} color="#93000a" />
            <Text className="font-label-lg text-[14px] font-semibold text-on-error-container">Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity className="mt-4 w-full min-h-[48px] flex-row items-center justify-center gap-2 active:scale-95">
            <MaterialIcons name="delete" size={20} color="#BA1A1A" />
            <Text className="font-label-lg text-[14px] font-semibold text-error">Delete Account</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="bg-surface border-t border-border-subtle flex-row justify-around items-center px-4 py-2">
        <TouchableOpacity className="flex-col items-center justify-center text-on-surface-variant p-2 rounded-xl min-w-[64px]">
          <MaterialIcons name="receipt-long" size={24} color="#3e4946" />
          <Text className="font-label-sm text-[12px] text-on-surface-variant">Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-col items-center justify-center text-on-surface-variant p-2 rounded-xl min-w-[64px]">
          <MaterialIcons name="add-a-photo" size={24} color="#3e4946" />
          <Text className="font-label-sm text-[12px] text-on-surface-variant">Upload</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-col items-center justify-center text-on-surface-variant p-2 rounded-xl min-w-[64px]">
          <MaterialIcons name="dashboard" size={24} color="#3e4946" />
          <Text className="font-label-sm text-[12px] text-on-surface-variant">Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-xl p-2 min-w-[64px]">
          <MaterialIcons name="person" size={24} color="#007232" />
          <Text className="font-label-sm text-[12px] font-bold text-primary">Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
