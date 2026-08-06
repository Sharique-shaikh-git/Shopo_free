import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { apiFetch, setToken } from '../../lib/api';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string }>();

  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState(params.phone || '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Pre-fill phone from phone screen if passed
  useEffect(() => {
    if (params.phone) {
      setPhone(params.phone);
    }
  }, [params.phone]);

  const handleSubmit = async () => {
    if (!phone || (!isLogin && !name) || !password) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin
        ? { phone, password }
        : { phone, password, name, language: 'en' };

      const res = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (res.token) {
        await setToken(res.token);
        router.replace('/(app)' as any);
      }
    } catch (err: any) {
      Alert.alert(
        isLogin ? 'Login Failed' : 'Registration Failed',
        err.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-container-lowest">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full"
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color="#1a1c1e" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo & Title */}
          <Animated.View
            entering={FadeInDown.duration(600).springify()}
            className="items-center mb-8 mt-4"
          >
            <View className="w-16 h-16 rounded-2xl bg-[#006B5E] items-center justify-center mb-4 shadow-sm">
              <MaterialIcons name="storefront" size={32} color="white" />
            </View>
            <Text className="text-[28px] font-bold text-on-surface tracking-tight">Shopo</Text>
            <Text className="text-[15px] text-on-surface-variant text-center mt-1 leading-5">
              {isLogin ? 'Welcome back! Manage your shop.' : 'Create your online shop in 5 minutes.'}
            </Text>
          </Animated.View>

          {/* Login / Sign Up Tabs */}
          <Animated.View
            entering={FadeInDown.duration(600).delay(100).springify()}
            className="bg-surface-container-low p-1 rounded-xl flex-row mb-6"
          >
            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg items-center ${isLogin ? 'bg-surface-container-lowest shadow-sm' : ''}`}
              onPress={() => setIsLogin(true)}
              activeOpacity={0.7}
            >
              <Text className={`font-semibold text-[14px] ${isLogin ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg items-center ${!isLogin ? 'bg-surface-container-lowest shadow-sm' : ''}`}
              onPress={() => setIsLogin(false)}
              activeOpacity={0.7}
            >
              <Text className={`font-semibold text-[14px] ${!isLogin ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Form */}
          <Animated.View
            entering={FadeInDown.duration(600).delay(200).springify()}
            className="gap-5"
          >
            {/* Full Name (Sign Up only) */}
            {!isLogin && (
              <View>
                <Text className="text-[14px] font-semibold mb-2 ml-1 text-on-surface-variant tracking-wide">
                  Full Name
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Ali Ahmed"
                  className="bg-white border border-outline-variant rounded-xl px-4 py-4 text-[16px] text-on-surface"
                  style={{ borderRadius: 12 }}
                  placeholderTextColor="#6e7976"
                  autoCapitalize="words"
                />
              </View>
            )}

            {/* Phone Number */}
            <View>
              <Text className="text-[14px] font-semibold mb-2 ml-1 text-on-surface-variant tracking-wide">
                Phone Number
              </Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="0300 1234567"
                keyboardType="phone-pad"
                className="bg-white border border-outline-variant rounded-xl px-4 py-4 text-[16px] text-on-surface"
                style={{ borderRadius: 12 }}
                placeholderTextColor="#6e7976"
              />
            </View>

            {/* Password */}
            <View>
              <Text className="text-[14px] font-semibold mb-2 ml-1 text-on-surface-variant tracking-wide">
                Password
              </Text>
              <View className="relative">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  secureTextEntry={!showPassword}
                  className="bg-white border border-outline-variant rounded-xl px-4 pr-12 py-4 text-[16px] text-on-surface"
                  style={{ borderRadius: 12 }}
                  placeholderTextColor="#6e7976"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="absolute right-4 top-4"
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    size={22}
                    color="#6e7976"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {/* Submit Button */}
          <Animated.View
            entering={FadeIn.duration(500).delay(300)}
            className="mt-8"
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleSubmit}
              disabled={isLoading}
              className={`w-full h-14 rounded-xl flex-row items-center justify-center gap-2 shadow-sm ${
                isLoading ? 'bg-[#006B5E] opacity-60' : 'bg-[#006B5E]'
              }`}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <View className="flex-row items-center justify-center gap-2">
                  <Text className="text-white font-semibold text-[15px] tracking-wide">
                    {isLogin ? 'Login to My Shop' : 'Create Account'}
                  </Text>
                  <MaterialIcons name="arrow-forward" size={20} color="white" />
                </View>
              )}
            </TouchableOpacity>

            {/* Toggle hint */}
            <TouchableOpacity
              className="items-center mt-5"
              onPress={() => setIsLogin(!isLogin)}
              activeOpacity={0.7}
            >
              <Text className="text-[14px] text-on-surface-variant">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <Text className="text-[#006B5E] font-semibold">
                  {isLogin ? 'Sign Up' : 'Login'}
                </Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
