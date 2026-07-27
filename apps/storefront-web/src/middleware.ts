import { NextRequest, NextResponse } from 'next/server';

/**
 * Subdomain-based multi-tenant middleware.
 *
 * Reads the host header, extracts the store slug from the subdomain
 * (e.g. ali.shopo.pk → "ali"), and passes it downstream via a
 * custom header that pages can read.
 *
 * In local dev, use ?store=ali or the header x-store-slug directly.
 */

const ROOT_DOMAINS = ['shopo.pk', 'shopo.com', 'localhost:3000', 'localhost'];

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl;

  // 1. Try extracting slug from subdomain (ali.shopo.pk → "ali")
  let slug: string | null = null;

  const isRootDomain = ROOT_DOMAINS.some(
    (root) => host === root || host === `www.${root}`,
  );

  if (!isRootDomain && host.includes('.')) {
    // Subdomain detected: take the first part
    slug = host.split('.')[0];
  }

  // 2. Dev override: ?store=ali
  if (!slug) {
    slug = url.searchParams.get('store');
  }

  // 3. Pass slug downstream via header
  const headers = new Headers(request.headers);
  if (slug) {
    headers.set('x-store-slug', slug);
  }

  return NextResponse.next({
    request: {
      headers,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
