import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SECTIONS = [
  {
    icon: 'document-text',
    title: 'What We Collect',
    content:
      'We collect information to provide better services to all our users. We collect information in the following ways:\n\n• Information you give us. For example, many of our services require you to sign up for an Account. When you do, we\'ll ask for personal information, like your name, email address, telephone number.\n\n• Information we get from your use of our services. We collect information about the services that you use and how you use them.',
  },
  {
    icon: 'analytics',
    title: 'How We Use It',
    content:
      'We use the information we collect from all of our services to provide, maintain, protect and improve them, to develop new ones, and to protect our users.\n\nWhen you contact us, we keep a record of your communication to help solve any issues you might be facing. We may use your email address to inform you about our services, such as letting you know about upcoming changes or improvements.',
  },
  {
    icon: 'shield-checkmark',
    title: 'Data Security',
    content:
      'We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold.\n\n• We encrypt many of our services using SSL.\n• We review our information collection, storage and processing practices, including physical security measures.\n• We restrict access to personal information to employees, contractors and agents who need to know that information.',
  },
];

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F9F9FC]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-[#F2F0F4]">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-center rounded-full">
          <Ionicons name="arrow-back" size={24} color="#005147" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[20px] font-bold text-[#005147]">Privacy Policy</Text>
        <View className="w-12" />
      </View>

      <ScrollView className="flex-1 px-4 py-6 pb-8">
        {/* Last Updated */}
        <Text className="text-[16px] text-[#75797E] mb-6">Last updated: October 24, 2023</Text>

        {/* Sections */}
        <View className="gap-4">
          {SECTIONS.map((s, i) => (
            <View key={i} className="bg-white border border-[#E0E3DE] rounded-lg p-4">
              <Text className="text-[20px] font-semibold text-[#005147] mb-3 flex-row items-center gap-2">
                <Ionicons name={s.icon as any} size={20} color="#0B57A4" /> {s.title}
              </Text>
              <Text className="text-[16px] text-[#1a1c1e] leading-6">{s.content}</Text>
            </View>
          ))}
        </View>

        {/* Need Help */}
        <View className="flex-row items-center justify-between bg-white border border-[#E0E3DE] rounded-lg p-4 mt-6">
          <View>
            <Text className="text-[14px] font-semibold text-[#1a1c1e]">Need Help?</Text>
            <Text className="text-[16px] text-[#75797E] text-sm">Contact our support team</Text>
          </View>
          <TouchableOpacity className="w-14 h-14 bg-[#F2F0F4] rounded-full items-center justify-center border border-[#E0E3DE]">
            <Ionicons name="person" size={22} color="#005147" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
