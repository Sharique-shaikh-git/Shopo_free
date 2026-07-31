import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemePreference } from '../../../context/ThemeContext';

type ThemeOption = 'light' | 'dark' | 'system';

export default function DarkModeScreen() {
  const router = useRouter();
  const { preference, setPreference } = useThemePreference();

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-[#F2F0F4]">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-center rounded-full">
          <Ionicons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[20px] font-bold text-[#005147]">Dark Mode</Text>
        <View className="w-12" />
      </View>

      <ScrollView className="flex-1 px-4 py-6 pb-32">
        {/* Preview Section */}
        <Text className="text-[14px] font-semibold text-[#75797E] mb-3">Appearance Preview</Text>
        <View className="w-full h-48 rounded-xl border border-[#E0E3DE] overflow-hidden flex-row mb-8 shadow-sm">
          {/* Light Half */}
          <View className="w-1/2 h-full bg-white p-4 border-r border-[#E0E3DE]">
            <View className="w-full h-8 bg-[#F2F0F4] rounded-lg mb-4" />
            <View className="w-3/4 h-4 bg-[#E0E3DE] rounded mb-2" />
            <View className="w-1/2 h-4 bg-[#E0E3DE] rounded" />
            <View className="absolute bottom-4 left-4 w-12 h-12 bg-[#CCE8E4] rounded-full" />
          </View>
          {/* Dark Half */}
          <View className="w-1/2 h-full bg-[#1a1c1e] p-4">
            <View className="w-full h-8 bg-[#2f3133] rounded-lg mb-4" />
            <View className="w-3/4 h-4 bg-[#2f3133] rounded mb-2 opacity-50" />
            <View className="w-1/2 h-4 bg-[#2f3133] rounded opacity-50" />
            <View className="absolute bottom-4 right-4 w-12 h-12 bg-[#005147] rounded-full" />
          </View>
        </View>

        {/* Selection Options */}
        <View className="gap-4">
          {/* Light Mode */}
          <TouchableOpacity
            onPress={() => setPreference('light')}
            className={`w-full flex-row items-center justify-between p-4 rounded-xl border-2 ${
              preference === 'light' ? 'border-[#005147] bg-white shadow-sm' : 'border-[#E0E3DE] bg-white'
            }`}
          >
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 rounded-full bg-[#F2F0F4] items-center justify-center">
                <Ionicons name="sunny" size={22} color="#1a1c1e" />
              </View>
              <View>
                <Text className="text-[18px] font-semibold text-[#1a1c1e]">Light Mode</Text>
                <Text className="text-[16px] text-[#75797E]">Clean and bright</Text>
              </View>
            </View>
            {preference === 'light' && (
              <View className="w-6 h-6 bg-[#005147] rounded-full items-center justify-center">
                <Ionicons name="checkmark" size={14} color="white" />
              </View>
            )}
          </TouchableOpacity>

          {/* Dark Mode */}
          <TouchableOpacity
            onPress={() => setPreference('dark')}
            className={`w-full flex-row items-center justify-between p-4 rounded-xl border-2 ${
              preference === 'dark' ? 'border-[#005147] bg-white shadow-sm' : 'border-[#E0E3DE] bg-white'
            }`}
          >
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 rounded-full bg-[#1a1c1e] items-center justify-center">
                <Ionicons name="moon" size={22} color="white" />
              </View>
              <View>
                <Text className="text-[18px] font-semibold text-[#1a1c1e]">Dark Mode</Text>
                <Text className="text-[16px] text-[#75797E]">Easy on the eyes</Text>
              </View>
            </View>
            {preference === 'dark' && (
              <View className="w-6 h-6 bg-[#005147] rounded-full items-center justify-center">
                <Ionicons name="checkmark" size={14} color="white" />
              </View>
            )}
          </TouchableOpacity>

          {/* System Default */}
          <TouchableOpacity
            onPress={() => setPreference('system')}
            className={`w-full flex-row items-center justify-between p-4 rounded-xl border-2 ${
              preference === 'system' ? 'border-[#005147] bg-white shadow-sm' : 'border-[#E0E3DE] bg-white'
            }`}
          >
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 rounded-full border border-[#E0E3DE] overflow-hidden flex-row">
                <View className="w-1/2 h-full bg-white items-center justify-center">
                  <Ionicons name="phone-portrait" size={12} color="#1a1c1e" />
                </View>
                <View className="w-1/2 h-full bg-[#1a1c1e]" />
              </View>
              <View>
                <Text className="text-[18px] font-semibold text-[#1a1c1e]">System Default</Text>
                <Text className="text-[16px] text-[#75797E]">Matches device settings</Text>
              </View>
            </View>
            {preference === 'system' && (
              <View className="w-6 h-6 bg-[#005147] rounded-full items-center justify-center">
                <Ionicons name="checkmark" size={14} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
