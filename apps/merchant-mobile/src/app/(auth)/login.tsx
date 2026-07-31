import { useState } from 'react';
import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { apiFetch, setToken } from '../../lib/api';
import { Button } from '../../components/Button';

export default function LoginScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!phone || (!isLogin && !name) || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
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
        router.replace('/(app)');
      }
    } catch (err: any) {
      Alert.alert('Authentication Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
          <View className="items-center mb-12">
            <Text className="text-[32px] font-bold text-primary mb-3">Shopo</Text>
            <Text className="text-muted-foreground text-center text-[16px] leading-6">
              {isLogin ? 'Welcome back! Let\'s manage your shop.' : 'Create your online shop in 5 minutes.'}
            </Text>
          </View>

          <View className="bg-surface-container-lowest p-6 rounded-[16px] border border-border-subtle">
            {/* Tabs */}
            <View className="flex-row mb-8 bg-surface-container-low p-1 rounded-xl">
              <TouchableOpacity 
                className={`flex-1 py-3 rounded-lg items-center ${isLogin ? 'bg-surface-container-lowest shadow-sm' : ''}`}
                onPress={() => setIsLogin(true)}
              >
                <Text className={`font-semibold text-[14px] ${isLogin ? 'text-foreground' : 'text-muted-foreground'}`}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className={`flex-1 py-3 rounded-lg items-center ${!isLogin ? 'bg-surface-container-lowest shadow-sm' : ''}`}
                onPress={() => setIsLogin(false)}
              >
                <Text className={`font-semibold text-[14px] ${!isLogin ? 'text-foreground' : 'text-muted-foreground'}`}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View className="space-y-6">
              {!isLogin && (
                <View>
                  <Text className="text-[14px] font-semibold mb-2 ml-1 text-foreground">Full Name</Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Ali Ahmed"
                    className="bg-surface-container-lowest border border-border-subtle rounded-xl px-4 py-4 text-[16px]"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              )}

              <View>
                <Text className="text-[14px] font-semibold mb-2 ml-1 text-foreground">Phone Number</Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="0300 1234567"
                  keyboardType="phone-pad"
                  className="bg-surface-container-lowest border border-border-subtle rounded-xl px-4 py-4 text-[16px]"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View>
                <Text className="text-[14px] font-semibold mb-2 ml-1 text-foreground">Password</Text>
                <View className="relative">
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••"
                    secureTextEntry={!showPassword}
                    className="bg-surface-container-lowest border border-border-subtle rounded-xl pl-4 pr-12 py-4 text-[16px]"
                    placeholderTextColor="#9ca3af"
                  />
                  <TouchableOpacity 
                    className="absolute right-4 top-1/2 -translate-y-1/2" 
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#6e7976" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="mt-6">
                <Button 
                  title={isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')} 
                  onPress={handleSubmit}
                  disabled={isLoading}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
