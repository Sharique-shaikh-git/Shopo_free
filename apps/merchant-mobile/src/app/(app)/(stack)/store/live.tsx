import React, { useEffect, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Share,
  Linking,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { apiFetch } from '../../../../lib/api';

export default function StoreLiveScreen() {
  const router = useRouter();
  const [storeName, setStoreName] = useState('My Shop');
  const [storeSlug, setStoreSlug] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    apiFetch('/stores')
      .then((stores: any[]) => {
        if (stores && stores.length > 0) {
          const store = stores[0];
          setStoreName(store.name || 'My Shop');
          setStoreSlug(store.slug || (store.name || 'myshop').toLowerCase().replace(/\s+/g, '-'));
        }
      })
      .catch(() => {});
  }, []);

  const storeUrl = storeSlug
    ? `https://shopo.pk/${storeSlug}`
    : 'https://shopo.pk/your-shop';

  const handleCopy = async () => {
    await Clipboard.setStringAsync(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Check out my online shop — ${storeName}! 🛍️\n${storeUrl}`);
    Linking.openURL(`whatsapp://send?text=${msg}`).catch(() =>
      Alert.alert('WhatsApp not installed', 'Please install WhatsApp to share.'),
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `${storeName} — ${storeUrl}` });
    } catch {}
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header escape */}
      <View className="flex-row justify-end px-gutter-mobile py-4">
        <TouchableOpacity
          accessibilityLabel="Close to Dashboard"
          onPress={() => router.replace('/(app)' as never)}
          className="w-12 h-12 items-center justify-center rounded-full active:scale-95"
        >
          <MaterialIcons name="close" size={24} color="#3e4946" />
        </TouchableOpacity>
      </View>

      {/* Celebration content */}
      <View className="flex-1 items-center justify-center px-margin-mobile -mt-10">
        <Animated.View entering={FadeInDown.duration(500).springify()} className="w-40 h-40 rounded-full bg-status-shipped items-center justify-center mb-stack-lg">
          <View className="w-28 h-28 bg-growth-green rounded-full items-center justify-center shadow-lg">
            <MaterialIcons name="check-circle" size={60} color="#ffffff" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(120).springify()} className="items-center w-full max-w-[360px]">
          <Text className="font-headline-lg-mobile text-headline-lg-mobile text-growth-green mb-stack-sm text-center">
            Your shop is live!
          </Text>
          <Text className="font-body-md text-body-md text-on-surface-variant text-center mb-stack-lg">
            Congratulations! You can now start sharing your products with customers.
          </Text>

          {/* URL box */}
          <TouchableOpacity
            onPress={handleCopy}
            activeOpacity={0.8}
            className="w-full bg-surface-bright border-2 border-primary-container rounded-xl p-4 flex-row items-center justify-between mb-2"
          >
            <View className="flex-1 mr-3">
              <Text className="font-label-sm text-label-sm text-on-surface-variant mb-1">Your Store Link</Text>
              <Text className="font-body-lg text-body-lg text-growth-green font-bold" numberOfLines={1}>
                {storeUrl.replace('https://', '')}
              </Text>
            </View>
            <View className={`w-12 h-12 items-center justify-center rounded-full ${copied ? 'bg-growth-green' : 'bg-surface-container-high'}`}>
              <MaterialIcons name={copied ? 'check' : 'content-copy'} size={22} color={copied ? '#ffffff' : '#006B5E'} />
            </View>
          </TouchableOpacity>

          {copied && (
            <Animated.View entering={FadeIn.duration(250)} className="flex-row items-center mb-2">
              <MaterialIcons name="check" size={16} color="#0055D4" />
              <Text className="text-trust-blue font-label-sm text-label-sm ml-1">Link copied to clipboard!</Text>
            </Animated.View>
          )}
        </Animated.View>
      </View>

      {/* Share actions */}
      <Animated.View entering={FadeInDown.duration(500).delay(240).springify()} className="px-gutter-mobile pb-8 gap-3">
        <TouchableOpacity
          onPress={handleWhatsApp}
          activeOpacity={0.9}
          className="w-full h-14 bg-whatsapp-green rounded-xl flex-row items-center justify-center gap-2 active:scale-95"
        >
          <MaterialIcons name="chat" size={22} color="#ffffff" />
          <Text className="text-white font-label-lg text-label-lg font-bold">Share on WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleShare}
          activeOpacity={0.9}
          className="w-full h-14 border-2 border-growth-green rounded-xl flex-row items-center justify-center gap-2"
        >
          <MaterialIcons name="share" size={20} color="#006B5E" />
          <Text className="text-growth-green font-label-lg text-label-lg font-bold">Share Link</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
