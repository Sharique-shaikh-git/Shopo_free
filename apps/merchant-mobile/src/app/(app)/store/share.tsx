import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Share, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import QRCode from 'react-native-qrcode-svg';
import { apiFetch } from '../../../lib/api';

export default function ShareShopScreen() {
  const router = useRouter();
  const [storeName, setStoreName] = useState('My Shop');
  const [storeSlug, setStoreSlug] = useState('my-shop');
  const [productCount, setProductCount] = useState(0);
  const [rating] = useState(4.9);

  useEffect(() => {
    async function loadStore() {
      try {
        const stores = await apiFetch('/stores');
        if (Array.isArray(stores) && stores.length > 0) {
          setStoreName(stores[0].name || 'My Shop');
          setStoreSlug(stores[0].slug || 'my-shop');
        }
        const products = await apiFetch('/products');
        setProductCount(Array.isArray(products) ? products.length : 0);
      } catch (err) {
        // Use defaults
      }
    }
    loadStore();
  }, []);

  const shopUrl = `${storeSlug}.digitaldukaan.pk`;

  const handleCopyLink = () => {
    Share.share({ message: `https://${shopUrl}` });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${storeName} on Shop Builder!\nhttps://${shopUrl}`,
      });
    } catch (err) {
      // User cancelled
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-surface z-40">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-12 h-12 items-center justify-center rounded-full"
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-[24px] font-bold text-growth-green">Share Shop</Text>
        </View>
        <View className="w-12" />
      </View>

      <View className="flex-1 px-5 py-4 gap-6">
        {/* Shop Preview Card */}
        <Animated.View 
          entering={FadeInDown.duration(600).springify()}
          className="bg-surface-container-lowest border border-border-subtle rounded-xl p-4 flex-row items-center gap-4"
        >
          <View className="w-16 h-16 rounded-full bg-surface-container items-center justify-center overflow-hidden">
            <MaterialIcons name="storefront" size={32} color="#006B5E" />
          </View>
          <View className="flex-1">
            <Text className="text-[24px] font-bold text-on-surface">{storeName}</Text>
            <View className="flex-row items-center gap-2 mt-1">
              <MaterialIcons name="inventory-2" size={18} color="#3e4946" />
              <Text className="text-[16px] text-on-surface-variant">{productCount} Products</Text>
              <Text className="text-outline mx-1">•</Text>
              <MaterialIcons name="star" size={18} color="#F59E0B" />
              <Text className="text-[16px] text-on-surface-variant">{rating} Rating</Text>
            </View>
          </View>
        </Animated.View>

        {/* Shop Link Box */}
        <Animated.View 
          entering={FadeInDown.duration(600).delay(100).springify()}
          className="gap-2"
        >
          <Text className="text-[14px] font-semibold text-on-surface-variant">Your Shop Link</Text>
          <View className="flex-row items-center bg-surface-container-lowest border border-border-subtle rounded-lg p-2">
            <Text className="flex-1 text-[18px] text-on-surface px-2" numberOfLines={1}>
              {shopUrl}
            </Text>
            <TouchableOpacity 
              onPress={handleCopyLink}
              className="w-12 h-12 bg-growth-green rounded-lg items-center justify-center"
              activeOpacity={0.8}
            >
              <MaterialIcons name="content-copy" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Share Buttons Row */}
        <Animated.View 
          entering={FadeInDown.duration(600).delay(200).springify()}
          className="flex-row justify-around items-center py-4"
        >
          {/* WhatsApp */}
          <TouchableOpacity className="items-center gap-2" activeOpacity={0.8}>
            <View className="w-14 h-14 rounded-full bg-whatsapp-green items-center justify-center">
              <MaterialIcons name="chat" size={28} color="white" />
            </View>
            <Text className="text-[12px] text-on-surface-variant">WhatsApp</Text>
          </TouchableOpacity>

          {/* Facebook */}
          <TouchableOpacity className="items-center gap-2" activeOpacity={0.8}>
            <View className="w-14 h-14 rounded-full bg-[#1877F2] items-center justify-center">
              <MaterialIcons name="thumb-up" size={28} color="white" />
            </View>
            <Text className="text-[12px] text-on-surface-variant">Facebook</Text>
          </TouchableOpacity>

          {/* Instagram */}
          <TouchableOpacity className="items-center gap-2" activeOpacity={0.8}>
            <View className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] items-center justify-center">
              <MaterialIcons name="photo-camera" size={28} color="white" />
            </View>
            <Text className="text-[12px] text-on-surface-variant">Instagram</Text>
          </TouchableOpacity>

          {/* More */}
          <TouchableOpacity className="items-center gap-2" activeOpacity={0.8}>
            <View className="w-14 h-14 rounded-full bg-surface-container-highest items-center justify-center">
              <MaterialIcons name="more-horiz" size={28} color="#1a1c1e" />
            </View>
            <Text className="text-[12px] text-on-surface-variant">More</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* QR Code Section */}
        <Animated.View 
          entering={FadeInDown.duration(600).delay(300).springify()}
          className="flex-col items-center bg-surface-container-lowest border border-border-subtle rounded-xl p-8 gap-4"
        >
          <View className="w-48 h-48 bg-white border border-border-subtle rounded-lg items-center justify-center p-2">
            <QRCode
              value={`https://${shopUrl}`}
              size={160}
              backgroundColor="white"
              color="#1a1c1e"
            />
          </View>
          <Text className="text-[18px] text-on-surface font-medium">Scan to visit my shop</Text>
        </Animated.View>
      </View>

      {/* Bottom Action */}
      <Animated.View 
        entering={FadeIn.duration(500).delay(400)}
        className="absolute bottom-0 left-0 w-full bg-surface-container-lowest border-t border-border-subtle px-5 py-4"
        style={{ paddingBottom: Platform.OS === 'ios' ? 32 : 24 }}
      >
        <TouchableOpacity
          onPress={handleShare}
          className="w-full h-14 border-2 border-trust-blue rounded-lg flex-row items-center justify-center gap-2"
          activeOpacity={0.8}
        >
          <MaterialIcons name="share" size={20} color="#0055D4" />
          <Text className="text-[14px] font-semibold text-trust-blue">More Sharing Options</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
