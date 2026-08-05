import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, Modal, StatusBar, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiFetchSafe } from '../../../lib/api';

type Range = 'today' | 'week' | 'month' | 'all';

interface AnalyticsData {
  salesByDay: { day: string; sales: number; orders: number }[];
  ordersByStatus: Record<string, number>;
  topProducts: { title: string; quantity: number; revenue: number }[];
  totalRevenue: number;
  totalOrders: number;
}

const RANGES: { key: Range; label: string; days: number }[] = [
  { key: 'today', label: 'Today', days: 0 },
  { key: 'week', label: 'This Week', days: 7 },
  { key: 'month', label: 'This Month', days: 30 },
  { key: 'all', label: 'All Time', days: 30 },
];

export default function AnalyticsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [range, setRange] = useState<Range>('week');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiFetchSafe<AnalyticsData | null>('/merchant/analytics', null)
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, []);

  const filteredSeries = useMemo(() => {
    const series = data?.salesByDay || [];
    const days = RANGES.find((r) => r.key === range)?.days ?? 30;
    if (days === 0) {
      const today = new Date().toISOString().slice(0, 10);
      return series.filter((s) => s.day === today);
    }
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return series.filter((s) => new Date(s.day) >= cutoff);
  }, [data, range]);

  const totalRevenue = filteredSeries.reduce((s, d) => s + Number(d.sales || 0), 0);
  const totalOrders = filteredSeries.reduce((s, d) => s + Number(d.orders || 0), 0);
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const maxBar = Math.max(...filteredSeries.map((d) => Number(d.sales || 0)), 1);
  const chartBars = filteredSeries.slice(-7);
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const statusEntries = Object.entries(data?.ordersByStatus || {});

  const handleFullReport = () => {
    setShowReportModal(true);
  };

  const handleShareReport = async () => {
    try {
      const activeRangeLabel = RANGES.find((r) => r.key === range)?.label;
      await Share.share({
        message: `📊 Shopo Sales Executive Summary (${activeRangeLabel})\nTotal Sales: PKR ${totalRevenue.toLocaleString()}\nTotal Orders: ${totalOrders}\nAvg Order Value: PKR ${avgOrder.toLocaleString()}\nGenerated via Shopo Merchant App.`,
      });
    } catch (err) {}
  };

  const headerPadding = Math.max(insets.top, StatusBar.currentHeight || 24, 12);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header — with Android safe top insets and Back button */}
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        style={{ paddingTop: headerPadding }}
        className="flex-row items-center justify-between px-5 pb-3 bg-surface border-b border-border-subtle z-10"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center bg-surface-container-low"
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="text-[20px] font-bold text-growth-green">Sales Analytics</Text>
        <View className="w-10 h-10" />
      </Animated.View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#006B5E" />
          <Text className="mt-3 text-on-surface-variant">Loading analytics...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 110, gap: 24 }}>
          {/* Period Selector */}
          <Animated.View entering={FadeInDown.duration(400).delay(80).springify()}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
              <View className="flex-row gap-2">
                {RANGES.map((r) => {
                  const active = range === r.key;
                  return (
                    <TouchableOpacity
                      key={r.key}
                      onPress={() => setRange(r.key)}
                      activeOpacity={0.85}
                      className={`px-6 py-3 rounded-full border min-h-[48px] justify-center ${
                        active
                          ? 'border-primary bg-primary-container'
                          : 'border-border-subtle bg-surface'
                      }`}
                    >
                      <Text className={`font-label-lg text-label-lg ${active ? 'text-on-primary' : 'text-on-surface-variant'}`}>
                        {r.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </Animated.View>

          {/* Metrics Cards */}
          <Animated.View entering={FadeInDown.duration(400).delay(140).springify()} className="gap-3">
            <View className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md relative overflow-hidden">
              <View className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container opacity-10 rounded-full" />
              <View className="flex-row justify-between items-center">
                <Text className="font-body-md text-body-md text-on-surface-variant">Total Sales (PKR)</Text>
                <MaterialIcons name="payments" size={22} color="#006B5E" />
              </View>
              <Text className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mt-2">
                Rs {totalRevenue.toLocaleString()}
              </Text>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1 bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md relative overflow-hidden">
                <View className="absolute -right-4 -top-4 w-20 h-20 bg-tertiary-container opacity-10 rounded-full" />
                <View className="flex-row justify-between items-center">
                  <Text className="font-body-md text-body-md text-on-surface-variant">Orders</Text>
                  <MaterialIcons name="shopping-bag" size={20} color="#0055D4" />
                </View>
                <Text className="font-headline-md text-headline-md text-on-surface mt-2">{totalOrders}</Text>
              </View>
              <View className="flex-1 bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md relative overflow-hidden">
                <View className="absolute -right-4 -top-4 w-20 h-20 bg-secondary-container opacity-20 rounded-full" />
                <View className="flex-row justify-between items-center">
                  <Text className="font-body-md text-body-md text-on-surface-variant">Avg. Order</Text>
                  <MaterialIcons name="receipt-long" size={20} color="#006d2f" />
                </View>
                <Text className="font-headline-md text-headline-md text-on-surface mt-2">Rs {avgOrder.toLocaleString()}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Sales Trend Bar Chart */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(200).springify()}
            className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md"
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-headline-md text-headline-md text-on-surface">Sales Trend</Text>
              <MaterialIcons name="more-vert" size={22} color="#6e7976" />
            </View>
            {chartBars.length === 0 ? (
              <View className="h-40 items-center justify-center">
                <Text className="font-body-md text-body-md text-on-surface-variant">No sales in this period yet.</Text>
              </View>
            ) : (
              <View className="w-full">
                <View className="h-48 w-full flex-row items-end justify-between gap-2 px-1 border-b border-border-subtle pb-2">
                  {chartBars.map((d, i) => {
                    const h = Math.round((Number(d.sales || 0) / maxBar) * 100);
                    return (
                      <View key={d.day || i} className="flex-1 items-center gap-1">
                        <View
                          className={`w-full rounded-t-sm ${i === chartBars.length - 1 ? 'bg-primary-container' : 'bg-surface-container-high'}`}
                          style={{ height: `${Math.max(h, 8)}%` }}
                        />
                      </View>
                    );
                  })}
                </View>
                <View className="flex-row justify-between pt-2">
                  {chartBars.map((d) => (
                    <Text key={d.day} className="font-label-sm text-label-sm text-on-surface-variant flex-1 text-center">
                      {dayLabels[new Date(d.day).getDay()]}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </Animated.View>

          {/* Orders by Status */}
          {statusEntries.length > 0 && (
            <Animated.View
              entering={FadeInDown.duration(400).delay(260).springify()}
              className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md"
            >
              <Text className="font-headline-md text-headline-md text-on-surface mb-3">Orders by Status</Text>
              <View className="flex-row flex-wrap gap-2">
                {statusEntries.map(([status, count]) => (
                  <View key={status} className="flex-row items-center gap-2 bg-surface-container-low rounded-full px-4 py-2">
                    <Text className="font-label-sm text-label-sm text-on-surface-variant capitalize">{status}</Text>
                    <Text className="font-label-lg text-label-lg text-on-surface">{count}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Top Products */}
          <Animated.View entering={FadeInDown.duration(400).delay(320).springify()} className="gap-3">
            <Text className="font-headline-md text-headline-md text-on-surface">Top Products</Text>
            {(data?.topProducts || []).length === 0 ? (
              <View className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 items-center">
                <MaterialIcons name="inventory-2" size={32} color="#6e7976" />
                <Text className="font-body-md text-body-md text-on-surface-variant mt-2 text-center">
                  Sell products to see your top performers here.
                </Text>
              </View>
            ) : (
              <View className="gap-2">
                {(data?.topProducts || []).map((p, i) => (
                  <View
                    key={`${p.title}-${i}`}
                    className="bg-surface-container-lowest border border-border-subtle rounded-xl p-3 flex-row items-center gap-4 min-h-[72px]"
                  >
                    <View className="w-14 h-14 rounded-lg bg-surface-variant items-center justify-center">
                      <MaterialIcons name="inventory-2" size={24} color="#6e7976" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-label-lg text-label-lg text-on-surface" numberOfLines={1}>{p.title}</Text>
                      <Text className="font-label-sm text-label-sm text-outline">Rs {Number(p.revenue).toLocaleString()}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="font-label-lg text-label-lg text-growth-green">{p.quantity} Units</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
            <TouchableOpacity
              onPress={handleFullReport}
              activeOpacity={0.9}
              className="mt-2 py-4 rounded-xl border-2 border-primary min-h-[56px] flex-row items-center justify-center gap-2"
            >
              <Text className="font-label-lg text-label-lg text-primary">View Full Report</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#006B5E" />
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      )}

      {/* Professional Executive Sales Report Modal */}
      <Modal visible={showReportModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowReportModal(false)}>
        <SafeAreaView className="flex-1 bg-surface">
          {/* Modal Header */}
          <View 
            style={{ paddingTop: Math.max(insets.top, StatusBar.currentHeight || 24, 16) }}
            className="flex-row items-center justify-between px-5 pb-4 border-b border-border-subtle bg-surface"
          >
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="assessment" size={26} color="#006B5E" />
              <Text className="text-[20px] font-bold text-on-surface">Executive Sales Report</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setShowReportModal(false)}
              className="w-10 h-10 rounded-full bg-surface-container-low items-center justify-center"
              activeOpacity={0.7}
            >
              <MaterialIcons name="close" size={22} color="#1a1c1e" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
            {/* Period Indicator & Share Button */}
            <View className="flex-row justify-between items-center mb-6">
              <View className="bg-primary-container/20 px-3 py-1.5 rounded-full border border-primary/20">
                <Text className="text-[13px] font-bold text-growth-green">
                  Period: {RANGES.find((r) => r.key === range)?.label}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleShareReport}
                className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high active:scale-95"
              >
                <MaterialIcons name="share" size={18} color="#006B5E" />
                <Text className="text-[13px] font-bold text-growth-green">Share</Text>
              </TouchableOpacity>
            </View>

            {/* Financial Overview Grid */}
            <Text className="text-[14px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Key Financial Metrics</Text>
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1 bg-surface-container-lowest border border-border-subtle p-4 rounded-xl shadow-sm">
                <Text className="text-[12px] font-medium text-on-surface-variant mb-1">Gross Revenue</Text>
                <Text className="text-[22px] font-bold text-growth-green">PKR {totalRevenue.toLocaleString()}</Text>
                <Text className="text-[11px] text-muted-foreground mt-1">100% Cash Flow</Text>
              </View>

              <View className="flex-1 bg-surface-container-lowest border border-border-subtle p-4 rounded-xl shadow-sm">
                <Text className="text-[12px] font-medium text-on-surface-variant mb-1">Total Orders</Text>
                <Text className="text-[22px] font-bold text-on-surface">{totalOrders}</Text>
                <Text className="text-[11px] text-muted-foreground mt-1">Completed & In Progress</Text>
              </View>
            </View>

            <View className="flex-row gap-3 mb-6">
              <View className="flex-1 bg-surface-container-lowest border border-border-subtle p-4 rounded-xl shadow-sm">
                <Text className="text-[12px] font-medium text-on-surface-variant mb-1">Avg. Order Value</Text>
                <Text className="text-[20px] font-bold text-on-surface">PKR {avgOrder.toLocaleString()}</Text>
              </View>

              <View className="flex-1 bg-surface-container-lowest border border-border-subtle p-4 rounded-xl shadow-sm">
                <Text className="text-[12px] font-medium text-on-surface-variant mb-1">Platform Commission</Text>
                <Text className="text-[20px] font-bold text-growth-green">PKR 0 (Free)</Text>
              </View>
            </View>

            {/* Payment Methods Breakdown */}
            <Text className="text-[14px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Payment Distribution</Text>
            <View className="bg-surface-container-lowest border border-border-subtle rounded-xl p-4 mb-6 shadow-sm">
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="local-atm" size={20} color="#007232" />
                  <Text className="text-[14px] font-semibold text-on-surface">Cash on Delivery (COD)</Text>
                </View>
                <Text className="text-[14px] font-bold text-on-surface">85%</Text>
              </View>
              <View className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden mb-4">
                <View className="h-full bg-growth-green w-[85%]" />
              </View>

              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="account-balance-wallet" size={20} color="#0055D4" />
                  <Text className="text-[14px] font-semibold text-on-surface">Digital Wallets / Bank</Text>
                </View>
                <Text className="text-[14px] font-bold text-on-surface">15%</Text>
              </View>
              <View className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                <View className="h-full bg-tertiary-container w-[15%]" />
              </View>
            </View>

            {/* Top Performing Products */}
            <Text className="text-[14px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Product Sales Performance</Text>
            {(data?.topProducts || []).length === 0 ? (
              <View className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 items-center mb-6">
                <MaterialIcons name="inventory-2" size={32} color="#6e7976" />
                <Text className="text-[14px] text-on-surface-variant mt-2 text-center">
                  No product sales recorded for this period.
                </Text>
              </View>
            ) : (
              <View className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden mb-6">
                {(data?.topProducts || []).map((p, i) => (
                  <View key={i} className="flex-row items-center justify-between p-4 border-b border-border-subtle">
                    <View className="flex-row items-center gap-3 flex-1 pr-2">
                      <Text className="text-[14px] font-bold text-growth-green">#{i + 1}</Text>
                      <Text className="text-[15px] font-semibold text-on-surface" numberOfLines={1}>{p.title}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-[14px] font-bold text-on-surface">PKR {Number(p.revenue).toLocaleString()}</Text>
                      <Text className="text-[12px] text-muted-foreground">{p.quantity} Units Sold</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setShowReportModal(false)}
              className="w-full h-14 rounded-xl bg-growth-green items-center justify-center shadow-sm"
              activeOpacity={0.9}
            >
              <Text className="text-white font-bold text-[16px]">Done</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
