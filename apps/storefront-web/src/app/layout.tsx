import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { getStoreFromHeaders } from '@/lib/get-store';
import { StoreProvider } from '@/components/StoreProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const beVietnamPro = Be_Vietnam_Pro({
  variable: '--font-be-vietnam-pro',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Welcome to our online store',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = await getStoreFromHeaders();

  return (
    <html lang="en" className={`${beVietnamPro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[var(--font-be-vietnam-pro)]">
        {store ? (
          <StoreProvider store={store}>
            <Header storeName={store.name} logoUrl={store.logoUrl} />
            <main className="flex-1">{children}</main>
            <Footer storeName={store.name} />
          </StoreProvider>
        ) : (
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
        )}
      </body>
    </html>
  );
}
