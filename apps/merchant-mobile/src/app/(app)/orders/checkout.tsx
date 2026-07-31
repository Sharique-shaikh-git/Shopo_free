import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const CART_ITEMS = [
  { name: 'Premium Wireless Earbuds Pro', qty: 1, price: 4500 },
];

export default function CODCheckoutScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Karachi, Sindh');

  const subtotal = CART_ITEMS.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = 200;
  const total = subtotal + deliveryFee;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-[#F2F0F4]">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-center rounded-full">
          <Ionicons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[20px] font-bold text-[#005147]">Checkout</Text>
        <View className="w-12" />
      </View>

      <ScrollView className="flex-1 pb-32">
        <View className="max-w-lg mx-auto px-4 py-6 gap-6">
          {/* Shipping Information */}
          <View className="gap-4">
            <Text className="text-[20px] font-semibold text-[#1a1c1e]">Shipping Information</Text>

            {/* Full Name */}
            <View className="bg-white border border-[#E0E3DE] rounded-lg px-4 pt-6 pb-2">
              <TextInput
                className="w-full text-[16px] text-[#1a1c1e]"
                placeholder=" "
                value={fullName}
                onChangeText={setFullName}
              />
              <Text className="absolute left-4 top-2 text-[12px] text-[#75797E]">Full Name</Text>
            </View>

            {/* Phone */}
            <View className="bg-white border border-[#E0E3DE] rounded-lg px-4 pt-6 pb-2">
              <TextInput
                className="w-full text-[16px] text-[#1a1c1e]"
                placeholder=" "
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <Text className="absolute left-4 top-2 text-[12px] text-[#75797E]">Phone Number</Text>
            </View>

            {/* Address */}
            <View className="bg-white border border-[#E0E3DE] rounded-lg px-4 pt-6 pb-2 h-32">
              <TextInput
                className="w-full h-full text-[16px] text-[#1a1c1e]"
                placeholder=" "
                value={address}
                onChangeText={setAddress}
                multiline
                textAlignVertical="top"
              />
              <Text className="absolute left-4 top-2 text-[12px] text-[#75797E]">Complete Delivery Address</Text>
            </View>

            {/* City */}
            <TouchableOpacity className="bg-white border border-[#E0E3DE] rounded-lg px-4 py-3 flex-row items-center justify-between">
              <View>
                <Text className="text-[12px] text-[#75797E]">City / Region</Text>
                <Text className="text-[16px] text-[#1a1c1e]">{city}</Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#75797E" />
            </TouchableOpacity>
          </View>

          {/* Payment Method */}
          <View className="gap-4">
            <Text className="text-[20px] font-semibold text-[#1a1c1e]">Payment Method</Text>
            <View className="bg-[#F2F0F4] border border-[#E0E3DE] rounded-lg p-4 flex-row items-start gap-4">
              <View className="w-12 h-12 rounded-full bg-[#CCE8E4] items-center justify-center flex-shrink-0">
                <Ionicons name="cash" size={22} color="#005147" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-semibold text-[#1a1c1e]">Cash on Delivery</Text>
                <Text className="text-[16px] text-[#75797E] mt-1">
                  Pay with cash when your order arrives. Please keep exact change ready.
                </Text>
              </View>
              <Ionicons name="checkmark-circle" size={22} color="#005147" />
            </View>
          </View>

          {/* Order Summary */}
          <View className="gap-4">
            <Text className="text-[20px] font-semibold text-[#1a1c1e]">Order Summary</Text>
            <View className="bg-white border border-[#E0E3DE] rounded-lg p-4 gap-4">
              {CART_ITEMS.map((item, i) => (
                <View key={i} className="flex-row items-center gap-4 border-b border-[#E0E3DE] pb-4">
                  <View className="w-16 h-16 rounded-lg bg-[#F2F0F4] items-center justify-center">
                    <Ionicons name="cube" size={22} color="#75797E" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[16px] text-[#1a1c1e]" numberOfLines={1}>{item.name}</Text>
                    <Text className="text-[12px] text-[#75797E]">Qty: {item.qty}</Text>
                  </View>
                  <Text className="text-[14px] font-semibold text-[#1a1c1e]">Rs {item.price.toLocaleString()}</Text>
                </View>
              ))}
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-[16px] text-[#75797E]">Subtotal</Text>
                  <Text className="text-[16px] text-[#1a1c1e]">Rs {subtotal.toLocaleString()}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-[16px] text-[#75797E]">Delivery Fee</Text>
                  <Text className="text-[16px] text-[#1a1c1e]">Rs {deliveryFee}</Text>
                </View>
                <View className="flex-row justify-between pt-4 border-t border-[#E0E3DE]">
                  <Text className="text-[20px] font-semibold text-[#1a1c1e]">Total</Text>
                  <Text className="text-[20px] font-bold text-[#005147]">Rs {total.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E0E3DE] px-4 py-4 pb-8">
        <View className="max-w-lg mx-auto flex-row items-center justify-between gap-4">
          <View>
            <Text className="text-[12px] text-[#75797E]">Total Payable</Text>
            <Text className="text-[20px] font-bold text-[#005147]">Rs {total.toLocaleString()}</Text>
          </View>
          <TouchableOpacity className="bg-[#005147] rounded-full h-14 px-8 items-center justify-center flex-grow shadow-sm">
            <Text className="text-[14px] font-semibold text-white">Place Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
