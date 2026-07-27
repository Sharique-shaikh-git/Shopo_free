/**
 * API helper for the customer storefront.
 * All calls go to the public (unauthenticated) endpoints.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface StoreData {
  id: string;
  merchantId: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  customDomain: string | null;
  category: string;
  currency: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductData {
  id: string;
  storeId: string;
  merchantId: string;
  title: string;
  titleUrdu: string | null;
  description: string | null;
  descriptionUrdu: string | null;
  category: string | null;
  tags: string[];
  price: string; // numeric comes as string from DB
  suggestedPrice: string | null;
  compareAtPrice: string | null;
  sku: string | null;
  stock: number;
  trackInventory: boolean;
  images: string[];
  thumbnailUrl: string | null;
  hasVariants: boolean;
  variants: unknown[];
  status: string;
  isAiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  storeId: string;
  merchantId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: Record<string, string>;
  subtotal: string;
  deliveryFee: string;
  discount: string;
  total: string;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItemData[];
}

export interface OrderItemData {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  title: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  thumbnailUrl: string | null;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

/** Fetch a store by its slug */
export function fetchStore(slug: string): Promise<StoreData> {
  return apiFetch<StoreData>(`/v1/public/stores/${slug}`);
}

/** Fetch all published products for a store */
export function fetchProducts(storeId: string): Promise<ProductData[]> {
  return apiFetch<ProductData[]>(`/v1/public/stores/${storeId}/products`);
}

/** Fetch a single product by ID */
export function fetchProduct(id: string): Promise<ProductData> {
  return apiFetch<ProductData>(`/v1/public/products/${id}`);
}

/** Place a new order */
export function placeOrder(data: {
  storeId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    province: string;
    postalCode?: string;
  };
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  paymentMethod?: string;
  notes?: string;
}): Promise<OrderData> {
  return apiFetch<OrderData>('/v1/public/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** Fetch a single order (for confirmation page) */
export function fetchOrder(id: string): Promise<OrderData> {
  return apiFetch<OrderData>(`/v1/public/orders/${id}`);
}
