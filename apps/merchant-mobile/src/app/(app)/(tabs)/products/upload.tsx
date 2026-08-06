import React, { useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function ProductPhotoUploadScreen() {
  const router = useRouter();

  const pulseScale = useSharedValue(0.8);
  const pulseOpacity = useSharedValue(0.5);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 2000 })
      ),
      -1,
      false
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 2000 })
      ),
      -1,
      false
    );
  }, []);

  const animatedPulse = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const handleTakeaPhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You've refused to allow this app to access your camera!");
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      router.push({
        pathname: '/products/create',
        params: { imageUri: result.assets[0].uri }
      });
    }
  };

  const handleChooseFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      router.push({
        pathname: '/products/create',
        params: { imageUri: result.assets[0].uri }
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background font-body-md overflow-hidden relative">
      {/* Header */}
      <View className="w-full top-0 bg-surface flex-row justify-between items-center px-6 py-4 z-40">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 flex items-center justify-center -ml-2 text-on-surface hover:bg-surface-container-high rounded-full active:scale-95 duration-150">
          <MaterialIcons name="storefront" size={24} color="#006B5E" />
        </TouchableOpacity>
        <Text className="font-bold text-[24px] text-growth-green text-center flex-1">Shop Builder</Text>
        <TouchableOpacity className="w-12 h-12 flex items-center justify-center text-growth-green hover:bg-surface-container-high rounded-full active:scale-95 duration-150">
          <MaterialIcons name="language" size={24} color="#006B5E" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 flex-col">
        {/* Header Section */}
        <Animated.View entering={FadeInDown.duration(400).springify()} className="px-6 pt-8 pb-4 text-center z-10">
          <Text className="font-bold text-[28px] text-on-background text-center mb-2">Add New Product</Text>
          <Text className="text-[16px] text-on-surface-variant text-center">Snap a photo to list your product.</Text>
        </Animated.View>

        {/* Viewfinder/Illustration Area */}
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="flex-1 items-center justify-center p-6 z-10">
          <View className="w-full max-w-sm aspect-[3/4] bg-surface-container-low rounded-[32px] border border-border-subtle flex-col items-center justify-center overflow-hidden relative">
            {/* Corner Brackets */}
            <View className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-growth-green opacity-50 rounded-tl-lg" />
            <View className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-growth-green opacity-50 rounded-tr-lg" />
            <View className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-growth-green opacity-50 rounded-bl-lg" />
            <View className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-growth-green opacity-50 rounded-br-lg" />

            {/* Central Illustration */}
            <View className="flex-col items-center justify-center">
              <View className="w-32 h-32 bg-primary-fixed rounded-full items-center justify-center mb-6 relative">
                <Animated.View style={[animatedPulse]} className="absolute inset-0 bg-primary-fixed rounded-full" />
                <MaterialIcons name="shopping-bag" size={64} color="#005147" />
              </View>
              <Text className="font-semibold text-[14px] text-primary text-center px-8">
                Position product within frame
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Bottom Action Area */}
        <Animated.View entering={FadeInDown.duration(400).delay(300).springify()} className="px-6 pb-[100px] pt-4 flex-col gap-4 z-10 bg-background">
          <TouchableOpacity 
            onPress={handleTakeaPhoto}
            className="w-full bg-growth-green rounded-full min-h-[56px] flex-row items-center justify-center gap-2 active:scale-95 duration-200 shadow-sm"
          >
            <MaterialIcons name="photo-camera" size={24} color="white" />
            <Text className="font-semibold text-[14px] text-on-primary">Take a Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleChooseFromGallery}
            className="w-full bg-transparent border-2 border-border-subtle rounded-full min-h-[56px] flex-row items-center justify-center gap-2 active:scale-95 duration-200"
          >
            <MaterialIcons name="photo-library" size={24} color="#3e4946" />
            <Text className="font-semibold text-[14px] text-on-surface-variant">Choose from Gallery</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
