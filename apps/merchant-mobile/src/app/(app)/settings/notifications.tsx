import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    message: 'Ahmed Khan placed a new order for PKR 4,200.',
    time: '2 mins ago',
    unread: true,
    icon: 'receipt-long',
    iconBg: 'bg-primary-container',
    iconColor: 'white',
  },
  {
    id: '2',
    type: 'tip',
    title: 'Shop Tip: Add AI Descriptions',
    message: 'Products with AI descriptions sell 30% faster. Try it now.',
    time: '1 hour ago',
    unread: true,
    icon: 'lightbulb',
    iconBg: 'bg-tertiary-container',
    iconColor: 'white',
  },
  {
    id: '3',
    type: 'shipping',
    title: 'Order #1040 Shipped',
    message: 'Your order is on the way to the customer.',
    time: 'Yesterday',
    unread: false,
    icon: 'local-shipping',
    iconBg: 'bg-status-shipped',
    iconColor: '#006d2f',
  },
  {
    id: '4',
    type: 'summary',
    title: 'Weekly Summary',
    message: 'You made PKR 24,000 in sales this week. Keep it up!',
    time: 'Yesterday',
    unread: false,
    icon: 'monitoring',
    iconBg: 'bg-surface-container-highest',
    iconColor: '#3e4946',
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const todayNotifs = notifications.filter((_, i) => i < 2);
  const yesterdayNotifs = notifications.filter((_, i) => i >= 2);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-surface z-40">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-center rounded-full" activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="text-[24px] font-bold text-growth-green">Notifications</Text>
        <TouchableOpacity className="px-2 py-1" activeOpacity={0.7}>
          <Text className="text-[14px] font-semibold text-primary">Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Today */}
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <Text className="text-[14px] font-semibold text-on-surface-variant uppercase tracking-wider py-2">Today</Text>
        </Animated.View>

        {todayNotifs.map((notif, i) => (
          <Animated.View key={notif.id} entering={FadeInDown.duration(400).delay(i * 100).springify()}>
            <TouchableOpacity className="bg-surface-container-lowest border border-border-subtle rounded-xl p-4 flex-row gap-4 mb-3 relative" activeOpacity={0.8}>
              {notif.unread && <View className="absolute top-4 left-2 w-2 h-2 rounded-full bg-primary" />}
              <View className={`w-12 h-12 rounded-full ${notif.iconBg} items-center justify-center flex-shrink-0`}>
                <MaterialIcons name={notif.icon as any} size={20} color={notif.iconColor} />
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-start gap-2">
                  <Text className="text-[14px] font-bold text-on-surface flex-1">{notif.title}</Text>
                  <Text className="text-[12px] text-on-surface-variant whitespace-nowrap">{notif.time}</Text>
                </View>
                <Text className="text-[16px] text-on-surface-variant mt-1">{notif.message}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Yesterday */}
        <Animated.View entering={FadeInDown.duration(600).delay(300).springify()}>
          <Text className="text-[14px] font-semibold text-on-surface-variant uppercase tracking-wider py-2 mt-4">Yesterday</Text>
        </Animated.View>

        {yesterdayNotifs.map((notif, i) => (
          <Animated.View key={notif.id} entering={FadeInDown.duration(400).delay((i + 2) * 100).springify()}>
            <TouchableOpacity className="bg-surface-container-lowest border border-border-subtle rounded-xl p-4 flex-row gap-4 mb-3 opacity-80" activeOpacity={0.8}>
              <View className={`w-12 h-12 rounded-full ${notif.iconBg} items-center justify-center flex-shrink-0`}>
                <MaterialIcons name={notif.icon as any} size={20} color={notif.iconColor} />
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-start gap-2">
                  <Text className="text-[14px] font-semibold text-on-surface flex-1">{notif.title}</Text>
                  <Text className="text-[12px] text-on-surface-variant whitespace-nowrap">{notif.time}</Text>
                </View>
                <Text className="text-[16px] text-on-surface-variant mt-1">{notif.message}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
