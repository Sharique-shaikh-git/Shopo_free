import { getStoreFromHeaders } from '@/lib/get-store';
import { fetchProducts, type ProductData } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { Store } from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
  const store = await getStoreFromHeaders();

  if (!store) {
    return null; // StoreProvider handles the fallback
  }

  let products: ProductData[] = [];
  try {
    products = await fetchProducts(store.id);
  } catch {
    // Store exists but no products yet
  }

  const featured = products.slice(0, 8);

  return (
    <div>
      {/* Hero banner */}
      <section className="relative overflow-hidden bg-primary">
        {store.bannerUrl ? (
          <div className="absolute inset-0">
            <img
              src={store.bannerUrl}
              alt={store.name}
              className="h-full w-full object-cover opacity-30"
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary opacity-90" />
        )}
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            {store.logoUrl ? (
              <img
                src={store.logoUrl}
                alt={store.name}
                className="h-16 w-16 rounded-xl object-cover"
              />
            ) : (
              <Store className="h-10 w-10 text-white" />
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-5xl">
            {store.name}
          </h1>
          {store.description && (
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              {store.description}
            </p>
          )}
          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-base font-bold text-primary shadow-lg transition-all hover:bg-white/90 hover:scale-105"
          >
            Browse Products
          </Link>
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Featured Products</h2>
            <Link
              href="/products"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {products.length === 0 && (
        <section className="mx-auto max-w-md px-4 py-20 text-center">
          <p className="text-4xl">🏗️</p>
          <h2 className="mt-4 text-xl font-bold text-foreground">
            Products Coming Soon
          </h2>
          <p className="mt-2 text-muted-foreground">
            This store is getting set up. Check back soon!
          </p>
        </section>
      )}
    </div>
  );
}
