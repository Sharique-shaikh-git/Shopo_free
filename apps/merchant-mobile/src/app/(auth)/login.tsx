import { useState } from 'react';
import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch, setToken } from '../../lib/api';
import { Button } from '../../components/Button';

export default function LoginScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!phone || (!isLogin && !name)) {
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
        router.replace('/(app)/dashboard');
      }
    } catch (err: any) {
      Alert.alert('Authentication Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background p-6 justify-center"
    >
      <View className="items-center mb-10">
        <Text className="text-4xl font-bold text-primary mb-2">Shopo</Text>
        <Text className="text-muted-foreground text-center">
          {isLogin ? 'Welcome back! Let\'s manage your shop.' : 'Create your online shop in 5 minutes.'}
        </Text>
      </View>

      <View className="bg-card p-6 rounded-3xl shadow-sm border border-border">
        {/* Tabs */}
        <View className="flex-row mb-6 bg-muted p-1 rounded-xl">
          <TouchableOpacity 
            className={`flex-1 py-3 rounded-lg items-center ${isLogin ? 'bg-background shadow-sm' : ''}`}
            onPress={() => setIsLogin(true)}
          >
            <Text className={`font-semibold ${isLogin ? 'text-foreground' : 'text-muted-foreground'}`}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 py-3 rounded-lg items-center ${!isLogin ? 'bg-background shadow-sm' : ''}`}
            onPress={() => setIsLogin(false)}
          >
            <Text className={`font-semibold ${!isLogin ? 'text-foreground' : 'text-muted-foreground'}`}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View className="space-y-4">
          {!isLogin && (
            <View>
              <Text className="text-sm font-medium mb-1 ml-1 text-foreground">Full Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Ali Ahmed"
                className="bg-background border border-border rounded-xl px-4 py-4 text-base"
                placeholderTextColor="#9ca3af"
              />
            </View>
          )}

          <View>
            <Text className="text-sm font-medium mb-1 ml-1 text-foreground">Phone Number</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="0300 1234567"
              keyboardType="phone-pad"
              className="bg-background border border-border rounded-xl px-4 py-4 text-base"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View>
            <Text className="text-sm font-medium mb-1 ml-1 text-foreground">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••"
              secureTextEntry
              className="bg-background border border-border rounded-xl px-4 py-4 text-base"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <Button 
            title={isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')} 
            onPress={handleSubmit}
            disabled={isLoading}
            className="mt-4"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
