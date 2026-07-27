import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { getToken } from '../lib/api';
import '../global.css';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const token = await getToken();
      const inAuthGroup = segments[0] === '(auth)';

      if (!token && !inAuthGroup) {
        // Redirect to login
        router.replace('/(auth)/login');
      } else if (token && inAuthGroup) {
        // Redirect to app
        router.replace('/(app)/dashboard');
      }
      setIsReady(true);
    }
    
    // Slight delay to ensure segments are mounted
    const timeout = setTimeout(checkAuth, 100);
    return () => clearTimeout(timeout);
  }, [segments, router]);

  if (!isReady) return null; // Or a splash screen

  return <Slot />;
}
