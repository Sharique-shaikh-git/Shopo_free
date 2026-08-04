import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('Ahmed Khan');
  const [email, setEmail] = useState('ahmed@digitaldukaan.pk');
  const [shopName, setShopName] = useState('Kinetic Growth');

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        className="flex-row items-center justify-between px-gutter-mobile py-4 border-b border-border-subtle bg-surface-gray"
      >
        <TouchableOpacity
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="w-touch-target-min h-touch-target-min items-start justify-center rounded-full active:scale-95"
        >
          <MaterialIcons name="arrow-back" size={24} color="#006B5E" />
        </TouchableOpacity>
        <Text className="font-headline-md text-[24px] font-bold text-growth-green">Account Settings</Text>
        <View className="w-touch-target-min h-touch-target-min" />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="flex-1 px-gutter-mobile pt-stack-lg"
      >
        {/* Profile Photo */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(100).springify()}
          className="items-center"
        >
          <View className="w-24 h-24 rounded-full overflow-hidden border border-border-subtle bg-surface-container-high relative">
            <View className="w-full h-full items-center justify-center bg-surface-container-high">
              <MaterialIcons name="person" size={48} color="#6e7976" />
            </View>
            <TouchableOpacity
              accessibilityLabel="Change photo"
              className="absolute bottom-0 right-0 bg-primary-container rounded-full p-1.5 border-2 border-surface items-center justify-center min-w-[36px] min-h-[36px]"
            >
              <MaterialIcons name="edit" size={20} color="#95e8d8" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Form Fields */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(200).springify()}
          className="mt-stack-lg flex-col gap-stack-md"
        >
          {/* Full Name */}
          <View className="relative">
            <Text className="absolute left-4 -top-2.5 bg-surface px-1 text-[12px] font-label-sm text-on-surface-variant z-10">
              Full Name
            </Text>
            <TextInput
              className="h-14 px-4 pt-1 rounded-lg border border-outline-variant bg-transparent text-[16px] text-on-surface"
              placeholder="Enter your full name"
              placeholderTextColor="#bec9c5"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Phone Number (Read-only) */}
          <View className="relative">
            <Text className="absolute left-4 -top-2.5 bg-surface px-1 text-[12px] font-label-sm text-on-surface-variant z-10">
              Phone Number
            </Text>
            <View className="relative">
              <TextInput
                className="h-14 pl-4 pr-12 pt-1 rounded-lg border border-outline-variant bg-surface-container-lowest text-[16px] text-on-surface-variant"
                placeholder="Phone number"
                placeholderTextColor="#bec9c5"
                value="+92 300 1234567"
                editable={false}
              />
              <MaterialIcons
                name="lock"
                size={20}
                color="#bec9c5"
                style={{ position: 'absolute', right: 16, top: 18 }}
              />
            </View>
          </View>

          {/* Email */}
          <View className="relative">
            <Text className="absolute left-4 -top-2.5 bg-surface px-1 text-[12px] font-label-sm text-on-surface-variant z-10">
              Email <Text className="text-outline">(Optional)</Text>
            </Text>
            <TextInput
              className="h-14 px-4 pt-1 rounded-lg border border-outline-variant bg-transparent text-[16px] text-on-surface"
              placeholder="Enter your email"
              placeholderTextColor="#bec9c5"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          {/* Shop Name */}
          <View className="relative">
            <Text className="absolute left-4 -top-2.5 bg-surface px-1 text-[12px] font-label-sm text-on-surface-variant z-10">
              Shop Name
            </Text>
            <TextInput
              className="h-14 px-4 pt-1 rounded-lg border border-outline-variant bg-transparent text-[16px] text-on-surface"
              placeholder="Enter your shop name"
              placeholderTextColor="#bec9c5"
              value={shopName}
              onChangeText={setShopName}
            />
          </View>

          {/* Save Changes Button */}
          <TouchableOpacity className="h-14 bg-growth-green rounded-lg items-center justify-center active:scale-95 mt-stack-sm">
            <Text className="text-[14px] font-label-lg text-on-primary font-semibold">Save Changes</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Danger Zone */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(300).springify()}
          className="mt-stack-lg border-t border-border-subtle pt-stack-lg"
        >
          <View className="bg-error-container/20 border border-error-container rounded-lg p-stack-md flex-col gap-4">
            <View>
              <Text className="text-[14px] font-label-lg font-semibold text-error-red mb-1">Danger Zone</Text>
              <Text className="text-[12px] font-label-sm text-on-surface-variant">
                Permanently delete your account and all associated data. This action cannot be undone.
              </Text>
            </View>
            <TouchableOpacity className="h-14 border-2 border-error-red rounded-lg items-center justify-center flex-row gap-2 active:scale-95">
              <MaterialIcons name="delete" size={20} color="#BA1A1A" />
              <Text className="text-[14px] font-label-lg font-semibold text-error-red">Delete Account</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
