import { View, Text, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { Button } from '../../components/Button';
import { OrderCard } from '../../components/OrderCard';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalSales: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, ordersData] = await Promise.all([
          apiFetch('/merchant/stats'),
          apiFetch('/orders')
        ]);
        setStats(statsData);
        setOrders(ordersData.slice(0, 5)); // Show only 5 recent orders
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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
        <Text className="text-3xl font-bold text-on-surface">My Shop</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        
        <View className="bg-primary-container rounded-2xl p-6 mb-8">
          <Text className="text-on-primary-container text-lg font-medium mb-1">
            Total Sales
          </Text>
          <Text className="text-on-primary-container text-4xl font-bold">
            Rs {stats.totalSales.toLocaleString()}
          </Text>
        </View>

        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 bg-surface-container rounded-2xl p-4">
            <Text className="text-muted-foreground text-sm font-medium mb-1">Products</Text>
            <Text className="text-2xl font-bold">{stats.totalProducts}</Text>
          </View>
          <View className="flex-1 bg-surface-container rounded-2xl p-4">
            <Text className="text-muted-foreground text-sm font-medium mb-1">Orders</Text>
            <Text className="text-2xl font-bold">{stats.totalOrders}</Text>
          </View>
        </View>
        
        <Text className="text-xl font-bold text-on-surface mb-4">
          Quick Actions
        </Text>
        <View className="flex-row flex-wrap gap-4 mb-8">
          <View className="w-[47%]">
            <Button title="Add Product" variant="primary" onPress={() => router.push('/(app)/products/create')} />
          </View>
          <View className="w-[47%]">
            <Button title="Share Store" variant="outline" onPress={() => {}} />
          </View>
        </View>
        
        <Text className="text-xl font-bold text-on-surface mb-4">
          Recent Orders
        </Text>
        
        {orders.length === 0 ? (
          <Text className="text-muted-foreground">No recent orders.</Text>
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
