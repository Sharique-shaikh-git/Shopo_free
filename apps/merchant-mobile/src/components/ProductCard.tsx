import { View, Text, Image } from 'react-native';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ProductCardProps {
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  className?: string;
}

export function ProductCard({ name, price, stock, imageUrl, className }: ProductCardProps) {
  return (
    <View className={twMerge('bg-surface-container-lowest rounded-xl border border-border-subtle p-4 mb-4 flex-row', className)}>
      <View className="h-16 w-16 bg-surface-container rounded-lg items-center justify-center mr-4 overflow-hidden">
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <Text className="text-2xl text-outline-variant">📦</Text>
        )}
      </View>
      <View className="flex-1 justify-center">
        <Text className="text-lg font-bold text-on-surface mb-1" numberOfLines={1}>{name}</Text>
        <Text className="text-sm font-semibold text-growth-green">Rs {price.toLocaleString()}</Text>
      </View>
      <View className="justify-center items-end">
        <View className={twMerge('px-2 py-1 rounded', stock > 0 ? 'bg-status-shipped' : 'bg-status-pending')}>
          <Text className={twMerge('text-xs font-semibold', stock > 0 ? 'text-secondary' : 'text-primary')}>
            {stock > 0 ? `${stock} in stock` : 'Out of stock'}
          </Text>
        </View>
      </View>
    </View>
  );
}
