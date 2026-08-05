import { View, Text, Image, TouchableOpacity } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface ProductCardProps {
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  className?: string;
  onPress?: () => void;
}

export function ProductCard({ name, price, stock, imageUrl, className, onPress }: ProductCardProps) {
  const content = (
    <View className="flex-row flex-1 items-center">
      <View className="h-16 w-16 bg-surface-container-low rounded-[12px] items-center justify-center mr-4 overflow-hidden border border-border-subtle">
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <Text className="text-[24px] text-muted-foreground">📦</Text>
        )}
      </View>
      <View className="flex-1 justify-center">
        <Text className="text-[16px] font-bold text-on-surface mb-1" numberOfLines={1}>{name}</Text>
        <Text className="text-[14px] font-semibold text-primary">Rs {price.toLocaleString()}</Text>
      </View>
      <View className="justify-center items-end">
        <View className={twMerge('px-2 py-1 rounded', stock > 0 ? 'bg-secondary-container' : 'bg-[#ffebee]')}>
          <Text className={twMerge('text-[12px] font-semibold', stock > 0 ? 'text-secondary' : 'text-error')}>
            {stock > 0 ? `${stock} in stock` : 'Out of stock'}
          </Text>
        </View>
      </View>
    </View>
  );

  const containerClassName = twMerge('bg-surface-container-lowest rounded-[16px] border border-border-subtle p-4 mb-4 flex-row', className);

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
