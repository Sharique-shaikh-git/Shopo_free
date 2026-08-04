import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { apiFetchSafe } from '../../../../lib/api';

interface CustomerOrder {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
}

interface CustomerDetail {
  phone: string;
  name: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
  orders: CustomerOrder[];
}

const STATUS_STYLE: Record<string, { bg: string; text: string; icon: string }> = {
  delivered: { bg: 'bg-status-shipped', text: 'text-secondary', icon: 'local-shipping' },
  shipped: { bg: 'bg-status-shipped', text: 'text-secondary', icon: 'local-shipping' },
  pending: { bg: 'bg-status-pending', text: 'text-[#6B538C]', icon: 'schedule' },
  cancelled: { bg: 'bg-error-container', text: 'text-error-red', icon: 'cancel' },
};

export default function CustomerDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; phone?: string }>();
  const phone = decodeURIComponent(params.id || params.phone || '');

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!phone) {
      setLoading(false);
      return;
    }
    apiFetchSafe<CustomerDetail | null>(`/customers/${encodeURIComponent(phone)}`, null)
      .then((data) => setCustomer(data))
      .finally(() => setLoading(false));
  }, [phone]);

  const initials = (name: string) =>
    name.split(' ').map((p) => p.charAt(0)).slice(0, 2).join('').toUpperCase() || 'C';

  const call = () => phone && Linking.openURL(`tel:${phone}`);
  const whatsapp = () => phone && Linking.openURL(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`);

  const since = customer?.orders?.length
    ? new Date(customer.orders[customer.orders.length - 1].createdAt).toLocaleDateString('en-PK', { month: 'short', year: 'numeric' })
    : '—';
  const avgOrder = customer && customer.orderCount > 0 ? Math.round(customer.totalSpent / customer.orderCount) : 0;
  const lastPurchase = customer?.lastOrderAt
    ? new Date(customer.lastOrderAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })
    : '—';

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400).springify()} className="flex-row items-center gap-3 px-gutter-mobile py-4 bg-surface">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:scale-95">
          <MaterialIcons name="arrow-back" size={24} color="#006B5E" />
        </TouchableOpacity>
        <Text className="font-headline-md text-headline-md font-bold text-growth-green">Customer Details</Text>
      </Animated.View>

      {loading ? (
        <ActivityIndicator size="large" color="#006B5E" className="mt-16" />
      ) : !customer ? (
        <View className="flex-1 items-center justify-center gap-3 px-8">
          <MaterialIcons name="person-off" size={48} color="#6e7976" />
          <Text className="text-[16px] font-semibold text-on-surface">Customer not found</Text>
          <Text className="text-[13px] text-on-surface-variant text-center">This customer may not have placed an order yet.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 90 }}>
          {/* Profile Header */}
          <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="border border-border-subtle rounded-xl p-stack-md bg-surface-container-lowest flex-row gap-5 items-center mb-stack-md">
            <View className="relative">
              <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-fixed bg-surface-container items-center justify-center">
                <Text className="text-[30px] font-bold text-growth-green">{initials(customer.name)}</Text>
              </View>
              <View className="absolute bottom-0 right-0 bg-whatsapp-green p-1 rounded-full border-2 border-white">
                <MaterialIcons name="verified" size={14} color="#ffffff" />
              </View>
            </View>
            <View className="flex-1">
              <Text className="font-headline-md text-headline-md text-on-surface" numberOfLines={1}>{customer.name}</Text>
              <View className="flex-row items-center gap-1 mt-1">
                <MaterialIcons name="phone" size={16} color="#3e4946" />
                <Text className="font-body-md text-body-md text-on-surface-variant">{customer.phone}</Text>
              </View>
              <View className="flex-row gap-3 pt-3">
                <TouchableOpacity onPress={whatsapp} className="bg-whatsapp-green px-5 py-2.5 rounded-xl flex-row items-center gap-2 active:scale-95">
                  <MaterialIcons name="chat" size={18} color="#ffffff" />
                  <Text className="font-label-lg text-label-lg text-white">WhatsApp</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={call} className="border-2 border-trust-blue px-5 py-2.5 rounded-xl flex-row items-center gap-2 active:scale-95">
                  <MaterialIcons name="call" size={18} color="#0055D4" />
                  <Text className="font-label-lg text-label-lg text-trust-blue">Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {/* Lifetime Value Card */}
          <Animated.View entering={FadeInDown.duration(400).delay(200).springify()} className="rounded-xl p-stack-md bg-growth-green mb-stack-md">
            <Text className="font-label-sm text-label-sm text-primary-fixed-dim uppercase tracking-wider">Lifetime Value</Text>
            <Text className="font-headline-lg text-headline-lg text-white mt-1">Rs. {Number(customer.totalSpent).toLocaleString()}</Text>
            <View className="mt-4 pt-4 border-t border-white/30">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-label-sm text-label-sm text-primary-fixed-dim">Total Orders</Text>
                <Text className="font-label-lg text-label-lg text-white">{customer.orderCount}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="font-label-sm text-label-sm text-primary-fixed-dim">Avg. Order Value</Text>
                <Text className="font-label-lg text-label-lg text-white">Rs. {avgOrder.toLocaleString()}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Insights Grid */}
          <Animated.View entering={FadeInDown.duration(400).delay(300).springify()} className="flex-row gap-stack-md mb-stack-md">
            <View className="flex-1 border border-border-subtle rounded-xl p-stack-md bg-surface-container-lowest">
              <MaterialIcons name="calendar-today" size={20} color="#006B5E" />
              <Text className="font-label-sm text-label-sm text-on-surface-variant mt-2">Customer Since</Text>
              <Text className="font-label-lg text-label-lg text-on-surface">{since}</Text>
            </View>
            <View className="flex-1 border border-border-subtle rounded-xl p-stack-md bg-surface-container-lowest">
              <MaterialIcons name="history" size={20} color="#006B5E" />
              <Text className="font-label-sm text-label-sm text-on-surface-variant mt-2">Last Purchase</Text>
              <Text className="font-label-lg text-label-lg text-on-surface">{lastPurchase}</Text>
            </View>
          </Animated.View>

          {/* Orders */}
          <Animated.View entering={FadeInDown.duration(400).delay(400).springify()}>
            <View className="flex-row justify-between items-center mb-stack-md">
              <Text className="font-headline-md text-headline-md text-on-surface">Recent Orders</Text>
            </View>
            {customer.orders.length === 0 ? (
              <View className="border border-border-subtle rounded-xl p-6 bg-surface-container-lowest items-center">
                <Text className="font-body-md text-body-md text-on-surface-variant">No orders from this customer yet.</Text>
              </View>
            ) : (
              <View className="gap-stack-sm">
                {customer.orders.map((o) => {
                  const s = STATUS_STYLE[o.status] || STATUS_STYLE.shipped;
                  return (
                    <View key={o.id} className="border border-border-subtle rounded-xl p-stack-md bg-surface-container-lowest">
                      <View className="flex-row justify-between items-start mb-2">
                        <View>
                          <Text className="font-label-lg text-label-lg text-on-surface">{o.orderNumber}</Text>
                          <Text className="font-label-sm text-label-sm text-on-surface-variant">
                            {new Date(o.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </Text>
                        </View>
                        <View className={`${s.bg} px-3 py-1 rounded-full flex-row items-center gap-1`}>
                          <MaterialIcons name={s.icon as any} size={14} color={s.text.includes('secondary') ? '#007232' : '#6B538C'} />
                          <Text className={`font-label-sm text-label-sm ${s.text} capitalize`}>{o.status}</Text>
                        </View>
                      </View>
                      <View className="pt-2 border-t border-border-subtle flex-row justify-between items-center">
                        <Text className="font-label-sm text-label-sm text-on-surface-variant">Total</Text>
                        <Text className="font-label-lg text-label-lg text-growth-green">Rs. {Number(o.total).toLocaleString()}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </Animated.View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
