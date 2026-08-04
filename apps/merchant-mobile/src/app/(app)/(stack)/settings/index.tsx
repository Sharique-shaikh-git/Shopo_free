import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { apiFetchSafe, removeToken } from '../../../../lib/api';
import { useThemePreference } from '../../../../context/ThemeContext';
import { SettingsRow, SettingsSection } from '../../../../components/settings-row';

export default function SettingsMainScreen() {
  const router = useRouter();
  const { preference, setPreference } = useThemePreference();

  const [merchantName, setMerchantName] = useState('Shop Owner');
  const [merchantPhone, setMerchantPhone] = useState('');
  const [ordersNotification, setOrdersNotification] = useState(true);
  const [updatesNotification, setUpdatesNotification] = useState(false);

  useEffect(() => {
    apiFetchSafe('/auth/me', null).then((me: any) => {
      if (me?.name) setMerchantName(me.name);
      if (me?.phone) setMerchantPhone(me.phone);
    });
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await removeToken();
          router.replace('/(auth)/welcome' as never);
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        className="w-full sticky z-40 bg-surface-gray flex-row justify-between items-center px-gutter-mobile py-4 border-b border-border-subtle"
      >
        <TouchableOpacity
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="w-touch-target-min h-touch-target-min items-start justify-center rounded-full active:scale-95"
        >
          <MaterialIcons name="arrow-back" size={24} color="#006B5E" />
        </TouchableOpacity>
        <Text className="font-headline-md text-[24px] font-bold text-growth-green">Settings</Text>
        <View className="w-touch-target-min h-touch-target-min" />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="px-gutter-mobile pt-stack-md"
      >
        {/* Profile Card */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(100).springify()}
          className="bg-surface-container-lowest rounded-xl border border-border-subtle p-stack-md flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-stack-md flex-1">
            <View className="w-16 h-16 rounded-full overflow-hidden bg-surface-container-high items-center justify-center">
              <MaterialIcons name="person" size={34} color="#6e7976" />
            </View>
            <View className="flex-1">
              <Text className="font-headline-md text-body-lg font-bold text-on-surface" numberOfLines={1}>
                {merchantName}
              </Text>
              <Text className="font-body-md text-body-md text-on-surface-variant" numberOfLines={1}>
                {merchantPhone || 'Shop Owner'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(app)/(stack)/settings/profile-settings' as never)}
            className="min-h-touch-target-min justify-center px-2"
          >
            <Text className="font-label-lg text-label-lg text-growth-green font-semibold">Edit Profile</Text>
          </TouchableOpacity>
        </Animated.View>

        <View className="h-stack-lg" />

        {/* Core settings */}
        <Animated.View entering={FadeInDown.duration(400).delay(200).springify()}>
          <SettingsSection>
            <SettingsRow
              icon="notifications"
              label="Notifications"
              right={
                <Switch
                  value={ordersNotification}
                  onValueChange={setOrdersNotification}
                  trackColor={{ false: '#e2e2e5', true: '#006B5E' }}
                  thumbColor="#ffffff"
                />
              }
            />
            <SettingsRow
              icon="inbox"
              label="Notifications Inbox"
              onPress={() => router.push('/(app)/(stack)/settings/notifications-inbox' as never)}
            />
            <SettingsRow
              icon="light-mode"
              label="Dark Mode"
              value={preference === 'system' ? 'System' : preference === 'dark' ? 'Dark' : 'Light'}
              onPress={() => router.push('/(app)/(stack)/settings/dark-mode' as never)}
              divider={false}
            />
          </SettingsSection>
        </Animated.View>

        <View className="h-stack-sm" />

        <Animated.View entering={FadeInDown.duration(400).delay(300).springify()}>
          <SettingsSection>
            <SettingsRow icon="language" label="Language" value="English" onPress={() => router.push('/(app)/(stack)/settings/language' as never)} />
            <SettingsRow icon="account-circle" label="Account" onPress={() => router.push('/(app)/(stack)/settings/account' as never)} />
            <SettingsRow icon="storefront" label="Shop Configuration" onPress={() => router.push('/(app)/(stack)/settings/shop-config' as never)} />
            <SettingsRow icon="credit-card" label="Payment Methods" onPress={() => router.push('/(app)/(stack)/settings/payments' as never)} />
            <SettingsRow icon="lock" label="Privacy" onPress={() => router.push('/(app)/(stack)/settings/privacy-settings' as never)} divider={false} />
          </SettingsSection>
        </Animated.View>

        <View className="h-stack-sm" />

        <Animated.View entering={FadeInDown.duration(400).delay(400).springify()}>
          <SettingsSection>
            <SettingsRow icon="help" label="Help & Support" onPress={() => router.push('/(app)/(stack)/settings/help' as never)} />
            <SettingsRow icon="info" label="About App" onPress={() => router.push('/(app)/(stack)/settings/about' as never)} />
            <SettingsRow icon="description" label="Terms of Service" onPress={() => router.push('/(app)/(stack)/settings/terms' as never)} />
            <SettingsRow icon="new-releases" label="What's New" onPress={() => router.push('/(app)/(stack)/settings/whats-new' as never)} />
            <SettingsRow
              icon="share"
              label="Share App"
              onPress={() => Alert.alert('Share', 'Share your shop link from the Share Shop screen.')}
              divider={false}
            />
          </SettingsSection>
        </Animated.View>

        <View className="h-stack-sm" />

        <Animated.View entering={FadeInDown.duration(400).delay(500).springify()}>
          <SettingsSection>
            <SettingsRow icon="logout" label="Logout" danger onPress={handleLogout} />
            <SettingsRow
              icon="delete-forever"
              label="Delete Account"
              danger
              onPress={() => router.push('/(app)/(stack)/settings/delete-account' as never)}
            />
          </SettingsSection>
        </Animated.View>

        <View className="h-stack-md" />

        <Text className="text-center font-label-sm text-label-sm text-outline-variant">Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
