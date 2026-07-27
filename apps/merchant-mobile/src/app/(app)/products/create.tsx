import { useState } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { Button } from '../../../components/Button';
import { apiFetch } from '../../../lib/api';

export default function CreateProductScreen() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreate = async () => {
    if (!title || !price || !stock) {
      Alert.alert('Error', 'Title, price, and stock are required');
      return;
    }

    setLoading(true);
    try {
      // In a real app, we would upload the image to a bucket and get a URL.
      // For now, we'll use a placeholder or base64 if needed, but since it's an AI MVP:
      const mockImageUrl = image || 'https://via.placeholder.com/400';

      await apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          price,
          stock: parseInt(stock, 10),
          thumbnailUrl: mockImageUrl,
        }),
      });
      
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-6 py-4 bg-surface-container-lowest border-b border-border-subtle flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full">
          <Feather name="arrow-left" size={24} color="#006b5e" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-on-surface">Add Product</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 pt-6">
          <Text className="text-sm font-medium mb-2 text-foreground">Product Image</Text>
          <TouchableOpacity 
            onPress={pickImage}
            className="h-48 bg-surface-container rounded-2xl border-2 border-dashed border-border-subtle justify-center items-center mb-6 overflow-hidden"
          >
            {image ? (
              <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <View className="items-center">
                <Feather name="camera" size={32} color="#6e7976" />
                <Text className="text-muted-foreground mt-2 font-medium">Tap to upload photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <View className="mb-4">
            <Text className="text-sm font-medium mb-1 ml-1 text-foreground">Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Premium Lawn Suit"
              className="bg-background border border-border rounded-xl px-4 py-4 text-base"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium mb-1 ml-1 text-foreground">Description (AI will improve this)</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your product..."
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
                placeholder="4500"
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
                placeholder="10"
                keyboardType="numeric"
                className="bg-background border border-border rounded-xl px-4 py-4 text-base"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          <Button 
            title={loading ? "Saving..." : "Save Product"} 
            onPress={handleCreate} 
            disabled={loading}
          />
          <View className="h-12" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
