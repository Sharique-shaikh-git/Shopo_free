import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AppVersionScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-[#F2F0F4]">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-center rounded-full">
          <Ionicons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[20px] font-semibold text-[#1a1c1e]">App Version</Text>
        <View className="w-12" />
      </View>

      <ScrollView className="flex-1 px-4 py-8 pb-32">
        {/* App Logo & Info */}
        <View className="items-center mb-10">
          <View className="w-24 h-24 bg-[#CCE8E4] rounded-3xl items-center justify-center mb-4">
            <Ionicons name="storefront" size={48} color="#005147" />
          </View>
          <Text className="text-[24px] font-bold text-[#1a1c1e]">Digital Dukaan</Text>
          <Text className="text-[16px] text-[#75797E] mt-1">Version 1.0.0</Text>
          <Text className="text-[12px] text-[#79747E] mt-1">Build 123</Text>
          <Text className="text-[12px] text-[#79747E] mt-1">Updated July 8, 2026</Text>
        </View>

        {/* Links */}
        <View className="bg-white border border-[#E0E3DE] rounded-xl overflow-hidden shadow-sm">
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-[#E0E3DE]">
            <View className="flex-row items-center gap-3">
              <Ionicons name="rocket" size={20} color="#005147" />
              <Text className="text-[16px] text-[#1a1c1e]">What's New</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#75797E" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-[#E0E3DE]">
            <View className="flex-row items-center gap-3">
              <Ionicons name="star" size={20} color="#E8A33D" />
              <Text className="text-[16px] text-[#1a1c1e]">Rate Us</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#75797E" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(app)/settings/privacy')}
            className="flex-row items-center justify-between p-4 border-b border-[#E0E3DE]"
          >
            <View className="flex-row items-center gap-3">
              <Ionicons name="shield-checkmark" size={20} color="#0B57A4" />
              <Text className="text-[16px] text-[#1a1c1e]">Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#75797E" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(app)/settings/terms')}
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center gap-3">
              <Ionicons name="document-text" size={20} color="#75797E" />
              <Text className="text-[16px] text-[#1a1c1e]">Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#75797E" />
          </TouchableOpacity>
        </View>

        {/* Credits */}
        <View className="items-center mt-8">
          <Text className="text-[14px] text-[#75797E]">Made with ❤️ in Pakistan</Text>
        </View>
      </ScrollView>
    </View>
  );
}
