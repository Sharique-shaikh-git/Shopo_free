import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Button } from '../../../components/Button';
import { ProductCard } from '../../../components/ProductCard';

export default function ProductsScreen() {
  const dummyProducts = [
    { id: '1', name: 'Premium Lawn Suit (Unstitched)', price: 4500, stock: 12 },
    { id: '2', name: 'Mens Kurta Shalwar (White)', price: 3200, stock: 5 },
    { id: '3', name: 'Digital Printed Dupatta', price: 1200, stock: 0 },
    { id: '4', name: 'Embroidered Chiffon Saree', price: 12500, stock: 2 },
  ];

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-6 pt-6 pb-4 bg-surface-container-lowest border-b border-border-subtle flex-row justify-between items-center">
        <Text className="text-3xl font-bold text-on-surface">My Products</Text>
      </View>
      
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="mb-6">
          <Button 
            title="+ AI Add Product" 
            variant="primary" 
            onPress={() => console.log('Open AI Flow')} 
          />
        </View>

        <Text className="text-sm font-semibold text-outline mb-4 uppercase tracking-wider">
          All Inventory ({dummyProducts.length})
        </Text>

        {dummyProducts.map(product => (
          <ProductCard 
            key={product.id}
            name={product.name}
            price={product.price}
            stock={product.stock}
          />
        ))}
        
        <View className="h-12" />
      </ScrollView>
    </SafeAreaView>
  );
}
