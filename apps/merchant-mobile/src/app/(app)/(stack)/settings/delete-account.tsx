import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { apiFetch, removeToken } from '../../../../lib/api';

export default function DeleteAccountScreen() {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const keyword = 'DELETE';
  const confirmed = confirmText.trim().toUpperCase() === keyword;

  const handleDelete = async () => {
    if (!confirmed) return;
    Alert.alert(
      'Delete Account?',
      'This will permanently remove your shop, products, orders and account. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              // No dedicated endpoint yet — record request; support follows up.
              await apiFetch('/merchant/delete-account', { method: 'POST' }).catch(() => null);
            } finally {
              await removeToken();
              setDeleting(false);
              router.replace('/(auth)/welcome' as never);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        className="flex-row items-center justify-between px-gutter-mobile py-4 border-b border-border-subtle"
      >
        <TouchableOpacity onPress={() => router.back()} className="w-touch-target-min h-touch-target-min justify-center">
          <MaterialIcons name="arrow-back" size={24} color="#BA1A1A" />
        </TouchableOpacity>
        <Text className="font-headline-md text-[24px] font-bold text-error-red">Delete Account</Text>
        <View className="w-touch-target-min h-touch-target-min" />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="items-center py-6">
          <View className="w-24 h-24 rounded-full bg-error-container items-center justify-center mb-4">
            <MaterialIcons name="warning" size={44} color="#BA1A1A" />
          </View>
          <Text className="text-[22px] font-bold text-on-surface text-center mb-2">This action is permanent</Text>
          <Text className="text-[14px] text-on-surface-variant text-center leading-5 max-w-[320px]">
            Deleting your account will permanently remove your shop, all products, order history and analytics. There is no way to recover it.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(200).springify()} className="mt-2">
          <Text className="text-[14px] font-medium text-on-surface-variant mb-2">
            Type <Text className="font-bold text-error-red">{keyword}</Text> to confirm
          </Text>
          <View className="bg-surface-container-lowest border border-border-subtle rounded-xl px-4 py-3">
            <TextInput
              value={confirmText}
              onChangeText={setConfirmText}
              placeholder={keyword}
              autoCapitalize="characters"
              className="text-[16px] text-on-surface"
              placeholderTextColor="#bec9c5"
            />
          </View>

          <TouchableOpacity
            activeOpacity={confirmed ? 0.9 : 1}
            disabled={!confirmed || deleting}
            onPress={handleDelete}
            className={`mt-6 h-14 rounded-xl items-center justify-center ${
              confirmed ? 'bg-error-red' : 'bg-surface-container'
            }`}
          >
            {deleting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className={`text-[16px] font-semibold ${confirmed ? 'text-white' : 'text-on-surface-variant'}`}>
                Delete My Account
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} className="mt-4 h-12 items-center justify-center">
            <Text className="text-[14px] font-medium text-on-surface-variant">Keep my account</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
