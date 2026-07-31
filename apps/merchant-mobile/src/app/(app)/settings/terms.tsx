import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SECTIONS = [
  {
    num: '1',
    title: 'Acceptance of Terms',
    content:
      'By accessing or using the Shop Builder application ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access the Service.\n\nWe reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. We will try to provide at least 30 days notice prior to any new terms taking effect.',
  },
  {
    num: '2',
    title: 'Merchant Responsibilities',
    content:
      'As a merchant utilizing our platform, you are solely responsible for:\n\n• The accuracy, quality, and legality of the products you list.\n• Fulfilling orders promptly and handling customer inquiries professionally.\n• Ensuring that your storefront content does not violate any intellectual property rights.\n• Maintaining the confidentiality of your account credentials.\n\nYou agree not to use the Service for any unlawful purpose or in any way that interrupts, damages, or impairs the Service.',
  },
  {
    num: '3',
    title: 'Payments & Fees',
    content:
      'Shop Builder provides digital tools to facilitate transactions. While setting up a basic storefront may be free, premium features or transaction processing may incur fees.\n\nAny applicable fees will be clearly communicated before you commit to a premium tier or specific transactional service. We do not hold funds directly unless utilizing an integrated payment gateway.\n\nYou are responsible for all taxes applicable to your sales.',
  },
  {
    num: '4',
    title: 'Privacy & Data Usage',
    content:
      'Your privacy is important to us. Our use of your data and your customers\' data is governed by our Privacy Policy.\n\nBy using the Service, you grant us the right to aggregate anonymized data to improve our platform, develop new features, and provide AI-driven insights (such as title or description enrichment) for your storefront.',
  },
  {
    num: '5',
    title: 'Termination',
    content:
      'We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.',
  },
];

export default function TermsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F9F9FC]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-[#F2F0F4] border-b border-[#E0E3DE]">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-center rounded-full">
          <Ionicons name="arrow-back" size={24} color="#75797E" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[20px] font-semibold text-[#1a1c1e]">Terms of Service</Text>
        <View className="w-12" />
      </View>

      <ScrollView className="flex-1 px-4 py-6 pb-8">
        {/* Header Section */}
        <View className="mb-6">
          <Text className="text-[12px] font-semibold text-[#79747E] mb-2">LAST UPDATED: OCTOBER 24, 2023</Text>
          <Text className="text-[28px] font-bold text-[#005147] mb-2">Merchant Agreement</Text>
          <Text className="text-[18px] text-[#75797E] leading-7">
            Please read these terms carefully before using the Shop Builder platform. These terms govern your use of our
            services to build and manage your digital storefront.
          </Text>
        </View>

        <View className="h-px bg-[#E0E3DE] mb-6" />

        {/* Sections */}
        <View className="gap-6">
          {SECTIONS.map((s, i) => (
            <View key={i}>
              <Text className="text-[20px] font-semibold text-[#1a1c1e] mb-3 flex-row items-center gap-2">
                <Text className="text-[#79747E] text-lg">{s.num}.</Text> {s.title}
              </Text>
              <View className="bg-white border border-[#E0E3DE] rounded-lg p-4 shadow-sm">
                <Text className="text-[16px] text-[#75797E] leading-6">{s.content}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer Icon */}
        <View className="items-center mt-10 opacity-50">
          <Ionicons name="shield-checkmark" size={48} color="#79747E" />
        </View>
      </ScrollView>
    </View>
  );
}
