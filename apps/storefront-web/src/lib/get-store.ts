import { headers } from 'next/headers';
import { fetchStore, type StoreData } from './api';

/**
 * Server-side helper to get the current store from the middleware-set header.
 * Falls back to a demo slug in development.
 */
export async function getStoreFromHeaders(): Promise<StoreData | null> {
  const headersList = await headers();
  const slug = headersList.get('x-store-slug');

  if (!slug) {
    return null;
  }

  try {
    return await fetchStore(slug);
  } catch {
    return null;
  }
}
