import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn, withRepeat, withTiming, useSharedValue, useAnimatedStyle, withSequence } from 'react-native-reanimated';

const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: 'devices' },
  { id: 'apparel', name: 'Apparel', icon: 'checkroom' },
  { id: 'home', name: 'Home & Living', icon: 'home-work' },
  { id: 'groceries', name: 'Groceries', icon: 'shopping-basket' },
  { id: 'beauty', name: 'Beauty', icon: 'content-cut' },
  { id: 'other', name: 'Other', icon: 'more-horiz' },
];

export default function StoreCategoriesScreen() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedPulse = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    // Navigate to Dashboard
    router.push('/(app)/dashboard');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface font-body-md">
      {/* TopAppBar */}
      <View className="w-full flex-row justify-between items-center px-6 py-4 bg-surface z-50">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="storefront" size={24} color="#006B5E" />
          <Text className="font-bold text-[24px] text-primary-container">Shop Builder</Text>
        </View>
        <TouchableOpacity className="p-2 rounded-full active:bg-surface-container-high">
          <MaterialIcons name="language" size={24} color="#3e4946" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-6 pt-4 pb-32">
        {/* Step Progress Indicator */}
        <View className="flex-row gap-2 mb-8">
          <View className="h-1.5 flex-1 bg-primary-container rounded-full" />
          <View className="h-1.5 flex-1 bg-primary-container rounded-full" />
          <View className="h-1.5 flex-1 bg-surface-variant rounded-full" />
        </View>

        {/* Headline Section */}
        <Animated.View entering={FadeInDown.duration(600).springify()} className="mb-8">
          <Text className="text-[28px] font-bold text-on-surface mb-2">What do you sell?</Text>
          <Text className="text-[16px] text-on-surface-variant">
            Select all categories that apply to your business. This helps us tailor your store's features.
          </Text>
        </Animated.View>

        {/* Category Grid */}
        <Animated.View entering={FadeInDown.duration(600).delay(100).springify()} className="flex-row flex-wrap justify-between">
          {CATEGORIES.map((cat, index) => {
            const isSelected = selectedCategories.includes(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.9}
                onPress={() => toggleCategory(cat.id)}
                className={`w-[48%] mb-4 flex-col items-start p-4 rounded-xl text-left border-2 overflow-hidden transition-all ${
                  isSelected ? 'border-primary-container bg-[#F0FDF4]' : 'border-border-subtle bg-white'
                }`}
              >
                <View className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${
                  isSelected ? 'bg-primary-fixed' : 'bg-surface-container-low'
                }`}>
                  <MaterialIcons name={cat.icon as any} size={24} color="#006B5E" />
                </View>
                <Text className="text-[14px] font-semibold text-on-surface">{cat.name}</Text>
                
                {isSelected && (
                  <Animated.View entering={FadeIn.duration(200)} className="absolute top-3 right-3">
                    <MaterialIcons name="check-circle" size={24} color="#006B5E" />
                  </Animated.View>
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* AI Tip Section */}
        <Animated.View entering={FadeInDown.duration(600).delay(200).springify()} className="mt-8 p-4 bg-surface-container-lowest border border-border-subtle rounded-xl flex-row gap-3 items-start">
          <MaterialIcons name="auto-awesome" size={20} color="#0055D4" style={{ marginTop: 2 }} />
          <View className="flex-1">
            <Animated.Text style={[animatedPulse]} className="text-[14px] font-semibold text-primary-container">
              AI Recommendation
            </Animated.Text>
            <Text className="text-[16px] text-on-surface-variant mt-1 leading-6">
              Based on your business name, we suggest starting with <Text className="font-bold">Electronics</Text>.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <Animated.View 
        entering={FadeIn.duration(500).delay(300)}
        className="absolute bottom-0 w-full bg-white px-6 py-4 border-t border-border-subtle pb-safe z-50"
        style={{ paddingBottom: Platform.OS === 'ios' ? 32 : 24 }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleContinue}
          disabled={selectedCategories.length === 0}
          className={`w-full h-14 rounded-full flex-row items-center justify-center gap-2 ${
            selectedCategories.length > 0 ? 'bg-primary-container' : 'bg-outline opacity-50'
          }`}
        >
          <Text className="text-white font-semibold text-[14px]">Continue</Text>
          <MaterialIcons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
