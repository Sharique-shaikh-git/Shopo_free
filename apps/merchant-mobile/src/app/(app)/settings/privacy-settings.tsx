import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function PrivacySettingsScreen() {
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [personalized, setPersonalized] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full">
          <Ionicons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[20px] font-semibold text-[#1a1c1e]">Privacy</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4 pb-32 pt-2">
        {/* Profile Visibility */}
        <Text className="text-[12px] font-semibold text-[#75797E] uppercase tracking-wider mb-3 px-2">Profile Visibility</Text>
        <View className="bg-white border border-[#E0E3DE] rounded-xl overflow-hidden mb-6 shadow-sm">
          <View className="flex-row items-center justify-between p-4 border-b border-[#E0E3DE]">
            <Text className="text-[18px] text-[#1a1c1e]">Show Profile to Customers</Text>
            <Switch value={showProfile} onValueChange={setShowProfile} trackColor={{ false: '#bec9c5', true: '#006B5E' }} />
          </View>
          <View className="flex-row items-center justify-between p-4 border-b border-[#E0E3DE]">
            <Text className="text-[18px] text-[#1a1c1e]">Show Phone Number</Text>
            <Switch value={showPhone} onValueChange={setShowPhone} trackColor={{ false: '#bec9c5', true: '#006B5E' }} />
          </View>
          <View className="flex-row items-center justify-between p-4">
            <Text className="text-[18px] text-[#1a1c1e]">Show Email</Text>
            <Switch value={showEmail} onValueChange={setShowEmail} trackColor={{ false: '#bec9c5', true: '#006B5E' }} />
          </View>
        </View>

        {/* Data Management */}
        <Text className="text-[12px] font-semibold text-[#75797E] uppercase tracking-wider mb-3 px-2">Data Management</Text>
        <View className="bg-white border border-[#E0E3DE] rounded-xl overflow-hidden mb-6 shadow-sm">
          <View className="flex-row items-center justify-between p-4 border-b border-[#E0E3DE]">
            <View className="flex-1 mr-4">
              <Text className="text-[18px] text-[#1a1c1e]">Share Analytics Data</Text>
              <Text className="text-[12px] text-[#75797E] mt-1">Help us improve the app experience</Text>
            </View>
            <Switch value={shareAnalytics} onValueChange={setShareAnalytics} trackColor={{ false: '#bec9c5', true: '#006B5E' }} />
          </View>
          <View className="flex-row items-center justify-between p-4">
            <Text className="text-[18px] text-[#1a1c1e]">Personalized Recommendations</Text>
            <Switch value={personalized} onValueChange={setPersonalized} trackColor={{ false: '#bec9c5', true: '#006B5E' }} />
          </View>
        </View>

        {/* Account Security */}
        <Text className="text-[12px] font-semibold text-[#75797E] uppercase tracking-wider mb-3 px-2">Account Security</Text>
        <View className="bg-white border border-[#E0E3DE] rounded-xl overflow-hidden shadow-sm">
          <View className="flex-row items-center justify-between p-4 border-b border-[#E0E3DE]">
            <Text className="text-[18px] text-[#1a1c1e]">Two-Factor Authentication</Text>
            <Switch value={twoFactor} onValueChange={setTwoFactor} trackColor={{ false: '#bec9c5', true: '#006B5E' }} />
          </View>
          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <Text className="text-[18px] text-[#1a1c1e]">Login Activity</Text>
            <Ionicons name="chevron-forward" size={20} color="#79747E" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E0E3DE] px-4 py-4 pb-8">
        <TouchableOpacity className="w-full h-[56px] bg-[#005147] rounded-lg items-center justify-center shadow-sm">
          <Text className="text-[14px] font-semibold text-white uppercase tracking-wider">Save Preferences</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
