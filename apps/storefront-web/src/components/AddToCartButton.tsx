'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useState } from 'react';

interface AddToCartButtonProps {
  productId: string;
  title: string;
  price: number;
  thumbnailUrl?: string;
  disabled?: boolean;
}

export function AddToCartButton({
  productId,
  title,
  price,
  thumbnailUrl,
  disabled,
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({
      productId,
      title,
      price,
      quantity: 1,
      thumbnailUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
        added
          ? 'bg-secondary text-secondary-foreground'
          : 'bg-primary text-primary-foreground hover:bg-primary/90'
      }`}
    >
      <ShoppingCart className="h-5 w-5" />
      {disabled ? 'Out of Stock' : added ? '✓ Added to Cart' : 'Add to Cart'}
    </button>
  );
}
