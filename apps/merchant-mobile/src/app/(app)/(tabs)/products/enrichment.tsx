import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { apiFetch } from '../../../../lib/api';

export default function AIEnrichmentReviewScreen() {
  const router = useRouter();
  const { imageUri, productId } = useLocalSearchParams<{ imageUri?: string; productId?: string }>();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [aiLoading, setAiLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setAiLoading(false);
      return;
    }
    // Poll for AI job completion
    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const product = await apiFetch(`/products/${productId}`);
        if (product.title) setTitle(product.title);
        if (product.suggestedPrice) setPrice(String(product.suggestedPrice));
        if (product.description) {
          setDescription(product.description);
          setAiLoading(false);
          clearInterval(interval);
        }
      } catch {
        // ignore polling errors
      }
      if (attempts >= maxAttempts) {
        setAiLoading(false);
        clearInterval(interval);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [productId]);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-[#F2F0F4]">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full">
          <Ionicons name="close" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[20px] font-bold text-[#005147]">Review Product Details</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 pb-32">
        <View className="max-w-md mx-auto px-4 py-4 gap-6">
          {/* Image Section */}
          <Animated.View entering={FadeIn.duration(600)} className="items-center gap-3">
            <View className="w-full aspect-square bg-[#F2F0F4] rounded-xl border border-[#E0E3DE] overflow-hidden relative">
              {imageUri ? (
                <Image source={{ uri: imageUri as string }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <Ionicons name="image-outline" size={48} color="#75797E" />
                </View>
              )}
              <TouchableOpacity className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full shadow-sm border border-[#E0E3DE]">
                <Ionicons name="create-outline" size={20} color="#75797E" />
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center gap-2">
              <Ionicons name="sparkles" size={18} color="#005147" />
              <Text className="text-[14px] font-semibold text-[#005147]">AI Enchanted Image</Text>
            </View>
          </Animated.View>

          {/* Form Section */}
          <View className="gap-6">
            {/* Title */}
            <View>
              <Text className="text-[12px] font-semibold text-[#005147] mb-1 ml-1">Product Title</Text>
              <TextInput
                className="w-full bg-white border-2 border-[#005147] rounded-lg px-4 py-3 text-[18px] text-[#1a1c1e]"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Price */}
            <View>
              <Text className="text-[12px] font-semibold text-[#75797E] mb-1 ml-1">Price (PKR)</Text>
              <TextInput
                className="w-full bg-white border border-[#E0E3DE] rounded-lg px-4 py-3 text-[18px] text-[#1a1c1e]"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>

            {/* Description */}
            <View>
              <Text className="text-[12px] font-semibold text-[#75797E] mb-1 ml-1">Description</Text>
              {aiLoading ? (
                <View className="w-full bg-white border border-[#E0E3DE] rounded-lg px-4 py-3 min-h-[120px] justify-center">
                  <View className="flex-row items-center gap-2 mb-3">
                    <Ionicons name="sync" size={18} color="#005147" style={{ opacity: 0.5 }} />
                    <Text className="text-[16px] text-[#005147]">AI is writing your description...</Text>
                  </View>
                  <View className="h-2 bg-[#E0E3DE] rounded w-3/4 mb-2" />
                  <View className="h-2 bg-[#E0E3DE] rounded w-1/2 mb-2" />
                  <View className="h-2 bg-[#E0E3DE] rounded w-5/6" />
                </View>
              ) : (
                <TextInput
                  className="w-full bg-white border border-[#E0E3DE] rounded-lg px-4 py-3 text-[16px] text-[#1a1c1e] min-h-[120px] text-top"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  textAlignVertical="top"
                />
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E0E3DE] px-4 py-4 pb-8">
        <TouchableOpacity className="w-full bg-[#005147] text-white rounded-xl min-h-[56px] items-center justify-center flex-row gap-2">
          <Ionicons name="checkmark-circle" size={22} color="white" />
          <Text className="text-[14px] font-semibold text-white">Confirm & Add Product</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
