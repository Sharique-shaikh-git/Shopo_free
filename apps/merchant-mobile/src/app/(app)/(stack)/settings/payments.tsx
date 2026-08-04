import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PAYMENTS_KEY = '@shopo_payment_methods';

interface Method {
  key: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  desc: string;
  note?: string;
}

const METHODS: Method[] = [
  {
    key: 'cod',
    icon: 'local-atm',
    title: 'Cash on Delivery',
    desc: 'Collect cash when the order arrives',
    note: 'Enabled by default',
  },
  {
    key: 'jazzcash',
    icon: 'account-balance-wallet',
    title: 'JazzCash',
    desc: 'Mobile Wallet & QR payments',
  },
  {
    key: 'easypaisa',
    icon: 'account-balance-wallet',
    title: 'EasyPaisa',
    desc: 'Mobile Wallet & Bank Transfer',
  },
  {
    key: 'bank',
    icon: 'account-balance',
    title: 'Bank Transfer',
    desc: 'Direct deposit to your account',
  },
];

export default function PaymentsScreen() {
  const router = useRouter();
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ cod: true, jazzcash: false, easypaisa: false, bank: false });

  useEffect(() => {
    AsyncStorage.getItem(PAYMENTS_KEY).then((raw) => {
      if (raw) setEnabled({ cod: true, ...JSON.parse(raw) });
    });
  }, []);

  const toggle = (key: string) => {
    const next = { ...enabled, [key]: !enabled[key] };
    if (key === 'cod') next.cod = true; // COD is locked on
    setEnabled(next);
    AsyncStorage.setItem(PAYMENTS_KEY, JSON.stringify(next));
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <Animated.View entering={FadeInDown.duration(400).springify()} className="flex-row items-center justify-between px-gutter-mobile py-4 border-b border-border-subtle">
        <TouchableOpacity onPress={() => router.back()} className="w-touch-target-min h-touch-target-min justify-center">
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="font-headline-md text-headline-md font-bold text-growth-green">Payment Methods</Text>
        <View className="w-touch-target-min h-touch-target-min" />
      </Animated.View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="mb-stack-md">
          <Text className="font-body-md text-body-md text-on-surface-variant">
            Choose how customers can pay you. Cash on Delivery works everywhere in Pakistan.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(180).springify()} className="gap-stack-sm">
          {METHODS.map((m) => (
            <View
              key={m.key}
              className="flex-row items-center gap-4 bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md"
            >
              <View className="w-12 h-12 rounded-full bg-surface-container-high items-center justify-center">
                <MaterialIcons name={m.icon} size={22} color="#006B5E" />
              </View>
              <View className="flex-1">
                <Text className="font-label-lg text-label-lg text-on-surface">{m.title}</Text>
                <Text className="font-body-md text-body-md text-on-surface-variant mt-0.5">{m.desc}</Text>
                {m.note && (
                  <Text className="font-label-sm text-label-sm text-on-surface-variant mt-1 italic">{m.note}</Text>
                )}
              </View>
              <Switch
                value={!!enabled[m.key]}
                onValueChange={() => toggle(m.key)}
                disabled={m.key === 'cod'}
                trackColor={{ false: '#e2e2e5', true: '#006B5E' }}
                thumbColor="#ffffff"
              />
            </View>
          ))}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400).delay(260).springify()}
          className="mt-stack-lg p-4 bg-surface-container-lowest border border-border-subtle rounded-xl flex-row gap-3 items-start"
        >
          <MaterialIcons name="auto-awesome" size={20} color="#0055D4" />
          <View className="flex-1">
            <Text className="font-label-lg text-label-lg text-on-surface mb-1">Smart tip</Text>
            <Text className="font-body-md text-body-md text-on-surface-variant leading-5">
              Most first-time customers prefer Cash on Delivery — keep it enabled to maximize conversions.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
