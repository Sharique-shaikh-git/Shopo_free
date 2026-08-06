import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { apiFetch } from '../../../../lib/api';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StoreCreationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setLogoUri(result.assets[0].uri);
    }
  };

  const handleCreate = async () => {
    if (!storeName.trim()) {
      Alert.alert('Required', 'Please enter your shop name.');
      return;
    }
    setIsLoading(true);
    try {
      const store = await apiFetch('/stores', {
        method: 'POST',
        body: JSON.stringify({ name: storeName.trim(), description }),
      });
      // Navigate to the launch celebration screen
      router.replace(`/(app)/(stack)/store/launch?storeId=${store.id}&storeName=${encodeURIComponent(storeName)}` as any);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not create shop. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const headerPadding = Math.max(insets.top, StatusBar.currentHeight || 24, 16);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Back Button */}
          <Animated.View
            entering={FadeInDown.duration(600).springify()}
            style={{ paddingTop: headerPadding }}
            className="pb-4 px-5 flex-row items-center justify-between"
          >
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/(app)');
                }
              }}
              className="w-10 h-10 rounded-full bg-surface-container-low items-center justify-center"
              activeOpacity={0.7}
            >
              <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
            </TouchableOpacity>
            <View className="flex-1 items-center px-2">
              <Text className="text-[22px] font-bold text-growth-green text-center">
                Create Your Shop
              </Text>
            </View>
            <View className="w-10 h-10" />
          </Animated.View>

          {/* Form */}
          <View className="flex-1 px-5 pt-6 gap-6">
            {/* Logo Upload */}
            <Animated.View
              entering={FadeInDown.duration(600).delay(100).springify()}
              className="items-center"
            >
              <TouchableOpacity
                onPress={pickLogo}
                activeOpacity={0.8}
                className="w-32 h-32 rounded-full border border-border-subtle bg-surface-gray items-center justify-center overflow-hidden"
              >
                {logoUri ? (
                  <Image source={{ uri: logoUri }} className="w-full h-full" />
                ) : (
                  <View className="items-center">
                    <MaterialIcons name="photo-camera" size={36} color="#006B5E" />
                    <Text className="text-[12px] font-medium text-growth-green mt-1">
                      Add Logo
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              <Text className="text-[12px] text-on-surface-variant mt-3 text-center">
                Tap to upload a profile picture
              </Text>
            </Animated.View>

            {/* Shop Name */}
            <Animated.View
              entering={FadeInDown.duration(600).delay(200).springify()}
            >
              <Text className="text-[14px] font-semibold text-on-surface-variant mb-2 ml-1">
                Shop Name *
              </Text>
              <TextInput
                value={storeName}
                onChangeText={setStoreName}
                placeholder="e.g. Ali's Fashion Store"
                className="w-full bg-white border border-border-subtle rounded-xl px-4 py-4 text-[16px] text-on-surface"
                placeholderTextColor="#6e7976"
                autoCapitalize="words"
                maxLength={60}
              />
              <Text className="text-[11px] text-on-surface-variant mt-1 ml-1">
                {storeName.length}/60 characters
              </Text>
            </Animated.View>

            {/* Description */}
            <Animated.View
              entering={FadeInDown.duration(600).delay(300).springify()}
            >
              <Text className="text-[14px] font-semibold text-on-surface-variant mb-2 ml-1">
                Short Description (optional)
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="What do you sell? e.g. Ladies fashion, electronics..."
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                className="w-full bg-white border border-border-subtle rounded-xl px-4 py-4 text-[16px] text-on-surface min-h-[96px]"
                placeholderTextColor="#6e7976"
                maxLength={200}
              />
            </Animated.View>

            {/* Info box */}
            <Animated.View
              entering={FadeInDown.duration(600).delay(400).springify()}
              className="flex-row gap-3 p-4 bg-surface-gray rounded-xl border border-border-subtle"
            >
              <MaterialIcons name="info" size={20} color="#0055D4" style={{ marginTop: 1 }} />
              <Text className="text-[13px] text-on-surface-variant flex-1 leading-5">
                Your shop will get a free link like{' '}
                <Text className="font-semibold text-growth-green">shopo.pk/yourshop</Text>{' '}
                that you can share on WhatsApp instantly.
              </Text>
            </Animated.View>

            <View className="flex-1 min-h-[40px]" />
          </View>
        </ScrollView>

        {/* Bottom Action Bar */}
        <Animated.View
          entering={FadeIn.duration(500).delay(500)}
          className="border-t border-border-subtle bg-surface px-5 py-4 pb-6"
          style={{ paddingBottom: Platform.OS === 'ios' ? 32 : 24 }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleCreate}
            disabled={isLoading || !storeName.trim()}
            className={`w-full h-14 rounded-xl flex-row items-center justify-center gap-2 shadow-sm ${
              !storeName.trim() || isLoading ? 'bg-[#006B5E] opacity-60' : 'bg-[#006B5E]'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <View className="flex-row items-center justify-center gap-2">
                <MaterialIcons name="storefront" size={20} color="white" />
                <Text className="text-white font-semibold text-[15px] tracking-wide">
                  Create My Shop
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
