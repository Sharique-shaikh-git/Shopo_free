import { View, Text, TouchableOpacity } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface OrderCardProps {
  id: string;
  customerName: string;
  total: number;
  status: string;
  date: string;
  className?: string;
  onPress?: () => void;
}

export function OrderCard({ id, customerName, total, status, date, className, onPress }: OrderCardProps) {
  const isPending = status === 'PENDING';
  
  const content = (
    <>
      <View className="flex-row justify-between items-center mb-3">
        <Text className="font-bold text-on-surface text-[18px]">Order #{id}</Text>
        <View className={twMerge('px-3 py-1 rounded-full', isPending ? 'bg-[#fff8e1]' : 'bg-secondary-container')}>
          <Text className={twMerge('text-[12px] font-bold tracking-wider', isPending ? 'text-[#f57c00]' : 'text-secondary')}>
            {status}
          </Text>
        </View>
      </View>
      
      <View className="flex-row justify-between items-end">
        <View>
          <Text className="text-on-surface-variant font-medium text-[16px]">{customerName}</Text>
          <Text className="text-muted-foreground text-[14px] mt-1">{date}</Text>
        </View>
        <Text className="text-[20px] font-bold text-primary">
          Rs {total.toLocaleString()}
        </Text>
      </View>
    </>
  );

  const containerClassName = twMerge('bg-surface-container-lowest rounded-[16px] border border-border-subtle p-5 mb-4', className);

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} className={containerClassName}>
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View className={containerClassName}>
      {content}
    </View>
  );
}
