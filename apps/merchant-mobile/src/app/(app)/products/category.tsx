import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function CategoryProductsScreen() {
  const router = useRouter();
  
  // AI Shimmer effect
  const shimmerOpacity = useSharedValue(0.5);
  React.useEffect(() => {
    shimmerOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.5, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedShimmer = useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
  }));

  const mockProducts = [
    {
      id: '1',
      title: 'Premium Linen Shirt',
      subtitle: 'Sage Green • Slim Fit',
      price: '4,500',
      badge: 'New Arrival',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNIcBcQqqYq_Sooopxab-xHYPzVWqYZCY6HPxql2mOTIJcI0OgTTYpZw0ocSKco3YYcJBaKnD8LteUfkXQhau4y-JBrc2Oiiz1VDmZC7MKLyt7IPgEB3K7Z3k6jpSiuY6GN2lAK5sSo-oDfBERagkBQgsPs78frlCo57WjBFWcNYHGKnMRZa6Fo5fayViRmqUZbDG2QoO7RO5j1ZTE6CbCUDobGlGgHfRwMClKnlSoWbqMd9xQ07Qgza_Hh16moqywVf1JxTuZdMo'
    },
    {
      id: '2',
      title: 'Embroidered Kurta',
      subtitle: 'Navy Blue • Festive',
      price: '7,200',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCum0T1PfqsXLXL4T2uEY9wwl5oFttTTH6IsLay7dXy7E5ohIdEKLWxbF1IeDV7MI-gPcJ7uwLu7IH_u2XEsdTAZUn3g3NcKrDoq6qnJkzb8qI_BFn3G5m62aNGIfBtEeXIALrfoivEY2HM9ZZmaL7L_FVjM2dhAmvg9FWMcNaN5yBuRcWmin70Ixhzd-BSS9QU_ywL4384DIOjccguUu3WDkWUZFZv5YbUTygh2JMgeI9f2OEv-1ulZCY3D8f_sGZ-IGTvYRxRgr8'
    },
    {
      id: '3',
      title: 'Essential Hoodie',
      subtitle: 'Charcoal • Oversized',
      price: '2,800',
      oldPrice: '3,500',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1uaBnsXo1n5s-T0IAGfKL9xefAnr0L2AysqaSzUeR5Axu2xyTqBiW5uFVClT9uNcxxEiGsI8-dMeqp8hqUf4UXPOFeya3HwCZyRfuWOa-v5zfjFsSowLytB-CsewOTEMu39VBCAl2MlW5qg5ZUOTfIFYmj2EhXX-UV9lXzvoyiEDTVVdBx9O80A8yZothXgLYZLZ0g9hEJyCmQy_8lf2aqgeOQkILRsIpBwkBdyyJoiJBz648XXWPYNbKFw9hUAd-WY7aI15X65Q'
    },
    {
      id: '4',
      title: 'Tailored Trousers',
      subtitle: 'Ivory • Relaxed Fit',
      price: '5,100',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSu7mMtZOXjnsFxYcl8P5zGoAJFlysYy6sD4r3PeXhI1DgIy8tGaPNNJVE8P7fuW7rlSgRsS9KFtsEl8lQs3CJ48Ozq6pfWXNud4fKlAi_NPDy_2CeyQmgJH2gBaZYYVyS04nme-Jzih2gS9IbmtFzChet8l2O1PlB9AxylOgImXxkA42kI5NNDdO8NLB6Jsn--94VGh2rEMDKj2iBaMa6T71uokz_XPflHliLA7RsTKEhM2Qco4Y4kRlzLY8xxfU8kmiJtUZ3Fl4'
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-background font-body-md">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4 bg-surface z-50">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full hover:bg-surface-container-high">
            <MaterialIcons name="arrow-back" size={24} color="#006B5E" />
          </TouchableOpacity>
          <Text className="text-[24px] font-bold text-growth-green">Apparel</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full hover:bg-surface-container-high">
            <MaterialIcons name="search" size={24} color="#006B5E" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full hover:bg-surface-container-high relative">
            <MaterialIcons name="shopping-cart" size={24} color="#006B5E" />
            <View className="absolute top-1 right-1 bg-[#BA1A1A] w-4 h-4 items-center justify-center rounded-full">
              <Text className="text-white text-[10px] font-bold">2</Text>
            </View>
          </TouchableOpacity>
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
        <View className="flex-row flex-wrap justify-between">
          {mockProducts.map((product, index) => (
            <Animated.View 
              key={product.id} 
              entering={FadeInDown.duration(400).delay(200 + index * 100).springify()}
              className="w-[48%] mb-4 bg-surface-container-lowest rounded-xl overflow-hidden border border-border-subtle shadow-sm"
            >
              <TouchableOpacity activeOpacity={0.9} className="flex-col">
                <View className="aspect-[4/5] relative bg-surface-container">
                  <Image source={{ uri: product.image }} className="w-full h-full object-cover" />
                  <TouchableOpacity className="absolute top-2 right-2 w-8 h-8 items-center justify-center bg-white/80 rounded-full shadow-sm z-10">
                    <MaterialIcons name="favorite-outline" size={20} color="#006B5E" />
                  </TouchableOpacity>
                  {product.badge && (
                    <View className="absolute bottom-2 left-2 px-2 py-1 bg-status-shipped rounded">
                      <Text className="text-[#005322] font-bold text-[10px] uppercase">{product.badge}</Text>
                    </View>
                  )}
                </View>
                <View className="p-3 flex-col gap-1">
                  <Text className="font-semibold text-[14px] text-on-surface" numberOfLines={1}>{product.title}</Text>
                  <Text className="text-[12px] text-on-surface-variant">{product.subtitle}</Text>
                  
                  <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-col">
                      {product.oldPrice && (
                        <Text className="text-[10px] text-error line-through">Rs. {product.oldPrice}</Text>
                      )}
                      <Text className="font-bold text-[14px] text-growth-green">Rs. {product.price}</Text>
                    </View>
                    <TouchableOpacity className="w-8 h-8 rounded-full bg-growth-green items-center justify-center">
                      <MaterialIcons name="add" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Pagination / Load More */}
        <Animated.View entering={FadeInDown.duration(400).delay(600).springify()} className="mt-4 mb-8 flex-col items-center gap-4">
          <Text className="text-[12px] text-on-surface-variant">Showing 4 of 48 items</Text>
          <TouchableOpacity activeOpacity={0.8} className="w-full py-4 border-2 border-growth-green rounded-xl items-center justify-center">
            <Text className="font-semibold text-[14px] text-growth-green">Load More Products</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity className="absolute bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg z-40">
        <MaterialIcons name="chat" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
