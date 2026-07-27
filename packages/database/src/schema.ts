import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { PRODUCT_STATUSES } from '@shopo/shared/src/constants/product-status';
import { ORDER_STATUSES } from '@shopo/shared/src/constants/order-status';

// ── Merchants ───────────────────────────────────────────
export const merchants = pgTable('merchants', {
  id: uuid('id').defaultRandom().primaryKey(),
  supabaseAuthId: text('supabase_auth_id').notNull().unique(),
  phone: text('phone').notNull().unique(),
  name: text('name').notNull(),
  email: text('email'),
  language: text('language').default('ur').notNull(),
  planTier: text('plan_tier').default('free').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ── Stores ──────────────────────────────────────────────
export const stores = pgTable('stores', {
  id: uuid('id').defaultRandom().primaryKey(),
  merchantId: uuid('merchant_id').references(() => merchants.id).notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  logoUrl: text('logo_url'),
  bannerUrl: text('banner_url'),
  customDomain: text('custom_domain').unique(),
  category: text('category').default('clothing').notNull(),
  currency: text('currency').default('PKR').notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ── Products ────────────────────────────────────────────
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeId: uuid('store_id').references(() => stores.id).notNull(),
  merchantId: uuid('merchant_id').references(() => merchants.id).notNull(), // Tenant isolation
  title: text('title').notNull(),
  titleUrdu: text('title_urdu'),
  description: text('description'),
  descriptionUrdu: text('description_urdu'),
  category: text('category'),
  tags: jsonb('tags').$type<string[]>().default([]).notNull(),
  price: numeric('price').notNull(), // using numeric for exact precision currency
  suggestedPrice: numeric('suggested_price'),
  compareAtPrice: numeric('compare_at_price'),
  sku: text('sku'),
  stock: integer('stock').default(0).notNull(),
  trackInventory: boolean('track_inventory').default(false).notNull(),
  images: jsonb('images').$type<string[]>().default([]).notNull(),
  thumbnailUrl: text('thumbnail_url'),
  hasVariants: boolean('has_variants').default(false).notNull(),
  variants: jsonb('variants').$type<unknown[]>().default([]).notNull(),
  status: text('status').$type<typeof PRODUCT_STATUSES[number]>().default('draft').notNull(),
  isAiGenerated: boolean('is_ai_generated').default(false).notNull(),
  aiJobId: uuid('ai_job_id'),
  aiConfidence: numeric('ai_confidence'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ── Orders ──────────────────────────────────────────────
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  storeId: uuid('store_id').references(() => stores.id).notNull(),
  merchantId: uuid('merchant_id').references(() => merchants.id).notNull(), // Tenant isolation
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  deliveryAddress: jsonb('delivery_address').notNull(),
  subtotal: numeric('subtotal').notNull(),
  deliveryFee: numeric('delivery_fee').default('0').notNull(),
  discount: numeric('discount').default('0').notNull(),
  total: numeric('total').notNull(),
  currency: text('currency').default('PKR').notNull(),
  paymentMethod: text('payment_method').default('cod').notNull(),
  paymentStatus: text('payment_status').default('pending').notNull(),
  status: text('status').$type<typeof ORDER_STATUSES[number]>().default('pending').notNull(),
  notes: text('notes'),
  merchantNotes: text('merchant_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id).notNull(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  variantId: uuid('variant_id'),
  title: text('title').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price').notNull(),
  totalPrice: numeric('total_price').notNull(),
  thumbnailUrl: text('thumbnail_url'),
});

// ── AI Jobs ─────────────────────────────────────────────
export const aiJobs = pgTable('ai_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  merchantId: uuid('merchant_id').references(() => merchants.id).notNull(),
  storeId: uuid('store_id').references(() => stores.id).notNull(),
  productId: uuid('product_id'),
  type: text('type').notNull(),
  status: text('status').default('queued').notNull(),
  retryCount: integer('retry_count').default(0).notNull(),
  maxRetries: integer('max_retries').default(3).notNull(),
  error: text('error'),
  dedupeKey: text('dedupe_key').notNull(),
  inputHash: text('input_hash').notNull(),
  input: jsonb('input').notNull(),
  output: jsonb('output'),
  tokensUsed: integer('tokens_used').default(0).notNull(),
  estimatedCostUsd: numeric('estimated_cost_usd').default('0').notNull(),
  modelUsed: text('model_used').default('gemini-2.5-flash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

// ── Relationships ───────────────────────────────────────
export const merchantsRelations = relations(merchants, ({ many }) => ({
  stores: many(stores),
  products: many(products),
  orders: many(orders),
  aiJobs: many(aiJobs),
}));

export const storesRelations = relations(stores, ({ one, many }) => ({
  merchant: one(merchants, {
    fields: [stores.merchantId],
    references: [merchants.id],
  }),
  products: many(products),
  orders: many(orders),
  aiJobs: many(aiJobs),
}));

export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
  merchant: one(merchants, {
    fields: [products.merchantId],
    references: [merchants.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.id],
  }),
  merchant: one(merchants, {
    fields: [orders.merchantId],
    references: [merchants.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
