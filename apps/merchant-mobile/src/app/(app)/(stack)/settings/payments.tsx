import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PAYMENTS_KEY = '@shopo_payment_methods';

interface Method {
  key: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  desc: string;
  placeholder?: string;
  note?: string;
}

const METHODS: Method[] = [
  {
    key: 'cod',
    icon: 'local-atm',
    title: 'Cash on Delivery',
    desc: 'Collect cash when the order arrives',
    note: 'Enabled by default for Pakistan',
  },
  {
    key: 'jazzcash',
    icon: 'account-balance-wallet',
    title: 'JazzCash',
    desc: 'Mobile Wallet & QR payments',
    placeholder: 'Enter JazzCash Mobile Number (03XX-XXXXXXX)',
  },
  {
    key: 'easypaisa',
    icon: 'account-balance-wallet',
    title: 'EasyPaisa',
    desc: 'Mobile Wallet & Bank Transfer',
    placeholder: 'Enter EasyPaisa Mobile Number (03XX-XXXXXXX)',
  },
  {
    key: 'bank',
    icon: 'account-balance',
    title: 'Bank Transfer',
    desc: 'Direct deposit to your bank account',
    placeholder: 'Enter Bank Name & IBAN Number',
  },
];

export default function PaymentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ cod: true, jazzcash: false, easypaisa: false, bank: false });
  const [details, setDetails] = useState<Record<string, string>>({});
  const [tipDismissed, setTipDismissed] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PAYMENTS_KEY).then((raw) => {
      if (raw) {
        const parsed = JSON.parse(raw);
        setEnabled({ cod: true, ...parsed.enabled });
        if (parsed.details) setDetails(parsed.details);
      }
    });
  }, []);

  const saveState = (nextEnabled: Record<string, boolean>, nextDetails: Record<string, string>) => {
    AsyncStorage.setItem(PAYMENTS_KEY, JSON.stringify({ enabled: nextEnabled, details: nextDetails }));
  };

  const toggle = (key: string) => {
    const nextEnabled = { ...enabled, [key]: !enabled[key] };
    if (key === 'cod') nextEnabled.cod = true;
    setEnabled(nextEnabled);
    saveState(nextEnabled, details);
  };

  const updateDetail = (key: string, value: string) => {
    const nextDetails = { ...details, [key]: value };
    setDetails(nextDetails);
    saveState(enabled, nextDetails);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header — with Android safe top insets */}
      <Animated.View 
        entering={FadeInDown.duration(400).springify()}
        style={{ paddingTop: Math.max(insets.top, 12) }}
        className="flex-row items-center justify-between px-5 pb-3 border-b border-border-subtle bg-surface"
      >
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center bg-surface-container-low"
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="text-[20px] font-bold text-growth-green">Payment Methods</Text>
        <View className="w-10 h-10" />
      </Animated.View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="mb-6">
          <Text className="text-[14px] text-on-surface-variant leading-5">
            Choose how customers can pay you. Cash on Delivery works everywhere in Pakistan.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(180).springify()} className="gap-4">
          {METHODS.map((m) => {
            const isON = !!enabled[m.key];
            return (
              <View
                key={m.key}
                className="bg-surface-container-lowest border border-border-subtle rounded-xl p-4 shadow-sm"
              >
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 rounded-full bg-surface-container-high items-center justify-center">
                    <MaterialIcons name={m.icon} size={22} color="#006B5E" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[16px] font-bold text-on-surface">{m.title}</Text>
                    <Text className="text-[13px] text-on-surface-variant mt-0.5">{m.desc}</Text>
                    {m.note && (
                      <Text className="text-[12px] text-on-surface-variant mt-1 italic">{m.note}</Text>
                    )}
                  </View>
                  <Switch
                    value={isON}
                    onValueChange={() => toggle(m.key)}
                    disabled={m.key === 'cod'}
                    trackColor={{ false: '#e2e2e5', true: '#006B5E' }}
                    thumbColor="#ffffff"
                  />
                </View>

                {/* Account Details Config Input if toggled ON */}
                {isON && m.placeholder && (
                  <View className="mt-3 pt-3 border-t border-border-subtle">
                    <Text className="text-[12px] font-semibold text-on-surface-variant mb-1 ml-1">Account Info / Till Number</Text>
                    <TextInput
                      value={details[m.key] || ''}
                      onChangeText={(val) => updateDetail(m.key, val)}
                      placeholder={m.placeholder}
                      placeholderTextColor="#6e7976"
                      style={{ borderRadius: 10 }}
                      className="bg-surface-container-low border border-border-subtle rounded-lg px-3 py-2.5 text-[14px] text-on-surface"
                    />
                  </View>
                )}
              </View>
            );
          })}
        </Animated.View>

        {/* Smart Tip — dismissible */}
        {!tipDismissed && (
          <Animated.View
            entering={FadeInDown.duration(400).delay(260).springify()}
            className="mt-6 p-4 bg-surface-container-lowest border border-border-subtle rounded-xl flex-row gap-3 items-start relative shadow-sm"
          >
            <MaterialIcons name="auto-awesome" size={20} color="#0055D4" style={{ marginTop: 2 }} />
            <View className="flex-1 pr-6">
              <Text className="text-[14px] font-bold text-on-surface mb-1">Smart tip</Text>
              <Text className="text-[13px] text-on-surface-variant leading-5">
                Most first-time customers prefer Cash on Delivery — keep it enabled to maximize conversions.
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => setTipDismissed(true)} 
              className="absolute top-3 right-3 p-1 rounded-full bg-surface-container-low"
            >
              <MaterialIcons name="close" size={18} color="#6e7976" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
