import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { apiFetch } from '../../../../lib/api';

const CATEGORIES = [
  { key: 'clothing', label: 'Apparel' },
  { key: 'cosmetics', label: 'Cosmetics' },
  { key: 'grocery', label: 'Grocery' },
  { key: 'mobile_accessories', label: 'Mobile Accessories' },
  { key: 'home_decor', label: 'Home Decor' },
  { key: 'food', label: 'Food' },
  { key: 'other', label: 'Other' },
];

export default function ShopConfigScreen() {
  const router = useRouter();
  const [storeId, setStoreId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('clothing');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch('/stores')
      .then((stores: any[]) => {
        const store = stores?.[0];
        if (store) {
          setStoreId(store.id);
          setName(store.name || '');
          setDescription(store.description || '');
          if (store.category) setCategory(store.category);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!storeId) {
      Alert.alert('No shop', 'Please create a shop first.');
      return;
    }
    if (name.trim().length < 2) {
      Alert.alert('Invalid name', 'Shop name must be at least 2 characters.');
      return;
    }
    setSaving(true);
    try {
      await apiFetch(`/stores/${storeId}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: name.trim(), description: description.trim() || undefined, category }),
      });
      Alert.alert('Saved', 'Shop settings updated.');
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <Animated.View entering={FadeInDown.duration(400).springify()} className="flex-row items-center justify-between px-gutter-mobile py-4 border-b border-border-subtle">
        <TouchableOpacity onPress={() => router.back()} className="w-touch-target-min h-touch-target-min justify-center">
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="font-headline-md text-headline-md font-bold text-growth-green">Shop Settings</Text>
        <View className="w-touch-target-min h-touch-target-min" />
      </Animated.View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#006B5E" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          <Text className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">
            Configure how your customers experience your store.
          </Text>

          <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="gap-4">
            {/* Shop Name */}
            <View>
              <Text className="font-label-lg text-label-lg text-on-surface-variant mb-2 ml-1">Shop Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="My Shop"
                className="bg-surface-container-lowest border border-border-subtle rounded-xl px-4 py-4 font-body-md text-body-md text-on-surface"
                placeholderTextColor="#6e7976"
              />
            </View>

            {/* Description */}
            <View>
              <Text className="font-label-lg text-label-lg text-on-surface-variant mb-2 ml-1">Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Tell customers about your shop"
                multiline
                numberOfLines={3}
                className="bg-surface-container-lowest border border-border-subtle rounded-xl px-4 py-4 font-body-md text-body-md text-on-surface h-24 align-top"
                placeholderTextColor="#6e7976"
              />
            </View>

            {/* Category */}
            <View>
              <Text className="font-label-lg text-label-lg text-on-surface-variant mb-2 ml-1">Category</Text>
              <View className="flex-row flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                  const active = category === c.key;
                  return (
                    <TouchableOpacity
                      key={c.key}
                      onPress={() => setCategory(c.key)}
                      activeOpacity={0.85}
                      className={`px-4 py-2 rounded-full border ${
                        active ? 'bg-growth-green border-growth-green' : 'bg-surface-container-lowest border-border-subtle'
                      }`}
                    >
                      <Text className={`font-label-lg text-label-lg ${active ? 'text-white' : 'text-on-surface'}`}>{c.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </Animated.View>

          {/* AI tip */}
          <Animated.View entering={FadeInDown.duration(400).delay(220).springify()} className="mt-stack-lg p-4 bg-surface-container-lowest border border-border-subtle rounded-xl flex-row gap-3 items-start">
            <MaterialIcons name="auto-awesome" size={20} color="#0055D4" />
            <View className="flex-1">
              <Text className="font-label-lg text-label-lg text-on-surface mb-1">AI Smart Tip</Text>
              <Text className="font-body-md text-body-md text-on-surface-variant leading-5">
                A clear shop name and category help our AI generate better product descriptions.
              </Text>
            </View>
          </Animated.View>

          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.9}
            className={`mt-6 h-14 rounded-xl items-center justify-center ${saving ? 'bg-growth-green opacity-70' : 'bg-growth-green'}`}
          >
            {saving ? <ActivityIndicator color="#ffffff" /> : <Text className="text-white font-label-lg text-label-lg font-bold">Save Changes</Text>}
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
