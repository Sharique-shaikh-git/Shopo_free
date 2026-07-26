import { z } from 'zod';

/**
 * Store — a merchant's online shop.
 *
 * Connected to: [[03_Features/store-creation]]
 * Each store has a unique slug for subdomain routing.
 * Merchants can also attach a custom domain (like Shopify).
 */

const slugRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

export const storeSchema = z.object({
  id: z.string().uuid(),
  merchantId: z.string().uuid(),
  name: z.string().min(2).max(60),
  slug: z.string().min(3).max(40).regex(slugRegex, {
    message: 'Slug must be lowercase letters, numbers, and hyphens only',
  }),
  description: z.string().max(500).optional(),
  logoUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  customDomain: z.string().max(255).optional(),
  category: z.enum([
    'clothing',
    'cosmetics',
    'grocery',
    'mobile_accessories',
    'home_decor',
    'food',
    'other',
  ]).default('clothing'),
  currency: z.literal('PKR').default('PKR'),
  isPublished: z.boolean().default(false),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Store = z.infer<typeof storeSchema>;

// ── Create DTO ──────────────────────────────────────────
export const createStoreSchema = storeSchema.pick({
  name: true,
  slug: true,
  description: true,
  category: true,
});

export type CreateStoreDto = z.infer<typeof createStoreSchema>;

// ── Update DTO ──────────────────────────────────────────
export const updateStoreSchema = storeSchema.pick({
  name: true,
  description: true,
  category: true,
  customDomain: true,
}).partial();

export type UpdateStoreDto = z.infer<typeof updateStoreSchema>;

// ── Public Response (storefront) ────────────────────────
export const storePublicResponseSchema = storeSchema.pick({
  id: true,
  name: true,
  slug: true,
  description: true,
  logoUrl: true,
  bannerUrl: true,
  category: true,
  currency: true,
});

export type StorePublicResponse = z.infer<typeof storePublicResponseSchema>;
