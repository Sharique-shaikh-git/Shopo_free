'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { StoreData } from '@/lib/api';

interface StoreContextValue {
  store: StoreData | null;
}

const StoreContext = createContext<StoreContextValue>({ store: null });

export function useStore() {
  return useContext(StoreContext);
}

interface StoreProviderProps {
  store: StoreData | null;
  children: ReactNode;
}

export function StoreProvider({ store, children }: StoreProviderProps) {
  return (
    <StoreContext.Provider value={{ store }}>
      {children}
    </StoreContext.Provider>
  );
}
