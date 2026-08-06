import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiFetchSafe } from '../../../../lib/api';

export interface NotificationItem {
  id: string;
  type: 'order' | 'system' | 'tip' | 'payment';
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
  color?: string;
  bgColor?: string;
}

export default function NotificationsInboxScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real notifications from API — strictly 0 mock data
    apiFetchSafe<NotificationItem[]>('/merchant/notifications', [])
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const headerPadding = Math.max(insets.top, StatusBar.currentHeight || 24, 12);
  const unreadCount = items.filter((i) => i.unread).length;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)');
    }
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const markRead = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, unread: false } : item)));
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header — with Android safe top insets and deterministic back navigation */}
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        style={{ paddingTop: headerPadding }}
        className="w-full flex-row justify-between items-center px-5 pb-3 border-b border-border-subtle bg-surface z-10"
      >
        <TouchableOpacity
          onPress={handleBack}
          className="w-10 h-10 items-center justify-center rounded-full bg-surface-container-low"
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="text-[20px] font-bold text-growth-green">Notifications</Text>
        <TouchableOpacity
          onPress={() => router.push('/(app)/(stack)/settings/notifications' as never)}
          className="w-10 h-10 items-center justify-center rounded-full bg-surface-container-low"
          activeOpacity={0.7}
        >
          <MaterialIcons name="tune" size={22} color="#006B5E" />
        </TouchableOpacity>
      </Animated.View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#006B5E" />
          <Text className="mt-3 text-on-surface-variant text-[14px]">Loading alerts...</Text>
        </View>
      ) : items.length === 0 ? (
        <Animated.View entering={FadeInDown.duration(400).springify()} className="flex-1 items-center justify-center px-6 py-12">
          <View className="w-20 h-20 rounded-full bg-surface-container-low items-center justify-center mb-4 border border-border-subtle">
            <MaterialIcons name="notifications-none" size={44} color="#6e7976" />
          </View>
          <Text className="text-[20px] font-bold text-on-surface text-center mb-2">No Notifications Yet</Text>
          <Text className="text-[14px] text-on-surface-variant text-center leading-6 max-w-[280px]">
            You're all caught up! Real-time alerts for new orders, status updates, and shop performance will appear here.
          </Text>
        </Animated.View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          className="flex-1 px-5 pt-4"
        >
          {/* Actions Row */}
          <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="flex-row justify-between items-center mb-4">
            <Text className="text-[14px] font-semibold text-on-surface-variant">
              {unreadCount > 0 ? `${unreadCount} unread alerts` : 'All caught up'}
            </Text>
            {unreadCount > 0 && (
              <TouchableOpacity onPress={markAllRead} activeOpacity={0.7}>
                <Text className="text-[14px] font-bold text-growth-green">Mark all read</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* Notifications List */}
          <Animated.View entering={FadeInDown.duration(400).delay(150).springify()} className="gap-3">
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() => markRead(item.id)}
                className={`p-4 rounded-xl border flex-row gap-3 items-start ${
                  item.unread ? 'bg-surface-container-lowest border-primary/30 shadow-sm' : 'bg-surface-container-low border-border-subtle opacity-80'
                }`}
              >
                <View
                  style={{ backgroundColor: item.bgColor || '#E6F4F1' }}
                  className="w-11 h-11 rounded-full items-center justify-center flex-shrink-0 mt-0.5"
                >
                  <MaterialIcons name={item.icon || 'notifications'} size={22} color={item.color || '#006B5E'} />
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-[15px] font-bold text-on-surface flex-1 pr-2" numberOfLines={1}>
                      {item.title}
                    </Text>
                    {item.unread && <View className="w-2.5 h-2.5 rounded-full bg-growth-green" />}
                  </View>
                  <Text className="text-[13px] text-on-surface-variant leading-5 mb-2">{item.desc}</Text>
                  <Text className="text-[11px] font-medium text-muted-foreground">{item.time}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
