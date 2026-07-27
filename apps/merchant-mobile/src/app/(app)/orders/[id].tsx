import { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Button } from '../../../components/Button';
import { apiFetch } from '../../../lib/api';
import { twMerge } from 'tailwind-merge';

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await apiFetch(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Order not found');
        router.back();
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id, router]);

  const handleUpdateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      await apiFetch(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setOrder({ ...order, status: newStatus });
      Alert.alert('Success', `Order marked as ${newStatus}`);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-surface justify-center items-center">
        <ActivityIndicator size="large" color="#006b5e" />
      </SafeAreaView>
    );
  }

  if (!order) return null;

  const isPending = order.status === 'pending';

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-6 py-4 bg-surface-container-lowest border-b border-border-subtle flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full">
          <Feather name="arrow-left" size={24} color="#006b5e" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-on-surface">Order #{order.orderNumber}</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <View className="bg-surface-container-lowest rounded-xl border border-border-subtle p-5 mb-6">
          <View className="flex-row justify-between mb-4">
            <Text className="text-on-surface-variant font-medium">Status</Text>
            <View className={twMerge('px-3 py-1 rounded-full', isPending ? 'bg-status-pending' : 'bg-status-shipped')}>
              <Text className={twMerge('text-xs font-bold tracking-wider', isPending ? 'text-primary' : 'text-secondary')}>
                {order.status.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View className="flex-row justify-between mb-4">
            <Text className="text-on-surface-variant font-medium">Customer</Text>
            <Text className="text-on-surface font-semibold">{order.customerName}</Text>
          </View>

          <View className="flex-row justify-between mb-4">
            <Text className="text-on-surface-variant font-medium">Phone</Text>
            <Text className="text-on-surface font-semibold">{order.customerPhone}</Text>
          </View>

          <View className="flex-row justify-between mb-4">
            <Text className="text-on-surface-variant font-medium">Address</Text>
            <Text className="text-on-surface font-semibold text-right flex-1 ml-4">{order.deliveryAddress}</Text>
          </View>
        </View>

        <View className="bg-surface-container-lowest rounded-xl border border-border-subtle p-5 mb-6">
          <View className="flex-row justify-between mb-2">
            <Text className="text-on-surface-variant">Subtotal</Text>
            <Text className="text-on-surface">Rs {parseFloat(order.subtotal).toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-on-surface-variant">Delivery</Text>
            <Text className="text-on-surface">Rs {parseFloat(order.deliveryFee).toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between pt-2 border-t border-border-subtle mt-2">
            <Text className="font-bold text-on-surface">Total</Text>
            <Text className="font-bold text-growth-green text-lg">Rs {parseFloat(order.total).toLocaleString()}</Text>
          </View>
        </View>

        <Text className="text-xl font-bold text-on-surface mb-4">Actions</Text>
        <View className="gap-3">
          {order.status === 'pending' && (
            <Button 
              title={updating ? "Updating..." : "Mark as Confirmed"} 
              onPress={() => handleUpdateStatus('confirmed')} 
              disabled={updating}
            />
          )}
          {order.status === 'confirmed' && (
            <Button 
              title={updating ? "Updating..." : "Mark as Packed"} 
              onPress={() => handleUpdateStatus('packed')} 
              disabled={updating}
            />
          )}
          {order.status === 'packed' && (
            <Button 
              title={updating ? "Updating..." : "Mark as Shipped"} 
              onPress={() => handleUpdateStatus('shipped')} 
              disabled={updating}
            />
          )}
          {order.status === 'shipped' && (
            <Button 
              title={updating ? "Updating..." : "Mark as Delivered"} 
              onPress={() => handleUpdateStatus('delivered')} 
              disabled={updating}
            />
          )}
        </View>

        <View className="h-12" />
      </ScrollView>
    </SafeAreaView>
  );
}
