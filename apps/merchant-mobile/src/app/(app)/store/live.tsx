import { View, Text, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function StoreLiveScreen() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const shopUrl = 'myshop.ai/boutique';

  const handleCopy = async () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    await Share.share({
      message: `Check out my shop!\nhttps://${shopUrl}`,
    });
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-end px-4 py-4">
        <TouchableOpacity onPress={() => router.replace('/(app)/dashboard')} className="w-12 h-12 items-center justify-center rounded-full">
          <Ionicons name="close" size={24} color="#75797E" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pb-32">
        {/* Success Hero */}
        <Animated.View entering={FadeIn.duration(800)} className="items-center py-12">
          <View className="w-48 h-48 rounded-full items-center justify-center relative">
            {/* Decorative dots */}
            <View className="absolute -top-4 -left-4 w-6 h-6 bg-[#CCE8E4] rounded-full opacity-60" />
            <View className="absolute top-10 -right-8 w-4 h-4 bg-[#005147] rounded-full opacity-50" />
            <View className="absolute -bottom-6 left-10 w-8 h-8 bg-[#0B57A4] rounded-full opacity-40" />
            <View className="w-32 h-32 bg-[#005147] rounded-full items-center justify-center shadow-lg">
              <Ionicons name="checkmark-circle" size={64} color="white" />
            </View>
          </View>
        </Animated.View>

        {/* Text Content */}
        <Animated.View entering={FadeIn.duration(600).delay(100)} className="items-center mb-8">
          <Text className="text-[28px] font-bold text-[#005147] text-center mb-2">Your shop is live!</Text>
          <Text className="text-[16px] text-[#75797E] text-center">
            Congratulations! You can now start sharing your products with customers.
          </Text>
        </Animated.View>

        {/* URL Box */}
        <Animated.View entering={FadeIn.duration(600).delay(200)} className="mb-8">
          <TouchableOpacity
            onPress={handleCopy}
            className="bg-white border-2 border-[#CCE8E4] rounded-xl p-4 flex-row items-center justify-between"
          >
            <View className="flex-1">
              <Text className="text-[12px] text-[#75797E] mb-1">Your Store Link</Text>
              <Text className="text-[18px] font-bold text-[#005147]">{shopUrl}</Text>
            </View>
            <View className="w-12 h-12 bg-[#F2F0F4] rounded-full items-center justify-center">
              <Ionicons name={copied ? 'checkmark' : 'copy'} size={22} color="#005147" />
            </View>
          </TouchableOpacity>
          {copied && (
            <View className="flex-row items-center justify-center mt-2 gap-1">
              <Ionicons name="checkmark" size={14} color="#0B57A4" />
              <Text className="text-[12px] text-[#0B57A4]">Link copied to clipboard!</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="absolute bottom-0 left-0 right-0 px-5 py-4 pb-8 gap-3 bg-gradient-to-t from-white via-white to-transparent">
        <TouchableOpacity
          onPress={() => router.replace('/(app)/dashboard')}
          className="w-full h-[56px] bg-[#005147] rounded-xl items-center justify-center flex-row gap-2"
        >
          <Text className="text-[14px] font-semibold text-white">Open My Shop</Text>
          <Ionicons name="open-outline" size={18} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleShare}
          className="w-full h-[56px] border-2 border-[#25D366] rounded-xl items-center justify-center flex-row gap-2"
        >
          <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
          <Text className="text-[14px] font-semibold text-[#25D366]">Share on WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
