import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function PrivacySettingsScreen() {
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const renderToggleRow = (
    label: string,
    subtitle: string | null,
    value: boolean,
    onValueChange: (v: boolean) => void,
    divider = false,
  ) => (
    <View
      className={`flex items-center justify-between p-stack-md bg-surface-container-lowest ${
        divider ? 'border-b border-border-subtle' : ''
      }`}
    >
      <View className="flex-col flex-1">
        <Text className="font-body-lg text-[18px] text-on-surface select-none">{label}</Text>
        {subtitle ? (
          <Text className="font-label-sm text-[12px] text-on-surface-variant mt-1">{subtitle}</Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#e2e2e5', true: '#006B5E' }}
        thumbColor="#fff"
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        className="flex-row items-center justify-between px-gutter-mobile py-4 border-b border-border-subtle bg-surface-gray relative"
      >
        <TouchableOpacity
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full active:scale-95"
        >
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="font-headline-md text-[24px] font-bold text-on-surface absolute left-1/2 -translate-x-1/2">
          Privacy
        </Text>
        <View className="w-10 h-10" />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="flex-1 px-gutter-mobile pt-2"
      >
        {/* Profile Visibility */}
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="flex-col gap-stack-sm">
          <Text className="font-label-lg text-[14px] font-semibold text-on-surface-variant uppercase mb-stack-sm px-2">
            Profile Visibility
          </Text>
          <View className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden shadow-sm">
            {renderToggleRow('Show Profile to Customers', null, showProfile, setShowProfile, true)}
            {renderToggleRow('Show Phone Number', null, showPhone, setShowPhone, true)}
            {renderToggleRow('Show Email', null, showEmail, setShowEmail)}
          </View>
        </Animated.View>

        {/* Data Management */}
        <Animated.View entering={FadeInDown.duration(400).delay(200).springify()} className="flex-col gap-stack-sm mt-stack-lg">
          <Text className="font-label-lg text-[14px] font-semibold text-on-surface-variant uppercase mb-stack-sm px-2">
            Data Management
          </Text>
          <View className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden shadow-sm">
            {renderToggleRow(
              'Share Analytics Data',
              'Help us improve the app experience',
              shareAnalytics,
              setShareAnalytics,
              true,
            )}
            {renderToggleRow('Personalized Recommendations', null, personalizedRecommendations, setPersonalizedRecommendations)}
          </View>
        </Animated.View>

        {/* Account Security */}
        <Animated.View entering={FadeInDown.duration(400).delay(300).springify()} className="flex-col gap-stack-sm mt-stack-lg">
          <Text className="font-label-lg text-[14px] font-semibold text-on-surface-variant uppercase mb-stack-sm px-2">
            Account Security
          </Text>
          <View className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden shadow-sm">
            {renderToggleRow('Two-Factor Authentication', null, twoFactorAuth, setTwoFactorAuth, true)}
            <TouchableOpacity className="w-full flex items-center justify-between p-stack-md bg-surface-container-lowest active:bg-surface-container-high text-left">
              <Text className="font-body-lg text-[18px] text-on-surface">Login Activity</Text>
              <MaterialIcons name="chevron-right" size={22} color="#6e7976" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="bg-surface border-t border-border-subtle px-gutter-mobile py-4">
        <TouchableOpacity className="w-full min-h-[56px] bg-growth-green rounded-lg items-center justify-center active:scale-95">
          <Text className="text-on-primary font-label-lg text-[14px] font-semibold uppercase tracking-wider">
            Save Preferences
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
