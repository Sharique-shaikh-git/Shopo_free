import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { apiFetch } from '../../../../lib/api';

export default function CategoryProductsScreen() {
  const router = useRouter();
  const { category: categoryParam } = useLocalSearchParams<{ category?: string }>();
  const category = categoryParam || 'Clothing';
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const shimmerOpacity = useSharedValue(0.6);

  useEffect(() => {
    shimmerOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedShimmer = useAnimatedStyle(() => ({ opacity: shimmerOpacity.value }));

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch(`/products?category=${encodeURIComponent(category)}`);
        setProducts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category]);


  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4 bg-surface z-50">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full">
            <MaterialIcons name="arrow-back" size={24} color="#006B5E" />
          </TouchableOpacity>
          <Text className="text-[24px] font-bold text-growth-green">{category}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
        
        {/* Filter & Sorting Chips */}
        <Animated.View entering={FadeInDown.duration(400).springify()} className="mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row overflow-visible pb-2 -mx-6 px-6">
            <TouchableOpacity className="flex-row items-center gap-1.5 px-4 py-2 rounded-full bg-primary-container border border-primary mr-2">
              <MaterialIcons name="filter-list" size={20} color="white" />
              <Text className="font-semibold text-[14px] text-white">Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-4 py-2 rounded-full bg-surface-container-low border border-border-subtle mr-2 justify-center">
              <Text className="font-semibold text-[14px] text-on-surface">Sort: Popular</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-4 py-2 rounded-full bg-surface-container-low border border-border-subtle mr-2 justify-center">
              <Text className="font-semibold text-[14px] text-on-surface">Men</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-4 py-2 rounded-full bg-surface-container-low border border-border-subtle mr-2 justify-center">
              <Text className="font-semibold text-[14px] text-on-surface">Women</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-4 py-2 rounded-full bg-surface-container-low border border-border-subtle mr-2 justify-center">
              <Text className="font-semibold text-[14px] text-on-surface">Kids</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>

        {/* AI Recommendation Pulse */}
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()}>
          <View className="mb-6 flex-row items-center gap-2 px-4 py-3 rounded-xl bg-surface-container-lowest border border-[#83d5c5]">
            <MaterialIcons name="auto-awesome" size={20} color="#006B5E" />
            <Animated.Text style={[animatedShimmer]} className="font-semibold text-[14px] text-[#006B5E]">
              AI Curating best matches for you...
            </Animated.Text>
          </View>
        </Animated.View>

        {/* Product Grid */}
        {loading ? (
          <ActivityIndicator size="large" color="#006B5E" className="mt-12" />
        ) : products.length === 0 ? (
          <View className="mt-16 items-center justify-center gap-4">
            <MaterialIcons name="inventory-2" size={48} color="#6e7976" />
            <Text className="text-[16px] text-on-surface-variant">No products in this category yet.</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {products.map((product, index) => (
              <Animated.View
                key={product.id}
                entering={FadeInDown.duration(400).delay(index * 100).springify()}
                className="w-[48%] mb-4 bg-surface-container-lowest rounded-xl overflow-hidden border border-border-subtle shadow-sm"
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => router.push(`/(app)/products/${product.id}` as any)}
                  className="flex-col"
                >
                  <View className="aspect-[4/5] relative bg-surface-container">
                    {product.images?.[0] ? (
                      <Image source={{ uri: product.images[0] }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                      <View className="w-full h-full items-center justify-center">
                        <MaterialIcons name="image" size={40} color="#6e7976" />
                      </View>
                    )}
                  </View>
                  <View className="p-3 flex-col gap-1">
                    <Text className="font-semibold text-[14px] text-on-surface" numberOfLines={1}>{product.title}</Text>
                    <Text className="font-bold text-[14px] text-growth-green">PKR {product.price}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity className="absolute bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg z-40">
        <MaterialIcons name="chat" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
