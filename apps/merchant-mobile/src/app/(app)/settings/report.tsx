import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const PROBLEM_TYPES = ['Issue with an Order', 'App not working correctly', 'Account access problem', 'Other'];

export default function ReportProblemScreen() {
  const router = useRouter();
  const [problemType, setProblemType] = useState('');
  const [description, setDescription] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <View className="flex-1 bg-[#F9F9FC]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-[#F9F9FC] border-b border-[#E0E3DE]">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-start">
          <Ionicons name="arrow-back" size={24} color="#1a1c1e" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[20px] font-semibold text-[#1a1c1e]">Report Problem</Text>
        <View className="w-12" />
      </View>

      <ScrollView className="flex-1 px-4 py-6 pb-32">
        {/* Problem Type Dropdown */}
        <View className="mb-4 relative">
          <Text className="text-[12px] font-semibold text-[#75797E] mb-2 ml-1">Problem Type</Text>
          <TouchableOpacity
            className="w-full px-4 py-4 border border-[#79747E] rounded-lg flex-row items-center justify-between bg-white"
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text className={`text-[16px] ${problemType ? 'text-[#1a1c1e]' : 'text-[#75797E]'}`}>
              {problemType || 'Select problem type'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#75797E" />
          </TouchableOpacity>
          {showDropdown && (
            <View className="absolute top-full left-0 right-0 bg-white border border-[#E0E3DE] rounded-lg z-10 shadow-md mt-1">
              {PROBLEM_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  className="px-4 py-3 border-b border-[#E0E3DE] last:border-b-0"
                  onPress={() => { setProblemType(type); setShowDropdown(false); }}
                >
                  <Text className="text-[16px] text-[#1a1c1e]">{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Description */}
        <View className="mb-4">
          <Text className="text-[12px] font-semibold text-[#75797E] mb-2 ml-1">Describe the issue</Text>
          <TextInput
            className="w-full px-4 py-4 border border-[#79747E] rounded-lg text-[16px] text-[#1a1c1e] h-32 text-top"
            placeholder=""
            placeholderTextColor="#75797E"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Attach Screenshot */}
        <TouchableOpacity className="w-full flex-row items-center justify-center gap-2 border-2 border-[#0B57A4] rounded-full h-12 mb-6">
          <Ionicons name="image-outline" size={22} color="#0B57A4" />
          <Text className="text-[14px] font-bold text-[#0B57A4]">Attach Screenshot</Text>
        </TouchableOpacity>

        {/* Device Info */}
        <View className="flex-row bg-[#F2F0F4] p-4 rounded-lg border border-[#E0E3DE] mt-auto">
          <Ionicons name="information-circle" size={20} color="#79747E" style={{ marginRight: 12, marginTop: 2 }} />
          <View className="flex-1">
            <Text className="text-[14px] font-semibold text-[#75797E] mb-1">Device Information included</Text>
            <Text className="text-[12px] text-[#79747E]">
              To help us fix the issue faster, basic device details (OS version, app version, connection type) will be
              securely sent with this report.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E0E3DE] p-4 pb-8">
        <TouchableOpacity className="w-full h-[56px] bg-[#005147] rounded-full items-center justify-center shadow-sm">
          <Text className="text-[14px] font-bold text-white">Submit Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
