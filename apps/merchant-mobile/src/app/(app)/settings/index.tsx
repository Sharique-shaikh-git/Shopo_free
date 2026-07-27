import { View, Text, ScrollView, SafeAreaView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Button } from '../../../components/Button';
import { useEffect, useState } from 'react';
import { apiFetch, removeToken } from '../../../lib/api';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const [store, setStore] = useState<any>(null);
  const [storeName, setStoreName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadStore() {
      try {
        const data = await apiFetch('/stores');
        if (data.length > 0) {
          setStore(data[0]);
          setStoreName(data[0].name);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStore();
  }, []);

  const handleSave = async () => {
    if (!store) {
      // Create store if none exists
      setSaving(true);
      try {
        const newStore = await apiFetch('/stores', {
          method: 'POST',
          body: JSON.stringify({ name: storeName, slug: storeName.toLowerCase().replace(/\s+/g, '-') }),
        });
        setStore(newStore);
        Alert.alert('Success', 'Store created successfully!');
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Failed to create store');
      } finally {
        setSaving(false);
      }
      return;
    }

    setSaving(true);
    try {
      await apiFetch(`/stores/${store.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: storeName }),
      });
      Alert.alert('Success', 'Settings updated successfully!');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await removeToken();
    router.replace('/(auth)/login');
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-surface justify-center items-center">
        <ActivityIndicator size="large" color="#006b5e" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-6 pt-6 pb-4 bg-surface-container-lowest border-b border-border-subtle flex-row justify-between items-center">
        <Text className="text-3xl font-bold text-on-surface">Settings</Text>
      </View>
      
      <ScrollView className="flex-1 px-6 pt-6">
        
        <View className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 mb-6">
          <Text className="text-xl font-bold text-on-surface mb-6">My Shop Details</Text>
          
          <View className="mb-6">
            <Text className="text-sm font-semibold text-on-surface mb-2 ml-1">Shop Name</Text>
            <TextInput 
              value={storeName}
              onChangeText={setStoreName}
              className="w-full bg-surface-container rounded-xl px-4 py-3 text-base text-on-surface border border-border-subtle"
              placeholder="e.g. Ahmed's Clothing"
            />
          </View>
          
          <Button 
            title={saving ? "Saving..." : "Save Changes"} 
            variant="primary" 
            onPress={handleSave} 
            disabled={saving} 
          />
        </View>

        <View className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 mb-6">
          <Text className="text-xl font-bold text-error-red mb-2">Danger Zone</Text>
          <Text className="text-outline mb-6">Log out of your account on this device.</Text>
          <Button title="Log Out" variant="outline" className="border-error-red" onPress={handleLogout} />
        </View>
        
        <View className="h-12" />
      </ScrollView>
    </SafeAreaView>
  );
}
