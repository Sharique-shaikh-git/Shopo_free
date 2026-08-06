import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Switch, Modal, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const START_TIME_OPTIONS = ['10:00 PM', '11:00 PM', '12:00 AM'];
const END_TIME_OPTIONS = ['6:00 AM', '7:00 AM', '8:00 AM'];

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [newOrders, setNewOrders] = useState(true);

  const headerPadding = Math.max(insets.top, StatusBar.currentHeight || 24, 12);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotionalMessages, setPromotionalMessages] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [startTime, setStartTime] = useState('10:00 PM');
  const [endTime, setEndTime] = useState('7:00 AM');
  const [startPickerVisible, setStartPickerVisible] = useState(false);
  const [endPickerVisible, setEndPickerVisible] = useState(false);

  const renderToggleCard = (
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (v: boolean) => void,
    divider = false,
  ) => (
    <View
      className={`bg-surface-container-lowest border border-border-subtle ${
        divider ? 'rounded-t-xl border-b border-border-subtle' : 'rounded-xl'
      } p-stack-md flex-row justify-between items-center`}
    >
      <View>
        <Text className="font-body-md text-[16px] font-medium text-on-surface">{title}</Text>
        <Text className="font-label-sm text-[12px] text-outline mt-1">{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#e2e2e5', true: '#006B5E' }}
        thumbColor="#fff"
      />
    </View>
  );

  const renderTimePicker = (
    visible: boolean,
    onClose: () => void,
    options: string[],
    selected: string,
    onSelect: (v: string) => void,
  ) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity className="flex-1 bg-black/50 justify-center items-center" onPress={onClose}>
        <View className="bg-surface-container-lowest rounded-xl p-stack-md w-3/4">
          <Text className="font-label-lg text-[14px] font-semibold text-on-surface mb-3">Select Time</Text>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => {
                onSelect(option);
                onClose();
              }}
              className={`py-3 px-2 rounded-lg ${selected === option ? 'bg-primary-container/10' : ''}`}
            >
              <Text
                className={`text-[16px] ${
                  selected === option ? 'text-growth-green font-semibold' : 'text-on-surface'
                }`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/more');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        style={{ paddingTop: headerPadding }}
        className="flex-row items-center justify-between px-5 pb-3 border-b border-border-subtle bg-surface"
      >
        <TouchableOpacity
          accessibilityLabel="Go back"
          onPress={handleBack}
          className="w-touch-target-min h-touch-target-min items-start justify-center rounded-full active:scale-95"
        >
          <MaterialIcons name="arrow-back" size={24} color="#006B5E" />
        </TouchableOpacity>
        <Text className="font-headline-md text-[24px] font-bold text-growth-green flex-1 text-center">Notifications</Text>
        <View className="w-touch-target-min h-touch-target-min" />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="flex-1 px-margin-mobile py-stack-md"
      >
        {/* Push Notifications */}
        <Animated.View entering={FadeInDown.duration(400).delay(100).springify()} className="flex-col gap-stack-sm">
          <Text className="font-label-lg text-[14px] font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
            Push Notifications
          </Text>
          {renderToggleCard('New Orders', 'Get alerts for new customer orders.', newOrders, setNewOrders, true)}
          {renderToggleCard('Order Updates', 'Status changes and tracking.', orderUpdates, setOrderUpdates, true)}
          {renderToggleCard('Promotional Messages', 'Tips, offers, and new features.', promotionalMessages, setPromotionalMessages)}
        </Animated.View>

        {/* Email Notifications */}
        <Animated.View entering={FadeInDown.duration(400).delay(200).springify()} className="flex-col gap-stack-sm mt-stack-lg">
          <Text className="font-label-lg text-[14px] font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
            Email Notifications
          </Text>
          {renderToggleCard('Weekly Report', "Summary of your shop's performance.", weeklyReport, setWeeklyReport, true)}
          {renderToggleCard('Marketing Emails', 'Newsletters and special offers.', marketingEmails, setMarketingEmails)}
        </Animated.View>

        {/* Quiet Hours */}
        <Animated.View entering={FadeInDown.duration(400).delay(300).springify()} className="flex-col gap-stack-sm mt-stack-lg">
          <Text className="font-label-lg text-[14px] font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
            Quiet Hours
          </Text>
          <View className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden">
            <View className="p-stack-md flex-row justify-between items-center border-b border-border-subtle">
              <View>
                <Text className="font-body-md text-[16px] font-medium text-on-surface">Enable Quiet Hours</Text>
                <Text className="font-label-sm text-[12px] text-outline mt-1">Pause notifications during sleep.</Text>
              </View>
              <Switch
                value={quietHoursEnabled}
                onValueChange={setQuietHoursEnabled}
                trackColor={{ false: '#e2e2e5', true: '#006B5E' }}
                thumbColor="#fff"
              />
            </View>
            {quietHoursEnabled ? (
              <View className="p-stack-md flex-row gap-4 bg-surface-gray">
                <View className="flex-1">
                  <Text className="block font-label-sm text-[12px] text-on-surface-variant mb-2">Start Time</Text>
                  <TouchableOpacity
                    onPress={() => setStartPickerVisible(true)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2 flex-row justify-between items-center"
                  >
                    <Text className="font-body-md text-[16px] text-on-surface">{startTime}</Text>
                    <MaterialIcons name="expand-more" size={20} color="#6e7976" />
                  </TouchableOpacity>
                </View>
                <View className="flex-1">
                  <Text className="block font-label-sm text-[12px] text-on-surface-variant mb-2">End Time</Text>
                  <TouchableOpacity
                    onPress={() => setEndPickerVisible(true)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2 flex-row justify-between items-center"
                  >
                    <Text className="font-body-md text-[16px] text-on-surface">{endTime}</Text>
                    <MaterialIcons name="expand-more" size={20} color="#6e7976" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="bg-surface border-t border-border-subtle p-margin-mobile">
        <TouchableOpacity className="w-full bg-growth-green h-[56px] rounded-xl items-center justify-center active:scale-95">
          <Text className="text-on-primary font-body-lg text-[18px] font-medium">Save Preferences</Text>
        </TouchableOpacity>
      </View>

      {renderTimePicker(startPickerVisible, () => setStartPickerVisible(false), START_TIME_OPTIONS, startTime, setStartTime)}
      {renderTimePicker(endPickerVisible, () => setEndPickerVisible(false), END_TIME_OPTIONS, endTime, setEndTime)}
    </SafeAreaView>
  );
}
