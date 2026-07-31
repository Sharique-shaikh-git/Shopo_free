import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
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

    const timeout = setTimeout(checkAuth, 2500);
    return () => clearTimeout(timeout);
  }, [segments, router]);

  if (!isReady) return <AnimatedSplashScreen />;

  return <>{children}</>;
}

export default function RootLayout() {
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
