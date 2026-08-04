import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { apiFetchSafe } from '../../../../lib/api';

interface Customer {
  phone: string;
  name: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string;
}

export default function CustomersScreen() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiFetchSafe<Customer[]>('/customers', [])
      .then((data) => setCustomers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.trim().toLowerCase();
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q),
    );
  }, [customers, search]);

  const totalCustomers = customers.length;
  const avgSpent = totalCustomers
    ? Math.round(customers.reduce((s, c) => s + Number(c.totalSpent || 0), 0) / totalCustomers)
    : 0;

  const initials = (name: string) =>
    name.split(' ').map((p) => p.charAt(0)).slice(0, 2).join('').toUpperCase() || 'C';

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Top App Bar */}
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        className="flex-row justify-between items-center px-gutter-mobile py-4 w-full bg-surface"
      >
        <View className="flex-row items-center gap-3">
          <MaterialIcons name="storefront" size={28} color="#006B5E" />
          <Text className="font-headline-md text-headline-md font-bold text-growth-green">Shop Builder</Text>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }} className="px-margin-mobile pt-4">
        {/* Heading + Search */}
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="mb-stack-lg">
          <Text className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1">Customers</Text>
          <Text className="font-body-md text-body-md text-on-surface-variant mb-stack-md">
            Manage and track your customer base and their lifetime value.
          </Text>
          <View className="flex-row items-center gap-3">
            <View className="relative flex-grow justify-center">
              <View className="absolute left-4 z-10">
                <MaterialIcons name="search" size={22} color="#6e7976" />
              </View>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search customer name or phone..."
                placeholderTextColor="#6e7976"
                className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border-2 border-border-subtle rounded-xl font-body-md text-body-md text-on-surface"
              />
            </View>
          </View>
        </Animated.View>

        {/* Stats Overview */}
        <Animated.View entering={FadeInDown.duration(400).delay(200).springify()} className="flex-row gap-4 mb-stack-lg">
          <View className="flex-1 bg-surface-container-lowest border border-border-subtle p-stack-md rounded-xl">
            <View className="flex-row items-center gap-3 mb-2">
              <View className="w-10 h-10 rounded-full bg-secondary-container items-center justify-center">
                <MaterialIcons name="group" size={20} color="#007232" />
              </View>
              <Text className="font-label-lg text-label-lg text-on-surface-variant">Total Customers</Text>
            </View>
            <Text className="font-headline-md text-headline-md text-on-surface">{totalCustomers}</Text>
          </View>
          <View className="flex-1 bg-surface-container-lowest border border-border-subtle p-stack-md rounded-xl">
            <View className="flex-row items-center gap-3 mb-2">
              <View className="w-10 h-10 rounded-full bg-tertiary-fixed items-center justify-center">
                <MaterialIcons name="payments" size={20} color="#001848" />
              </View>
              <Text className="font-label-lg text-label-lg text-on-surface-variant">Avg. Spent</Text>
            </View>
            <Text className="font-headline-md text-headline-md text-on-surface">Rs. {avgSpent.toLocaleString()}</Text>
          </View>
        </Animated.View>

        {/* Customer List */}
        <Animated.View entering={FadeInDown.duration(400).delay(300).springify()}>
          {loading ? (
            <ActivityIndicator size="large" color="#006B5E" className="mt-12" />
          ) : filtered.length === 0 ? (
            <View className="mt-12 items-center justify-center gap-3 bg-surface-container-lowest border border-border-subtle rounded-xl p-8">
              <View className="w-16 h-16 rounded-full bg-surface-container-high items-center justify-center">
                <MaterialIcons name="people-outline" size={30} color="#6e7976" />
              </View>
              <Text className="text-[16px] font-semibold text-on-surface">No customers yet</Text>
              <Text className="text-[13px] text-on-surface-variant text-center max-w-[240px]">
                Customers appear here automatically once they place their first order.
              </Text>
            </View>
          ) : (
            <View className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden">
              {filtered.map((customer, index) => (
                <TouchableOpacity
                  key={customer.phone}
                  activeOpacity={0.7}
                  onPress={() => router.push(`/(app)/(stack)/customers/${encodeURIComponent(customer.phone)}` as never)}
                  className={`flex-row items-center gap-4 px-4 py-4 bg-surface-container-lowest ${
                    index < filtered.length - 1 ? 'border-b border-border-subtle' : ''
                  }`}
                >
                  <View className="w-12 h-12 rounded-full bg-surface-container items-center justify-center flex-shrink-0">
                    <Text className="text-[16px] font-bold text-on-surface-variant">{initials(customer.name)}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-body-lg text-body-lg font-bold text-on-surface" numberOfLines={1}>
                      {customer.name}
                    </Text>
                    <Text className="font-label-sm text-label-sm text-on-surface-variant">{customer.phone}</Text>
                  </View>
                  <View className="items-center">
                    <Text className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Orders</Text>
                    <Text className="font-body-md text-body-md font-semibold text-on-surface">{customer.orderCount}</Text>
                  </View>
                  <View className="items-end min-w-[84px]">
                    <Text className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Spent</Text>
                    <Text className="font-body-md text-body-md font-semibold text-growth-green">
                      Rs. {Number(customer.totalSpent).toLocaleString()}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={22} color="#6e7976" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
