import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SettingsRow, SettingsSection } from '../../../../components/settings-row';
import { apiFetch, removeToken } from '../../../../lib/api';

export default function ProfileSettingsScreen() {
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

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Clean Header with Back Button */}
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        style={{ paddingTop: Math.max(insets.top, 12) }}
        className="flex-row items-center justify-between px-5 pb-3 border-b border-border-subtle bg-surface"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center bg-surface-container-low"
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="text-[20px] font-bold text-on-surface">Profile & Settings</Text>
        <TouchableOpacity
          onPress={() => router.push('/(app)/(stack)/settings/language' as never)}
          className="w-10 h-10 rounded-full bg-surface-container-low items-center justify-center"
          activeOpacity={0.7}
        >
          <MaterialIcons name="language" size={22} color="#006B5E" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="flex-1 px-5 pt-4"
      >
        {/* 1. Account Owner Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="flex-col gap-2 mb-6">
          <Text className="font-label-lg text-[14px] font-semibold text-on-surface-variant uppercase tracking-wider pl-1">
            Account Owner
          </Text>
          <View className="border border-border-subtle rounded-xl p-4 flex-row items-center justify-between bg-surface-container-lowest shadow-sm">
            <View className="flex-row items-center gap-4">
              <View className="w-16 h-16 rounded-full bg-primary-container items-center justify-center border border-border-subtle">
                <Text className="text-[22px] font-bold text-white">
                  {merchant?.name ? merchant.name.substring(0, 2).toUpperCase() : 'ME'}
                </Text>
              </View>
              <View className="flex-col">
                <Text className="font-headline-md text-[18px] font-bold text-on-surface leading-tight">
                  {merchant?.name || 'Shop Owner'}
                </Text>
                <Text className="font-body-md text-[15px] text-on-surface-variant mt-1">
                  {merchant?.phone || '+92 300 0000000'}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* 2. Shop Details Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(200).springify()} className="flex-col gap-2 mb-6">
          <Text className="font-label-lg text-[14px] font-semibold text-on-surface-variant uppercase tracking-wider pl-1">
            Shop Details
          </Text>
          <SettingsSection>
            <SettingsRow
              icon="store"
              label="Shop Name"
              value={store?.name || 'Not Created Yet'}
              onPress={() => router.push(store ? ('/(app)/(stack)/store/share' as never) : ('/(app)/(stack)/store/create' as never))}
              divider
            />
            <View className="flex-row items-center justify-between p-4 bg-surface-container-lowest">
              <View className="flex-row items-center gap-3 w-full flex-1">
                <MaterialIcons name="link" size={22} color="#6e7976" />
                <View className="flex-col flex-1">
                  <Text className="font-body-lg text-[16px] text-on-surface">Store URL</Text>
                  <Text className="font-body-md text-[14px] text-growth-green font-semibold mt-0.5">
                    {store?.slug ? `${store.slug}.shopo.pk` : 'No store created yet'}
                  </Text>
                </View>
              </View>
            </View>
          </SettingsSection>
        </Animated.View>

        {/* 3. Preferences Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(300).springify()} className="flex-col gap-2 mb-6">
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
            <View className="flex-row items-center justify-between p-4 bg-surface-container-lowest">
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="notifications" size={22} color="#6e7976" />
                <Text className="font-body-lg text-[16px] text-on-surface">Notifications</Text>
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
        <Animated.View entering={FadeInDown.duration(400).delay(400).springify()} className="flex-col gap-2 mb-8">
          <Text className="font-label-lg text-[14px] font-semibold text-on-surface-variant uppercase tracking-wider pl-1">
            Support & Legal
          </Text>
          <SettingsSection>
            <SettingsRow
              icon="forum"
              label="Help Center (WhatsApp)"
              iconColor="#25D366"
              onPress={() => Alert.alert('Help Center', 'Connecting to WhatsApp Support...')}
              right={<MaterialIcons name="open-in-new" size={22} color="#6e7976" />}
              divider
            />
            <SettingsRow
              icon="description"
              label="Terms of Service"
              onPress={() => router.push('/(app)/(stack)/settings/terms' as never)}
            />
          </SettingsSection>
          
          <TouchableOpacity 
            onPress={handleLogout}
            className="mt-6 w-full h-14 flex-row items-center justify-center gap-2 rounded-xl bg-error-container active:scale-95 shadow-sm"
          >
            <MaterialIcons name="logout" size={20} color="#93000a" />
            <Text className="font-label-lg text-[16px] font-bold text-on-error-container">Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
