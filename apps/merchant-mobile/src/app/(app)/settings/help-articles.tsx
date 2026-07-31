import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ARTICLES: Record<string, { title: string; items: { icon: string; title: string }[] }> = {
  'Getting Started': {
    title: 'Getting Started',
    items: [
      { icon: 'rocket', title: 'How to set up your store' },
      { icon: 'person-add', title: 'Creating your account' },
      { icon: 'storefront', title: 'Customizing your shop' },
    ],
  },
  Products: {
    title: 'Managing Products',
    items: [
      { icon: 'add-circle', title: 'How to add a product' },
      { icon: 'create', title: 'How to edit a product' },
      { icon: 'trash', title: 'How to delete a product' },
      { icon: 'cube', title: 'How to manage inventory' },
    ],
  },
  Orders: {
    title: 'Managing Orders',
    items: [
      { icon: 'list', title: 'Viewing your orders' },
      { icon: 'checkmark-circle', title: 'Fulfilling an order' },
      { icon: 'time', title: 'Order status explained' },
    ],
  },
  Payments: {
    title: 'Payments',
    items: [
      { icon: 'wallet', title: 'Setting up JazzCash' },
      { icon: 'card', title: 'Setting up EasyPaisa' },
      { icon: 'cash', title: 'Cash on Delivery' },
    ],
  },
  Account: {
    title: 'Account',
    items: [
      { icon: 'person', title: 'Editing your profile' },
      { icon: 'lock', title: 'Changing your password' },
      { icon: 'notifications', title: 'Managing notifications' },
    ],
  },
  Troubleshooting: {
    title: 'Troubleshooting',
    items: [
      { icon: 'bug', title: 'Reporting a problem' },
      { icon: 'refresh', title: 'App not loading' },
      { icon: 'wifi', title: 'Connection issues' },
    ],
  },
};

export default function HelpArticlesScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const cat = ARTICLES[(category as string) || 'Products'] || ARTICLES['Products'];

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-[#F2F0F4]">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-center rounded-full">
          <Ionicons name="arrow-back" size={24} color="#005147" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[20px] font-bold text-[#005147]">{cat.title}</Text>
        <View className="w-12" />
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        <Text className="text-[16px] text-[#75797E] mb-4">
          Learn how to effectively manage your inventory, update details, and keep your shop running smoothly.
        </Text>

        <View className="gap-3">
          {cat.items.map((article, i) => (
            <TouchableOpacity
              key={i}
              className="flex-row items-center justify-between p-4 bg-[#F2F0F4] rounded-lg border border-[#E0E3DE]"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
                  <Ionicons name={article.icon as any} size={20} color="#005147" />
                </View>
                <Text className="text-[14px] font-semibold text-[#1a1c1e]">{article.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#79747E" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Still Need Help */}
        <View className="mt-6 p-4 rounded-xl bg-[#F2F0F4] border border-[#E0E3DE] items-start gap-3">
          <Text className="text-[14px] font-bold text-[#1a1c1e]">Still need help?</Text>
          <Text className="text-[16px] text-[#75797E]">Our support team is ready to assist you on WhatsApp.</Text>
          <TouchableOpacity className="mt-2 w-full h-12 border-2 border-[#25D366] rounded-full items-center justify-center flex-row gap-2">
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            <Text className="text-[14px] font-semibold text-[#25D366]">Chat with Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
