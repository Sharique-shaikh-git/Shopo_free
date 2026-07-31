import { View, Text, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import Animated, { FadeIn, FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export default function StoreLaunchScreen() {
  const router = useRouter();
  const scaleAnim = useSharedValue(1);

  useEffect(() => {
    scaleAnim.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const shopUrl = 'ali.digitaldukaan.pk';

  const handleShare = async () => {
    await Share.share({
      message: `Check out my shop on Digital Dukaan!\nhttps://${shopUrl}`,
    });
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white">
        <TouchableOpacity onPress={() => router.replace('/(app)/dashboard')} className="w-10 h-10 items-center justify-center rounded-full">
          <Ionicons name="close" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[20px] font-semibold text-[#1a1c1e]">Store Launched!</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-5 pb-24">
        {/* Celebration Hero */}
        <Animated.View entering={FadeIn.duration(800)} className="items-center py-12">
          <Animated.View style={animatedStyle} className="w-28 h-28 bg-[#CCE8E4] rounded-full items-center justify-center mb-6">
            <Ionicons name="storefront" size={64} color="#005147" />
          </Animated.View>
          <Text className="text-[28px] font-bold text-[#1a1c1e] text-center mb-2">Your Store is Live!</Text>
          <Text className="text-[16px] text-[#75797E] text-center max-w-[280px]">
            Congratulations! Your digital storefront is now accessible to customers.
          </Text>
        </Animated.View>

        {/* Store URL Card */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)} className="bg-white border border-[#E0E3DE] rounded-xl p-5 mb-6 shadow-sm">
          <Text className="text-[12px] font-semibold text-[#75797E] uppercase tracking-wider mb-3">Your Shop URL</Text>
          <View className="flex-row items-center gap-3 mb-4">
            <View className="w-12 h-12 rounded-full bg-[#CCE8E4] items-center justify-center">
              <Ionicons name="globe" size={22} color="#005147" />
            </View>
            <View className="flex-1">
              <Text className="text-[18px] font-bold text-[#005147]">{shopUrl}</Text>
              <Text className="text-[12px] text-[#75797E]">Share this with your customers</Text>
            </View>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleShare}
              className="flex-1 h-12 bg-[#005147] rounded-lg items-center justify-center flex-row gap-2"
            >
              <Ionicons name="share" size={18} color="white" />
              <Text className="text-[14px] font-semibold text-white">Share Link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(app)/store/share')}
              className="flex-1 h-12 border border-[#E0E3DE] rounded-lg items-center justify-center flex-row gap-2"
            >
              <Ionicons name="qr-code" size={18} color="#1a1c1e" />
              <Text className="text-[14px] font-semibold text-[#1a1c1e]">QR Code</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Next Steps */}
        <Animated.View entering={FadeInDown.duration(600).delay(500)} className="gap-3">
          <Text className="text-[12px] font-semibold text-[#75797E] uppercase tracking-wider mb-1 px-1">Next Steps</Text>
          {[
            { icon: 'camera', label: 'Add your first product', color: '#005147' },
            { icon: 'share-social', label: 'Share on WhatsApp', color: '#25D366' },
            { icon: 'bar-chart', label: 'View analytics', color: '#0B57A4' },
          ].map((step, i) => (
            <TouchableOpacity key={i} className="flex-row items-center gap-4 p-4 bg-[#F2F0F4] rounded-xl border border-[#E0E3DE]">
              <View className="w-12 h-12 rounded-full bg-white items-center justify-center">
                <Ionicons name={step.icon as any} size={22} color={step.color} />
              </View>
              <Text className="flex-1 text-[16px] font-semibold text-[#1a1c1e]">{step.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#75797E" />
            </TouchableOpacity>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E0E3DE] px-5 py-4 pb-8">
        <TouchableOpacity
          onPress={() => router.replace('/(app)/dashboard')}
          className="w-full h-[56px] bg-[#005147] rounded-xl items-center justify-center"
        >
          <Text className="text-[14px] font-semibold text-white">Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
