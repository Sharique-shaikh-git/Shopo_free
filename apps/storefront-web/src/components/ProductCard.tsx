'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import type { ProductData } from '@/lib/api';

interface ProductCardProps {
  product: ProductData;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const price = parseFloat(product.price);
  const comparePrice = product.compareAtPrice
    ? parseFloat(product.compareAtPrice)
    : null;
  const thumbnail = product.images?.[0] || product.thumbnailUrl;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault(); // Don't navigate when clicking the button
    addItem({
      productId: product.id,
      title: product.title,
      price,
      quantity: 1,
      thumbnailUrl: thumbnail || undefined,
    });
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-muted-foreground">
            📦
          </div>
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-foreground">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            Rs {price.toLocaleString()}
          </span>
          {comparePrice && comparePrice > price && (
            <span className="text-sm text-muted-foreground line-through">
              Rs {comparePrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
