import { Slot, useRouter, useSegments } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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

  const checkAuth = useCallback(async () => {
    try {
      const token = await getToken();
      const inAuthGroup = segments[0] === '(auth)';

      // Unauthenticated users should land on the welcome/auth flow
      if (!token && !inAuthGroup) {
        router.replace('/(auth)/welcome');
        return;
      }

      // Authenticated users should never see the auth screens
      if (token && inAuthGroup) {
        router.replace('/(app)');
        return;
      }

      // Stay where you are — authenticated in app, or unauthenticated in auth.
    } catch (err) {
      // If any storage error occurs, fail safe to the welcome screen.
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
