import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { OrderCard } from '../../../components/OrderCard';

export default function OrdersScreen() {
  const dummyOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: 'PENDING' | 'SHIPPED' | 'DELIVERED';
    date: string;
  }> = [
    { id: '8921', customerName: 'Ahmed Ali', total: 3200, status: 'PENDING', date: 'Today, 2:30 PM' },
    { id: '8920', customerName: 'Sara Khan', total: 12500, status: 'SHIPPED', date: 'Yesterday' },
    { id: '8919', customerName: 'Usman Tariq', total: 4500, status: 'SHIPPED', date: 'Yesterday' },
    { id: '8918', customerName: 'Fatima Zohra', total: 2200, status: 'DELIVERED', date: 'Jul 24' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-6 pt-6 pb-4 bg-surface-container-lowest border-b border-border-subtle flex-row justify-between items-center">
        <Text className="text-3xl font-bold text-on-surface">Orders</Text>
      </View>
      
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-sm font-semibold text-outline mb-4 uppercase tracking-wider">
          Recent Orders
        </Text>

        {dummyOrders.map(order => (
          <OrderCard 
            key={order.id}
            id={order.id}
            customerName={order.customerName}
            total={order.total}
            status={order.status}
            date={order.date}
          />
        ))}
        
        <View className="h-12" />
      </ScrollView>
    </SafeAreaView>
  );
}
