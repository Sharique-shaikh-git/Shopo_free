import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const [storeId, setStoreId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('clothing');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tipDismissed, setTipDismissed] = useState(false);

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
    if (name.trim().length < 2) {
      Alert.alert('Invalid Name', 'Shop name must be at least 2 characters.');
      return;
    }
    setSaving(true);
    try {
      if (storeId) {
        await apiFetch(`/stores/${storeId}`, {
          method: 'PATCH',
          body: JSON.stringify({ name: name.trim(), description: description.trim() || undefined, category }),
        });
      } else {
        const newStore = await apiFetch('/stores', {
          method: 'POST',
          body: JSON.stringify({ name: name.trim(), description: description.trim() || undefined, category }),
        });
        if (newStore?.id) setStoreId(newStore.id);
      }
      Alert.alert('Saved', 'Shop settings updated successfully.');
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not save shop settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header — with Android safe area top padding */}
      <Animated.View 
        entering={FadeInDown.duration(400).springify()}
        style={{ paddingTop: Math.max(insets.top, 12) }}
        className="flex-row items-center justify-between px-5 pb-3 border-b border-border-subtle bg-surface"
      >
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="w-10 h-10 rounded-full items-center justify-center bg-surface-container-low"
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="text-[20px] font-bold text-growth-green">Shop Settings</Text>
        <View className="w-10 h-10" />
      </Animated.View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#006B5E" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
          <Text className="text-[14px] text-on-surface-variant mb-6">
            Configure how your customers experience your store.
          </Text>

          <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="gap-5">
            {/* Shop Name */}
            <View>
              <Text className="text-[14px] font-semibold text-on-surface-variant mb-2 ml-1">Shop Name *</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="My Shop"
                style={{ borderRadius: 12 }}
                className="bg-surface-container-lowest border border-border-subtle rounded-xl px-4 py-4 text-[16px] text-on-surface"
                placeholderTextColor="#6e7976"
              />
            </View>

            {/* Description */}
            <View>
              <Text className="text-[14px] font-semibold text-on-surface-variant mb-2 ml-1">Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Tell customers about your shop"
                multiline
                numberOfLines={3}
                style={{ borderRadius: 12 }}
                className="bg-surface-container-lowest border border-border-subtle rounded-xl px-4 py-4 text-[16px] text-on-surface h-24 align-top"
                placeholderTextColor="#6e7976"
              />
            </View>

            {/* Category */}
            <View className="mb-4">
              <Text className="text-[14px] font-semibold text-on-surface-variant mb-3 ml-1">Category</Text>
              <View className="flex-row flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                  const active = category === c.key;
                  return (
                    <TouchableOpacity
                      key={c.key}
                      onPress={() => setCategory(c.key)}
                      activeOpacity={0.85}
                      className={`px-4 py-2.5 rounded-full border ${
                        active ? 'bg-growth-green border-growth-green' : 'bg-surface-container-lowest border-border-subtle'
                      }`}
                    >
                      <Text className={`text-[14px] font-semibold ${active ? 'text-white' : 'text-on-surface'}`}>{c.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </Animated.View>

          {/* AI Tip — dismissible with close X button */}
          {!tipDismissed && (
            <Animated.View entering={FadeInDown.duration(400).delay(220).springify()} className="mt-4 mb-6 p-4 bg-surface-container-lowest border border-border-subtle rounded-xl flex-row gap-3 items-start relative shadow-sm">
              <MaterialIcons name="auto-awesome" size={20} color="#0055D4" style={{ marginTop: 2 }} />
              <View className="flex-1 pr-6">
                <Text className="text-[14px] font-bold text-on-surface mb-1">AI Smart Tip</Text>
                <Text className="text-[13px] text-on-surface-variant leading-5">
                  A clear shop name and category help our AI generate better product descriptions.
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => setTipDismissed(true)} 
                className="absolute top-3 right-3 p-1 rounded-full bg-surface-container-low"
              >
                <MaterialIcons name="close" size={18} color="#6e7976" />
              </TouchableOpacity>
            </Animated.View>
          )}

          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.9}
            className={`mt-4 h-14 rounded-xl items-center justify-center shadow-sm ${saving ? 'bg-growth-green opacity-70' : 'bg-growth-green'}`}
          >
            {saving ? <ActivityIndicator color="#ffffff" /> : <Text className="text-white text-[16px] font-bold">Save Changes</Text>}
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
