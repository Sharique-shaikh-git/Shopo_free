import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SettingsRow, SettingsSection } from '../../../../components/settings-row';

export default function HelpArticlesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        className="w-full flex-row justify-between items-center px-gutter-mobile py-4"
      >
        <TouchableOpacity
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="w-10 h-10 items-start justify-center rounded-full active:scale-95"
        >
          <MaterialIcons name="arrow-back" size={24} color="#006B5E" />
        </TouchableOpacity>
        <Text className="font-headline-md text-headline-md font-bold text-growth-green">
          Managing Products
        </Text>
        <View className="w-10" />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="px-gutter-mobile pt-stack-md"
      >
        <Animated.View entering={FadeInDown.duration(400).delay(50).springify()} className="mb-stack-sm">
          <Text className="font-body-md text-body-md text-on-surface-variant">
            Learn how to effectively manage your inventory, update details, and keep your shop running smoothly.
          </Text>
        </Animated.View>

        {/* Articles */}
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()}>
          <SettingsSection>
            <SettingsRow icon="add-circle" label="How to add a product" onPress={() => {}} />
            <SettingsRow icon="edit" label="How to edit a product" onPress={() => {}} divider />
            <SettingsRow icon="delete" label="How to delete a product" onPress={() => {}} divider />
            <SettingsRow icon="inventory-2" label="How to manage inventory" onPress={() => {}} />
          </SettingsSection>
        </Animated.View>

        <View className="h-stack-lg" />

        {/* Still need help */}
        <Animated.View entering={FadeInDown.duration(400).delay(200).springify()}>
          <View className="mt-stack-lg p-stack-md rounded-xl bg-surface-container-low border border-border-subtle">
            <Text className="font-label-lg text-label-lg text-on-surface font-bold mb-stack-sm">
              Still need help?
            </Text>
            <Text className="font-body-md text-body-md text-on-surface-variant mb-stack-md">
              Our support team is ready to assist you on WhatsApp.
            </Text>
            <TouchableOpacity
              className="min-h-[48px] px-6 rounded-full border-2 border-whatsapp-green flex-row items-center justify-center gap-2 active:scale-95"
              onPress={() => router.push('/(app)/(stack)/settings/contact' as never)}
            >
              <MaterialIcons name="chat" size={20} color="#25D366" />
              <Text className="font-label-lg text-label-lg text-whatsapp-green">
                Chat with Support
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
