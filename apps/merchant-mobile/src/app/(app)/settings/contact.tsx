import { View, Text, ScrollView, TextInput, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const ISSUE_TYPES = ['Order Tracking', 'Payment Issue', 'Account Support', 'Other'];

export default function ContactSupportScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [issue, setIssue] = useState('');
  const [message, setMessage] = useState('');
  const [showIssueDropdown, setShowIssueDropdown] = useState(false);

  return (
    <View className="flex-1 bg-[#F9F9FC]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-[#F9F9FC] border-b border-[#E0E3DE]">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-start">
          <Ionicons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[20px] font-semibold text-[#1a1c1e]">Contact Us</Text>
        <View className="w-12" />
      </View>

      <ScrollView className="flex-1 px-4 pt-6 pb-32">
        {/* Header Text */}
        <View className="items-center mb-6">
          <Text className="text-[28px] font-bold text-[#005147] mb-2">We're here to help</Text>
          <Text className="text-[16px] text-[#75797E] text-center px-4">
            Choose a method below or send us a message directly.
          </Text>
        </View>

        {/* Support Options */}
        <View className="gap-4 mb-6">
          {/* WhatsApp */}
          <TouchableOpacity
            className="flex-row items-center bg-white border border-[#25D366] rounded-xl p-4"
            onPress={() => Linking.openURL('https://wa.me/923001234567')}
          >
            <View className="w-12 h-12 rounded-full bg-[#25D36615] items-center justify-center mr-4">
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-semibold text-[#1a1c1e] mb-1">WhatsApp Chat</Text>
              <Text className="text-[12px] text-[#75797E]">Fastest response</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#75797E" />
          </TouchableOpacity>

          {/* Phone */}
          <TouchableOpacity
            className="flex-row items-center bg-white border border-[#E0E3DE] rounded-xl p-4"
            onPress={() => Linking.openURL('tel:+923001234567')}
          >
            <View className="w-12 h-12 rounded-full bg-[#E3F2FD] items-center justify-center mr-4">
              <Ionicons name="call" size={24} color="#0B57A4" />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-semibold text-[#1a1c1e] mb-1">Call Us</Text>
              <Text className="text-[12px] text-[#75797E]">Mon-Sat, 9am-6pm</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#75797E" />
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity
            className="flex-row items-center bg-white border border-[#E0E3DE] rounded-xl p-4"
            onPress={() => Linking.openURL('mailto:support@shopo.pk')}
          >
            <View className="w-12 h-12 rounded-full bg-[#E7E0EC] items-center justify-center mr-4">
              <Ionicons name="mail" size={24} color="#005147" />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-semibold text-[#1a1c1e] mb-1">Email</Text>
              <Text className="text-[12px] text-[#75797E]">Usually replies in 24h</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#75797E" />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View className="flex-row items-center gap-4 mb-6">
          <View className="h-px bg-[#E0E3DE] flex-1" />
          <Text className="text-[12px] text-[#75797E] uppercase tracking-wider">Or</Text>
          <View className="h-px bg-[#E0E3DE] flex-1" />
        </View>

        {/* Contact Form */}
        <View className="bg-white border border-[#E0E3DE] rounded-xl p-4 mb-6">
          <Text className="text-[14px] font-semibold text-[#1a1c1e] mb-4">Send a Message</Text>

          {/* Name */}
          <View className="mb-4">
            <TextInput
              className="w-full px-4 py-4 border border-[#79747E] rounded-lg text-[16px] text-[#1a1c1e]"
              placeholder="Your Name"
              placeholderTextColor="#75797E"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Issue Type */}
          <View className="mb-4 relative">
            <TouchableOpacity
              className="w-full px-4 py-4 border border-[#79747E] rounded-lg flex-row items-center justify-between bg-white"
              onPress={() => setShowIssueDropdown(!showIssueDropdown)}
            >
              <Text className={`text-[16px] ${issue ? 'text-[#1a1c1e]' : 'text-[#75797E]'}`}>
                {issue || 'Issue Type'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#75797E" />
            </TouchableOpacity>
            {showIssueDropdown && (
              <View className="absolute top-full left-0 right-0 bg-white border border-[#E0E3DE] rounded-lg z-10 shadow-md">
                {ISSUE_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    className="px-4 py-3 border-b border-[#E0E3DE] last:border-b-0"
                    onPress={() => { setIssue(type); setShowIssueDropdown(false); }}
                  >
                    <Text className="text-[16px] text-[#1a1c1e]">{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Message */}
          <TextInput
            className="w-full px-4 py-4 border border-[#79747E] rounded-lg text-[16px] text-[#1a1c1e] h-28 text-top"
            placeholder="How can we help?"
            placeholderTextColor="#75797E"
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Support Hours */}
        <View className="flex-row bg-[#F2F0F4] p-4 rounded-lg border border-[#E0E3DE] mb-6">
          <Ionicons name="information-circle" size={20} color="#79747E" style={{ marginRight: 12, marginTop: 2 }} />
          <View className="flex-1">
            <Text className="text-[14px] font-semibold text-[#1a1c1e] mb-1">Support Hours</Text>
            <Text className="text-[12px] text-[#75797E]">
              Our team is available Monday to Saturday, from 9:00 AM to 6:00 PM (PKT). Messages sent outside these hours will be addressed the next business day.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E0E3DE] p-4 pb-8">
        <TouchableOpacity className="w-full h-[56px] bg-[#005147] rounded-full items-center justify-center flex-row gap-2 shadow-sm">
          <Text className="text-[14px] font-semibold text-white">Send Message</Text>
          <Ionicons name="send" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
