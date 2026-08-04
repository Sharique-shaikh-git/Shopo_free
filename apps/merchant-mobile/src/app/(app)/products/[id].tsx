import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { apiFetch } from '../../../lib/api';

export default function EditProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('home_decor');
  const [isActive, setIsActive] = useState(true);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!id || id === 'new') {
        // Just mock for now if it's 'new'
        setLoading(false);
        return;
      }
      try {
        const product = await apiFetch(`/products/${id}`);
        setTitle(product.title);
        setDescription(product.description || '');
        setPrice(product.price.toString());
        setStock(product.stock.toString());
        setImage(product.thumbnailUrl || product.images?.[0] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMwyJ6vqQd6nYtJ7Fva0Kj0QSOlFL6Elh2l3EyS73cw6iL5txdKtiYzK7E6abRjr8Zeco8kqL430NxIQN3wz4dAVW7rsCr34BLPhmsljax91X7pQh_63GLZlBgdpg8EXXzIcne0w2b_d_o1uMdKtur_h9wbWAhZNudBT3rjz5V2fpgbohCeVBLVf8WOlxzA6bzme5APeXKevA-v-J2n06h20zq7th2k9UksWgOqslfBkkj82Jk4YA-AVuxdxVZqUns9CLxxFbP8u8');
      } catch (err: any) {
        console.error(err);
        // Fallback mock if API fails
        setTitle('Minimalist Ceramic Mug');
        setDescription('Handcrafted ceramic mug with a matte finish. Perfect for your morning coffee or tea.');
        setPrice('850');
        setStock('12');
        setImage('https://lh3.googleusercontent.com/aida-public/AB6AXuDMwyJ6vqQd6nYtJ7Fva0Kj0QSOlFL6Elh2l3EyS73cw6iL5txdKtiYzK7E6abRjr8Zeco8kqL430NxIQN3wz4dAVW7rsCr34BLPhmsljax91X7pQh_63GLZlBgdpg8EXXzIcne0w2b_d_o1uMdKtur_h9wbWAhZNudBT3rjz5V2fpgbohCeVBLVf8WOlxzA6bzme5APeXKevA-v-J2n06h20zq7th2k9UksWgOqslfBkkj82Jk4YA-AVuxdxVZqUns9CLxxFbP8u8');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id, router]);

  const handleUpdate = async () => {
    if (!title || !price || !stock) {
      Alert.alert('Error', 'Title, price, and stock are required');
      return;
    }

    setSaving(true);
    try {
      if (id && id !== 'new') {
        await apiFetch(`/products/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            title,
            description,
            price,
            stock: parseInt(stock, 10),
            thumbnailUrl: image,
          }),
        });
      }
      Alert.alert('Success', 'Product updated successfully');
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          setSaving(true);
          try {
            if (id && id !== 'new') {
              await apiFetch(`/products/${id}`, { method: 'DELETE' });
            }
            router.back();
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to delete product');
          } finally {
            setSaving(false);
          }
        }
      }
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#005147" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background font-body-md relative">
      {/* Top App Bar */}
      <View className="w-full top-0 bg-surface z-40 flex-row justify-between items-center px-6 py-4 border-b border-border-subtle">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="w-12 h-12 flex items-center justify-center -ml-2 text-on-surface hover:bg-surface-container-high rounded-full active:scale-95 duration-150"
        >
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="font-bold text-[24px] text-on-surface">Edit Product</Text>
        <TouchableOpacity 
          onPress={handleDelete}
          className="w-12 h-12 flex items-center justify-center text-error-red hover:bg-error-container rounded-full active:scale-95 duration-150"
        >
          <MaterialIcons name="delete" size={24} color="#BA1A1A" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="flex-1 w-full max-w-md mx-auto" showsVerticalScrollIndicator={false}>
          
          {/* Product Image Section */}
          <View className="relative w-full aspect-square bg-surface-container-low mb-8 group items-center justify-center overflow-hidden">
            {image ? (
              <Image source={{ uri: image }} className="w-full h-full object-cover" />
            ) : (
              <MaterialIcons name="image" size={64} color="#bec9c5" />
            )}
            <View className="absolute inset-0 bg-black/20 items-center justify-center">
              <TouchableOpacity className="bg-surface/90 px-6 py-3 rounded-full flex-row items-center gap-2 active:scale-95 duration-150 shadow-sm">
                <MaterialIcons name="photo-camera" size={20} color="#005147" />
                <Text className="font-semibold text-[14px] text-primary">Change Photo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields */}
          <View className="px-6 flex-col gap-6">
            
            {/* Product Title */}
            <View className="relative w-full">
              <Text className="text-[12px] text-on-surface-variant font-semibold absolute top-2 left-4 z-10">Product Title</Text>
              <TextInput 
                className="block w-full px-4 pt-7 pb-3 bg-surface text-on-surface font-body-md text-[16px] border border-border-subtle rounded-lg focus:border-primary"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Description */}
            <View className="relative w-full">
              <Text className="text-[12px] text-on-surface-variant font-semibold absolute top-2 left-4 z-10">Description</Text>
              <TextInput 
                className="block w-full px-4 pt-7 pb-3 bg-surface text-on-surface font-body-md text-[16px] border border-border-subtle rounded-lg focus:border-primary min-h-[100px]"
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Price & Stock Row */}
            <View className="flex-row gap-4 w-full">
              {/* Price */}
              <View className="relative flex-1">
                <Text className="text-[12px] text-on-surface-variant font-semibold absolute top-2 left-4 z-10">Price</Text>
                <View className="absolute inset-y-0 left-0 flex justify-center pl-4 pt-4 z-10 pointer-events-none">
                  <Text className="text-on-surface-variant text-[16px]">PKR</Text>
                </View>
                <TextInput 
                  className="block w-full pl-14 pr-4 pt-7 pb-3 bg-surface text-on-surface font-body-md text-[16px] border border-border-subtle rounded-lg focus:border-primary"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </View>

              {/* Stock */}
              <View className="relative flex-1">
                <Text className="text-[12px] text-on-surface-variant font-semibold absolute top-2 left-4 z-10">Stock Quantity</Text>
                <TextInput 
                  className="block w-full px-4 pt-7 pb-3 bg-surface text-on-surface font-body-md text-[16px] border border-border-subtle rounded-lg focus:border-primary"
                  value={stock}
                  onChangeText={setStock}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Status Toggle */}
            <View className="w-full flex-row items-center justify-between p-4 bg-surface border border-border-subtle rounded-lg mb-4">
              <View className="flex-col">
                <Text className="font-body-md text-[16px] text-on-surface">Product Status</Text>
                <Text className="font-medium text-[12px] text-on-surface-variant">Visible in your storefront</Text>
              </View>
              <TouchableOpacity 
                activeOpacity={1}
                onPress={() => setIsActive(!isActive)}
                className={`w-11 h-6 rounded-full p-0.5 justify-center ${isActive ? 'bg-primary' : 'bg-surface-variant'}`}
              >
                <View className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
              </TouchableOpacity>
            </View>

            {/* Secondary Delete Action */}
            <TouchableOpacity 
              onPress={handleDelete}
              className="w-full flex-row items-center justify-center gap-2 py-4 border-2 border-error-red rounded-lg bg-transparent mb-6 active:scale-95 duration-150"
            >
              <MaterialIcons name="delete-outline" size={24} color="#BA1A1A" />
              <Text className="font-semibold text-[14px] text-error-red">Delete Product</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 left-0 w-full bg-surface border-t border-border-subtle px-6 py-4 z-50">
        <TouchableOpacity 
          onPress={handleUpdate}
          disabled={saving}
          className="w-full bg-growth-green rounded-lg min-h-[56px] flex items-center justify-center active:scale-[0.98] duration-150 shadow-sm"
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-bold text-[14px] text-on-primary">Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
