import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

const ORDER_ITEMS = [
  { name: 'Premium Organic Basmati Rice 5kg', qty: 2, price: 4500 },
  { name: 'Pure Cooking Oil 3L', qty: 1, price: 2800 },
];

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const trackingNumber = `PK-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

  const subtotal = ORDER_ITEMS.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = 200;
  const total = subtotal + deliveryFee;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white">
        <TouchableOpacity onPress={() => router.replace('/(app)')} className="w-10 h-10 items-center justify-center rounded-full">
          <Ionicons name="close" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[20px] font-semibold text-[#1a1c1e]">Order Confirmation</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-5 pb-24">
        {/* Hero Success */}
        <Animated.View entering={FadeIn.duration(600)} className="items-center py-8">
          <View className="w-24 h-24 items-center justify-center mb-6">
            <View className="absolute inset-0 bg-[#005147] opacity-10 rounded-full" style={{ transform: [{ scale: 1.3 }] }} />
            <View className="absolute inset-2 bg-[#005147] opacity-20 rounded-full" />
            <Ionicons name="checkmark-circle" size={72} color="#005147" style={{ zIndex: 10 }} />
          </View>
          <Text className="text-[28px] font-bold text-[#1a1c1e] text-center mb-2">Order Placed!</Text>
          <Text className="text-[16px] text-[#75797E] text-center mb-6 max-w-[280px]">
            Thank you for your purchase. The merchant has received your order.
          </Text>
          {/* Tracking Pill */}
          <View className="items-center gap-2 w-full max-w-sm">
            <Text className="text-[12px] font-semibold text-[#75797E] uppercase tracking-wider">Tracking Number</Text>
            <TouchableOpacity className="w-full max-w-[240px] bg-[#F2F0F4] border border-[#E0E3DE] rounded-xl py-3 px-4 flex-row items-center justify-center gap-3">
              <Text className="text-[14px] font-semibold text-[#1a1c1e] tracking-widest font-mono">{trackingNumber}</Text>
              <Ionicons name="copy-outline" size={18} color="#75797E" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Order Summary Card */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} className="border border-[#E0E3DE] rounded-xl overflow-hidden mb-6 shadow-sm">
          <View className="flex-row items-center gap-2 px-4 py-3 bg-[#F2F0F4] border-b border-[#E0E3DE]">
            <MaterialIcons name="receipt" size={18} color="#75797E" />
            <Text className="text-[20px] font-semibold text-[#1a1c1e]">Order Summary</Text>
          </View>
          <View className="px-4 py-4 gap-4">
            {ORDER_ITEMS.map((item, i) => (
              <View key={i} className="flex-row items-center gap-4">
                <View className="w-16 h-16 rounded-lg bg-[#F2F0F4] border border-[#E0E3DE] items-center justify-center">
                  <Ionicons name="cube" size={22} color="#75797E" />
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="text-[16px] font-medium text-[#1a1c1e]" numberOfLines={1}>{item.name}</Text>
                  <Text className="text-[12px] text-[#75797E] mt-1">Qty: {item.qty}</Text>
                </View>
                <Text className="text-[16px] font-medium text-[#1a1c1e]">Rs {item.price.toLocaleString()}</Text>
              </View>
            ))}
          </View>
          {/* Totals */}
          <View className="px-4 py-4 bg-[#F2F0F4] border-t border-[#E0E3DE] gap-2">
            <View className="flex-row justify-between">
              <Text className="text-[16px] text-[#75797E]">Subtotal</Text>
              <Text className="text-[16px] text-[#1a1c1e]">Rs {subtotal.toLocaleString()}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[16px] text-[#75797E]">Delivery Fee</Text>
              <Text className="text-[16px] text-[#1a1c1e]">Rs {deliveryFee}</Text>
            </View>
            <View className="flex-row justify-between mt-2 pt-2 border-t border-[#E0E3DE] border-dashed">
              <Text className="text-[14px] font-semibold text-[#1a1c1e]">Total</Text>
              <Text className="text-[20px] font-bold text-[#005147]">Rs {total.toLocaleString()}</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E0E3DE] px-5 py-4 pb-8 gap-3">
        <TouchableOpacity className="w-full h-[56px] bg-[#25D366] rounded-xl items-center justify-center flex-row gap-2 shadow-sm">
          <Ionicons name="logo-whatsapp" size={22} color="white" />
          <Text className="text-[14px] font-semibold text-white">WhatsApp Merchant</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace('/(app)')}
          className="w-full h-[56px] border-2 border-[#E0E3DE] rounded-xl items-center justify-center"
        >
          <Text className="text-[14px] font-semibold text-[#1a1c1e]">Keep Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
