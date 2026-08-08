import { headers } from 'next/headers';
import { fetchStore, type StoreData, DEMO_STORE } from './api';

/**
 * Server-side helper to get the current store from the middleware-set header.
 * Falls back to a demo store for seamless preview.
 */
export async function getStoreFromHeaders(): Promise<StoreData | null> {
  const headersList = await headers();
  const slug = headersList.get('x-store-slug') || 'demo';

  try {
    const store = await fetchStore(slug);
    return store || DEMO_STORE;
  } catch {
    return DEMO_STORE;
  }
}
