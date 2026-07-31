import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { removeToken } from '../../../lib/api';

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
        await removeToken();
        router.replace('/(auth)/login');
      }},
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-[#F2F0F4]">
        <View className="flex-row items-center gap-2 flex-1">
          <Ionicons name="storefront" size={24} color="#005147" />
          <Text className="text-[20px] font-bold text-[#005147]">Shop Builder</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Ionicons name="globe" size={22} color="#005147" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-6 pb-32">
        <Text className="text-[28px] font-bold text-[#1a1c1e] mb-6">Profile & Settings</Text>

        {/* Account Owner */}
        <Text className="text-[12px] font-semibold text-[#75797E] uppercase tracking-wider mb-3 px-1">Account Owner</Text>
        <View className="bg-white border border-[#E0E3DE] rounded-xl overflow-hidden mb-6 shadow-sm">
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-[#E0E3DE]">
            <View className="flex-row items-center gap-3">
              <Ionicons name="storefront" size={20} color="#79747E" />
              <Text className="text-[18px] text-[#1a1c1e]">Shop Name</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-[16px] text-[#75797E]">Ahmed's Electronics</Text>
              <Ionicons name="chevron-forward" size={20} color="#75797E" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-[#E0E3DE]">
            <View className="flex-row items-center gap-3">
              <Ionicons name="image" size={20} color="#79747E" />
              <Text className="text-[18px] text-[#1a1c1e]">Shop Logo</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#75797E" />
          </TouchableOpacity>
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3 flex-1">
              <Ionicons name="link" size={20} color="#79747E" />
              <View className="flex-1">
                <Text className="text-[18px] text-[#1a1c1e]">Store URL</Text>
                <Text className="text-[16px] text-[#005147] truncate">ahmeds-electronics.shop.pk</Text>
              </View>
            </View>
            <TouchableOpacity className="w-10 h-10 items-center justify-center">
              <Ionicons name="copy" size={20} color="#005147" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Shop Details */}
        <Text className="text-[12px] font-semibold text-[#75797E] uppercase tracking-wider mb-3 px-1">Shop Details</Text>
        <View className="bg-white border border-[#E0E3DE] rounded-xl overflow-hidden mb-6 shadow-sm">
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-[#E0E3DE]">
            <View className="flex-row items-center gap-3">
              <Ionicons name="language" size={20} color="#79747E" />
              <Text className="text-[18px] text-[#1a1c1e]">Language</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-[16px] text-[#75797E]">English</Text>
              <Ionicons name="chevron-forward" size={20} color="#75797E" />
            </View>
          </TouchableOpacity>
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
              <Ionicons name="notifications" size={20} color="#79747E" />
              <Text className="text-[18px] text-[#1a1c1e]">Notifications</Text>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: '#bec9c5', true: '#006B5E' }} />
          </View>
        </View>

        {/* Preferences */}
        <Text className="text-[12px] font-semibold text-[#75797E] uppercase tracking-wider mb-3 px-1">Preferences</Text>
        <View className="bg-white border border-[#E0E3DE] rounded-xl overflow-hidden mb-6 shadow-sm">
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-[#E0E3DE]">
            <View className="flex-row items-center gap-3">
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
              <Text className="text-[18px] text-[#1a1c1e]">Help Center (WhatsApp)</Text>
            </View>
            <Ionicons name="open-outline" size={20} color="#75797E" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
              <Ionicons name="document-text" size={20} color="#79747E" />
              <Text className="text-[18px] text-[#1a1c1e]">Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#75797E" />
          </TouchableOpacity>
        </View>

        {/* Support & Legal */}
        <Text className="text-[12px] font-semibold text-[#75797E] uppercase tracking-wider mb-3 px-1">Support & Legal</Text>
        <View className="bg-white border border-[#E0E3DE] rounded-xl overflow-hidden mb-6 shadow-sm">
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-[#E0E3DE]">
            <View className="flex-row items-center gap-3">
              <Ionicons name="help-circle" size={20} color="#79747E" />
              <Text className="text-[18px] text-[#1a1c1e]">Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#75797E" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
              <Ionicons name="document-text" size={20} color="#79747E" />
              <Text className="text-[18px] text-[#1a1c1e]">Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#75797E" />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="w-full flex-row items-center justify-center gap-2 py-4 bg-[#F9D0DE] rounded-xl mb-4"
        >
          <Ionicons name="log-out" size={20} color="#BA1A1A" />
          <Text className="text-[14px] font-semibold text-[#BA1A1A]">Logout</Text>
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity className="w-full flex-row items-center justify-center gap-2 py-3 mb-4">
          <Ionicons name="trash" size={18} color="#BA1A1A" />
          <Text className="text-[14px] text-[#BA1A1A]">Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
