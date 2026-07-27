import { View, Text } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface OrderCardProps {
  id: string;
  customerName: string;
  total: number;
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED';
  date: string;
  className?: string;
}

export function OrderCard({ id, customerName, total, status, date, className }: OrderCardProps) {
  const isPending = status === 'PENDING';
  
  return (
    <View className={twMerge('bg-surface-container-lowest rounded-xl border border-border-subtle p-5 mb-4', className)}>
      <View className="flex-row justify-between items-center mb-3">
        <Text className="font-bold text-on-surface text-lg">Order #{id}</Text>
        <View className={twMerge('px-3 py-1 rounded-full', isPending ? 'bg-status-pending' : 'bg-status-shipped')}>
          <Text className={twMerge('text-xs font-bold tracking-wider', isPending ? 'text-primary' : 'text-secondary')}>
            {status}
          </Text>
        </View>
      </View>
      
      <View className="flex-row justify-between items-end">
        <View>
          <Text className="text-on-surface-variant font-medium">{customerName}</Text>
          <Text className="text-outline text-sm mt-1">{date}</Text>
        </View>
        <Text className="text-xl font-bold text-growth-green">
          Rs {total.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}
