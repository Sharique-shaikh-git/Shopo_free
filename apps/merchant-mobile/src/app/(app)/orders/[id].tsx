import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiFetch } from '../../../lib/api';

const TIMELINE_STEPS = [
  { key: 'placed', label: 'Order Placed', desc: 'Successfully received by shop', icon: 'check' },
  { key: 'processing', label: 'Processing', desc: 'Merchant verified and packed items', icon: 'check' },
  { key: 'shipped', label: 'On the way', desc: 'The rider has picked up your order', icon: 'local_shipping' },
  { key: 'delivered', label: 'Delivered', desc: 'Waiting to reach your doorstep', icon: 'check' },
];

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const pulseScale = useSharedValue(0.95);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.05, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: 0.8,
  }));

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await apiFetch(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setOrder({
          id,
          orderNumber: 'SB-8291',
          status: 'shipped',
          totalAmount: 6650,
          customerName: 'Customer',
          estimatedDelivery: 'Oct 24, 2023',
          items: [
            { title: 'Classic Polo T-Shirt', variant: 'Size: L, Blue', price: 2450, quantity: 1 },
            { title: 'Canvas Sneakers', variant: 'Size: 42, White', price: 4200, quantity: 1 },
          ],
        });
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  const activeIndex = TIMELINE_STEPS.findIndex(s => s.key === (order?.status || 'placed'));

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 py-4 bg-surface z-40">
        <View className="flex-row items-center gap-3">
          <MaterialIcons name="storefront" size={24} color="#006B5E" />
          <Text className="text-[20px] font-bold text-growth-green">Shop Builder</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full">
          <MaterialIcons name="language" size={24} color="#006B5E" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Order Identity */}
        <Animated.View entering={FadeInDown.duration(600).springify()} className="mb-6">
          <View className="flex-row justify-between items-end mb-2">
            <View>
              <Text className="text-[14px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Order #{order?.orderNumber || 'SB-8291'}
              </Text>
              <Text className="text-[28px] font-bold text-on-surface mt-1">Tracking your package</Text>
            </View>
            <View className="bg-secondary-container px-3 py-1 rounded-xl">
              <Text className="text-[14px] font-semibold text-on-secondary-container capitalize">
                {order?.status || 'In Transit'}
              </Text>
            </View>
          </View>
          <Text className="text-[16px] text-on-surface-variant">
            Estimated delivery: <Text className="font-bold text-on-surface">{order?.estimatedDelivery || 'Oct 24, 2023'}</Text>
          </Text>
        </Animated.View>

        {/* Map Placeholder */}
        <Animated.View entering={FadeInDown.duration(600).delay(100).springify()} className="h-48 rounded-xl overflow-hidden border border-border-subtle mb-4 bg-surface-container-high items-center justify-center relative">
          <MaterialIcons name="map" size={48} color="#bec9c5" />
          <Text className="text-[14px] text-outline mt-2">Live tracking map</Text>
          <View className="absolute bottom-4 left-4 flex-row items-center gap-2">
            <Animated.View style={pulseStyle}>
              <MaterialIcons name="location-on" size={20} color="#25D366" />
            </Animated.View>
            <Text className="text-[14px] font-semibold text-white">Currently near Saddar Town, Karachi</Text>
          </View>
        </Animated.View>

        {/* Bento Grid */}
        <Animated.View entering={FadeInDown.duration(600).delay(200).springify()} className="flex-row gap-3 mb-6">
          <View className="flex-1 p-4 rounded-xl border border-border-subtle bg-surface-container-lowest">
            <MaterialIcons name="schedule" size={32} color="#0055D4" className="mb-2" />
            <Text className="text-[14px] text-on-surface-variant">Arrival Time</Text>
            <Text className="text-[20px] font-bold text-on-surface mt-1">~ 45 mins</Text>
          </View>
          <View className="flex-1 p-4 rounded-xl border border-border-subtle bg-surface-container-lowest">
            <MaterialIcons name="local-shipping" size={32} color="#006B5E" className="mb-2" />
            <Text className="text-[14px] text-on-surface-variant">Carrier</Text>
            <Text className="text-[20px] font-bold text-on-surface mt-1">Swift Logistics</Text>
          </View>
        </Animated.View>

        {/* Order Timeline */}
        <Animated.View entering={FadeInDown.duration(600).delay(300).springify()} className="bg-surface-gray rounded-xl p-4 border border-border-subtle mb-6">
          <Text className="text-[20px] font-bold text-on-surface mb-4">Order Timeline</Text>
          <View className="space-y-6">
            {TIMELINE_STEPS.map((step, i) => {
              const isActive = i === activeIndex;
              const isCompleted = i < activeIndex;
              const isInactive = i > activeIndex;

              return (
                <View key={step.key} className="flex-row gap-4">
                  {/* Circle */}
                  <View className={`w-8 h-8 rounded-full items-center justify-center flex-shrink-0 ${
                    isActive ? 'bg-growth-green' :
                    isCompleted ? 'bg-secondary-container' :
                    'bg-surface-variant'
                  }`}>
                    <MaterialIcons 
                      name={step.icon} 
                      size={16} 
                      color={isActive ? 'white' : isCompleted ? '#007232' : '#3e4946'}
                    />
                  </View>
                  {/* Content */}
                  <View className={`flex-1 ${isInactive ? 'opacity-40' : ''}`}>
                    <Text className={`text-[14px] font-semibold ${isActive ? 'text-on-surface font-bold' : 'text-on-surface'}`}>
                      {step.label}
                    </Text>
                    <Text className="text-[12px] text-on-surface-variant mt-0.5">{step.desc}</Text>
                    {isActive && (
                      <Text className="text-[12px] text-growth-green mt-1">11:32 AM</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Order Details */}
        <Animated.View entering={FadeInDown.duration(600).delay(400).springify()} className="border border-border-subtle rounded-xl overflow-hidden bg-white mb-6">
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="shopping-bag" size={20} color="#3e4946" />
              <Text className="text-[14px] font-semibold text-on-surface">Order Details ({order?.items?.length || 2} Items)</Text>
            </View>
            <MaterialIcons name="expand-more" size={20} color="#3e4946" />
          </View>
          <View className="border-t border-border-subtle p-4 space-y-4">
            {(order?.items || []).map((item: any, i: number) => (
              <View key={i} className="flex-row justify-between items-center">
                <View className="flex-row gap-3">
                  <View className="w-12 h-12 rounded bg-surface-container-high items-center justify-center">
                    <MaterialIcons name="inventory-2" size={20} color="#6e7976" />
                  </View>
                  <View>
                    <Text className="text-[14px] text-on-surface">{item.title}</Text>
                    <Text className="text-[12px] text-on-surface-variant">{item.variant}</Text>
                  </View>
                </View>
                <Text className="font-bold text-on-surface">Rs. {(item.price || 0).toLocaleString()}</Text>
              </View>
            ))}
            <View className="pt-4 border-t border-dashed border-outline-variant flex-row justify-between items-center">
              <Text className="text-[14px] font-semibold">Total Amount</Text>
              <Text className="text-[20px] font-bold text-growth-green">Rs. {(order?.totalAmount || 0).toLocaleString()}</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <Animated.View 
        entering={FadeIn.duration(500).delay(500)}
        className="absolute bottom-0 left-0 w-full bg-white/90 border-t border-border-subtle px-5 py-4 flex-row gap-3"
        style={{ paddingBottom: 32 }}
      >
        <TouchableOpacity 
          onPress={() => Linking.openURL('tel:+923000000000')}
          className="flex-1 py-4 border-2 border-growth-green rounded-xl flex-row items-center justify-center gap-2"
          activeOpacity={0.8}
        >
          <MaterialIcons name="call" size={18} color="#006B5E" />
          <Text className="text-[14px] font-bold text-growth-green">Call Merchant</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="flex-1 bg-growth-green py-4 rounded-xl flex-row items-center justify-center gap-2"
          activeOpacity={0.8}
        >
          <MaterialIcons name="help-center" size={18} color="white" />
          <Text className="text-[14px] font-bold text-white">Support</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
