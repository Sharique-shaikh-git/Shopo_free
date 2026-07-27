'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { CartItem } from '@/components/CartItem';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">
          Browse products and add items to your cart.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Continue Shopping
      </Link>

      <h1 className="text-2xl font-bold text-foreground">
        Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
      </h1>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <CartItem key={`${item.productId}-${item.variantId || ''}`} item={item} />
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>Rs {totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Delivery</span>
            <span className="text-secondary font-medium">FREE</span>
          </div>
          <div className="border-t border-border pt-3">
            <div className="flex justify-between">
              <span className="text-base font-bold text-foreground">Total</span>
              <span className="text-xl font-extrabold text-primary">
                Rs {totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/checkout"
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
