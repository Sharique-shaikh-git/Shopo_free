import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ReportScreen() {
  const router = useRouter();
  const [problemType, setProblemType] = useState('Select problem type');
  const [description, setDescription] = useState('');

  const PROBLEM_TYPES = ['Issue with an Order', 'App not working correctly', 'Account access problem', 'Other'];

  const handleSubmit = () => {
    Alert.alert('Thank you', 'We received your report.');
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        className="w-full flex-row justify-between items-center px-gutter-mobile py-4 border-b border-border-subtle"
      >
        <TouchableOpacity
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="w-10 h-10 items-start justify-center rounded-full active:scale-95"
        >
          <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="font-headline-md text-headline-md text-on-surface">Report Problem</Text>
        <View className="w-10" />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="px-gutter-mobile py-stack-lg"
      >
        {/* Form */}
        <Animated.View entering={FadeInDown.duration(400).delay(50).springify()} className="gap-stack-lg">
          {/* Problem Type Dropdown */}
          <View className="relative">
            <TouchableOpacity
              className="flex-row justify-between items-center rounded-lg border border-outline-variant bg-surface px-4 py-4 min-h-[56px]"
              onPress={() => {}}
            >
              <Text className={`font-body-md text-body-md ${problemType === 'Select problem type' ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                {problemType}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#6e7976" />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View className="relative">
            <TextInput
              multiline
              numberOfLines={5}
              placeholder="Describe the issue"
              placeholderTextColor="#6e7976"
              value={description}
              onChangeText={setDescription}
              className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-4 font-body-md text-body-md text-on-surface"
            />
          </View>

          {/* Attach Screenshot */}
          <TouchableOpacity className="flex-row items-center justify-center gap-2 border-2 border-trust-blue rounded-full min-h-[48px] active:scale-[0.98]">
            <MaterialIcons name="add-photo-alternate" size={22} color="#0055D4" />
            <Text className="font-label-lg text-label-lg text-trust-blue font-bold">
              Attach Screenshot
            </Text>
          </TouchableOpacity>

          {/* Device Info */}
          <View className="flex-row items-start gap-3 bg-surface-gray p-stack-md rounded-lg border border-border-subtle">
            <MaterialIcons name="info" size={24} color="#6e7976" />
            <View className="flex-1">
              <Text className="font-label-lg text-label-lg text-on-surface-variant">Device Information included</Text>
              <Text className="font-label-sm textLabel-sm text-outline mt-1">
                To help us fix the issue faster, basic device details (OS version, app version, connection type) will be securely sent with this report.
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Action */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface border-t border-border-subtle p-gutter-mobile">
        <TouchableOpacity
          className="w-full bg-growth-green rounded-full min-h-[48px] items-center justify-center active:scale-[0.98]"
          onPress={handleSubmit}
        >
          <Text className="font-label-lg text-label-lg text-on-primary font-bold">Submit Report</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
