import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/components/StoreProvider';

const beVietnamPro = Be_Vietnam_Pro({
  variable: '--font-be-vietnam-pro',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Welcome to our online store',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${beVietnamPro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[var(--font-be-vietnam-pro)]">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
