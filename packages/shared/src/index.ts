/**
 * @shopo/shared — Barrel export
 *
 * All shared types, DTOs, validation schemas, and constants
 * used across the API, Worker, Storefront, and Mobile apps.
 */

// ── Entity schemas & types ──────────────────────────────
export * from './schemas/merchant.schema';
export * from './schemas/store.schema';
export * from './schemas/product.schema';
export * from './schemas/order.schema';
export * from './schemas/ai-job.schema';

// ── API contracts ───────────────────────────────────────
export * from './dto/api-response.dto';
export * from './dto/pagination.dto';

// ── Constants ───────────────────────────────────────────
export * from './constants/error-codes';
export * from './constants/order-status';
export * from './constants/product-status';
export * from './constants/plan-limits';

// ── Utility types ───────────────────────────────────────
export * from './types/common';
