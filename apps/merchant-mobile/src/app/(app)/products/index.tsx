import { View, Text, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { Button } from '../../../components/Button';
import { ProductCard } from '../../../components/ProductCard';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';
import { useRouter } from 'expo-router';

export default function ProductsScreen() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await apiFetch('/products');
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-6 pt-6 pb-4 bg-surface-container-lowest border-b border-border-subtle flex-row justify-between items-center">
        <Text className="text-3xl font-bold text-on-surface">My Products</Text>
      </View>
      
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="mb-6 flex-row gap-4">
          <View className="flex-1">
            <Button 
              title="+ Add Product" 
              variant="primary" 
              onPress={() => router.push('/(app)/products/create')} 
            />
          </View>
        </View>

        <Text className="text-sm font-semibold text-outline mb-4 uppercase tracking-wider">
          All Inventory ({products.length})
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#006b5e" />
        ) : products.length === 0 ? (
          <Text className="text-muted-foreground text-center mt-10">No products found. Add some!</Text>
        ) : (
          products.map((product: any) => (
            <ProductCard 
              key={product.id}
              name={product.title}
              price={parseFloat(product.price)}
              stock={product.stock}
              imageUrl={product.thumbnailUrl}
              onPress={() => router.push(`/(app)/products/${product.id}`)}
            />
          ))
        )}
        
        <View className="h-12" />
      </ScrollView>
    </SafeAreaView>
  );
}
