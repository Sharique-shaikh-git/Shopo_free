/**
 * Structured error codes — never expose raw stack traces.
 *
 * Format: DOMAIN_ACTION_REASON
 * Connected to: [[04_Code_Patterns/structured-error-codes]]
 */
export const ERROR_CODES = {
  // ── Auth ──────────────────────────────────────────────
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',
  AUTH_RATE_LIMITED: 'AUTH_RATE_LIMITED',

  // ── Merchant ──────────────────────────────────────────
  MERCHANT_NOT_FOUND: 'MERCHANT_NOT_FOUND',
  MERCHANT_ALREADY_EXISTS: 'MERCHANT_ALREADY_EXISTS',
  MERCHANT_SUSPENDED: 'MERCHANT_SUSPENDED',

  // ── Store ─────────────────────────────────────────────
  STORE_NOT_FOUND: 'STORE_NOT_FOUND',
  STORE_SLUG_TAKEN: 'STORE_SLUG_TAKEN',
  STORE_LIMIT_REACHED: 'STORE_LIMIT_REACHED',
  STORE_NOT_PUBLISHED: 'STORE_NOT_PUBLISHED',

  // ── Product ───────────────────────────────────────────
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  PRODUCT_LIMIT_REACHED: 'PRODUCT_LIMIT_REACHED',
  PRODUCT_IMAGE_TOO_LARGE: 'PRODUCT_IMAGE_TOO_LARGE',
  PRODUCT_IMAGE_INVALID: 'PRODUCT_IMAGE_INVALID',

  // ── Order ─────────────────────────────────────────────
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  ORDER_INVALID_TRANSITION: 'ORDER_INVALID_TRANSITION',
  ORDER_PRODUCT_UNAVAILABLE: 'ORDER_PRODUCT_UNAVAILABLE',
  ORDER_OUT_OF_STOCK: 'ORDER_OUT_OF_STOCK',

  // ── AI ────────────────────────────────────────────────
  AI_JOB_NOT_FOUND: 'AI_JOB_NOT_FOUND',
  AI_QUOTA_EXCEEDED: 'AI_QUOTA_EXCEEDED',
  AI_PROCESSING_FAILED: 'AI_PROCESSING_FAILED',
  AI_SERVICE_UNAVAILABLE: 'AI_SERVICE_UNAVAILABLE',

  // ── General ───────────────────────────────────────────
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMITED: 'RATE_LIMITED',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
