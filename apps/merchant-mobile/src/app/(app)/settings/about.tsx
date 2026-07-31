import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const VALUES = [
  {
    icon: 'shield-checkmark',
    color: '#005147',
    bg: '#CCE8E4',
    title: 'Reliability Built-in',
    desc: 'Systems you can trust to run your business, every single day without fail.',
  },
  {
    icon: 'finger-print',
    color: '#7B4F1E',
    bg: '#F5E6D0',
    title: 'Radical Simplicity',
    desc: 'Technology designed for humans. No complex manuals, just intuitive actions.',
  },
  {
    icon: 'trending-up',
    color: '#006B5E',
    bg: '#CCE8E4',
    title: 'Partner in Growth',
    desc: 'We succeed only when you succeed. Tools designed to scale your revenue.',
  },
];

export default function AboutUsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F9F9FC]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-[#F9F9FC]">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-start">
          <Ionicons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="text-[20px] font-semibold text-[#1a1c1e] ml-2">About Us</Text>
      </View>

      <ScrollView className="flex-1 px-4 pb-8">
        {/* Logo & Hero */}
        <View className="items-center py-8 gap-4">
          <View className="w-32 h-32 rounded-3xl bg-white border border-[#E0E3DE] shadow-sm items-center justify-center">
            <Ionicons name="storefront" size={48} color="#005147" />
          </View>
          <Text className="text-[28px] font-bold text-[#005147] text-center tracking-tight">
            Empowering Pakistani shopkeepers
          </Text>
          <Text className="text-[18px] text-[#75797E] text-center max-w-sm leading-7">
            We are building the digital bridge for traditional retail. Our mission is to transform everyday commerce with
            radical simplicity, giving power back to local merchants through accessible technology.
          </Text>
        </View>

        {/* Values Bento Grid */}
        <View className="gap-4 mb-8">
          {VALUES.map((v, i) => (
            <View key={i} className="bg-white border border-[#E0E3DE] p-4 rounded-xl flex-row items-start gap-3">
              <View className="w-12 h-12 rounded-lg items-center justify-center" style={{ backgroundColor: v.bg }}>
                <Ionicons name={v.icon as any} size={22} color={v.color} />
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-[14px] font-semibold text-[#1a1c1e]">{v.title}</Text>
                <Text className="text-[16px] text-[#75797E] leading-6">{v.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Social Links */}
        <View className="items-center border-t border-[#E0E3DE] pt-8">
          <Text className="text-[12px] text-[#79747E] uppercase tracking-wider mb-4">Connect with us</Text>
          <View className="flex-row gap-6">
            <TouchableOpacity className="w-12 h-12 rounded-full bg-[#E7E0EC] items-center justify-center">
              <Ionicons name="thumbs-up" size={22} color="#0B57A4" />
            </TouchableOpacity>
            <TouchableOpacity className="w-12 h-12 rounded-full bg-[#F9D0DE] items-center justify-center">
              <Ionicons name="camera" size={22} color="#A40E2C" />
            </TouchableOpacity>
            <TouchableOpacity className="w-12 h-12 rounded-full bg-[#E7E0EC] items-center justify-center">
              <Ionicons name="musical-note" size={22} color="#1a1c1e" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
