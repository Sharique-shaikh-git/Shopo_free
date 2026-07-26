import { View, Text, TextInput } from 'react-native';
import { Button } from '../components/Button';
import { useState } from 'react';

export default function AuthScreen() {
  const [phone, setPhone] = useState('');
  
  return (
    <View className="flex-1 bg-background px-6 pt-24 pb-8">
      <View className="flex-1">
        <Text className="text-4xl font-bold text-foreground mb-4">
          Welcome to Shopo
        </Text>
        <Text className="text-lg text-muted-foreground mb-12">
          Enter your WhatsApp number to log in or create your digital dukaan.
        </Text>
        
        <View className="gap-2 mb-8">
          <Text className="text-sm font-semibold text-foreground ml-1">Phone Number</Text>
          <TextInput 
            className="w-full bg-input rounded-xl px-4 py-4 text-lg text-foreground border border-border"
            placeholder="0300 1234567"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>
        
        <Button 
          title="Continue" 
          onPress={() => console.log('Login with', phone)}
        />
      </View>
    </View>
  );
}
