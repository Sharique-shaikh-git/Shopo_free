import { getStoreFromHeaders } from '@/lib/get-store';
import { StoreShell } from './StoreShell';
import type { ReactNode } from 'react';

/**
 * Server component that fetches the store data from the middleware header,
 * then passes it to the client-side StoreShell for rendering.
 */
export async function StoreProvider({ children }: { children: ReactNode }) {
  const store = await getStoreFromHeaders();

  if (!store) {
    // No store found — show a landing page or error
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Store Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            This store doesn&apos;t exist or hasn&apos;t been published yet.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Try adding <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">?store=your-slug</code> to the URL
          </p>
        </div>
      </div>
    );
  }

  return <StoreShell store={store}>{children}</StoreShell>;
}
