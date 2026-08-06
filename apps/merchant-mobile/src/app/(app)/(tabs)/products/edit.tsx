import { View, Text, ScrollView, TextInput, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { apiFetch } from '../../../../lib/api';

const CATEGORIES = ['Home & Decor', 'Electronics', 'Clothing', 'Health & Beauty'];

export default function EditProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    apiFetch(`/products/${id}`)
      .then((p: any) => {
        setTitle(p.title || '');
        setDescription(p.description || '');
        setPrice(String(p.price || ''));
        setStock(String(p.stock || ''));
        setCategory(p.category || '');
        setIsActive(p.status === 'active');
        if (p.images?.[0]) setImageUri(p.images[0]);
      })
      .catch(() => Alert.alert('Error', 'Could not load product'))
      .finally(() => setLoading(false));
  }, [id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Product', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => router.back() },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-[#E0E3DE]">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-center">
          <Ionicons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[20px] font-semibold text-[#1a1c1e]">Edit Product</Text>
        <TouchableOpacity onPress={handleDelete} className="w-12 h-12 items-center justify-center">
          <Ionicons name="trash" size={24} color="#BA1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 pb-32">
        {/* Product Image */}
        <TouchableOpacity onPress={pickImage} className="relative w-full aspect-square bg-[#F2F0F4] mb-6">
          {imageUri ? (
            <View className="w-full h-full items-center justify-center">
              <Ionicons name="image" size={48} color="#75797E" />
            </View>
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Ionicons name="camera" size={48} color="#75797E" />
              <Text className="text-[14px] text-[#75797E] mt-2">Change Photo</Text>
            </View>
          )}
          <View className="absolute bottom-4 right-4 bg-white w-12 h-12 rounded-full items-center justify-center shadow-md">
            <Ionicons name="camera" size={22} color="#005147" />
          </View>
        </TouchableOpacity>

        {/* Form */}
        <View className="px-4 gap-5">
          {/* Title */}
          <View className="relative">
            <TextInput
              className="w-full px-4 py-4 pt-6 bg-white border border-[#E0E3DE] rounded-lg text-[16px] text-[#1a1c1e] focus:border-[#005147]"
              value={title}
              onChangeText={setTitle}
            />
            <Text className="absolute left-4 top-2 text-[12px] text-[#75797E]">Product Title</Text>
          </View>

          {/* Description */}
          <View className="relative">
            <TextInput
              className="w-full px-4 py-4 pt-6 bg-white border border-[#E0E3DE] rounded-lg text-[16px] text-[#1a1c1e] min-h-[100px] text-top"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
            <Text className="absolute left-4 top-2 text-[12px] text-[#75797E]">Description</Text>
          </View>

          {/* Price & Stock Row */}
          <View className="flex-row gap-4">
            <View className="relative flex-1">
              <View className="absolute left-4 top-4">
                <Text className="text-[16px] text-[#75797E]">PKR</Text>
              </View>
              <TextInput
                className="w-full pl-14 pr-4 py-4 pt-6 bg-white border border-[#E0E3DE] rounded-lg text-[16px] text-[#1a1c1e]"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
              <Text className="absolute left-14 top-2 text-[12px] text-[#75797E]">Price</Text>
            </View>
            <View className="relative flex-1">
              <TextInput
                className="w-full px-4 py-4 pt-6 bg-white border border-[#E0E3DE] rounded-lg text-[16px] text-[#1a1c1e]"
                value={stock}
                onChangeText={setStock}
                keyboardType="numeric"
              />
              <Text className="absolute left-4 top-2 text-[12px] text-[#75797E]">Stock Quantity</Text>
            </View>
          </View>

          {/* Category Dropdown */}
          <View className="relative">
            <TouchableOpacity
              className="w-full px-4 py-4 pt-6 bg-white border border-[#E0E3DE] rounded-lg flex-row items-center justify-between"
              onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <Text className="text-[16px] text-[#1a1c1e]">{category}</Text>
              <Ionicons name="chevron-down" size={20} color="#75797E" />
            </TouchableOpacity>
            <Text className="absolute left-4 top-2 text-[12px] text-[#75797E]">Category</Text>
            {showCategoryDropdown && (
              <View className="absolute top-full left-0 right-0 bg-white border border-[#E0E3DE] rounded-lg z-10 shadow-md mt-1">
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    className="px-4 py-3 border-b border-[#E0E3DE] last:border-b-0"
                    onPress={() => { setCategory(cat); setShowCategoryDropdown(false); }}
                  >
                    <Text className="text-[16px] text-[#1a1c1e]">{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Status Toggle */}
          <View className="flex-row items-center justify-between p-4 bg-white border border-[#E0E3DE] rounded-lg">
            <View>
              <Text className="text-[16px] text-[#1a1c1e]">Product Status</Text>
              <Text className="text-[12px] text-[#75797E]">Visible in your storefront</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Text className={`text-[14px] font-semibold ${isActive ? 'text-[#005147]' : 'text-[#75797E]'}`}>
                {isActive ? 'Active' : 'Inactive'}
              </Text>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: '#bec9c5', true: '#006B5E' }}
              />
            </View>
          </View>

          {/* Delete Button */}
          <TouchableOpacity
            onPress={handleDelete}
            className="w-full flex-row items-center justify-center gap-2 py-4 border-2 border-[#BA1A1A] rounded-lg mb-4"
          >
            <Ionicons name="trash-outline" size={20} color="#BA1A1A" />
            <Text className="text-[14px] font-semibold text-[#BA1A1A]">Delete Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E0E3DE] px-4 py-4 pb-8">
        <TouchableOpacity className="w-full bg-[#005147] rounded-lg min-h-[56px] items-center justify-center shadow-sm">
          <Text className="text-[14px] font-semibold text-white">Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
