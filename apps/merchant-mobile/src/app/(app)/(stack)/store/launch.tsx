import React, { useEffect } from 'react';
import * as Clipboard from 'expo-clipboard';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Share,
  Linking,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  ZoomIn,
} from 'react-native-reanimated';

export default function StoreLaunchScreen() {
  const router = useRouter();
  const { storeId, storeName, storeSlug } = useLocalSearchParams<{
    storeId?: string;
    storeName?: string;
    storeSlug?: string;
  }>();

  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const shopUrl = storeSlug
    ? `https://shopo.pk/${storeSlug}`
    : `https://shopo.pk/${(storeName || '').toLowerCase().replace(/\s+/g, '-')}`;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(shopUrl);
    Alert.alert('Copied!', 'Shop link copied to clipboard.');
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Check out my new online shop — ${storeName}! 🛍️\n${shopUrl}`
    );
    Linking.openURL(`whatsapp://send?text=${msg}`).catch(() =>
      Alert.alert('WhatsApp not installed', 'Please install WhatsApp to share.')
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my new online shop — ${storeName}! 🛍️\n${shopUrl}`,
        url: shopUrl,
      });
    } catch (err) {
      // ignore
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Close Button */}
      <View className="flex-row justify-end px-4 py-4">
        <TouchableOpacity
          onPress={() => router.replace('/')}
          className="w-12 h-12 items-center justify-center rounded-full"
          activeOpacity={0.7}
        >
          <MaterialIcons name="close" size={24} color="#3e4946" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center justify-center px-5 pb-48">
        {/* Animated success icon */}
        <Animated.View
          entering={ZoomIn.duration(600).springify()}
          className="mb-8"
        >
          <View className="w-32 h-32 rounded-full bg-[#e6f3f1] items-center justify-center border-2 border-primary-container/30">
            <MaterialIcons name="check-circle" size={64} color="#006B5E" />
          </View>
        </Animated.View>

        {/* Text */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(200).springify()}
          className="items-center mb-8"
        >
          <Text className="text-[28px] font-bold text-growth-green text-center mb-2">
            Your shop is live! 🎉
          </Text>
          <Text className="text-[16px] text-on-surface-variant text-center max-w-[280px] leading-6">
            Congratulations{storeName ? `, ${storeName}` : ''}! You can now start sharing your products with customers.
          </Text>
        </Animated.View>

        {/* URL Box */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(300).springify()}
          style={pulseStyle}
          className="w-full bg-surface-bright border-2 border-primary-container rounded-xl p-4 flex-row items-center justify-between mb-6"
        >
          <View className="flex-1 overflow-hidden mr-3">
            <Text className="text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
              Your Store Link
            </Text>
            <Text className="text-[16px] font-bold text-growth-green" numberOfLines={1}>
              {shopUrl}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleCopy}
            className="w-12 h-12 items-center justify-center bg-surface-container-high rounded-full"
            activeOpacity={0.8}
          >
            <MaterialIcons name="content-copy" size={22} color="#006B5E" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Bottom Actions */}
      <Animated.View
        entering={FadeIn.duration(500).delay(500)}
        className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-gradient-to-t from-surface via-surface to-transparent gap-3"
        style={{ paddingBottom: Platform.OS === 'ios' ? 40 : 32 }}
      >
        {/* Primary: Open Shop */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => Linking.openURL(shopUrl)}
          className="w-full h-14 bg-[#006B5E] rounded-xl flex-row items-center justify-center gap-2 shadow-sm"
        >
          <Text className="text-white font-semibold text-[15px]">Open My Shop</Text>
          <MaterialIcons name="open-in-new" size={18} color="white" />
        </TouchableOpacity>

        {/* Secondary: Share on WhatsApp */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleWhatsApp}
          className="w-full h-14 border-2 border-[#25D366] rounded-xl flex-row items-center justify-center gap-2"
        >
          <MaterialIcons name="chat" size={20} color="#25D366" />
          <Text className="text-[#25D366] font-semibold text-[15px]">Share on WhatsApp</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
