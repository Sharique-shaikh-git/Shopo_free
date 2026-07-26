/**
 * Plan tier limits — enforced at API and worker level.
 *
 * Free tier aligns with Supabase/Upstash free limits.
 * Connected to: [[02_Architecture/pricing-model]]
 */
export const PLAN_LIMITS = {
  free: {
    maxStores: 1,
    maxProductsPerStore: 25,
    maxImagesPerProduct: 3,
    maxImageSizeMb: 2,
    aiJobsPerDay: 10,
    maxOrdersPerMonth: 100,
    customDomain: false,
  },
  starter: {
    maxStores: 2,
    maxProductsPerStore: 100,
    maxImagesPerProduct: 5,
    maxImageSizeMb: 5,
    aiJobsPerDay: 50,
    maxOrdersPerMonth: 1000,
    customDomain: true,
  },
  business: {
    maxStores: 5,
    maxProductsPerStore: 500,
    maxImagesPerProduct: 10,
    maxImageSizeMb: 10,
    aiJobsPerDay: 200,
    maxOrdersPerMonth: 10000,
    customDomain: true,
  },
} as const;

export type PlanTier = keyof typeof PLAN_LIMITS;
