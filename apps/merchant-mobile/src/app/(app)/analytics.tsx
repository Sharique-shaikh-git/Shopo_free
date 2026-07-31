import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { apiFetch } from '../../lib/api';

const PERIODS = ['Today', 'This Week', 'This Month', 'All Time'];

const BAR_DATA = [
  { label: 'Mon', value: 12000, height: '30%' },
  { label: 'Tue', value: 18000, height: '45%' },
  { label: 'Wed', value: 10000, height: '25%' },
  { label: 'Thu', value: 24000, height: '60%' },
  { label: 'Fri', value: 34000, height: '85%', isToday: true },
  { label: 'Sat', value: 16000, height: '40%' },
  { label: 'Sun', value: 22000, height: '55%' },
];

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('This Week');
  const [metrics, setMetrics] = useState({ sales: 0, orders: 0, avgOrder: 0 });
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          apiFetch('/merchant/stats').catch(() => ({ sales: 0, orders: 0 })),
          apiFetch('/orders').catch(() => []),
        ]);
        const orders = Array.isArray(ordersRes) ? ordersRes : [];
        setMetrics({
          sales: statsRes.sales || 0,
          orders: statsRes.orders || orders.length,
          avgOrder: orders.length > 0 ? Math.round(orders.reduce((s: number, o: any) => s + (o.totalAmount || 0), 0) / orders.length) : 0,
        });
      } catch (err) {
        // Use defaults
      }
    }
    loadAnalytics();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 py-4 bg-surface z-40">
        <MaterialIcons name="storefront" size={24} color="#006B5E" />
        <Text className="text-[24px] font-bold text-growth-green">Sales Analytics</Text>
        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full">
          <MaterialIcons name="language" size={24} color="#006B5E" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 -mx-5 px-5 pb-2">
            {PERIODS.map((period) => (
              <TouchableOpacity
                key={period}
                onPress={() => setSelectedPeriod(period)}
                className={`px-6 py-3 rounded-full min-h-[48px] items-center justify-center border ${
                  selectedPeriod === period
                    ? 'border-2 border-primary bg-primary-container'
                    : 'border-border-subtle bg-surface'
                }`}
                activeOpacity={0.8}
              >
                <Text className={`text-[14px] font-semibold ${
                  selectedPeriod === period ? 'text-on-primary' : 'text-on-surface-variant'
                }`}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Primary Metrics */}
        <Animated.View entering={FadeInDown.duration(600).delay(100).springify()} className="flex-row gap-3 mt-4">
          {/* Total Sales */}
          <View className="flex-1 bg-surface-container-lowest border border-border-subtle rounded-xl p-4 relative overflow-hidden">
            <View className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container opacity-10 rounded-full" />
            <View className="flex-row justify-between items-center z-10">
              <Text className="text-[14px] text-on-surface-variant">Total Sales</Text>
              <MaterialIcons name="payments" size={20} color="#006B5E" />
            </View>
            <Text className="text-[28px] font-bold text-on-surface z-10 mt-2">Rs {metrics.sales.toLocaleString()}</Text>
            <View className="flex-row items-center gap-1 mt-2 z-10">
              <MaterialIcons name="trending-up" size={14} color="#25D366" />
              <Text className="text-[12px] text-whatsapp-green">+12.5%</Text>
              <Text className="text-[12px] text-outline ml-1">vs last week</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(150).springify()} className="flex-row gap-3 mt-3">
          {/* Total Orders */}
          <View className="flex-1 bg-surface-container-lowest border border-border-subtle rounded-xl p-4 relative overflow-hidden">
            <View className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary-container opacity-10 rounded-full" />
            <View className="flex-row justify-between items-center z-10">
              <Text className="text-[14px] text-on-surface-variant">Total Orders</Text>
              <MaterialIcons name="shopping-bag" size={20} color="#0055D4" />
            </View>
            <Text className="text-[28px] font-bold text-on-surface z-10 mt-2">{metrics.orders}</Text>
            <View className="flex-row items-center gap-1 mt-2 z-10">
              <MaterialIcons name="trending-up" size={14} color="#25D366" />
              <Text className="text-[12px] text-whatsapp-green">+5.2%</Text>
              <Text className="text-[12px] text-outline ml-1">vs last week</Text>
            </View>
          </View>

          {/* Avg Order Value */}
          <View className="flex-1 bg-surface-container-lowest border border-border-subtle rounded-xl p-4 relative overflow-hidden">
            <View className="absolute -right-4 -top-4 w-24 h-24 bg-secondary-container opacity-10 rounded-full" />
            <View className="flex-row justify-between items-center z-10">
              <Text className="text-[14px] text-on-surface-variant">Avg. Order</Text>
              <MaterialIcons name="receipt-long" size={20} color="#006d2f" />
            </View>
            <Text className="text-[28px] font-bold text-on-surface z-10 mt-2">Rs {metrics.avgOrder}</Text>
            <View className="flex-row items-center gap-1 mt-2 z-10">
              <MaterialIcons name="trending-down" size={14} color="#BA1A1A" />
              <Text className="text-[12px] text-error-red">-1.8%</Text>
              <Text className="text-[12px] text-outline ml-1">vs last week</Text>
            </View>
          </View>
        </Animated.View>

        {/* Sales Trend Chart */}
        <Animated.View entering={FadeInDown.duration(600).delay(200).springify()} className="bg-surface-container-lowest border border-border-subtle rounded-xl p-4 mt-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-[20px] font-bold text-on-surface">Sales Trend</Text>
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full">
              <MaterialIcons name="more-vert" size={20} color="#6e7976" />
            </TouchableOpacity>
          </View>

          {/* Bar Chart */}
          <View className="h-48 w-full flex-row items-end justify-between gap-2 border-b border-border-subtle pb-2">
            {BAR_DATA.map((bar, i) => (
              <View key={i} className="flex-1 items-center">
                <View 
                  className={`w-full rounded-t-sm ${bar.isToday ? 'bg-primary-container' : 'bg-surface-container-high'}`}
                  style={{ height: bar.height }}
                />
              </View>
            ))}
          </View>

          {/* X-Axis Labels */}
          <View className="flex-row justify-between mt-2">
            {BAR_DATA.map((bar, i) => (
              <Text key={i} className={`flex-1 text-center text-[12px] ${
                bar.isToday ? 'text-primary font-bold' : 'text-outline'
              }`}>
                {bar.label}
              </Text>
            ))}
          </View>
        </Animated.View>

        {/* Top Products */}
        <Animated.View entering={FadeInDown.duration(600).delay(300).springify()} className="mt-6">
          <Text className="text-[20px] font-bold text-on-surface mb-4">Top Products</Text>
          <View className="gap-2">
            {[
              { name: 'Minimalist Ceramic Mug', price: 'Rs 850', units: 42, trend: '+12%', up: true },
              { name: 'Premium Cotton T-Shirt', price: 'Rs 1,200', units: 28, trend: '0%', up: null },
              { name: 'Desk Organizer Set', price: 'Rs 2,450', units: 15, trend: '-4%', up: false },
            ].map((product, i) => (
              <View key={i} className="bg-surface-container-lowest border border-border-subtle rounded-xl p-3 flex-row items-center gap-4">
                <View className="w-16 h-16 rounded-lg bg-surface-variant items-center justify-center">
                  <MaterialIcons name="inventory-2" size={24} color="#6e7976" />
                </View>
                <View className="flex-1">
                  <Text className="text-[14px] font-semibold text-on-surface" numberOfLines={1}>{product.name}</Text>
                  <Text className="text-[12px] text-outline">{product.price}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-[14px] font-semibold text-growth-green">{product.units} Units</Text>
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons 
                      name={product.up === true ? 'arrow-upward' : product.up === false ? 'arrow-downward' : 'horizontal-rule'} 
                      size={12} 
                      color={product.up === true ? '#25D366' : product.up === false ? '#BA1A1A' : '#6e7976'} 
                    />
                    <Text className={`text-[12px] ${
                      product.up === true ? 'text-whatsapp-green' : product.up === false ? 'text-error-red' : 'text-outline'
                    }`}>
                      {product.trend}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity className="w-full mt-4 py-4 rounded-xl border-2 border-primary items-center justify-center flex-row gap-2" activeOpacity={0.8}>
            <Text className="text-[14px] font-semibold text-primary">View Full Report</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#005147" />
          </TouchableOpacity>
        </Animated.View>

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
