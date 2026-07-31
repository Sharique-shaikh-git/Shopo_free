import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

export default function WelcomeLanguageScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ur'>('en');

  const handleNext = () => {
    // In a real app we would save the language preference here
    router.push('/(auth)/phone');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 px-6 pt-12 pb-24">
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600).springify()} className="items-center text-center mt-8 mb-12">
          <View className="w-16 h-16 rounded-2xl bg-primary-container items-center justify-center mb-6 shadow-sm">
            <MaterialIcons name="storefront" size={32} color="white" />
          </View>
          <Text className="text-[28px] md:text-[32px] font-bold text-on-background text-center mb-4 leading-9">
            Start your online business in seconds
          </Text>
          <Text className="text-[18px] text-on-surface-variant text-center max-w-md">
            Select your preferred language to continue setting up your shop.
          </Text>
        </Animated.View>

        {/* Language Selection */}
        <Animated.View entering={FadeInDown.duration(600).delay(200).springify()} className="w-full max-w-md self-center gap-4">
          {/* English Option */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedLanguage('en')}
            className={`w-full rounded-xl p-4 flex-row items-center justify-between shadow-sm border-2 ${
              selectedLanguage === 'en' 
                ? 'bg-[#F0FDF4] border-primary-container' 
                : 'bg-surface-container-lowest border-border-subtle'
            }`}
          >
            <View className="flex-row items-center gap-4">
              <View className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
                <Text className="text-[14px] font-semibold text-on-surface-variant">EN</Text>
              </View>
              <Text className="text-[24px] font-semibold text-on-background">English</Text>
            </View>
            <Animated.View style={{ opacity: selectedLanguage === 'en' ? 1 : 0 }}>
              <MaterialIcons name="check-circle" size={28} color="#006B5E" />
            </Animated.View>
          </TouchableOpacity>

          {/* Urdu Option */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedLanguage('ur')}
            className={`w-full rounded-xl p-4 flex-row items-center justify-between shadow-sm border-2 ${
              selectedLanguage === 'ur' 
                ? 'bg-[#F0FDF4] border-primary-container' 
                : 'bg-surface-container-lowest border-border-subtle'
            }`}
          >
            <View className="flex-row items-center gap-4">
              <View className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
                <Text className="text-[14px] font-bold text-on-surface-variant">اردو</Text>
              </View>
              <Text className="text-[24px] font-semibold text-on-background">Urdu (اردو)</Text>
            </View>
            <Animated.View style={{ opacity: selectedLanguage === 'ur' ? 1 : 0 }}>
              <MaterialIcons name="check-circle" size={28} color="#006B5E" />
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Bottom Action Bar */}
      <Animated.View 
        entering={FadeIn.duration(500).delay(400)}
        className="absolute bottom-0 left-0 w-full bg-surface-container-lowest border-t border-border-subtle p-6 pb-safe shadow-lg"
        style={{ paddingBottom: Platform.OS === 'ios' ? 32 : 24 }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleNext}
          className="w-full h-14 bg-primary-container rounded-xl flex-row items-center justify-center gap-2"
        >
          <Text className="text-white font-semibold text-[16px]">Start Now</Text>
          <MaterialIcons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
