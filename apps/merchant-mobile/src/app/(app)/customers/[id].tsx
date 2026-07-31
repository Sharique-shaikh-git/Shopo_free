import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

export default function CustomerProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const mockCustomers: Record<string, any> = {
    c1: {
      id: 'c1',
      name: 'Ahmed Khan',
      phone: '+92 300 1234567',
      orders: 24,
      spent: 45200,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3EnMrqrk0Eu6yWtd-YRR9ZQOMbBoWqISUE85p13NF6fC1jkHBSo-nC2ygvApTNGI40PKONdVcpeI1UpYUUDPXwQnI88hsL3eFmsoNaz6ALqrpFAG4kYoBnmD_rV1kMQubQEnu4J48pAyCBc55gooAqJtqu-TvsfrcD5r_PBZXpL1JWxjmUY6ogd-wVq9MFBLlpfPtSvMoYUQLoXGCnNrlrWz8EMAgbGwW0PPV1xx7_6V7PpOZFjgVizl-klSooGvKioB5hg9Pvv8'
    },
    c2: {
      id: 'c2',
      name: 'Zainab Bibi',
      phone: '+92 321 9876543',
      orders: 8,
      spent: 12800,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7a5OnxrKe47namji6xe6iMJXCx-CisBxjExJMsKDYArHHshzBwdRzge19NHgMQoYrq2kDS9TZAEX1bqc00DFhFeIvPOsMtBW19J0p9dhAqVfh_V4Mcp6Lh2KLEqaSkdf3ER4r1MFbQVot19EvCoVA6WIZ2kl48X0oPx8Lfb4MKyQ3bVGo5tiBFT6M0dYhLQuJhyEk6P0PVDOJdlmrf_Cc8K4fAyhtG0irTOl0GJzys_alSdaWrSUU3ESKFPe3XZLsY9QLT6IVWyE'
    },
    c3: {
      id: 'c3',
      name: 'Omar Qureshi',
      phone: '+92 345 5544332',
      orders: 15,
      spent: 28450,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjK7dFpy7ECWvnnw02d8blmKppDIxHO_UUiiBAuebPpaxeRLRrK2WYz2Nbh1u9orT1XmfRfLf8fv7fB9ntk-ptpDWP7uNdciUOchqHGJUdPoS04obfQXLmhug70QV8yj7DU_oNTur-5N7uBd-fqm2Mm_SYrqYYqD_h8-Xwp-qsI3O3e5iVEoaX4zTDcy-P26A3PL6m7N7twmBgE6eNi13bqPR2gV0frpp29D2Mv47CuHgGR6bxeABXbr-dGSz98VJwEQ-nwt2LCSI'
    },
    c4: {
      id: 'c4',
      name: 'Fatima Shah',
      phone: '+92 333 7778889',
      orders: 42,
      spent: 92100,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD8u2ljA1nf6ui5oGvk4nj5QEwTEOudrkAz002nq89y-XL0CpkBvRLy7mfrIyt4rYjSeBgFli4aIdPo3FgtgbsD11HhmrxAm5UvTDaS05WasejuB9yuLvHSEM-qsZ7mOMDDixNRQuEog7c64HHN3zDB4YHnZFKixSXXUMzmnFtvQ5EOzb7J0C_TLeLu-xq3zZus6vpZmpP7F9MVeIBuluv3J-LpPXAzPyXIXOjGYkln9F3JGmzySG1RNWzmeNWcbYJ5sUdRjEr6jc'
    }
  };

  const customer = mockCustomers[id as string] || mockCustomers.c1;

  return (
    <SafeAreaView className="flex-1 bg-surface font-body-md">
      {/* TopAppBar */}
      <View className="flex-row items-center bg-surface p-4 border-b border-border-subtle z-10 justify-between">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-center -ml-2 rounded-full active:scale-95">
          <MaterialIcons name="arrow-back" size={24} color="#006B5E" />
        </TouchableOpacity>
        <Text className="text-on-background text-[24px] font-bold text-center">Customer Details</Text>
        <View className="w-12 h-12" />
      </View>

      <ScrollView className="flex-1 px-5 pt-8" contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Profile Header */}
        <Animated.View entering={FadeInDown.duration(400).springify()} className="flex-col items-center mb-8">
          <View className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-[#9ff2e1]">
            <Image source={{ uri: customer.avatar }} className="w-full h-full" resizeMode="cover" />
          </View>
          <Text className="text-[28px] font-bold text-on-surface mb-1">{customer.name}</Text>
          <Text className="text-[16px] text-on-surface-variant">{customer.phone}</Text>
        </Animated.View>
        
        {/* Stats Grid */}
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="flex-row gap-4 mb-8">
          <View className="bg-surface-container-low p-4 rounded-xl flex-1 border border-border-subtle">
            <Text className="text-[12px] text-on-surface-variant uppercase tracking-wider mb-1">Lifetime Orders</Text>
            <Text className="text-[24px] font-bold text-primary">{customer.orders}</Text>
          </View>
          <View className="bg-surface-container-low p-4 rounded-xl flex-1 border border-border-subtle">
            <Text className="text-[12px] text-on-surface-variant uppercase tracking-wider mb-1">Total Value</Text>
            <Text className="text-[24px] font-bold text-growth-green">Rs. {customer.spent.toLocaleString()}</Text>
          </View>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInDown.duration(400).delay(200).springify()} className="space-y-4 gap-4">
          <TouchableOpacity className="w-full py-4 bg-growth-green rounded-xl flex-row items-center justify-center gap-2 active:scale-95">
            <MaterialIcons name="chat" size={24} color="white" />
            <Text className="text-white font-bold text-[16px]">Message Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-full py-4 border-2 border-primary rounded-xl flex-row items-center justify-center gap-2 active:scale-95">
            <MaterialIcons name="history" size={24} color="#005147" />
            <Text className="text-primary font-bold text-[16px]">View Order History</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}
