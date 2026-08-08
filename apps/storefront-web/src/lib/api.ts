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

export const DEMO_STORE: StoreData = {
  id: 'demo-store-001',
  merchantId: 'demo-merchant-001',
  name: "Ahmed's Premium Store",
  slug: 'demo',
  description: 'Quality fashion, lawn suits, footwear, and electronics delivered Cash-on-Delivery across Pakistan.',
  logoUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&auto=format&fit=crop&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80',
  customDomain: null,
  category: "Fashion & Lifestyle",
  currency: 'PKR',
  isPublished: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DEMO_PRODUCTS: ProductData[] = [
  {
    id: 'prod-001',
    storeId: 'demo-store-001',
    merchantId: 'demo-merchant-001',
    title: 'Unstitched 3-Piece Printed Lawn Suit with Chiffon Dupatta',
    titleUrdu: 'انسٹچڈ 3 پیس پرنٹڈ لان سوٹ',
    description: 'Premium quality 100% pure lawn unstitched 3-piece suit with digital printed shirt, dyed trousers, and breathable chiffon dupatta. Perfect for summer.',
    descriptionUrdu: 'اعلیٰ کوالٹی کا پرنٹڈ لان سوٹ جو شفیون دوپٹہ اور ڈائیڈ ٹراؤزر کے ساتھ آتا ہے۔',
    category: "Women's Fashion",
    tags: ['Lawn', 'Summer Collection', '3-Piece', 'Fashion'],
    price: '3499',
    suggestedPrice: '3999',
    compareAtPrice: '4500',
    sku: 'LAWN-2026-01',
    stock: 25,
    trackInventory: true,
    images: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800&auto=format&fit=crop&q=80'
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&auto=format&fit=crop&q=80',
    hasVariants: false,
    variants: [],
    status: 'active',
    isAiGenerated: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-002',
    storeId: 'demo-store-001',
    merchantId: 'demo-merchant-001',
    title: 'Men Embroidered Cotton Kurta (Navy Blue)',
    titleUrdu: 'مردانہ کاٹن کرتہ (نیوی بلیو)',
    description: 'Elegant hand-embroidered neckline cotton kurta for men. Breathable soft fabric suitable for Friday prayers, weddings, and casual wear.',
    descriptionUrdu: 'اعلیٰ قسم کا کاٹن کرتہ جو خوبصورت کڑھائی کے ساتھ دستیاب ہے۔',
    category: "Men's Wear",
    tags: ['Kurta', 'Cotton', 'Men', 'Traditional'],
    price: '2850',
    suggestedPrice: '3200',
    compareAtPrice: '3500',
    sku: 'KURTA-NVY-M',
    stock: 18,
    trackInventory: true,
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80'
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80',
    hasVariants: false,
    variants: [],
    status: 'active',
    isAiGenerated: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-003',
    storeId: 'demo-store-001',
    merchantId: 'demo-merchant-001',
    title: 'Handcrafted Genuine Leather Peshawari Chappal',
    titleUrdu: 'خالص چمڑے کی پشاوری چپل',
    description: 'Traditional handcrafted Peshawari Chappal made from high-grade genuine cow leather with durable tire sole comfort.',
    descriptionUrdu: 'روایتی پشاوری چپل جو خالص لیدر اور لچکدار سول سے تیار کی گئی ہے۔',
    category: "Footwear",
    tags: ['Leather', 'Peshawari', 'Footwear', 'Handmade'],
    price: '4200',
    suggestedPrice: '4500',
    compareAtPrice: '5200',
    sku: 'FOOT-PESH-42',
    stock: 12,
    trackInventory: true,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80'
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
    hasVariants: false,
    variants: [],
    status: 'active',
    isAiGenerated: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-004',
    storeId: 'demo-store-001',
    merchantId: 'demo-merchant-001',
    title: 'AMOLED Smart Fitness Watch with Heart Rate & Call Alerts',
    titleUrdu: 'سمارٹ واچ برائے فٹنس اور کالز',
    description: 'Full HD AMOLED touch screen smart watch with Bluetooth calling, SPO2 heart monitor, and 7-day battery life.',
    descriptionUrdu: 'سمارٹ واچ جو ایچ ڈی ڈسپلے اور 7 دن کی بیٹری لائف کے ساتھ آتی ہے۔',
    category: "Electronics",
    tags: ['Smart Watch', 'Gadgets', 'Fitness', 'Electronics'],
    price: '5999',
    suggestedPrice: '6500',
    compareAtPrice: '7999',
    sku: 'WATCH-SMART-01',
    stock: 30,
    trackInventory: true,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    hasVariants: false,
    variants: [],
    status: 'active',
    isAiGenerated: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

/** Fetch a store by its slug with fallback for preview */
export async function fetchStore(slug: string): Promise<StoreData> {
  try {
    return await apiFetch<StoreData>(`/v1/public/stores/${slug}`);
  } catch {
    return DEMO_STORE;
  }
}

/** Fetch all published products for a store with fallback for preview */
export async function fetchProducts(storeId: string): Promise<ProductData[]> {
  try {
    const list = await apiFetch<ProductData[]>(`/v1/public/stores/${storeId}/products`);
    return list && list.length > 0 ? list : DEMO_PRODUCTS;
  } catch {
    return DEMO_PRODUCTS;
  }
}

/** Fetch a single product by ID with fallback for preview */
export async function fetchProduct(id: string): Promise<ProductData> {
  try {
    return await apiFetch<ProductData>(`/v1/public/products/${id}`);
  } catch {
    const found = DEMO_PRODUCTS.find((p) => p.id === id);
    if (found) return found;
    return DEMO_PRODUCTS[0];
  }
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
