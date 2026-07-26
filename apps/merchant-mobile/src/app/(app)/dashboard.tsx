import { View, Text, ScrollView } from 'react-native';
import { Button } from '../../components/Button';

export default function DashboardScreen() {
  return (
    <ScrollView className="flex-1 bg-background px-6 pt-12">
      <Text className="text-3xl font-bold text-foreground mb-8">
        My Dukaan
      </Text>
      
      <View className="bg-primary-container rounded-2xl p-6 mb-8">
        <Text className="text-on-primary-container text-lg font-medium mb-1">
          Today's Sales
        </Text>
        <Text className="text-on-primary-container text-4xl font-bold">
          Rs 12,500
        </Text>
      </View>
      
      <Text className="text-xl font-bold text-foreground mb-4">
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
      
      <Text className="text-xl font-bold text-foreground mb-4">
        Recent Orders
      </Text>
      
      <View className="bg-card border border-border rounded-xl p-4 mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="font-semibold text-foreground text-lg">ORD-8921</Text>
          <View className="bg-[#FEF7FF] px-2 py-1 rounded">
            <Text className="text-primary text-xs font-medium">Pending</Text>
          </View>
        </View>
        <Text className="text-muted-foreground">Ahmed Ali • Rs 3,200</Text>
      </View>
      
    </ScrollView>
  );
}
