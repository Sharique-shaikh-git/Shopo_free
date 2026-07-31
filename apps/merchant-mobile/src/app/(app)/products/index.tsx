import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../../lib/api';

export default function ProductsScreen() {
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

  // Mock data to ensure beautiful UI is visible even if DB is empty
  const mockProducts = [
    {
      id: 'mock1',
      title: 'Embroidered Pashmina Shawl',
      price: '4500',
      stock: 10,
      images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCArU5I8ROApjKcuGZhwIeMqMxFo_gs9fxyVlfCfB2t43FFyZISzvfKL2yswNaZjFqjWvB5emQn6cB-abQkQMInnQQNM3BHb74eCi6diOiqrntUD4BbEsdjsrcHuLEinq4wjFJfQhi0GGEQl84MaNo5GSujaQNQMhnYF8e6FzaMp38917TvTH4zcGYpBnuaZxFxD456ukQbS-uMi-JOHyfjPvW6-t8Nb--Q_GqzpcynzXyRxLf4QaqV97aY2pvDT6UeJVh1wVxFfOo']
    },
    {
      id: 'mock2',
      title: 'Handmade Leather Sandals',
      price: '2850',
      stock: 5,
      images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBGeVbxb253p2gQsWHgQn9r3PkWHPpA7Yrn71qYJlXzm7oboEyTuH-QwDcGS6euSGjBK8ndVrEUV8YEEoD4Z4qA8EvrcCXCtXkSKubEXiXovhize8Yr12_C97fd6EDTI4NRc7cjxTnNCC0PL6XYu-5fptVtLuATfhxBKkHdjt9t7TrvOZjgV64PB8n2FJLs7EcmtJo8tVo5ph1LMjQwQIe4xI-jf-MFmJv3nGcpaWb1Hsk754cwZq7hgZIOlDjPGOBIx1YT-xyL5s8']
    },
    {
      id: 'mock3',
      title: 'Smart Series-X Watch',
      price: '12000',
      stock: 0,
      images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBuvXng8d7OVTDLk3tmhkDKQ_uA8ROghXmcXIzHHhESMNSxsE9OGMPVkcszy5eDw3F9SSHFyfqEpWFYWtVVUI8A_riIK9yceiWEEO696EmYNdssVwNxEdhQ54G-svVn98DlMbaTZei-fzS6AtwR5oJzA-z19VoI1fx0jK6BYZqcnLMU9EVplNw4rngrFassMsSiTiLvjoJlhg4Em9vXZ_Wk3uuqhjGkLkSOELQs0Y9fXMCVySJK1XWdJrdSUo5ocJn49fWk92khiT0']
    }
  ];

  const displayProducts = products.length > 0 ? products : mockProducts;
  
  const filteredProducts = displayProducts.filter(p => {
    if (searchQuery && !p.title?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilter === 'In Stock' && p.stock <= 0) return false;
    if (activeFilter === 'Out of Stock' && p.stock > 0) return false;
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-background font-body-md relative">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4 bg-surface z-40">
        <View className="flex-row items-center gap-3">
          <MaterialIcons name="storefront" size={24} color="#006B5E" />
          <Text className="text-[24px] font-bold text-growth-green">Shop Builder</Text>
        </View>
        <TouchableOpacity className="p-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all">
          <MaterialIcons name="language" size={24} color="#006B5E" />
        </TouchableOpacity>
      </View>

      {/* Search & Filter */}
      <View className="px-6 py-4 bg-background z-30">
        <View className="flex-col gap-4">
          <View className="relative justify-center">
            <View className="absolute left-4 z-10">
              <MaterialIcons name="search" size={24} color="#3e4946" />
            </View>
            <TextInput
              className="w-full h-14 pl-12 pr-4 bg-surface-container-lowest border border-border-subtle rounded-xl font-body-md text-[16px] text-on-surface"
              placeholder="Search your products..."
              placeholderTextColor="#3e4946"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row overflow-visible pb-2 -mx-6 px-6">
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
        ) : filteredProducts.length === 0 ? (
          <View className="mt-10 items-center justify-center">
            <Text className="text-[16px] text-on-surface-variant text-center">No products found.</Text>
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
                    <View className={`w-16 h-16 rounded-lg overflow-hidden bg-surface-container border border-border-subtle shrink-0 ${!inStock ? 'opacity-60' : ''}`}>
                      <Image 
                        source={{ uri: product.images?.[0] || 'https://via.placeholder.com/100' }} 
                        className={`w-full h-full object-cover ${!inStock ? 'opacity-60' : ''}`}
                      />
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
