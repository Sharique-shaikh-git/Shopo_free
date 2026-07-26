/**
 * Product status — lifecycle states.
 *
 * draft → active → archived
 *
 * Connected to: [[03_Features/product-enrichment]]
 */
export const PRODUCT_STATUSES = [
  'draft',     // AI enrichment in progress or merchant editing
  'active',    // Published and visible on storefront
  'archived',  // Removed from storefront but data preserved
] as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];
