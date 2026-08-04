import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function TermsScreen() {
  const router = useRouter();

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
        <Text className="font-headline-md text-headline-md text-on-surface">Terms of Service</Text>
        <View className="w-10" />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="px-margin-mobile py-stack-lg"
      >
        {/* Header Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(50).springify()} className="mb-stack-lg">
          <Text className="font-label-lg text-label-lg text-outline mb-stack-sm">LAST UPDATED: OCTOBER 24, 2023</Text>
          <Text className="font-headline-lg-mobile text-headline-lg-mobile text-growth-green mb-2">
            Merchant Agreement
          </Text>
          <Text className="font-body-md text-body-md text-on-surface-variant mt-2">
            Please read these terms carefully before using the Shop Builder platform. These terms govern your use of our services to build and manage your digital storefront.
          </Text>
        </Animated.View>

        <View className="h-stack-sm" />

        {/* Sections */}
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="gap-stack-lg">
          {/* Section 1 */}
          <View className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md">
            <Text className="font-headline-md text-headline-md text-on-surface flex-row items-center gap-2 mb-stack-sm">
              <Text className="text-outline">1.</Text> Acceptance of Terms
            </Text>
            <View>
              <Text className="font-body-md text-body-md text-on-surface-variant mb-4">
                By accessing or using the Shop Builder application ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access the Service.
              </Text>
              <Text className="font-body-md text-body-md text-on-surface-variant">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. We will try to provide at least 30 days notice prior to any new terms taking effect.
              </Text>
            </View>
          </View>

          {/* Section 2 */}
          <View className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md">
            <Text className="font-headline-md text-headline-md text-on-surface flex-row items-center gap-2 mb-stack-sm">
              <Text className="text-outline">2.</Text> Merchant Responsibilities
            </Text>
            <View>
              <Text className="font-body-md text-body-md text-on-surface-variant mb-4">
                As a merchant utilizing our platform, you are solely responsible for:
              </Text>
              <View className="pl-5 gap-2 mb-4">
                <Text className="font-body-md text-body-md text-on-surface-variant">The accuracy, quality, and legality of the products you list.</Text>
                <Text className="font-body-md text-body-md text-on-surface-variant">Fulfilling orders promptly and handling customer inquiries professionally.</Text>
                <Text className="font-body-md text-body-md text-on-surface-variant">Ensuring that your storefront content does not violate any intellectual property rights.</Text>
                <Text className="font-body-md text-body-md text-on-surface-variant">Maintaining the confidentiality of your account credentials.</Text>
              </View>
              <Text className="font-body-md text-body-md text-on-surface-variant">
                You agree not to use the Service for any unlawful purpose or in any way that interrupts, damages, or impairs the Service.
              </Text>
            </View>
          </View>

          {/* Section 3 */}
          <View className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md">
            <Text className="font-headline-md text-headline-md text-on-surface flex-row items-center gap-2 mb-stack-sm">
              <Text className="text-outline">3.</Text> Payments & Fees
            </Text>
            <View>
              <Text className="font-body-md text-body-md text-on-surface-variant mb-4">
                Shop Builder provides digital tools to facilitate transactions. While setting up a basic storefront may be free, premium features or transaction processing may incur fees.
              </Text>
              <View className="bg-surface-container-low p-4 rounded-md mb-4 border border-border-subtle flex-row items-start gap-3">
                <MaterialIcons name="info" size={24} color="#0055D4" />
                <Text className="font-body-md text-body-md text-on-surface-variant flex-1 text-sm">
                  Any applicable fees will be clearly communicated before you commit to a premium tier or specific transactional service. We do not hold funds directly unless utilizing an integrated payment gateway.
                </Text>
              </View>
              <Text className="font-body-md text-body-md text-on-surface-variant">
                You are responsible for all taxes applicable to your sales.
              </Text>
            </View>
          </View>

          {/* Section 4 */}
          <View className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md">
            <Text className="font-headline-md text-headline-md text-on-surface flex-row items-center gap-2 mb-stack-sm">
              <Text className="text-outline">4.</Text> Privacy & Data Usage
            </Text>
            <View>
              <Text className="font-body-md text-body-md text-on-surface-variant mb-4">
                Your privacy is important to us. Our use of your data and your customers' data is governed by our Privacy Policy.
              </Text>
              <Text className="font-body-md text-body-md text-on-surface-variant">
                By using the Service, you grant us the right to aggregate anonymized data to improve our platform, develop new features, and provide AI-driven insights for your storefront.
              </Text>
            </View>
          </View>

          {/* Section 5 */}
          <View className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-md">
            <Text className="font-headline-md text-headline-md text-on-surface flex-row items-center gap-2 mb-stack-sm">
              <Text className="text-outline">5.</Text> Termination
            </Text>
            <View>
              <Text className="font-body-md text-body-md text-on-surface-variant">
                We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
              </Text>
            </View>
          </View>
        </Animated.View>

        <View className="items-center mt-8">
          <MaterialIcons name="verified-user" size={48} color="#bec9c5" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
