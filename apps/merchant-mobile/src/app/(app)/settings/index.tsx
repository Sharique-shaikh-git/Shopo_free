import { View, Text, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { Button } from '../../../components/Button';

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-6 pt-6 pb-4 bg-surface-container-lowest border-b border-border-subtle flex-row justify-between items-center">
        <Text className="text-3xl font-bold text-on-surface">Settings</Text>
      </View>
      
      <ScrollView className="flex-1 px-6 pt-6">
        
        <View className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 mb-6">
          <Text className="text-xl font-bold text-on-surface mb-6">My Shop Details</Text>
          
          <View className="mb-4">
            <Text className="text-sm font-semibold text-on-surface mb-2 ml-1">Shop Name</Text>
            <TextInput 
              className="w-full bg-surface-container rounded-xl px-4 py-3 text-base text-on-surface border border-border-subtle"
              defaultValue="Ahmed's Clothing"
            />
          </View>
          
          <View className="mb-6">
            <Text className="text-sm font-semibold text-on-surface mb-2 ml-1">WhatsApp Number</Text>
            <TextInput 
              className="w-full bg-surface-container rounded-xl px-4 py-3 text-base text-on-surface border border-border-subtle"
              defaultValue="0300 1234567"
              keyboardType="phone-pad"
            />
          </View>
          
          <Button title="Save Changes" variant="primary" />
        </View>

        <View className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 mb-6">
          <Text className="text-xl font-bold text-error-red mb-2">Danger Zone</Text>
          <Text className="text-outline mb-6">Log out of your account on this device.</Text>
          <Button title="Log Out" variant="outline" className="border-error-red" />
        </View>
        
        <View className="h-12" />
      </ScrollView>
    </SafeAreaView>
  );
}
