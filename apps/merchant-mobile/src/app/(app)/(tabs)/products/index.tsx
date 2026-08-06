import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Image, ActivityIndicator, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../../../lib/api';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Products');

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await apiFetch('/products');
        setProducts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filters = ['All Products', 'In Stock', 'Out of Stock', 'Drafts'];

  const filteredProducts = products.filter(p => {
    if (searchQuery && !p.title?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilter === 'In Stock' && p.stock <= 0) return false;
    if (activeFilter === 'Out of Stock' && p.stock > 0) return false;
    return true;
  });

  const headerPadding = Math.max(insets.top, StatusBar.currentHeight || 24, 12);

  return (
    <SafeAreaView className="flex-1 bg-background font-body-md relative">
      {/* Header — with Android safe area top padding */}
      <View 
        style={{ paddingTop: headerPadding }} 
        className="flex-row justify-between items-center px-6 pb-4 bg-surface z-40 border-b border-border-subtle"
      >
        <View className="flex-row items-center gap-3">
          <MaterialIcons name="storefront" size={24} color="#006B5E" />
          <Text className="text-[24px] font-bold text-growth-green">Shop Builder</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/(app)/(stack)/settings/language' as any)}
          className="p-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all"
        >
          <MaterialIcons name="language" size={24} color="#006B5E" />
        </TouchableOpacity>
      </View>

      {/* Search & Filter */}
      <View className="px-6 pt-4 pb-2 bg-background z-30">
        <View className="flex-col gap-3">
          <View className="relative justify-center">
            <View className="absolute left-4 z-10">
              <MaterialIcons name="search" size={24} color="#3e4946" />
            </View>
            <TextInput
              className="w-full h-14 pl-12 pr-4 bg-surface-container-lowest border border-border-subtle rounded-xl font-body-md text-[16px] text-on-surface"
              style={{ borderRadius: 12 }}
              placeholder="Search your products..."
              placeholderTextColor="#3e4946"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row overflow-visible py-1">
            {filters.map((filter) => (
              <TouchableOpacity 
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full mr-2 justify-center items-center ${activeFilter === filter ? 'bg-primary' : 'bg-surface-container-high'}`}
              >
                <Text className={`font-semibold text-[14px] ${activeFilter === filter ? 'text-on-primary' : 'text-on-surface-variant'}`}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Product List */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="flex-1 px-6 mt-2" showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#005147" className="mt-8" />
        ) : products.length === 0 ? (
          <View className="mt-20 items-center justify-center gap-4">
            <View className="w-20 h-20 rounded-full bg-surface-container-high items-center justify-center">
              <MaterialIcons name="inventory-2" size={40} color="#6e7976" />
            </View>
            <Text className="text-[18px] font-semibold text-on-surface">No products yet</Text>
            <Text className="text-[14px] text-on-surface-variant text-center max-w-[220px] leading-5">
              Tap the + button to add your first product!
            </Text>
          </View>
        ) : (
          <View className="flex-col gap-3">
            {filteredProducts.map((product, index) => {
              const inStock = product.stock > 0;
              return (
                <Animated.View key={product.id || index} entering={FadeInDown.duration(400).delay(index * 100).springify()}>
                  <TouchableOpacity 
                    activeOpacity={0.9} 
                    onPress={() => router.push(`/(app)/products/${product.id}`)}
                    className="flex-row items-center p-3 bg-surface-container-lowest border border-border-subtle rounded-xl shadow-sm min-h-[88px]"
                  >
                    <View className={`w-16 h-16 rounded-lg overflow-hidden bg-surface-container border border-border-subtle shrink-0 items-center justify-center ${!inStock ? 'opacity-60' : ''}`}>
                      {product.images?.[0] ? (
                        <Image
                          source={{ uri: product.images[0] }}
                          className={`w-full h-full object-cover ${!inStock ? 'opacity-60' : ''}`}
                        />
                      ) : (
                        <MaterialIcons name="inventory-2" size={24} color="#bec9c5" />
                      )}
                    </View>
                    <View className="ml-4 flex-1">
                      <View className="flex-row justify-between items-start">
                        <Text className={`font-semibold text-[14px] text-on-surface flex-1 mr-2 ${!inStock ? 'opacity-60' : ''}`} numberOfLines={1}>
                          {product.title}
                        </Text>
                        <MaterialIcons name="chevron-right" size={20} color="#3e4946" />
                      </View>
                      <View className="flex-row items-center gap-2 mt-1">
                        <Text className={`font-bold text-[16px] text-primary ${!inStock ? 'opacity-60' : ''}`}>
                          PKR {product.price}
                        </Text>
                        <View className={`px-2 py-0.5 rounded-full flex-row items-center justify-center ${inStock ? 'bg-status-shipped' : 'bg-error-container'}`}>
                          <Text className={`text-[10px] font-bold uppercase tracking-wider ${inStock ? 'text-secondary' : 'text-[#ba1a1a]'}`}>
                            {inStock ? 'In Stock' : 'Out of Stock'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* FAB: Add Product */}
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => router.push('/(app)/products/create')}
        className="absolute bottom-6 right-6 w-14 h-14 bg-growth-green rounded-xl shadow-lg items-center justify-center z-50"
      >
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
