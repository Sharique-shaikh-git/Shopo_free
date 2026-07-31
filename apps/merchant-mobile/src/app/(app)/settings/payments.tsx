import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentMethodsScreen() {
  const [jazzCashEnabled, setJazzCashEnabled] = useState(true);
  const [easyPaisaEnabled, setEasyPaisaEnabled] = useState(false);
  const [jazzCashNumber, setJazzCashNumber] = useState('0300 1234567');
  const [easyPaisaNumber, setEasyPaisaNumber] = useState('');

  return (
    <ScrollView className="flex-1 bg-[#F9F9FC]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-[#F9F9FC]">
        <View className="flex-row items-center gap-3 flex-1">
          <Ionicons name="storefront" size={24} color="#005147" />
          <Text className="text-[20px] font-bold text-[#005147]">Shop Builder</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Ionicons name="globe" size={22} color="#005147" />
        </TouchableOpacity>
      </View>

      <View className="px-4 py-6 pb-32">
        {/* Header Section */}
        <View className="mb-6">
          <Text className="text-[28px] font-bold text-[#1a1c1e] mb-2">Payment Methods</Text>
          <Text className="text-[16px] text-[#75797E] leading-6">
            Configure how customers pay you. Enable JazzCash or EasyPaisa to start accepting digital payments instantly.
          </Text>
        </View>

        {/* AI Tip */}
        <View className="bg-[#CCE8E415] border border-[#CCE8E420] rounded-xl p-4 mb-6 flex-row gap-3">
          <Ionicons name="sparkles" size={20} color="#005147" style={{ marginTop: 2 }} />
          <Text className="flex-1 text-[14px] font-semibold text-[#005147]">
            <Text className="text-[#005147]">AI Tip:</Text> Enabling multiple payment methods increases checkout
            conversion by up to 40% in your region.
          </Text>
        </View>

        {/* JazzCash Card */}
        <View className="bg-white border border-[#E0E3DE] rounded-xl p-4 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-lg bg-[#FFD70015] items-center justify-center">
                <Text className="text-[18px] font-bold text-[#FFD700]">J</Text>
              </View>
              <View>
                <Text className="text-[18px] font-bold text-[#1a1c1e]">JazzCash</Text>
                <Text className="text-[12px] text-[#75797E]">Mobile Wallet & QR</Text>
              </View>
            </View>
            {/* Toggle */}
            <TouchableOpacity
              className={`w-11 h-6 rounded-full p-1 ${jazzCashEnabled ? 'bg-[#006B5E]' : 'bg-[#79747E]'}`}
              onPress={() => setJazzCashEnabled(!jazzCashEnabled)}
            >
              <View
                className={`w-4 h-4 bg-white rounded-full ${jazzCashEnabled ? 'ml-5' : 'ml-0'}`}
              />
            </TouchableOpacity>
          </View>
          {jazzCashEnabled && (
            <View>
              <Text className="text-[12px] text-[#75797E] mb-1 ml-1">JazzCash Account Number</Text>
              <TextInput
                className="w-full h-12 px-4 rounded-lg border-2 border-[#E0E3DE] text-[16px] text-[#1a1c1e]"
                placeholder="03XX XXXXXXX"
                placeholderTextColor="#75797E"
                value={jazzCashNumber}
                onChangeText={setJazzCashNumber}
              />
              <View className="flex-row items-center gap-1 mt-2">
                <Ionicons name="information-circle" size={14} color="#75797E" />
                <Text className="text-[12px] text-[#75797E]">Payments will be sent to this number.</Text>
              </View>
            </View>
          )}
        </View>

        {/* EasyPaisa Card */}
        <View className={`bg-white border border-[#E0E3DE] rounded-xl p-4 mb-4 ${!easyPaisaEnabled ? 'opacity-50' : ''}`}>
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-lg bg-[#006B5E15] items-center justify-center">
                <Text className="text-[18px] font-bold text-[#006B5E]">E</Text>
              </View>
              <View>
                <Text className="text-[18px] font-bold text-[#1a1c1e]">EasyPaisa</Text>
                <Text className="text-[12px] text-[#75797E]">Mobile Wallet & Bank Transfer</Text>
              </View>
            </View>
            <TouchableOpacity
              className={`w-11 h-6 rounded-full p-1 ${easyPaisaEnabled ? 'bg-[#006B5E]' : 'bg-[#79747E]'}`}
              onPress={() => setEasyPaisaEnabled(!easyPaisaEnabled)}
            >
              <View
                className={`w-4 h-4 bg-white rounded-full ${easyPaisaEnabled ? 'ml-5' : 'ml-0'}`}
              />
            </TouchableOpacity>
          </View>
          {easyPaisaEnabled && (
            <View>
              <Text className="text-[12px] text-[#75797E] mb-1 ml-1">EasyPaisa Account Number</Text>
              <TextInput
                className="w-full h-12 px-4 rounded-lg border-2 border-[#E0E3DE] text-[16px] text-[#1a1c1e]"
                placeholder="03XX XXXXXXX"
                placeholderTextColor="#75797E"
                value={easyPaisaNumber}
                onChangeText={setEasyPaisaNumber}
              />
            </View>
          )}
        </View>

        {/* Cash on Delivery */}
        <View className="bg-[#F2F0F4] border border-dashed border-[#79747E] rounded-xl p-4 mb-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-lg bg-[#E7E0EC] items-center justify-center">
                <Ionicons name="cash" size={22} color="#79747E" />
              </View>
              <View>
                <Text className="text-[18px] font-bold text-[#79747E]">Cash on Delivery</Text>
                <Text className="text-[12px] text-[#79747E]">Enabled by default</Text>
              </View>
            </View>
            <View className="w-6 h-6 bg-[#CCE8E4] rounded-full items-center justify-center">
              <Ionicons name="checkmark" size={14} color="#005147" />
            </View>
          </View>
        </View>
      </View>

      {/* Fixed Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E0E3DE] p-4 pb-8">
        <TouchableOpacity className="w-full h-[56px] bg-[#005147] rounded-xl items-center justify-center flex-row gap-2">
          <Text className="text-[14px] font-bold text-white">Save Payment Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
