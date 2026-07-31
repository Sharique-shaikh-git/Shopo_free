import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

export default function StoreCreationScreen() {
  const router = useRouter();
  const [shopName, setShopName] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleCreateShop = () => {
    // In a real app we would create the shop via API
    router.push('/(app)/store/categories' as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface font-body-md">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 w-full max-w-md mx-auto px-6 pt-8 pb-24">
            
            {/* Header */}
            <Animated.View entering={FadeInDown.duration(600).springify()} className="pb-8">
              <Text className="text-[28px] font-bold text-primary-container text-center">Create Your Shop</Text>
              <Text className="text-[16px] text-on-surface-variant text-center mt-2">
                Let's set up your brand identity.
              </Text>
            </Animated.View>

            {/* Form Content */}
            <Animated.View entering={FadeInDown.duration(600).delay(100).springify()} className="flex-1 items-center space-y-8 w-full gap-8">
              
              {/* Logo Upload */}
              <TouchableOpacity 
                activeOpacity={0.8}
                className="flex-col items-center w-full group"
              >
                <View className="w-32 h-32 rounded-full border border-border-subtle bg-surface-gray flex-col items-center justify-center overflow-hidden">
                  <MaterialIcons name="photo-camera" size={36} color="#006B5E" className="mb-1" />
                  <Text className="text-[12px] font-medium text-primary-container mt-1">Add Logo</Text>
                </View>
                <Text className="text-[12px] text-on-surface-variant mt-3 text-center">
                  Tap to upload a profile picture
                </Text>
              </TouchableOpacity>

              {/* Shop Name Input */}
              <View className="w-full mt-4">
                <View 
                  className={`relative w-full border rounded-lg px-4 pt-6 pb-2 min-h-[64px] bg-transparent transition-colors ${
                    isFocused ? 'border-primary-container' : 'border-border-subtle'
                  }`}
                >
                  <Animated.Text 
                    className="absolute left-4 font-body-md text-on-surface-variant"
                    style={{
                      top: isFocused || shopName ? 8 : 20,
                      fontSize: isFocused || shopName ? 12 : 16,
                      color: isFocused ? '#006B5E' : '#3e4946',
                    }}
                  >
                    Shop Name
                  </Animated.Text>
                  <TextInput
                    value={shopName}
                    onChangeText={setShopName}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="text-on-surface text-[16px] p-0 m-0"
                    placeholderTextColor="transparent"
                  />
                </View>
              </View>

            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Action Bar */}
      <Animated.View 
        entering={FadeIn.duration(500).delay(300)}
        className="absolute bottom-0 left-0 w-full bg-surface border-t border-border-subtle px-6 py-4 pb-safe shadow-sm z-40"
        style={{ paddingBottom: Platform.OS === 'ios' ? 32 : 24 }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleCreateShop}
          disabled={!shopName.trim()}
          className={`w-full h-14 rounded-xl flex-row items-center justify-center ${
            shopName.trim() ? 'bg-primary-container' : 'bg-surface-variant'
          }`}
        >
          <Text className={`font-semibold text-[16px] ${
            shopName.trim() ? 'text-white' : 'text-on-surface-variant'
          }`}>
            Create My Shop
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
