import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const LANGUAGES = [
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي', flag: '🇵🇰' },
];

export default function LanguageScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState('en');

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full">
          <Ionicons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[20px] font-semibold text-[#1a1c1e]">Language</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4 py-6 pb-32">
        {/* Current Language */}
        <View className="bg-[#F2F0F4] rounded-xl p-4 mb-6">
          <Text className="text-[12px] font-semibold text-[#75797E] uppercase tracking-wider mb-1">Current Language</Text>
          <Text className="text-[18px] font-semibold text-[#1a1c1e]">
            {LANGUAGES.find(l => l.code === selected)?.name} ({LANGUAGES.find(l => l.code === selected)?.native})
          </Text>
        </View>

        {/* Language Options */}
        <View className="gap-4">
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => setSelected(lang.code)}
              className={`flex-row items-center justify-between p-4 rounded-xl border-2 ${
                selected === lang.code ? 'border-[#005147] bg-[#CCE8E415]' : 'border-[#E0E3DE] bg-white'
              }`}
            >
              <View className="flex-row items-center gap-4">
                <Text className="text-2xl">{lang.flag}</Text>
                <View>
                  <Text className="text-[18px] font-semibold text-[#1a1c1e]">{lang.name}</Text>
                  <Text className="text-[16px] text-[#75797E]">{lang.native}</Text>
                </View>
              </View>
              {selected === lang.code && (
                <View className="w-6 h-6 bg-[#005147] rounded-full items-center justify-center">
                  <Ionicons name="checkmark" size={14} color="white" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E0E3DE] px-4 py-4 pb-8">
        <TouchableOpacity className="w-full h-[56px] bg-[#005147] rounded-lg items-center justify-center shadow-sm">
          <Text className="text-[14px] font-semibold text-white">Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
