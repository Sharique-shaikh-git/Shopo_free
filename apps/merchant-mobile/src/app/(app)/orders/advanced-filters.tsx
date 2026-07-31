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

  // Filter states
  const [statusFilter, setStatusFilter] = useState('All Orders');
  const [dateFilter, setDateFilter] = useState('Today');
  const [paymentFilter, setPaymentFilter] = useState('All Payments');

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
            <Text className="text-growth-green text-[32px] font-bold">PKR 12,500</Text>
          </View>
          <View className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-surface-container-lowest border border-border-subtle shadow-sm">
            <Text className="text-on-surface-variant font-medium text-[16px]">New Orders</Text>
            <Text className="text-growth-green text-[32px] font-bold">8</Text>
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
          ) : (
            <View className="flex-col gap-2 px-5">
              {displayOrders.map((order, index) => (
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
