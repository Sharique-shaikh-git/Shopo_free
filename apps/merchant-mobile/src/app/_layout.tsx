import { Slot, useRouter, useSegments } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { getToken, removeToken, apiFetch } from '../lib/api';
import { AnimatedSplashScreen } from '../components/AnimatedSplashScreen';
import { ThemeProvider, useThemePreference } from '../context/ThemeContext';

import { SafeAreaProvider } from 'react-native-safe-area-context';

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useThemePreference();
  return (
    <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#121212' : '#f9f9fc' }} className={theme === 'dark' ? 'dark' : ''}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      {children}
    </View>
  );
}

import { Stack } from 'expo-router';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const token = await getToken();
      const inAuthGroup = segments[0] === '(auth)';

      if (!token) {
        if (!inAuthGroup) {
          router.replace('/(auth)/welcome');
        }
        return;
      }

      if (inAuthGroup) {
        router.replace('/(app)' as any);
      }
    } catch (err) {
      if (segments[0] !== '(auth)') {
        router.replace('/(auth)/welcome');
      }
    } finally {
      setIsReady(true);
    }
  }, [segments, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isReady) return <AnimatedSplashScreen />;

  return <View style={{ flex: 1 }}>{children}</View>;
}

import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Be Vietnam Pro': require('../../assets/fonts/BeVietnamPro-Regular.ttf'),
    'BeVietnamPro-Medium': require('../../assets/fonts/BeVietnamPro-Medium.ttf'),
    'BeVietnamPro-SemiBold': require('../../assets/fonts/BeVietnamPro-SemiBold.ttf'),
    'BeVietnamPro-Bold': require('../../assets/fonts/BeVietnamPro-Bold.ttf'),
  });

  if (!fontsLoaded && !fontError) {
    return <AnimatedSplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemeWrapper>
          <AuthGuard>
            <Stack screenOptions={{ headerShown: false }} />
          </AuthGuard>
        </ThemeWrapper>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
