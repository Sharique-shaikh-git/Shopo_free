import { z } from 'zod';

/**
 * Merchant — the shop owner who creates and manages their store.
 *
 * Connected to: [[03_Features/merchant-onboarding]]
 * Security: merchantId is ALWAYS derived from JWT, never from client.
 */
export const merchantSchema = z.object({
  id: z.string().uuid(),
  phone: z.string().min(10).max(15),
  name: z.string().min(1).max(100),
  email: z.string().email().optional(),
  language: z.enum(['ur', 'en', 'sd', 'pa', 'ps', 'bal']).default('ur'),
  planTier: z.enum(['free', 'starter', 'business']).default('free'),
  supabaseAuthId: z.string(),
  isActive: z.boolean().default(true),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Merchant = z.infer<typeof merchantSchema>;

// ── Create DTO ──────────────────────────────────────────
export const createMerchantSchema = merchantSchema.pick({
  phone: true,
  name: true,
  language: true,
}).extend({
  supabaseAuthId: z.string(),
});

export type CreateMerchantDto = z.infer<typeof createMerchantSchema>;

// ── Update DTO ──────────────────────────────────────────
export const updateMerchantSchema = merchantSchema.pick({
  name: true,
  email: true,
  language: true,
}).partial();

export type UpdateMerchantDto = z.infer<typeof updateMerchantSchema>;

// ── Response DTO ────────────────────────────────────────
export const merchantResponseSchema = merchantSchema.omit({
  supabaseAuthId: true,
});

export type MerchantResponse = z.infer<typeof merchantResponseSchema>;
