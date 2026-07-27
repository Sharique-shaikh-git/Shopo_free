'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { ShoppingBag, Store } from 'lucide-react';

interface HeaderProps {
  storeName: string;
  logoUrl?: string | null;
}

export function Header({ storeName, logoUrl }: HeaderProps) {
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Store branding */}
        <Link href="/" className="flex items-center gap-3 group">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={storeName}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Store className="h-5 w-5" />
            </div>
          )}
          <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {storeName}
          </span>
        </Link>

        {/* Cart */}
        <Link
          href="/cart"
          className="relative flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="hidden sm:inline">Cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
