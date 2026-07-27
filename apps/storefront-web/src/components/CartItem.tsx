'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore, type CartItem as CartItemType } from '@/store/cart';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-4">
      {/* Thumbnail */}
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl text-muted-foreground">
            📦
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground line-clamp-1">
            {item.title}
          </h3>
          <p className="mt-0.5 text-sm font-bold text-primary">
            Rs {item.price.toLocaleString()}
          </p>
        </div>

        {/* Quantity controls */}
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() =>
              updateQuantity(item.productId, item.variantId, item.quantity - 1)
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-foreground">
            {item.quantity}
          </span>
          <button
            onClick={() =>
              updateQuantity(item.productId, item.variantId, item.quantity + 1)
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => removeItem(item.productId, item.variantId)}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Line total */}
      <div className="shrink-0 text-right">
        <p className="text-sm font-bold text-foreground">
          Rs {(item.price * item.quantity).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
