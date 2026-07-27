import { fetchProduct } from '@/lib/api';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/AddToCartButton';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  let product;
  try {
    product = await fetchProduct(id);
  } catch {
    notFound();
  }

  const price = parseFloat(product.price);
  const comparePrice = product.compareAtPrice
    ? parseFloat(product.compareAtPrice)
    : null;
  const images = product.images?.length ? product.images : [product.thumbnailUrl].filter(Boolean);
  const discount =
    comparePrice && comparePrice > price
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {/* Breadcrumb */}
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
            {images[0] ? (
              <img
                src={images[0] as string}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl text-muted-foreground">
                📦
              </div>
            )}
            {discount && (
              <div className="absolute top-3 left-3 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                {discount}% OFF
              </div>
            )}
          </div>

          {/* Thumbnail gallery */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {(images as string[]).slice(1, 5).map((img, i) => (
                <div
                  key={i}
                  className="aspect-square overflow-hidden rounded-xl bg-muted"
                >
                  <img
                    src={img}
                    alt={`${product.title} ${i + 2}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          {product.category && (
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {product.category}
            </span>
          )}

          <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            {product.title}
          </h1>

          {product.titleUrdu && (
            <p className="mt-1 text-lg text-muted-foreground" dir="rtl">
              {product.titleUrdu}
            </p>
          )}

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-primary">
              Rs {price.toLocaleString()}
            </span>
            {comparePrice && comparePrice > price && (
              <span className="text-lg text-muted-foreground line-through">
                Rs {comparePrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mt-3">
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                Out of Stock
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Description
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Add to Cart */}
          <div className="mt-8">
            <AddToCartButton
              productId={product.id}
              title={product.title}
              price={price}
              thumbnailUrl={images[0] as string | undefined}
              disabled={product.stock <= 0}
            />
          </div>

          {/* COD Badge */}
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <span className="text-2xl">💵</span>
            <div>
              <p className="text-sm font-semibold text-foreground">Cash on Delivery</p>
              <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
