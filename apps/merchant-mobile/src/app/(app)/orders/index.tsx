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
  const [stats, setStats] = useState<{ todaySales: number; newOrders: number } | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const [data, statsData] = await Promise.all([
          apiFetch('/orders').catch(() => []),
          apiFetch('/merchant/stats').catch(() => null),
        ]);
        setOrders(data || []);
        if (statsData) {
          setStats({ todaySales: statsData.sales || 0, newOrders: statsData.orders || 0 });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);


  return (
    <SafeAreaView className="flex-1 bg-background font-body-md">
      {/* TopAppBar */}
      <View className="flex-row items-center bg-surface-container-lowest p-4 pb-2 justify-center border-b border-border-subtle z-10">
        <Text className="text-on-background text-[24px] font-bold">My Shop</Text>
      </View>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Stats Section */}
        <View className="flex-row flex-wrap gap-4 p-5">
          <View className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-surface-container-lowest border border-border-subtle shadow-sm">
            <Text className="text-on-surface-variant font-medium text-[16px]">Today's Sales</Text>
            <Text className="text-growth-green text-[32px] font-bold">PKR {stats?.todaySales ?? 0}</Text>
          </View>
          <View className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-surface-container-lowest border border-border-subtle shadow-sm">
            <Text className="text-on-surface-variant font-medium text-[16px]">New Orders</Text>
            <Text className="text-growth-green text-[32px] font-bold">{stats?.newOrders ?? orders.length}</Text>
          </View>
        </View>

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
          ) : orders.length === 0 ? (
            <View className="mt-16 items-center justify-center gap-4 px-5">
              <View className="w-20 h-20 rounded-full bg-surface-container-high items-center justify-center">
                <MaterialIcons name="receipt-long" size={40} color="#6e7976" />
              </View>
              <Text className="text-[18px] font-semibold text-on-surface">No orders yet</Text>
              <Text className="text-[14px] text-on-surface-variant text-center max-w-[220px] leading-5">
                Share your shop link to start getting orders!
              </Text>
            </View>
          ) : (
            <View className="flex-col gap-2 px-5">
              {orders.map((order, index) => (
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
