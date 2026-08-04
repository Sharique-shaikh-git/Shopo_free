import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL 
  ? `${process.env.EXPO_PUBLIC_API_URL}/v1`
  : (Platform.OS === 'android' ? 'http://10.0.2.2:3001/v1' : 'http://localhost:3001/v1');
const TOKEN_KEY = 'merchant_jwt';

const isWeb = Platform.OS === 'web';

export async function setToken(token: string) {
  if (isWeb) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

export async function getToken(): Promise<string | null> {
  if (isWeb) {
    return localStorage.getItem(TOKEN_KEY);
  }
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function removeToken() {
  if (isWeb) {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = await getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API Error');
  }

  return response.json();
}

/**
 * apiFetchSafe — never throws; returns `fallback` when the request fails or
 * there is no data. Use for non-critical UI reads so a missing/offline
 * endpoint renders as an empty state instead of crashing the screen.
 */
export async function apiFetchSafe<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const data = await apiFetch(endpoint);
    return (data ?? fallback) as T;
  } catch {
    return fallback;
  }
}
