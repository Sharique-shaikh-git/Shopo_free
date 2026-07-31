import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const POPULAR_ARTICLES = [
  'How to add your first product',
  'Setting up EasyPaisa payments',
  'Fulfilling an order',
  'Sharing your store link on WhatsApp',
];

const CATEGORIES = [
  { name: 'Getting Started', icon: 'rocket', color: '#005147', bg: '#CCE8E4' },
  { name: 'Products', icon: 'cube', color: '#7B4F1E', bg: '#F5E6D0' },
  { name: 'Orders', icon: 'document-text', color: '#006B5E', bg: '#CCE8E4' },
  { name: 'Payments', icon: 'cash', color: '#A40E2C', bg: '#F9D0DE' },
  { name: 'Account', icon: 'person', color: '#49454F', bg: '#E7E0EC' },
  { name: 'Troubleshooting', icon: 'build', color: '#005147', bg: '#CCE8E4' },
];

export default function HelpCenterScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  return (
    <ScrollView className="flex-1 bg-[#F9F9FC]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-[#F9F9FC]">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-center">
          <Ionicons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[20px] font-semibold text-[#1a1c1e]">Help Center</Text>
        <View className="w-12" />
      </View>

      <View className="px-4 pb-8">
        {/* Search */}
        <View className="flex-row items-center bg-white border border-[#E0E3DE] rounded-lg h-14 px-4 mb-6">
          <Ionicons name="search" size={20} color="#75797E" style={{ marginRight: 12 }} />
          <TextInput
            className="flex-1 text-[16px] text-[#1a1c1e]"
            placeholder="Search for help..."
            placeholderTextColor="#75797E"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Popular Articles */}
        <Text className="text-[12px] font-semibold text-[#75797E] uppercase tracking-wider mb-3 px-1">
          Popular Articles
        </Text>
        <View className="bg-white border border-[#E0E3DE] rounded-xl mb-6">
          {POPULAR_ARTICLES.map((article, i) => (
            <TouchableOpacity
              key={i}
              className={`flex-row items-center justify-between p-4 ${i < POPULAR_ARTICLES.length - 1 ? 'border-b border-[#E0E3DE]' : ''}`}
            >
              <Text className="text-[16px] text-[#1a1c1e]">{article}</Text>
              <Ionicons name="chevron-forward" size={20} color="#75797E" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Categories Grid */}
        <Text className="text-[12px] font-semibold text-[#75797E] uppercase tracking-wider mb-3 px-1">
          Categories
        </Text>
        <View className="flex-row flex-wrap gap-3 mb-6">
          {CATEGORIES.map((cat, i) => (
            <TouchableOpacity
              key={i}
              className="bg-white border border-[#E0E3DE] rounded-xl p-4 w-[47%]"
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: cat.bg }}
              >
                <Ionicons name={cat.icon as any} size={22} color={cat.color} />
              </View>
              <Text className="text-[14px] font-semibold text-[#1a1c1e]">{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Need More Help */}
        <View className="bg-[#F2F0F4] border border-[#E0E3DE] rounded-xl p-6 items-center">
          <Text className="text-[20px] font-semibold text-[#1a1c1e] mb-2">Need more help?</Text>
          <Text className="text-[16px] text-[#75797E] text-center mb-4">
            Our support team is available from 9 AM to 6 PM to assist you directly.
          </Text>
          <TouchableOpacity className="w-full h-14 border-2 border-[#25D366] rounded-lg items-center justify-center flex-row gap-2 bg-white">
            <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
            <Text className="text-[14px] font-semibold text-[#25D366]">Chat on WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
