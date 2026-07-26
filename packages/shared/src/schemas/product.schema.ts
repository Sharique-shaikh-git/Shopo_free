import { z } from 'zod';
import { PRODUCT_STATUSES } from '../constants/product-status';

/**
 * Product — an item for sale in a merchant's store.
 *
 * Connected to: [[03_Features/product-enrichment]], [[09_AI_Pipeline/gemini-integration]]
 * Lifecycle: draft → active → archived
 * AI generates: title, description, category, tags, suggestedPrice
 */
export const productSchema = z.object({
  id: z.string().uuid(),
  storeId: z.string().uuid(),
  merchantId: z.string().uuid(),

  // ── Core fields (merchant or AI fills these) ──────────
  title: z.string().min(1).max(200),
  titleUrdu: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  descriptionUrdu: z.string().max(2000).optional(),
  category: z.string().max(100).optional(),
  tags: z.array(z.string().max(50)).max(10).default([]),

  // ── Pricing ───────────────────────────────────────────
  price: z.number().positive().max(10_000_000), // PKR, max 10M
  suggestedPrice: z.number().positive().optional(), // AI-suggested
  compareAtPrice: z.number().positive().optional(), // Strikethrough price

  // ── Inventory ─────────────────────────────────────────
  sku: z.string().max(100).optional(),
  stock: z.number().int().min(0).default(0),
  trackInventory: z.boolean().default(false),

  // ── Media ─────────────────────────────────────────────
  images: z.array(z.string().url()).max(10).default([]),
  thumbnailUrl: z.string().url().optional(),

  // ── Variants (Phase 2 — clothing sizes/colors) ────────
  hasVariants: z.boolean().default(false),
  variants: z.array(z.object({
    id: z.string().uuid(),
    name: z.string().max(100),
    options: z.array(z.string().max(50)),
    priceAdjustment: z.number().default(0),
    stock: z.number().int().min(0).default(0),
  })).max(50).default([]),

  // ── Status ────────────────────────────────────────────
  status: z.enum(PRODUCT_STATUSES).default('draft'),
  isAiGenerated: z.boolean().default(false),
  aiJobId: z.string().uuid().optional(),
  aiConfidence: z.number().min(0).max(1).optional(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Product = z.infer<typeof productSchema>;

// ── Create DTO (merchant uploads photo, minimal info) ───
export const createProductSchema = z.object({
  storeId: z.string().uuid(),
  title: z.string().min(1).max(200).optional(), // AI can fill this
  price: z.number().positive().max(10_000_000).optional(), // AI can suggest
  images: z.array(z.string().url()).min(1).max(10),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;

// ── Update DTO ──────────────────────────────────────────
export const updateProductSchema = productSchema.pick({
  title: true,
  titleUrdu: true,
  description: true,
  descriptionUrdu: true,
  category: true,
  tags: true,
  price: true,
  compareAtPrice: true,
  sku: true,
  stock: true,
  trackInventory: true,
  images: true,
  status: true,
}).partial();

export type UpdateProductDto = z.infer<typeof updateProductSchema>;

// ── Public Response (storefront) ────────────────────────
export const productPublicResponseSchema = productSchema.pick({
  id: true,
  title: true,
  titleUrdu: true,
  description: true,
  descriptionUrdu: true,
  category: true,
  tags: true,
  price: true,
  compareAtPrice: true,
  images: true,
  thumbnailUrl: true,
  hasVariants: true,
  variants: true,
  stock: true,
  status: true,
});

export type ProductPublicResponse = z.infer<typeof productPublicResponseSchema>;
