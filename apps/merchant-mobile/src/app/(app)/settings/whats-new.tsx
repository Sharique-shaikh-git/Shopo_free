import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const FEATURES = [
  {
    emoji: '✨',
    title: 'Dark Mode',
    desc: 'Easier on the eyes, especially at night. Enable it in settings.',
  },
  {
    emoji: '📊',
    title: 'Better Analytics',
    desc: 'Deeper insights into your sales performance with our new dashboard.',
  },
  {
    emoji: '🎤',
    title: 'Voice Input',
    desc: 'Search and add products faster by just speaking to your phone.',
  },
  {
    emoji: '🐛',
    title: 'Bug Fixes',
    desc: 'Squashed some pesky bugs to make the app smoother and more reliable.',
  },
];

export default function WhatsNewScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F9F9FC]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-[#F2F0F4]">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-center rounded-full">
          <Ionicons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[20px] font-bold text-[#005147]">What's New</Text>
        <View className="w-12" />
      </View>

      <ScrollView className="flex-1 px-4 pt-6 pb-32">
        {/* Header Section */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-[#CCE8E4] rounded-full items-center justify-center mb-4 shadow-lg">
            <Ionicons name="rocket" size={40} color="#005147" />
          </View>
          <Text className="text-[28px] font-bold text-[#1a1c1e]">Version 2.0.0</Text>
          <Text className="text-[16px] text-[#75797E] text-center mt-2">
            We've been hard at work making things better for you. Check out what's new!
          </Text>
        </View>

        {/* Features List */}
        <View className="gap-4">
          {FEATURES.map((f, i) => (
            <View key={i} className="flex-row items-start bg-white rounded-xl p-4 border border-[#E0E3DE]">
              <View className="w-12 h-12 bg-[#F2F0F4] rounded-full items-center justify-center mr-4 shadow-sm">
                <Text className="text-2xl">{f.emoji}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-semibold text-[#1a1c1e] mb-1">{f.title}</Text>
                <Text className="text-[16px] text-[#75797E] leading-5">{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E0E3DE] p-4 pb-8">
        <TouchableOpacity className="w-full h-[56px] bg-[#005147] rounded-xl items-center justify-center">
          <Text className="text-[14px] font-semibold text-white">Got It</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
