import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const CUSTOMER_ORDERS = [
  { id: 'ORD-001', date: 'Jul 28, 2026', amount: 4500, status: 'Delivered' },
  { id: 'ORD-005', date: 'Jul 20, 2026', amount: 2800, status: 'Delivered' },
  { id: 'ORD-012', date: 'Jul 15, 2026', amount: 7300, status: 'Cancelled' },
];

export default function CustomerProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-[#E0E3DE]">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-center">
          <Ionicons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[20px] font-semibold text-[#1a1c1e]">Customer Profile</Text>
        <TouchableOpacity className="w-12 h-12 items-center justify-center">
          <Ionicons name="ellipsis-vertical" size={20} color="#75797E" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-6 pb-32">
        {/* Customer Info */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-[#CCE8E4] items-center justify-center mb-4">
            <Text className="text-[28px] font-bold text-[#005147]">AH</Text>
          </View>
          <Text className="text-[24px] font-bold text-[#1a1c1e]">Ahmed Hassan</Text>
          <Text className="text-[16px] text-[#75797E]">Karachi, Sindh</Text>
          <View className="flex-row gap-4 mt-4">
            <TouchableOpacity className="flex-row items-center gap-2 bg-[#25D366] px-4 py-2 rounded-full">
              <Ionicons name="logo-whatsapp" size={16} color="white" />
              <Text className="text-[14px] font-semibold text-white">WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center gap-2 border border-[#E0E3DE] px-4 py-2 rounded-full">
              <Ionicons name="call" size={16} color="#1a1c1e" />
              <Text className="text-[14px] font-semibold text-[#1a1c1e]">Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3 mb-6">
          {[
            { label: 'Total Orders', value: '3', color: '#005147' },
            { label: 'Total Spent', value: 'Rs 14,600', color: '#0B57A4' },
            { label: 'Last Order', value: '3 days ago', color: '#7B4F1E' },
          ].map((stat, i) => (
            <View key={i} className="flex-1 bg-[#F2F0F4] rounded-xl p-3 items-center">
              <Text className="text-[18px] font-bold" style={{ color: stat.color }}>{stat.value}</Text>
              <Text className="text-[10px] text-[#75797E] mt-1">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Order History */}
        <Text className="text-[12px] font-semibold text-[#75797E] uppercase tracking-wider mb-3 px-1">Order History</Text>
        <View className="bg-white border border-[#E0E3DE] rounded-xl overflow-hidden shadow-sm">
          {CUSTOMER_ORDERS.map((order, i) => (
            <TouchableOpacity
              key={order.id}
              onPress={() => router.push(`/(app)/orders/${order.id}`)}
              className={`flex-row items-center justify-between p-4 ${i < CUSTOMER_ORDERS.length - 1 ? 'border-b border-[#E0E3DE]' : ''}`}
            >
              <View>
                <Text className="text-[16px] font-semibold text-[#1a1c1e]">{order.id}</Text>
                <Text className="text-[12px] text-[#75797E] mt-1">{order.date}</Text>
              </View>
              <View className="items-end">
                <Text className="text-[16px] font-semibold text-[#1a1c1e]">Rs {order.amount.toLocaleString()}</Text>
                <Text className={`text-[12px] mt-1 ${order.status === 'Delivered' ? 'text-[#005147]' : 'text-[#BA1A1A]'}`}>
                  {order.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <Text className="text-[12px] font-semibold text-[#75797E] uppercase tracking-wider mb-3 mt-6 px-1">Customer Notes</Text>
        <View className="bg-white border border-[#E0E3DE] rounded-xl p-4 shadow-sm">
          <Text className="text-[16px] text-[#75797E]">No notes added yet.</Text>
        </View>
      </ScrollView>
    </View>
  );
}
