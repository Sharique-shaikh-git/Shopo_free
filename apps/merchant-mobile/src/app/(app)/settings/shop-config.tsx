import { View, Text, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function ShopConfigScreen() {
  const router = useRouter();
  const [shopName, setShopName] = useState('Ali\'s Digital Dukaan');
  const [description, setDescription] = useState('Your one-stop shop for quality products at great prices.');
  const [whatsapp, setWhatsapp] = useState('0300 1234567');
  const [autoReply, setAutoReply] = useState(true);
  const [inventory, setInventory] = useState(true);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-[#E0E3DE]">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-center">
          <Ionicons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[20px] font-semibold text-[#1a1c1e]">Shop Configuration</Text>
        <View className="w-12" />
      </View>

      <ScrollView className="flex-1 px-4 py-6 pb-32">
        {/* Shop Details */}
        <Text className="text-[12px] font-semibold text-[#75797E] uppercase tracking-wider mb-3 px-1">Shop Details</Text>
        <View className="bg-white border border-[#E0E3DE] rounded-xl p-4 gap-4 mb-6 shadow-sm">
          <View>
            <Text className="text-[12px] text-[#75797E] mb-1 ml-1">Shop Name</Text>
            <TextInput
              className="w-full px-4 py-3 border border-[#E0E3DE] rounded-lg text-[16px] text-[#1a1c1e]"
              value={shopName}
              onChangeText={setShopName}
            />
          </View>
          <View>
            <Text className="text-[12px] text-[#75797E] mb-1 ml-1">Description</Text>
            <TextInput
              className="w-full px-4 py-3 border border-[#E0E3DE] rounded-lg text-[16px] text-[#1a1c1e] min-h-[80px] text-top"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
          </View>
          <View>
            <Text className="text-[12px] text-[#75797E] mb-1 ml-1">WhatsApp Number</Text>
            <TextInput
              className="w-full px-4 py-3 border border-[#E0E3DE] rounded-lg text-[16px] text-[#1a1c1e]"
              value={whatsapp}
              onChangeText={setWhatsapp}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Automation */}
        <Text className="text-[12px] font-semibold text-[#75797E] uppercase tracking-wider mb-3 px-1">Automation</Text>
        <View className="bg-white border border-[#E0E3DE] rounded-xl overflow-hidden mb-6 shadow-sm">
          <View className="flex-row items-center justify-between p-4 border-b border-[#E0E3DE]">
            <View className="flex-1 mr-4">
              <Text className="text-[16px] text-[#1a1c1e]">Auto-Reply on WhatsApp</Text>
              <Text className="text-[12px] text-[#75797E] mt-1">Send automatic responses to customers</Text>
            </View>
            <Switch value={autoReply} onValueChange={setAutoReply} trackColor={{ false: '#bec9c5', true: '#006B5E' }} />
          </View>
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-1 mr-4">
              <Text className="text-[16px] text-[#1a1c1e]">Low Stock Alerts</Text>
              <Text className="text-[12px] text-[#75797E] mt-1">Get notified when stock is low</Text>
            </View>
            <Switch value={inventory} onValueChange={setInventory} trackColor={{ false: '#bec9c5', true: '#006B5E' }} />
          </View>
        </View>

        {/* Business Hours */}
        <Text className="text-[12px] font-semibold text-[#75797E] uppercase tracking-wider mb-3 px-1">Business Hours</Text>
        <View className="bg-white border border-[#E0E3DE] rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[16px] text-[#1a1c1e]">Monday - Saturday</Text>
            <Text className="text-[16px] text-[#005147] font-semibold">9:00 AM - 6:00 PM</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-[16px] text-[#1a1c1e]">Sunday</Text>
            <Text className="text-[16px] text-[#BA1A1A] font-semibold">Closed</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E0E3DE] px-4 py-4 pb-8">
        <TouchableOpacity className="w-full h-[56px] bg-[#005147] rounded-lg items-center justify-center shadow-sm">
          <Text className="text-[14px] font-semibold text-white">Save Configuration</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
