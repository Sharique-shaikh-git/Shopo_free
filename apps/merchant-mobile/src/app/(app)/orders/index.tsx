import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await apiFetch('/orders');
        setOrders(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const mockOrders = [
    {
      id: 'mock1',
      orderNumber: '#ORD-001',
      customerName: 'Aisha Khan',
      total: '1500',
      time: '10 mins ago',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASUnVOcw6KXfVT1tRgQH9BdVS3_cqzd1GSWgA_jd-KrhSgNcg3qH2WdGoSGReKvc9huTRoA3FGxo02Cr_YUUKLMf6jaKCYGUz19Hx5Nc0GT2UkOj5pbXKxOeNYwKpNoGD8RNg_eca9wDJx11h5yQh70by85cnt0xVr3-uqJ1GXkb5tB4xuOY_4AglM2CHgbTbNssOSo00pmH2cMNM3plf9KYVmVE03vvwSHyQE-kVV4jaddWUx4D3kgdW_V5OPgkgdlgjF8GPGz_s'
    },
    {
      id: 'mock2',
      orderNumber: '#ORD-002',
      customerName: 'Usman Saeed',
      total: '4200',
      time: '45 mins ago',
      initials: 'US'
    },
    {
      id: 'mock3',
      orderNumber: '#ORD-003',
      customerName: 'Fatima Ali',
      total: '2850',
      time: '2 hours ago',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuOqd7gwY1pVNPtfYgL4jgMUewt8oycpgN9Zdz811UWKLJwHzDYb37ON8OA9K2D-iVxHNzLgWzcKi54xVw-Hf2zmQVCbMWTfJ8juNkMpNiAM06jVtKSqooi9p4-zwx7mdV0gqGWAhXVFnYH_IzkbDEs9GfB5qxIe61VsOMIrjbQug4TLokyOPb_j1PDx2QCTW-vsuE_LaKG06jYjIfJlVPohM96iZW6M6nFgHbLSzIeyEV50VllG1HhmH3qBJa9gZNcinZqysfR2Y'
    }
  ];

  const displayOrders = orders.length > 0 ? orders : mockOrders;

  return (
    <SafeAreaView className="flex-1 bg-background font-body-md">
      {/* TopAppBar */}
      <View className="flex-row items-center bg-surface-container-lowest p-4 pb-2 justify-center border-b border-border-subtle z-10">
        <Text className="text-on-background text-[24px] font-bold">My Shop</Text>
      </View>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Stats Section */}
        <Animated.View entering={FadeInDown.duration(400).springify()} className="flex-row flex-wrap gap-4 p-5">
          <TouchableOpacity activeOpacity={0.9} className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-surface-container-lowest border border-border-subtle shadow-sm">
            <Text className="text-on-surface-variant font-medium text-[16px]">Today's Sales</Text>
            <Text className="text-growth-green text-[32px] font-bold">PKR 12,500</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.9} className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-surface-container-lowest border border-border-subtle shadow-sm">
            <Text className="text-on-surface-variant font-medium text-[16px]">New Orders</Text>
            <Text className="text-growth-green text-[32px] font-bold">8</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Orders Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()}>
          <View className="flex-row justify-between items-center px-5 pb-3 pt-2">
            <Text className="text-on-background text-[24px] font-bold">New Orders</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/orders/advanced-filters' as any)}>
              <MaterialIcons name="filter-list" size={24} color="#006B5E" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#006b5e" className="mt-10" />
          ) : (
            <View className="flex-col gap-2 px-5">
              {displayOrders.map((order, index) => (
                <Animated.View key={order.id || index} entering={FadeInDown.duration(400).delay(200 + index * 100).springify()}>
                  <View className="flex-row items-center gap-4 bg-surface-container-lowest px-4 py-3 rounded-xl border border-border-subtle shadow-sm justify-between mb-2">
                    <View className="flex-row items-center gap-4 flex-1">
                      {order.avatar ? (
                        <Image source={{ uri: order.avatar }} className="h-12 w-12 rounded-full" />
                      ) : (
                        <View className="h-12 w-12 rounded-full bg-[#0055d4] flex items-center justify-center">
                          <Text className="text-white font-bold text-[20px]">{order.initials || order.customerName?.substring(0,2).toUpperCase()}</Text>
                        </View>
                      )}
                      
                      <View className="flex-col justify-center flex-1">
                        <Text className="text-on-background font-medium text-[18px]" numberOfLines={1}>{order.customerName}</Text>
                        <Text className="text-on-surface-variant text-[16px]" numberOfLines={1}>PKR {order.total}</Text>
                        <Text className="text-[#6e7976] text-[12px] mt-1">{order.orderNumber || `#ORD-${order.id}`} • {order.time || new Date(order.createdAt).toLocaleDateString()}</Text>
                      </View>
                    </View>
                    
                    <View className="shrink-0">
                      <TouchableOpacity 
                        onPress={() => router.push(`/(app)/orders/${order.id}` as any)}
                        className="flex min-w-[84px] items-center justify-center rounded-full h-12 px-4 bg-primary-container active:scale-95 transition-transform"
                      >
                        <Text className="text-on-primary-container font-semibold text-[14px]">View</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
