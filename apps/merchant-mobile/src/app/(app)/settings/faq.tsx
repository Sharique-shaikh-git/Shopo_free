import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const FAQ_DATA = [
  {
    q: 'What is Digital Dukaan?',
    a: 'Digital Dukaan is your helpful partner in transitioning from traditional physical trade to a digital-first economy. It provides you with radical simplicity to manage your inventory, orders, and storefront from your mobile device.',
  },
  {
    q: 'How much does it cost?',
    a: 'Setting up your basic storefront is completely free. We charge a minimal transaction fee only when you make a successful sale, ensuring we only grow when you grow.',
  },
  {
    q: 'How do I add products?',
    a: "Simply navigate to your Dashboard and tap the large 'Upload' button at the bottom. You can take a photo directly from your camera, add a title, price, and our AI will help you write a description.",
  },
  {
    q: 'How do I receive payments?',
    a: 'You can enable JazzCash, EasyPaisa, or Cash on Delivery from Settings > Payment Methods. Customers will see your enabled options at checkout.',
  },
  {
    q: 'Can I customize my store?',
    a: 'Yes! You can add a store name, description, and logo during the store creation process. More customization options are coming soon.',
  },
];

export default function FAQScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFAQ = FAQ_DATA.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-[#F9F9FC]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-[#F9F9FC]">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-start">
          <Ionicons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[20px] font-semibold text-[#1a1c1e]">FAQ</Text>
        <View className="w-12" />
      </View>

      <ScrollView className="flex-1 px-4 pb-8">
        {/* Search */}
        <View className="flex-row items-center bg-white rounded-xl px-4 h-14 border border-[#E0E3DE] shadow-sm mb-6">
          <Ionicons name="search" size={20} color="#75797E" style={{ marginRight: 12 }} />
          <TextInput
            className="flex-1 text-[16px] text-[#1a1c1e]"
            placeholder="Search for answers..."
            placeholderTextColor="#75797E"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Section Title */}
        <Text className="text-[12px] font-semibold text-[#75797E] uppercase tracking-wider mb-4">
          Frequently Asked Questions
        </Text>

        {/* Accordion */}
        <View>
          {filteredFAQ.map((faq, i) => (
            <View key={i} className="border-b border-[#E0E3DE]">
              <TouchableOpacity
                className="flex-row items-center justify-between py-5"
                onPress={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <Text className="flex-1 text-[18px] font-medium text-[#1a1c1e] pr-4">{faq.q}</Text>
                <Ionicons
                  name="chevron-down"
                  size={22}
                  color="#75797E"
                  style={{ transform: [{ rotate: openIndex === i ? '180deg' : '0deg' }] }}
                />
              </TouchableOpacity>
              {openIndex === i && (
                <View className="pb-5 pr-8">
                  <Text className="text-[16px] text-[#75797E] leading-6">{faq.a}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Contact Support Card */}
        <View className="mt-6 bg-white rounded-xl p-4 border border-[#E0E3DE] flex-row items-center justify-between shadow-sm">
          <View className="flex-1">
            <Text className="text-[14px] font-semibold text-[#1a1c1e] mb-1">Still need help?</Text>
            <Text className="text-[12px] text-[#75797E]">Chat with our support team.</Text>
          </View>
          <TouchableOpacity className="h-12 px-4 rounded-lg border-2 border-[#25D366] items-center justify-center flex-row gap-2">
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            <Text className="text-[14px] font-semibold text-[#25D366]">WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
