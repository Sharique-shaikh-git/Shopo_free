import React, { useState, useEffect } from 'react';
import * as Clipboard from 'expo-clipboard';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Share,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { apiFetch } from '../../../../lib/api';

export default function ShareShopScreen() {
  const router = useRouter();
  const [storeName, setStoreName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    apiFetch('/stores')
      .then((stores: any[]) => {
        if (stores.length > 0) {
          const store = stores[0];
          setStoreName(store.name || 'My Shop');
          setStoreUrl(store.url || `https://shopo.pk/${(store.name || 'myshop').toLowerCase().replace(/\s+/g, '-')}`);
        }
      })
      .catch(() => {});
  }, []);

  const handleCopy = () => {
    Clipboard.setString(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Check out my online shop — ${storeName}! 🛍️\n${storeUrl}`);
    Linking.openURL(`whatsapp://send?text=${msg}`).catch(() =>
      Alert.alert('WhatsApp not installed', 'Please install WhatsApp.')
    );
  };

  const handleFacebook = () => {
    Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storeUrl)}`);
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `${storeName} - ${storeUrl}`, url: storeUrl });
    } catch {}
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full"
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[18px] font-bold text-on-surface mr-10">
          Share My Shop
        </Text>
      </View>

      <View className="flex-1 px-5 pt-4">
        {/* Shop Name Banner */}
        <Animated.View
          entering={FadeInDown.duration(600).springify()}
          className="items-center mb-8 mt-4"
        >
          <View className="w-20 h-20 rounded-2xl bg-primary-container items-center justify-center mb-4 shadow-sm">
            <MaterialIcons name="storefront" size={40} color="white" />
          </View>
          <Text className="text-[24px] font-bold text-growth-green">{storeName || 'My Shop'}</Text>
          <Text className="text-[14px] text-on-surface-variant mt-1">
            Share your shop with customers
          </Text>
        </Animated.View>

        {/* Store URL Box */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(100).springify()}
          className="bg-surface-bright border-2 border-primary-container/50 rounded-xl p-4 flex-row items-center justify-between mb-6"
        >
          <View className="flex-1 overflow-hidden mr-3">
            <Text className="text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
              Your Store Link
            </Text>
            <Text className="text-[15px] font-bold text-growth-green" numberOfLines={1}>
              {storeUrl || 'shopo.pk/yourshop'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleCopy}
            className={`w-12 h-12 items-center justify-center rounded-full ${copied ? 'bg-growth-green' : 'bg-surface-container-high'}`}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name={copied ? 'check' : 'content-copy'}
              size={22}
              color={copied ? 'white' : '#006B5E'}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Share Buttons Row */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(200).springify()}
          className="flex-row justify-around items-center py-4 mb-6 bg-surface-container-lowest rounded-xl border border-border-subtle"
        >
          {/* WhatsApp */}
          <TouchableOpacity onPress={handleWhatsApp} className="items-center gap-2" activeOpacity={0.8}>
            <View className="w-14 h-14 rounded-full bg-[#25D366] items-center justify-center shadow-sm">
              <MaterialIcons name="chat" size={28} color="white" />
            </View>
            <Text className="text-[11px] text-on-surface-variant font-medium">WhatsApp</Text>
          </TouchableOpacity>

          {/* Facebook */}
          <TouchableOpacity onPress={handleFacebook} className="items-center gap-2" activeOpacity={0.8}>
            <View className="w-14 h-14 rounded-full bg-[#1877F2] items-center justify-center shadow-sm">
              <MaterialIcons name="thumb-up" size={28} color="white" />
            </View>
            <Text className="text-[11px] text-on-surface-variant font-medium">Facebook</Text>
          </TouchableOpacity>

          {/* Instagram */}
          <TouchableOpacity
            onPress={() => Linking.openURL('https://instagram.com')}
            className="items-center gap-2"
            activeOpacity={0.8}
          >
            <View
              className="w-14 h-14 rounded-full items-center justify-center shadow-sm"
              style={{ backgroundColor: '#E1306C' }}
            >
              <MaterialIcons name="photo-camera" size={28} color="white" />
            </View>
            <Text className="text-[11px] text-on-surface-variant font-medium">Instagram</Text>
          </TouchableOpacity>

          {/* More */}
          <TouchableOpacity onPress={handleShare} className="items-center gap-2" activeOpacity={0.8}>
            <View className="w-14 h-14 rounded-full bg-surface-container-highest items-center justify-center shadow-sm">
              <MaterialIcons name="more-horiz" size={28} color="#1a1c1e" />
            </View>
            <Text className="text-[11px] text-on-surface-variant font-medium">More</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* QR Code Placeholder */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(300).springify()}
          className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 items-center gap-3"
        >
          <MaterialIcons name="qr-code-2" size={80} color="#006B5E" />
          <Text className="text-[14px] font-semibold text-on-surface text-center">
            QR Code
          </Text>
          <Text className="text-[12px] text-on-surface-variant text-center">
            Customers can scan this to open your shop
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            className="mt-2 px-6 py-3 border-2 border-growth-green rounded-xl"
          >
            <Text className="text-[14px] font-semibold text-growth-green">Download QR</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
