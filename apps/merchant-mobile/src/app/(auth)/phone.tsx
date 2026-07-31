import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

export default function PhoneVerificationScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    if (phone.length < 10) return;
    setIsLoading(true);
    // TODO: Call API to send OTP
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to OTP entry (future screen)
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-container-lowest">
      {/* Header — Back Navigation */}
      <View className="flex-row items-center px-4 py-4">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full"
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-5 pt-8">
        {/* Branding & Title */}
        <Animated.View 
          entering={FadeInDown.duration(600).springify()}
          className="mb-8 flex-col items-start gap-4"
        >
          {/* Icon Container */}
          <View className="w-16 h-16 bg-primary-fixed rounded-2xl items-center justify-center">
            <MaterialIcons name="phone-android" size={40} color="#005147" />
          </View>
          
          {/* Title */}
          <Text className="text-[28px] font-bold text-on-surface tracking-tight leading-9">
            Enter your phone number
          </Text>
          
          {/* Subtitle */}
          <Text className="text-[16px] text-on-surface-variant max-w-[280px] leading-6">
            We will send a 4-digit code to verify your account.
          </Text>
        </Animated.View>

        {/* Form Area */}
        <Animated.View 
          entering={FadeInDown.duration(600).delay(200).springify()}
          className="space-y-6"
        >
          {/* Phone Input Label */}
          <Text className="text-[14px] font-semibold text-on-surface-variant ml-1">
            Mobile Number
          </Text>
          
          {/* Phone Input with Flag */}
          <View className="flex-row items-center bg-white border border-outline-variant rounded-xl overflow-hidden">
            {/* Flag & Prefix Selector */}
            <View className="flex-row items-center gap-2 pl-4 pr-3 py-4 border-r border-outline-variant bg-surface-gray">
              {/* Pakistan Flag Placeholder */}
              <View className="w-7 h-5 rounded-sm overflow-hidden bg-white shadow-sm items-center justify-center">
                <Text className="text-[10px] font-bold text-primary-container">PK</Text>
              </View>
              <Text className="text-[16px] font-semibold text-on-surface">+92</Text>
            </View>
            
            {/* Number Input */}
            <TextInput
              value={phone}
              onChangeText={(text) => {
                // Remove non-numeric, limit to 10 digits
                const cleaned = text.replace(/\D/g, '').slice(0, 10);
                setPhone(cleaned);
              }}
              placeholder="300 1234567"
              keyboardType="phone-pad"
              className="flex-1 px-4 py-4 text-[18px] bg-transparent border-none"
              placeholderTextColor="#6e7976"
            />
          </View>

          {/* Assistance Text */}
          <View className="flex-row items-start gap-3 p-4 bg-surface-gray rounded-xl border border-border-subtle">
            <MaterialIcons name="info" size={20} color="#0055D4" className="mt-0.5" />
            <Text className="text-[12px] text-on-surface-variant flex-1 leading-5">
              By continuing, you agree to receive an automated SMS code for security and account management.
            </Text>
          </View>
        </Animated.View>

        {/* Spacer for thumb-zone */}
        <View className="flex-1 min-h-[40px]" />

        {/* Bottom Action Bar */}
        <Animated.View 
          entering={FadeIn.duration(500).delay(400)}
          className="pb-6 pt-4 mb-2"
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleSendCode}
            disabled={phone.length < 10 || isLoading}
            className={`w-full h-14 rounded-xl flex-row items-center justify-center gap-2 shadow-sm ${
              phone.length >= 10 && !isLoading
                ? 'bg-primary-container' 
                : 'bg-primary-container opacity-60'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text className="text-white font-semibold text-[14px] tracking-wide">
                  Send Code
                </Text>
                <MaterialIcons name="chevron-right" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Background Blur Ornaments */}
      <View className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/5 rounded-full opacity-30" pointerEvents="none" />
      <View className="absolute top-1/3 -left-32 w-64 h-64 bg-trust-blue/5 rounded-full opacity-30" pointerEvents="none" />
    </SafeAreaView>
  );
}
