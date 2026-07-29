import { getStoreFromHeaders } from '@/lib/get-store';
import { fetchProducts, type ProductData } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';

export default async function ProductsPage() {
  const store = await getStoreFromHeaders();

  if (!store) {
    return null;
  }

  let products: ProductData[] = [];
  try {
    products = await fetchProducts(store.id);
  } catch {
    // No products
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">All Products</h1>
        <p className="mt-1 text-muted-foreground">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-4xl">📦</p>
          <h2 className="mt-4 text-xl font-bold text-foreground">No Products Yet</h2>
          <p className="mt-2 text-muted-foreground">
            Check back soon for new items!
          </p>
        </div>
      )}
    </div>
  );
}
