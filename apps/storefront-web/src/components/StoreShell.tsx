'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import type { StoreData } from '@/lib/api';

interface StoreContextValue {
  store: StoreData | null;
}

const StoreContext = createContext<StoreContextValue>({ store: null });

export function useStore() {
  return useContext(StoreContext);
}

interface StoreShellProps {
  store: StoreData;
  children: ReactNode;
}

/**
 * Client wrapper that provides Header + Footer + Store context.
 * Rendered by the server-side StoreProvider.
 */
export function StoreShell({ store, children }: StoreShellProps) {
  return (
    <StoreContext.Provider value={{ store }}>
      <Header storeName={store.name} logoUrl={store.logoUrl} />
      <main className="flex-1">{children}</main>
      <Footer storeName={store.name} />
    </StoreContext.Provider>
  );
}
