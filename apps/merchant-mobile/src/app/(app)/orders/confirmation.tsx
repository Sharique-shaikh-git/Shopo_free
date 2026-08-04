import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { apiFetch } from '../../../lib/api';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(!!orderId);

  useEffect(() => {
    if (!orderId) return;
    apiFetch(`/orders/${orderId}`)
      .then(setOrder)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  const items = order?.items || [];
  const subtotal = order?.subtotal ? Number(order.subtotal) : 0;
  const deliveryFee = order?.deliveryFee ? Number(order.deliveryFee) : 0;
  const total = order?.total ? Number(order.total) : 0;

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
        {loading ? (
          <ActivityIndicator size="large" color="#005147" className="mt-12" />
        ) : (
          <>
            {/* Hero Success */}
            <Animated.View entering={FadeIn.duration(600)} className="items-center py-8">
              <View className="w-24 h-24 items-center justify-center mb-6">
                <View className="absolute inset-0 bg-[#005147] opacity-10 rounded-full" style={{ transform: [{ scale: 1.3 }] }} />
                <View className="absolute inset-2 bg-[#005147] opacity-20 rounded-full" />
                <Ionicons name="checkmark-circle" size={72} color="#005147" style={{ zIndex: 10 }} />
              </View>
              <Text className="text-[28px] font-bold text-[#1a1c1e] text-center mb-2">Order Placed!</Text>
              <Text className="text-[16px] text-[#75797E] text-center mb-6 max-w-[280px]">
                Thank you! Order #{order?.orderNumber || orderId} has been received.
              </Text>
            </Animated.View>

            {/* Order Summary Card */}
            <Animated.View entering={FadeInDown.duration(600).delay(200)} className="border border-[#E0E3DE] rounded-xl overflow-hidden mb-6 shadow-sm">
              <View className="flex-row items-center gap-2 px-4 py-3 bg-[#F2F0F4] border-b border-[#E0E3DE]">
                <MaterialIcons name="receipt" size={18} color="#75797E" />
                <Text className="text-[20px] font-semibold text-[#1a1c1e]">Order Summary</Text>
              </View>
              <View className="px-4 py-4 gap-4">
                {items.length === 0 ? (
                  <Text className="text-[14px] text-[#75797E] text-center py-4">No items found</Text>
                ) : items.map((item: any, i: number) => (
                  <View key={i} className="flex-row items-center gap-4">
                    <View className="w-16 h-16 rounded-lg bg-[#F2F0F4] border border-[#E0E3DE] items-center justify-center">
                      <Ionicons name="cube" size={22} color="#75797E" />
                    </View>
                    <View className="flex-1 min-w-0">
                      <Text className="text-[16px] font-medium text-[#1a1c1e]" numberOfLines={1}>{item.title || item.name}</Text>
                      <Text className="text-[12px] text-[#75797E] mt-1">Qty: {item.quantity || item.qty}</Text>
                    </View>
                    <Text className="text-[16px] font-medium text-[#1a1c1e]">PKR {Number(item.totalPrice || item.price).toLocaleString()}</Text>
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
          </>
        )}
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
