import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('Ahmed Khan');
  const [email, setEmail] = useState('ahmed@digitaldukaan.pk');
  const [shopName, setShopName] = useState('Kinetic Growth');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert('Success', 'Account settings saved.');
    }, 1000);
  };

  const handleDeleteAccount = () => {
    Alert.alert('Delete Account', 'This action cannot be undone. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive' },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-surface z-40">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-center rounded-full" activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="text-[24px] font-bold text-growth-green">Account Settings</Text>
        <View className="w-12" />
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Profile Photo */}
        <Animated.View entering={FadeInDown.duration(600).springify()} className="items-center mt-6 mb-8">
          <View className="relative">
            <View className="w-24 h-24 rounded-full overflow-hidden border border-border-subtle bg-surface-container-high items-center justify-center">
              <MaterialIcons name="person" size={48} color="#6e7976" />
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 bg-primary-container rounded-full p-1.5 border-2 border-surface" activeOpacity={0.8}>
              <MaterialIcons name="edit" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Form Fields */}
        <Animated.View entering={FadeInDown.duration(600).delay(100).springify()} className="gap-5">
          {/* Full Name */}
          <View>
            <Text className="text-[12px] font-medium text-on-surface-variant ml-1 mb-2">Full Name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              className="w-full h-14 px-4 rounded-lg border border-outline-variant bg-transparent text-[16px] text-on-surface"
              placeholder="Enter your full name"
              placeholderTextColor="#6e7976"
            />
          </View>

          {/* Phone Number (Read-only) */}
          <View>
            <Text className="text-[12px] font-medium text-on-surface-variant ml-1 mb-2">Phone Number</Text>
            <View className="relative">
              <TextInput
                value="+92 300 1234567"
                editable={false}
                className="w-full h-14 px-4 pr-12 rounded-lg border border-outline-variant bg-surface-container-lowest text-[16px] text-on-surface-variant"
              />
              <MaterialIcons name="lock" size={18} color="#bec9c5" className="absolute right-4 top-1/2 -translate-y-1/2" />
            </View>
          </View>

          {/* Email */}
          <View>
            <Text className="text-[12px] font-medium text-on-surface-variant ml-1 mb-2">
              Email <Text className="text-outline">(Optional)</Text>
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              className="w-full h-14 px-4 rounded-lg border border-outline-variant bg-transparent text-[16px] text-on-surface"
              placeholder="Enter your email"
              placeholderTextColor="#6e7976"
              keyboardType="email-address"
            />
          </View>

          {/* Shop Name */}
          <View>
            <Text className="text-[12px] font-medium text-on-surface-variant ml-1 mb-2">Shop Name</Text>
            <TextInput
              value={shopName}
              onChangeText={setShopName}
              className="w-full h-14 px-4 rounded-lg border border-outline-variant bg-transparent text-[16px] text-on-surface"
              placeholder="Enter your shop name"
              placeholderTextColor="#6e7976"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            onPress={handleSave}
            className="w-full h-14 bg-growth-green rounded-lg items-center justify-center mt-2"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-[14px]">{isSaving ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Danger Zone */}
        <Animated.View entering={FadeInDown.duration(600).delay(300).springify()} className="mt-10 border-t border-border-subtle pt-8">
          <View className="bg-error-container/20 border border-error-container rounded-lg p-4 gap-4">
            <View>
              <Text className="text-[14px] font-semibold text-error-red mb-1">Danger Zone</Text>
              <Text className="text-[12px] text-on-surface-variant">Permanently delete your account and all associated data. This action cannot be undone.</Text>
            </View>
            <TouchableOpacity 
              onPress={handleDeleteAccount}
              className="w-full h-14 border-2 border-error-red rounded-lg flex-row items-center justify-center gap-2"
              activeOpacity={0.8}
            >
              <MaterialIcons name="delete" size={18} color="#BA1A1A" />
              <Text className="text-[14px] font-semibold text-error-red">Delete Account</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
