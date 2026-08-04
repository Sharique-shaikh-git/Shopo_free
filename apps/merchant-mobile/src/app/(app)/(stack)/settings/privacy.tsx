import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function PrivacyScreen() {
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
          className="w-10 h-10 items-center justify-center rounded-full active:scale-95"
        >
          <MaterialIcons name="arrow-back" size={24} color="#006B5E" />
        </TouchableOpacity>
        <Text className="font-headline-md text-headline-md font-bold text-growth-green flex-1 text-center">
          Privacy Policy
        </Text>
        <View className="w-10" />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="px-gutter-mobile py-stack-lg"
      >
        <Animated.View entering={FadeInDown.duration(400).delay(50).springify()}>
          <Text className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">
            Last updated: October 24, 2023
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="gap-stack-lg">
          {/* What We Collect */}
          <View className="bg-surface-container-lowest border border-border-subtle rounded-lg p-stack-md">
            <View className="flex-row items-center gap-2 mb-stack-sm">
              <MaterialIcons name="policy" size={24} color="#0055D4" />
              <Text className="font-headline-md text-headline-md text-growth-green">What We Collect</Text>
            </View>
            <Text className="font-body-md text-body-md text-on-surface mb-4">
              We collect information to provide better services to all our users. We collect information in the following ways:
            </Text>
            <View className="pl-5 gap-2">
              <Text className="font-body-md text-body-md text-on-surface-variant">
                Information you give us. For example, many of our services require you to sign up for an Account. When you do, we'll ask for personal information, like your name, email address, telephone number.
              </Text>
              <Text className="font-body-md text-body-md text-on-surface-variant">
                Information we get from your use of our services. We collect information about the services that you use and how you use them.
              </Text>
            </View>
          </View>

          {/* How We Use It */}
          <View className="bg-surface-container-lowest border border-border-subtle rounded-lg p-stack-md">
            <View className="flex-row items-center gap-2 mb-stack-sm">
              <MaterialIcons name="psychology" size={24} color="#0055D4" />
              <Text className="font-headline-md text-headline-md text-growth-green">How We Use It</Text>
            </View>
            <Text className="font-body-md text-body-md text-on-surface mb-4">
              We use the information we collect from all of our services to provide, maintain, protect and improve them, to develop new ones, and to protect our users.
            </Text>
            <Text className="font-body-md text-body-md text-on-surface-variant">
              When you contact us, we keep a record of your communication to help solve any issues you might be facing. We may use your email address to inform you about our services, such as letting you know about upcoming changes or improvements.
            </Text>
          </View>

          {/* Data Security */}
          <View className="bg-surface-container-lowest border border-border-subtle rounded-lg p-stack-md">
            <View className="flex-row items-center gap-2 mb-stack-sm">
              <MaterialIcons name="shield" size={24} color="#0055D4" />
              <Text className="font-headline-md text-headline-md text-growth-green">Data Security</Text>
            </View>
            <Text className="font-body-md text-body-md text-on-surface mb-4">
              We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold.
            </Text>
            <View className="pl-5 gap-2">
              <Text className="font-body-md text-body-md text-on-surface-variant">We encrypt many of our services using SSL.</Text>
              <Text className="font-body-md text-body-md text-on-surface-variant">We review our information collection, storage and processing practices, including physical security measures.</Text>
              <Text className="font-body-md text-body-md text-on-surface-variant">We restrict access to personal information to employees, contractors and agents who need to know that information.</Text>
            </View>
          </View>

          {/* Need Help */}
          <View className="bg-surface-container-lowest border border-border-subtle rounded-lg p-stack-md mt-stack-lg flex-row items-center justify-between">
            <View>
              <Text className="font-label-lg text-label-lg text-on-surface">Need Help?</Text>
              <Text className="font-body-md text-body-md text-on-surface-variant text-sm">Contact our support team</Text>
            </View>
            <TouchableOpacity className="min-h-[56px] min-w-[56px] bg-surface-container-low rounded-full flex items-center justify-center active:scale-95 border border-border-subtle">
              <MaterialIcons name="support-agent" size={24} color="#006B5E" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
