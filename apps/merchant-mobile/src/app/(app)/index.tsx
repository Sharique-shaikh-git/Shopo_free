import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator, Alert, Dimensions, Share, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, interpolate, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pulseOpacity = useSharedValue(0.7);
  const gradientShift = useSharedValue(0);

  const [isLoading, setIsLoading] = useState(true);
  const [storeName, setStoreName] = useState('');
  const [stats, setStats] = useState({ sales: 0, orders: 0, products: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  // Count-up animation values
  const [displaySales, setDisplaySales] = useState(0);
  const [displayOrders, setDisplayOrders] = useState(0);
  const [displayProducts, setDisplayProducts] = useState(0);

  useEffect(() => {
    // AI pulse animation
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.7, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Gradient shift animation
    gradientShift.value = withRepeat(
      withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  // Count-up effect
  useEffect(() => {
    if (isLoading) return;
    const speed = 150;
    const inc = stats.sales / speed;
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= stats.sales) {
        setDisplaySales(stats.sales);
        clearInterval(timer);
      } else {
        setDisplaySales(Math.ceil(current));
      }
    }, 15);
    return () => clearInterval(timer);
  }, [stats.sales, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    const speed = 50;
    const inc = Math.max(1, stats.orders / speed);
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= stats.orders) {
        setDisplayOrders(stats.orders);
        clearInterval(timer);
      } else {
        setDisplayOrders(Math.ceil(current));
      }
    }, 15);
    return () => clearInterval(timer);
  }, [stats.orders, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    const speed = 50;
    const inc = Math.max(1, stats.products / speed);
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= stats.products) {
        setDisplayProducts(stats.products);
        clearInterval(timer);
      } else {
        setDisplayProducts(Math.ceil(current));
      }
    }, 15);
    return () => clearInterval(timer);
  }, [stats.products, isLoading]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        const [statsRes, ordersRes, storesRes] = await Promise.all([
          apiFetch('/merchant/stats').catch(() => ({ sales: 0, orders: 0, products: 0 })),
          apiFetch('/orders').catch(() => []),
          apiFetch('/stores').catch(() => [])
        ]);

        setStats({
          sales: statsRes.sales || 0,
          orders: statsRes.orders || 0,
          products: statsRes.products || 0
        });
        
        setRecentOrders(Array.isArray(ordersRes) ? ordersRes.slice(0, 3) : []);
        
        if (Array.isArray(storesRes) && storesRes.length > 0) {
          setStoreName(storesRes[0].name);
        } else {
          setStoreName('');
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const animatedPulse = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface justify-center items-center">
        <ActivityIndicator size="large" color="#006b5e" />
        <Text className="mt-4 text-on-surface-variant">Loading your shop...</Text>
      </SafeAreaView>
    );
  }

  const headerPadding = Math.max(insets.top, StatusBar.currentHeight || 24, 12);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header — sticky with safe area padding for notch/camera */}
      <Animated.View 
        entering={FadeInDown.duration(600).springify()} 
        style={{ paddingTop: headerPadding }}
        className="flex-row justify-between items-center px-5 pb-4 bg-surface/90 z-40 border-b border-border-subtle"
      >
        <View>
          <Text className="text-[16px] text-on-surface-variant">Assalam-o-Alaikum,</Text>
          <Text className="text-[24px] font-bold text-growth-green">{storeName || 'Shop Builder'}</Text>
        </View>
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={() => router.push('/(app)/(stack)/settings/notifications-inbox' as any)}
          className="w-12 h-12 rounded-full bg-surface-container-low items-center justify-center relative"
        >
          <MaterialIcons name="notifications" size={24} color="#1a1c1e" />
          {/* Notification dot */}
          <View className="absolute top-3 right-3 w-2.5 h-2.5 bg-error-red rounded-full border-2 border-surface" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 120 }} 
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Cards — Horizontal Scroll with snap */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="flex-row overflow-visible -mx-5 px-5 pb-2"
          snapToInterval={SCREEN_WIDTH * 0.5 + 16}
          decelerationRate="fast"
        >
          {/* Today's Sales */}
          <Animated.View 
            entering={FadeInDown.duration(600).delay(100).springify()} 
            className="w-[200px] bg-surface-container-lowest border border-border-subtle rounded-xl p-4 h-32 mr-4 flex-col justify-between shadow-sm"
          >
            <View className="flex-row justify-between items-start">
              <View className="w-10 h-10 rounded-full bg-primary-container/20 items-center justify-center">
                <MaterialIcons name="payments" size={20} color="#006b5e" />
              </View>
              <View className="bg-surface-container-low px-2 py-1 rounded-full">
                <Text className="text-[12px] font-medium text-on-surface-variant">Today</Text>
              </View>
            </View>
            <View>
              <Text className="text-[12px] font-medium text-on-surface-variant mb-1">Total Sales</Text>
              <Text className="text-[24px] font-bold text-on-surface tracking-tight">
                <Text className="text-[14px] font-normal">PKR </Text>{displaySales.toLocaleString()}
              </Text>
            </View>
          </Animated.View>

          {/* Total Orders */}
          <Animated.View 
            entering={FadeInDown.duration(600).delay(200).springify()} 
            className="w-[160px] bg-surface-container-lowest border border-border-subtle rounded-xl p-4 h-32 mr-4 flex-col justify-between shadow-sm"
          >
            <View className="w-10 h-10 rounded-full bg-tertiary-container/20 items-center justify-center">
              <MaterialIcons name="shopping-bag" size={20} color="#0055D4" />
            </View>
            <View>
              <Text className="text-[12px] font-medium text-on-surface-variant mb-1">Orders</Text>
              <Text className="text-[24px] font-bold text-on-surface tracking-tight">{displayOrders}</Text>
            </View>
          </Animated.View>

          {/* Total Products */}
          <Animated.View 
            entering={FadeInDown.duration(600).delay(300).springify()} 
            className="w-[160px] bg-surface-container-lowest border border-border-subtle rounded-xl p-4 h-32 mr-6 flex-col justify-between shadow-sm"
          >
            <View className="w-10 h-10 rounded-full bg-secondary-container/30 items-center justify-center">
              <MaterialIcons name="inventory-2" size={20} color="#007232" />
            </View>
            <View>
              <Text className="text-[12px] font-medium text-on-surface-variant mb-1">Products</Text>
              <Text className="text-[24px] font-bold text-on-surface tracking-tight">{displayProducts}</Text>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Create Store Prompt Banner if no store exists */}
        {!storeName && (
          <Animated.View 
            entering={FadeInDown.duration(600).delay(50).springify()}
            className="mt-6 bg-primary-container p-5 rounded-2xl shadow-md border border-primary/20"
          >
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center">
                <MaterialIcons name="add-business" size={28} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-[18px] font-bold text-white mb-1">Create Your Online Store</Text>
                <Text className="text-[13px] text-white/90 leading-5">Set up your shop name and link in under 2 minutes.</Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push('/(app)/(stack)/store/create' as any)}
              className="mt-4 bg-white py-3 px-5 rounded-xl items-center justify-center flex-row gap-2 shadow-sm"
            >
              <MaterialIcons name="storefront" size={20} color="#006B5E" />
              <Text className="font-bold text-[15px] text-growth-green">Create Store Now</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* AI Insight Card — with animated gradient */}
        <Animated.View 
          entering={FadeInDown.duration(600).delay(400).springify()} 
          className="mt-6 rounded-xl overflow-hidden shadow-sm"
        >
          <LinearGradient
            colors={['#005147', '#006B5E', '#008775']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-4 relative"
          >
            {/* Decorative blobs */}
            <View className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full opacity-50" />
            <View className="absolute -left-4 -bottom-4 w-24 h-24 bg-secondary-container/20 rounded-full opacity-50" />
            
            <View className="flex-row items-start gap-4">
              <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center flex-shrink-0">
                <MaterialIcons name="auto-awesome" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Animated.Text style={[animatedPulse]} className="text-[14px] font-bold text-white mb-1">
                  AI Store Insight
                </Animated.Text>
                <Text className="text-[16px] text-white/90 mb-4 leading-6">
                  {stats.orders > 0
                    ? `You have ${stats.orders} order${stats.orders !== 1 ? 's' : ''} and PKR ${stats.sales.toLocaleString()} in sales. Keep it up!`
                    : 'Add your first product and share your shop link to start getting orders!'}
                </Text>
                <TouchableOpacity 
                  activeOpacity={0.9} 
                  className="bg-white px-4 py-2 rounded-full flex-row items-center self-start gap-2"
                  onPress={() => Share.share({ message: `Shop at ${storeName}! ` + (storeName ? `Check us out.` : '') })}
                >
                  <MaterialIcons name="share" size={18} color="#006B5E" />
                  <Text className="text-[14px] font-bold text-growth-green">Share Link</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions Grid — 2-col 2x2 grid via explicit rows for RN flexbox reliability */}
        <Animated.View entering={FadeInDown.duration(600).delay(500).springify()} className="mt-8">
          <Text className="text-[24px] font-bold text-on-surface mb-4">Quick Actions</Text>
          <View className="gap-3">
            {/* Row 1 */}
            <View className="flex-row gap-3">
              {/* Add Product */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/(app)/products/create' as any)}
                className="flex-1 bg-surface-container-lowest border border-border-subtle rounded-xl p-4 flex-col items-center justify-center min-h-[100px] shadow-sm"
              >
                <View className="w-12 h-12 rounded-full bg-primary-container items-center justify-center mb-3">
                  <MaterialIcons name="add" size={24} color="white" />
                </View>
                <Text className="text-[14px] font-semibold text-on-surface">Add Product</Text>
              </TouchableOpacity>

              {/* View Orders */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/(app)/orders' as any)}
                className="flex-1 bg-surface-container-lowest border border-border-subtle rounded-xl p-4 flex-col items-center justify-center min-h-[100px] shadow-sm"
              >
                <View className="w-12 h-12 rounded-full bg-surface-container-high items-center justify-center mb-3">
                  <MaterialIcons name="receipt-long" size={24} color="#1a1c1e" />
                </View>
                <Text className="text-[14px] font-semibold text-on-surface">View Orders</Text>
              </TouchableOpacity>
            </View>

            {/* Row 2 */}
            <View className="flex-row gap-3">
              {/* Share Shop */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/(app)/(stack)/store/share' as any)}
                className="flex-1 bg-surface-container-lowest border border-border-subtle rounded-xl p-4 flex-col items-center justify-center min-h-[100px] shadow-sm"
              >
                <View className="w-12 h-12 rounded-full bg-surface-container-high items-center justify-center mb-3">
                  <MaterialIcons name="share" size={24} color="#25D366" />
                </View>
                <Text className="text-[14px] font-semibold text-on-surface">Share Shop</Text>
              </TouchableOpacity>

              {/* Analytics */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/(app)/(stack)/analytics' as any)}
                className="flex-1 bg-surface-container-lowest border border-border-subtle rounded-xl p-4 flex-col items-center justify-center min-h-[100px] shadow-sm"
              >
                <View className="w-12 h-12 rounded-full bg-surface-container-high items-center justify-center mb-3">
                  <MaterialIcons name="bar-chart" size={24} color="#1a1c1e" />
                </View>
                <Text className="text-[14px] font-semibold text-on-surface">Analytics</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Recent Orders */}
        <Animated.View entering={FadeInDown.duration(600).delay(600).springify()} className="mt-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-[24px] font-bold text-on-surface">Recent Orders</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/orders' as any)}>
              <Text className="text-[14px] font-bold text-growth-green">See All</Text>
            </TouchableOpacity>
          </View>

          <View className="gap-3">
            {recentOrders.length === 0 ? (
              <View className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 items-center">
                <Text className="text-[14px] text-on-surface-variant">No recent orders found.</Text>
              </View>
            ) : (
              recentOrders.map((order, i) => (
                <TouchableOpacity 
                  key={order.id || i} 
                  activeOpacity={0.8}
                  onPress={() => router.push(`/(app)/orders/${order.id}` as any)}
                  className="bg-surface-container-lowest border border-border-subtle rounded-xl p-4 flex-row justify-between items-center shadow-sm"
                >
                  <View className="flex-row items-center gap-4">
                    <View className="w-12 h-12 rounded-full bg-surface-container-high items-center justify-center">
                      <Text className="font-bold text-[16px] text-on-surface-variant">
                        {order.customerName ? order.customerName.substring(0, 2).toUpperCase() : 'CU'}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-[14px] font-semibold text-on-surface mb-0.5">{order.customerName || 'Customer'}</Text>
                      <Text className="text-[16px] font-bold text-on-surface-variant">PKR {order.totalAmount || 0}</Text>
                    </View>
                  </View>
                  <View className={`px-3 py-1 rounded-full border ${
                    order.status === 'pending' ? 'bg-[#FEF7FF] border-[#E9DDF8]' :
                    order.status === 'shipped' ? 'bg-status-shipped border-[#BDECC4]' :
                    'bg-surface-container-low border-border-subtle'
                  }`}>
                    <Text className={`text-[12px] font-bold capitalize ${
                      order.status === 'pending' ? 'text-[#6B538C]' :
                      order.status === 'shipped' ? 'text-growth-green' :
                      'text-on-surface'
                    }`}>{order.status || 'Pending'}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </Animated.View>
        
      </ScrollView>
    </SafeAreaView>
  );
}
