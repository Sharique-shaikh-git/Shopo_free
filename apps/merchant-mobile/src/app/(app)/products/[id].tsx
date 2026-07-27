import { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { Button } from '../../../components/Button';
import { apiFetch } from '../../../lib/api';

export default function EditProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const product = await apiFetch(`/products/${id}`);
        setTitle(product.title);
        setDescription(product.description || '');
        setPrice(product.price.toString());
        setStock(product.stock.toString());
        setImage(product.thumbnailUrl);
      } catch (err: any) {
        Alert.alert('Error', 'Failed to load product');
        router.back();
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
            await apiFetch(`/products/${id}`, { method: 'DELETE' });
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
      <SafeAreaView className="flex-1 bg-surface justify-center items-center">
        <ActivityIndicator size="large" color="#006b5e" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-6 py-4 bg-surface-container-lowest border-b border-border-subtle flex-row justify-between items-center">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full">
            <Feather name="arrow-left" size={24} color="#006b5e" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-on-surface">Edit Product</Text>
        </View>
        <TouchableOpacity onPress={handleDelete} className="p-2">
          <Feather name="trash-2" size={24} color="#dc2626" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 pt-6">
          <Text className="text-sm font-medium mb-2 text-foreground">Product Image</Text>
          <TouchableOpacity 
            className="h-48 bg-surface-container rounded-2xl border-2 border-dashed border-border-subtle justify-center items-center mb-6 overflow-hidden"
          >
            {image ? (
              <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <View className="items-center">
                <Feather name="image" size={32} color="#6e7976" />
                <Text className="text-muted-foreground mt-2 font-medium">No Image</Text>
              </View>
            )}
          </TouchableOpacity>

          <View className="mb-4">
            <Text className="text-sm font-medium mb-1 ml-1 text-foreground">Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              className="bg-background border border-border rounded-xl px-4 py-4 text-base"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium mb-1 ml-1 text-foreground">Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              className="bg-background border border-border rounded-xl px-4 py-4 text-base h-28 align-top"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View className="flex-row gap-4 mb-8">
            <View className="flex-1">
              <Text className="text-sm font-medium mb-1 ml-1 text-foreground">Price (Rs)</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                className="bg-background border border-border rounded-xl px-4 py-4 text-base"
                placeholderTextColor="#9ca3af"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium mb-1 ml-1 text-foreground">Stock</Text>
              <TextInput
                value={stock}
                onChangeText={setStock}
                keyboardType="numeric"
                className="bg-background border border-border rounded-xl px-4 py-4 text-base"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          <Button 
            title={saving ? "Saving..." : "Update Product"} 
            onPress={handleUpdate} 
            disabled={saving}
          />
          <View className="h-12" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
