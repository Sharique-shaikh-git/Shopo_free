import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, TextInput, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

export default function CustomerListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const mockCustomers = [
    {
      id: 'c1',
      name: 'Ahmed Khan',
      phone: '+92 300 1234567',
      orders: 24,
      spent: 45200,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3EnMrqrk0Eu6yWtd-YRR9ZQOMbBoWqISUE85p13NF6fC1jkHBSo-nC2ygvApTNGI40PKONdVcpeI1UpYUUDPXwQnI88hsL3eFmsoNaz6ALqrpFAG4kYoBnmD_rV1kMQubQEnu4J48pAyCBc55gooAqJtqu-TvsfrcD5r_PBZXpL1JWxjmUY6ogd-wVq9MFBLlpfPtSvMoYUQLoXGCnNrlrWz8EMAgbGwW0PPV1xx7_6V7PpOZFjgVizl-klSooGvKioB5hg9Pvv8'
    },
    {
      id: 'c2',
      name: 'Zainab Bibi',
      phone: '+92 321 9876543',
      orders: 8,
      spent: 12800,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7a5OnxrKe47namji6xe6iMJXCx-CisBxjExJMsKDYArHHshzBwdRzge19NHgMQoYrq2kDS9TZAEX1bqc00DFhFeIvPOsMtBW19J0p9dhAqVfh_V4Mcp6Lh2KLEqaSkdf3ER4r1MFbQVot19EvCoVA6WIZ2kl48X0oPx8Lfb4MKyQ3bVGo5tiBFT6M0dYhLQuJhyEk6P0PVDOJdlmrf_Cc8K4fAyhtG0irTOl0GJzys_alSdaWrSUU3ESKFPe3XZLsY9QLT6IVWyE'
    },
    {
      id: 'c3',
      name: 'Omar Qureshi',
      phone: '+92 345 5544332',
      orders: 15,
      spent: 28450,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjK7dFpy7ECWvnnw02d8blmKppDIxHO_UUiiBAuebPpaxeRLRrK2WYz2Nbh1u9orT1XmfRfLf8fv7fB9ntk-ptpDWP7uNdciUOchqHGJUdPoS04obfQXLmhug70QV8yj7DU_oNTur-5N7uBd-fqm2Mm_SYrqYYqD_h8-Xwp-qsI3O3e5iVEoaX4zTDcy-P26A3PL6m7N7twmBgE6eNi13bqPR2gV0frpp29D2Mv47CuHgGR6bxeABXbr-dGSz98VJwEQ-nwt2LCSI'
    },
    {
      id: 'c4',
      name: 'Fatima Shah',
      phone: '+92 333 7778889',
      orders: 42,
      spent: 92100,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD8u2ljA1nf6ui5oGvk4nj5QEwTEOudrkAz002nq89y-XL0CpkBvRLy7mfrIyt4rYjSeBgFli4aIdPo3FgtgbsD11HhmrxAm5UvTDaS05WasejuB9yuLvHSEM-qsZ7mOMDDixNRQuEog7c64HHN3zDB4YHnZFKixSXXUMzmnFtvQ5EOzb7J0C_TLeLu-xq3zZus6vpZmpP7F9MVeIBuluv3J-LpPXAzPyXIXOjGYkln9F3JGmzySG1RNWzmeNWcbYJ5sUdRjEr6jc'
    }
  ];

  const filteredCustomers = mockCustomers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  return (
    <SafeAreaView className="flex-1 bg-surface font-body-md">
      {/* TopAppBar */}
      <View className="flex-row items-center bg-surface p-4 border-b border-border-subtle z-10 justify-between">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-center -ml-2 rounded-full active:scale-95">
          <MaterialIcons name="arrow-back" size={24} color="#3e4946" />
        </TouchableOpacity>
        <Text className="text-on-background text-[24px] font-bold text-center">Customers</Text>
        <View className="w-12 h-12" />
      </View>

      <ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* Header & Search */}
        <Animated.View entering={FadeInDown.duration(400).springify()} className="mb-6">
          <Text className="text-[28px] font-bold text-on-surface mb-2">Customers</Text>
          <Text className="text-[16px] text-[#3e4946] mb-6">Manage and track your customer base and their lifetime value.</Text>
          
          <View className="flex-row items-center gap-3">
            <View className="relative flex-1">
              <MaterialIcons name="search" size={24} color="#6e7976" className="absolute left-4 top-4 z-10" />
              <TextInput 
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search customer name or phone..."
                className="w-full pl-12 pr-4 h-[56px] bg-surface-container-lowest border-2 border-border-subtle rounded-xl font-body-md text-[16px] text-on-surface"
                placeholderTextColor="#6e7976"
              />
            </View>
            <TouchableOpacity className="h-[56px] w-[56px] bg-surface-container-low border border-border-subtle rounded-xl flex items-center justify-center active:scale-95">
              <MaterialIcons name="filter-list" size={24} color="#3e4946" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Stats Overview */}
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="flex-row gap-4 mb-6">
          <View className="bg-surface-container-lowest border border-border-subtle p-4 rounded-xl flex-1">
            <View className="flex-row items-center gap-3 mb-2">
              <View className="w-10 h-10 rounded-full bg-[#5dfd8a] flex items-center justify-center">
                <MaterialIcons name="group" size={20} color="#007232" />
              </View>
              <Text className="font-semibold text-[14px] text-[#3e4946]">Total</Text>
            </View>
            <Text className="text-[24px] font-bold text-on-surface">1,284</Text>
          </View>
          
          <View className="bg-surface-container-lowest border border-border-subtle p-4 rounded-xl flex-1">
            <View className="flex-row items-center gap-3 mb-2">
              <View className="w-10 h-10 rounded-full bg-[#dae2ff] flex items-center justify-center">
                <MaterialIcons name="payments" size={20} color="#001848" />
              </View>
              <Text className="font-semibold text-[14px] text-[#3e4946]">Avg. Spent</Text>
            </View>
            <Text className="text-[24px] font-bold text-on-surface">Rs. 4,520</Text>
          </View>
        </Animated.View>

        {/* Customer List */}
        <Animated.View entering={FadeInDown.duration(400).delay(200).springify()} className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden mb-8">
          {filteredCustomers.map((customer, index) => (
            <TouchableOpacity 
              key={customer.id} 
              activeOpacity={0.7}
              onPress={() => router.push(`/(app)/customers/${customer.id}` as any)}
              className={`p-5 flex-col ${index !== filteredCustomers.length - 1 ? 'border-b border-border-subtle' : ''}`}
            >
              <View className="flex-row items-center gap-4 mb-4">
                <View className="w-12 h-12 rounded-full overflow-hidden bg-surface-container shrink-0">
                  <Image source={{ uri: customer.avatar }} className="w-full h-full" resizeMode="cover" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-[18px] text-on-surface">{customer.name}</Text>
                  <Text className="text-[12px] text-[#3e4946] mt-0.5">{customer.phone}</Text>
                </View>
              </View>
              
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-[12px] text-[#3e4946] uppercase tracking-wider">Orders</Text>
                  <Text className="font-semibold text-[16px] text-on-surface mt-0.5">{customer.orders}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-[12px] text-[#3e4946] uppercase tracking-wider">Total Spent</Text>
                  <Text className="font-semibold text-[16px] text-growth-green mt-0.5">Rs. {customer.spent.toLocaleString()}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          
          {filteredCustomers.length === 0 && (
            <View className="p-8 items-center">
              <Text className="text-[16px] text-[#3e4946]">No customers found.</Text>
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(300).springify()} className="pb-8">
          <TouchableOpacity className="w-full h-14 rounded-xl border-2 border-primary flex-row items-center justify-center gap-2 active:scale-95">
            <Text className="text-primary font-bold text-[16px]">View More Customers</Text>
            <MaterialIcons name="expand-more" size={24} color="#005147" />
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>

      {/* FAB */}
      <Animated.View entering={FadeIn.duration(300).delay(500)} className="absolute bottom-6 right-6 z-40" style={{ paddingBottom: Platform.OS === 'ios' ? 24 : 0 }}>
        <TouchableOpacity className="w-14 h-14 bg-growth-green rounded-full shadow-lg items-center justify-center active:scale-90">
          <MaterialIcons name="person-add" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

    </SafeAreaView>
  );
}
