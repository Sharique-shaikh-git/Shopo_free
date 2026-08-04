import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../../lib/api';

export default function AdvancedFiltersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ todaySales: number; newOrders: number }>({ todaySales: 0, newOrders: 0 });

  // Filter states
  const [statusFilter, setStatusFilter] = useState('All Orders');
  const [dateFilter, setDateFilter] = useState('Today');
  const [paymentFilter, setPaymentFilter] = useState('All Payments');

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

  const filteredOrders = orders.filter((order: any) => {
    if (statusFilter !== 'All Orders' && order.status?.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (paymentFilter === 'COD' && (order.paymentMethod || 'cod').toLowerCase() !== 'cod') return false;
    if (dateFilter === 'Today') {
      const d = new Date(order.createdAt);
      const now = new Date();
      if (d.toDateString() !== now.toDateString()) return false;
    } else if (dateFilter === 'This Week') {
      const d = new Date(order.createdAt);
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      if (d.getTime() < weekAgo) return false;
    }
    return true;
  });


  const statuses = [
    { label: 'All Orders', color: null },
    { label: 'Pending', color: 'bg-amber-500' },
    { label: 'Shipped', color: 'bg-blue-500' },
    { label: 'Delivered', color: 'bg-growth-green' },
  ];

  const dates = [
    { label: 'Today', icon: 'calendar-today' },
    { label: 'This Week', icon: null },
    { label: 'Custom Date', icon: null },
  ];

  const payments = [
    { label: 'All Payments', icon: 'payments' },
    { label: 'COD', icon: null },
    { label: 'JazzCash', icon: null },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background font-body-md">
      {/* TopAppBar */}
      <View className="flex-row items-center bg-surface-container-lowest p-4 pb-2 justify-between border-b border-border-subtle z-10">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2 rounded-full">
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="text-on-background text-[24px] font-bold text-center">My Shop</Text>
        <View className="w-10 h-10" />
      </View>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Stats Section */}
        <View className="flex-row flex-wrap gap-4 p-5">
          <View className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-surface-container-lowest border border-border-subtle shadow-sm">
            <Text className="text-on-surface-variant font-medium text-[16px]">Today's Sales</Text>
            <Text className="text-growth-green text-[32px] font-bold">PKR {stats.todaySales.toLocaleString()}</Text>
          </View>
          <View className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-surface-container-lowest border border-border-subtle shadow-sm">
            <Text className="text-on-surface-variant font-medium text-[16px]">New Orders</Text>
            <Text className="text-growth-green text-[32px] font-bold">{stats.newOrders || orders.length}</Text>
          </View>
        </View>

        {/* Filters Section */}
        <Animated.View entering={FadeInDown.duration(400).springify()} className="px-5 pt-2 flex-col gap-4">
          
          {/* Status Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row overflow-visible pb-1 -mx-5 px-5">
            {statuses.map(s => (
              <TouchableOpacity 
                key={s.label}
                onPress={() => setStatusFilter(s.label)}
                className={`flex-row items-center gap-2 px-4 py-2 rounded-full mr-2 border transition-colors ${
                  statusFilter === s.label 
                    ? 'bg-growth-green border-growth-green' 
                    : 'bg-surface-container-lowest border-border-subtle'
                }`}
              >
                {s.color && statusFilter !== s.label && <View className={`w-2 h-2 rounded-full ${s.color}`} />}
                <Text className={`font-medium text-[16px] ${statusFilter === s.label ? 'text-white' : 'text-on-surface'}`}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Date Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row overflow-visible pb-1 -mx-5 px-5">
            {dates.map(d => (
              <TouchableOpacity 
                key={d.label}
                onPress={() => setDateFilter(d.label)}
                className={`flex-row items-center gap-2 px-4 py-2 rounded-full mr-2 border transition-colors ${
                  dateFilter === d.label 
                    ? 'bg-[#0055D4] border-[#0055D4]' 
                    : 'bg-surface-container-lowest border-border-subtle'
                }`}
              >
                {d.icon && (
                  <MaterialIcons 
                    name={d.icon as any} 
                    size={16} 
                    color={dateFilter === d.label ? 'white' : '#1a1c1e'} 
                  />
                )}
                <Text className={`font-medium text-[16px] ${dateFilter === d.label ? 'text-white' : 'text-on-surface'}`}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Payment Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row overflow-visible pb-2 -mx-5 px-5">
            {payments.map(p => (
              <TouchableOpacity 
                key={p.label}
                onPress={() => setPaymentFilter(p.label)}
                className={`flex-row items-center gap-2 px-4 py-2 rounded-full mr-2 border transition-colors ${
                  paymentFilter === p.label 
                    ? 'bg-[#3e4946] border-[#3e4946]' 
                    : 'bg-surface-container-lowest border-border-subtle'
                }`}
              >
                {p.icon && (
                  <MaterialIcons 
                    name={p.icon as any} 
                    size={16} 
                    color={paymentFilter === p.label ? 'white' : '#1a1c1e'} 
                  />
                )}
                <Text className={`font-medium text-[16px] ${paymentFilter === p.label ? 'text-white' : 'text-on-surface'}`}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

        </Animated.View>

        {/* Orders List Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()}>
          <View className="flex-row justify-between items-center px-5 pb-3 pt-5">
            <Text className="text-on-background text-[24px] font-bold">New Orders</Text>
            <TouchableOpacity className="flex-row items-center gap-2 px-3 py-1 rounded-lg border border-border-subtle bg-surface-container-lowest">
              <MaterialIcons name="file-download" size={16} color="#006B5E" />
              <Text className="font-medium text-[14px] text-growth-green">Export</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#006b5e" className="mt-10" />
          ) : filteredOrders.length === 0 ? (
            <View className="mt-16 items-center justify-center gap-4 px-5">
              <View className="w-20 h-20 rounded-full bg-surface-container-high items-center justify-center">
                <MaterialIcons name="receipt-long" size={40} color="#6e7976" />
              </View>
              <Text className="text-[18px] font-semibold text-on-surface">No orders match</Text>
              <Text className="text-[14px] text-on-surface-variant text-center max-w-[220px] leading-5">
                Try adjusting your filters.
              </Text>
            </View>
          ) : (
            <View className="flex-col gap-2 px-5">
              {filteredOrders.map((order: any, index: number) => (
                <Animated.View key={order.id || index} entering={FadeInDown.duration(400).delay(200 + index * 100).springify()}>
                  <TouchableOpacity 
                    activeOpacity={0.9}
                    onPress={() => router.push(`/(app)/orders/${order.id}` as any)}
                    className="flex-row items-center gap-4 bg-surface-container-lowest px-4 py-3 rounded-xl border border-border-subtle shadow-sm justify-between mb-2"
                  >
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
                    
                    <View className="shrink-0 flex-row items-center">
                      <View className="flex min-w-[84px] items-center justify-center rounded-full h-12 px-4 bg-primary-container mr-2">
                        <Text className="text-on-primary-container font-semibold text-[14px]">View</Text>
                      </View>
                      <MaterialIcons name="chevron-right" size={24} color="#6e7976" />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
