import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Lang {
  key: string;
  native: string;
  english: string;
  default?: boolean;
}

const LANGUAGES: Lang[] = [
  { key: 'en', native: 'English', english: 'Default', default: true },
  { key: 'ur', native: 'اردو', english: 'Urdu' },
  { key: 'sd', native: 'سنڌي', english: 'Sindhi' },
  { key: 'pa', native: 'پنجابی', english: 'Punjabi' },
  { key: 'ps', native: 'پشتو', english: 'Pashto' },
  { key: 'bal', native: 'بلوچی', english: 'Balochi' },
];

export default function LanguageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState('en');

  const apply = () => {
    Alert.alert('Language updated', 'Interface language will change on next reload.', [{ text: 'OK' }]);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/more');
    }
  };

  const headerPadding = Math.max(insets.top, StatusBar.currentHeight || 24, 12);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <Animated.View 
        entering={FadeInDown.duration(400).springify()} 
        style={{ paddingTop: headerPadding }}
        className="flex-row items-center justify-between px-5 pb-3 border-b border-border-subtle bg-surface"
      >
        <TouchableOpacity onPress={handleBack} className="w-10 h-10 rounded-full items-center justify-center bg-surface-container-low">
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="text-[20px] font-bold text-growth-green">Language</Text>
        <View className="w-10 h-10" />
      </Animated.View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* Current language banner */}
        <Animated.View entering={FadeInDown.duration(400).delay(80).springify()} className="bg-primary-fixed rounded-xl border border-border-subtle p-stack-md mb-stack-md">
          <Text className="font-label-sm text-label-sm text-on-primary-fixed-variant uppercase tracking-wider">Current Language</Text>
          <Text className="font-headline-md text-headline-md text-on-primary-fixed mt-1">English</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(160).springify()}>
          <Text className="font-headline-md text-headline-md text-on-surface mb-1">Select Language</Text>
          <Text className="font-body-md text-body-md text-on-surface-variant mb-stack-md">
            Choose your preferred language for the app interface.
          </Text>

          <View className="bg-surface-container-lowest rounded-xl border border-border-subtle overflow-hidden">
            {LANGUAGES.map((lang, i) => {
              const active = current === lang.key;
              return (
                <TouchableOpacity
                  key={lang.key}
                  activeOpacity={0.8}
                  onPress={() => setCurrent(lang.key)}
                  className={`flex-row items-center p-stack-md ${i < LANGUAGES.length - 1 ? 'border-b border-border-subtle' : ''} ${active ? 'bg-primary-fixed' : ''}`}
                >
                  <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${active ? 'bg-growth-green' : 'bg-surface-container-high'}`}>
                    <Text className="font-label-lg text-label-lg text-on-surface" allowFontScaling={false}>
                      {lang.native.slice(0, 2)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-label-lg text-label-lg text-on-surface">{lang.native}</Text>
                    <Text className="font-body-md text-body-md text-on-surface-variant mt-0.5">{lang.english}</Text>
                  </View>
                  {active && <MaterialIcons name="check-circle" size={24} color="#006B5E" />}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity onPress={apply} activeOpacity={0.9} className="mt-stack-lg h-14 rounded-xl bg-growth-green items-center justify-center active:scale-95">
            <Text className="text-white font-label-lg text-label-lg font-bold">Apply Language</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
