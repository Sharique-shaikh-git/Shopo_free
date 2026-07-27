import { View, Text, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { OrderCard } from '../../../components/OrderCard';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';
import { useRouter } from 'expo-router';

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await apiFetch('/orders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-6 pt-6 pb-4 bg-surface-container-lowest border-b border-border-subtle flex-row justify-between items-center">
        <Text className="text-3xl font-bold text-on-surface">Orders</Text>
      </View>
      
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-sm font-semibold text-outline mb-4 uppercase tracking-wider">
          All Orders ({orders.length})
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#006b5e" />
        ) : orders.length === 0 ? (
          <Text className="text-muted-foreground text-center mt-10">No orders yet.</Text>
        ) : (
          orders.map((order: any) => (
            <OrderCard 
              key={order.id}
              id={order.orderNumber}
              customerName={order.customerName}
              total={parseFloat(order.total)}
              status={order.status.toUpperCase()}
              date={new Date(order.createdAt).toLocaleString()}
              onPress={() => router.push(`/(app)/orders/${order.id}`)}
            />
          ))
        )}
        
        <View className="h-12" />
      </ScrollView>
    </SafeAreaView>
  );
}
