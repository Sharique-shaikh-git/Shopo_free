import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { getToken } from '../lib/api';
import { AnimatedSplashScreen } from '../components/AnimatedSplashScreen';
import { ThemeProvider, useThemePreference } from '../context/ThemeContext';

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useThemePreference();
  return (
    <View style={{ flex: 1 }} className={theme === 'dark' ? 'dark' : ''}>
      {children}
    </View>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const token = await getToken();
      const inAuthGroup = segments[0] === '(auth)';

      if (!token && !inAuthGroup) {
        router.replace('/(auth)/welcome');
      } else if (token && inAuthGroup) {
        router.replace('/(app)');
      }
      setIsReady(true);
    }

    checkAuth();
  }, [segments, router]);

  if (!isReady) return <AnimatedSplashScreen />;

  return <>{children}</>;
}

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
    <ThemeProvider>
      <ThemeWrapper>
        <AuthGuard>
          <Slot />
        </AuthGuard>
      </ThemeWrapper>
    </ThemeProvider>
  );
}
