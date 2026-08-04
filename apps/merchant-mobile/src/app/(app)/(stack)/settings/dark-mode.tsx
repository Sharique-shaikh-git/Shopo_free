import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemePreference } from '../../../../context/ThemeContext';

type Pref = 'light' | 'dark' | 'system';
const OPTIONS: { key: Pref; label: string; desc: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { key: 'light', label: 'Light', desc: 'Clean, bright interface for daytime', icon: 'light-mode' },
  { key: 'dark', label: 'Dark', desc: 'Easy on the eyes in low light', icon: 'dark-mode' },
  { key: 'system', label: 'System', desc: 'Follows your device theme', icon: 'settings-suggest' },
];

export default function DarkModeScreen() {
  const router = useRouter();
  const { preference, setPreference } = useThemePreference();

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <Animated.View entering={FadeInDown.duration(400).springify()} className="flex-row items-center justify-between px-gutter-mobile py-4 border-b border-border-subtle">
        <TouchableOpacity onPress={() => router.back()} className="w-touch-target-min h-touch-target-min justify-center">
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="font-headline-md text-headline-md font-bold text-growth-green">Appearance</Text>
        <View className="w-touch-target-min h-touch-target-min" />
      </Animated.View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <Text className="font-body-md text-body-md text-on-surface-variant mb-stack-md">Choose how Shopo looks on this device.</Text>
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="bg-surface-container-lowest rounded-xl border border-border-subtle overflow-hidden">
          {OPTIONS.map((opt, i) => {
            const active = preference === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                activeOpacity={0.8}
                onPress={() => setPreference(opt.key)}
                className={`flex-row items-center p-stack-md ${i < OPTIONS.length - 1 ? 'border-b border-border-subtle' : ''} ${active ? 'bg-primary-fixed' : ''}`}
              >
                <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${active ? 'bg-growth-green' : 'bg-surface-container-high'}`}>
                  <MaterialIcons name={opt.icon} size={22} color={active ? '#ffffff' : '#6e7976'} />
                </View>
                <View className="flex-1">
                  <Text className="font-label-lg text-label-lg text-on-surface">{opt.label}</Text>
                  <Text className="font-body-md text-body-md text-on-surface-variant mt-0.5">{opt.desc}</Text>
                </View>
                {active && <MaterialIcons name="check-circle" size={24} color="#006B5E" />}
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
