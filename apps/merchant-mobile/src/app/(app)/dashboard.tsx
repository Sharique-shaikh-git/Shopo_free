import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Button } from '../../components/Button';
import { OrderCard } from '../../components/OrderCard';

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-6 pt-6 pb-4 bg-surface-container-lowest border-b border-border-subtle flex-row justify-between items-center">
        <Text className="text-3xl font-bold text-on-surface">My Shop</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        
        <View className="bg-primary-container rounded-2xl p-6 mb-8">
          <Text className="text-on-primary-container text-lg font-medium mb-1">
            Today&apos;s Sales
          </Text>
          <Text className="text-on-primary-container text-4xl font-bold">
            Rs 12,500
          </Text>
        </View>
        
        <Text className="text-xl font-bold text-on-surface mb-4">
          Quick Actions
        </Text>
        <View className="flex-row flex-wrap gap-4 mb-8">
          <View className="w-[47%]">
            <Button title="Add Product" variant="primary" onPress={() => {}} />
          </View>
          <View className="w-[47%]">
            <Button title="Share Store" variant="outline" onPress={() => {}} />
          </View>
        </View>
        
        <Text className="text-xl font-bold text-on-surface mb-4">
          Recent Orders
        </Text>
        
        <OrderCard 
          id="8921"
          customerName="Ahmed Ali"
          total={3200}
          status="PENDING"
          date="Today, 2:30 PM"
        />
        
        <View className="h-12" />
      </ScrollView>
    </SafeAreaView>
  );
}
