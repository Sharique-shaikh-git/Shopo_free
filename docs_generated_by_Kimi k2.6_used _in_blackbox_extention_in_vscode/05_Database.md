# Database — AI Shop Builder

## 1. Overview
Defines persistence model for multi-tenant merchant/store/product/order system. Focus: correctness, isolation, indexing, and cost-efficient growth.

## 2. Persistence Principles
- Use managed PostgreSQL for durability.
- Enforce tenant isolation at the query level by always scoping with `merchant_id` and/or `store_id`.
- Prefer append-safe writes for AI job logs and immutable order snapshots.
- Use Redis/managed KV only for caching and counters, not as the source of truth.

## 3. Core Tables (initial)
### 3.1 merchants
- `id` (uuid, PK)
- `auth_user_id` (string, unique)
- `display_name` (text)
- `phone_e164` (text, nullable)
- `created_at` (timestamp)

### 3.2 stores
- `id` (uuid, PK)
- `merchant_id` (uuid, FK -> merchants.id, indexed)
- `slug` (text, unique) // used in store subdomain
- `name` (text)
- `logo_url` (text, nullable)
- `theme_primary_color` (text, nullable)
- `theme_accent_color` (text, nullable)
- `locale_code` (text)
- `status` (active/paused/deleted)
- `plan` (free/starter/business)
- `created_at`, `updated_at`

### 3.3 products
- `id` (uuid, PK)
- `store_id` (uuid, FK -> stores.id, indexed)
- `title` (text)
- `description` (text)
- `category` (text)
- `brand` (text, nullable)
- `tags` (text[] or jsonb)
- `attributes` (jsonb, nullable) // category dependent
- `images` (jsonb) // [{url, alt}]
- `price_amount` (int) // PKR major unit or paise; choose one convention
- `currency` (text default 'PKR')
- `stock_quantity` (int, nullable)
- `stock_low_threshold` (int, nullable)
- `status` (draft/active/archived)
- `created_at`, `updated_at`

### 3.4 ai_jobs
- `id` (uuid, PK)
- `merchant_id` (uuid, indexed)
- `store_id` (uuid, indexed)
- `product_id` (uuid, nullable) // null for store/promotion generation
- `job_type` (text) // product_enrichment | promotion_generation
- `dedupe_key` (text, indexed)
- `state` (queued/running/completed/failed/rejected)
- `input_payload` (jsonb)
- `output_payload` (jsonb, nullable)
- `error_code` (text, nullable)
- `error_message` (text, nullable)
- `created_at`, `started_at`, `finished_at`

Unique constraints:
- optional unique `(job_type, dedupe_key, store_id)` to dedupe results

### 3.5 orders
- `id` (uuid, PK)
- `store_id` (uuid, indexed)
- `merchant_id` (uuid, indexed)
- `customer_name` (text)
- `customer_phone_e164` (text)
- `pricing_subtotal` (int)
- `pricing_delivery_fee` (int)
- `pricing_total` (int)
- `delivery_address_line1` (text)
- `delivery_city` (text)
- `delivery_notes` (text, nullable)
- `payment_method` (COD/BANK_TRANSFER/WALLET)
- `payment_status` (pending/paid/failed)
- `status` (new/packed/shipped/delivered/cancelled)
- `placed_at`, `updated_at`

### 3.6 order_items
- `id` (uuid, PK)
- `order_id` (uuid, FK -> orders.id, indexed)
- `product_id_snapshot` (uuid, nullable) // keep link
- `title_snapshot` (text)
- `unit_price` (int)
- `quantity` (int)

## 4. Indexing Strategy
- `stores(merchant_id)` and `stores(slug)` unique
- `products(store_id, status)` and `products(status, category)` if needed
- `orders(store_id, status, placed_at)` for dashboards
- `ai_jobs(store_id, job_type, state, created_at)`
- keep composite indexes aligned to query patterns (dashboard filters)

## 5. Partitioning (later)
- For early scale (500–1000 stores) do NOT shard.
- Consider partitioning only when tables exceed operational thresholds:
  - orders partition by time (monthly) or store_id hash
  - ai_jobs partition by month
- Partitioning only after load testing and production metrics confirm the need.

## 6. Data Isolation Enforcement
- API always scopes reads/writes using merchant/store context:
  - merchant actions: `merchant_id = JWT.merchantId` AND `store_id belongs to merchant`
  - storefront reads: `store_slug -> store_id` and use that store_id; never allow merchant enumeration

## 7. Caching Data (what NOT to store in cache)
- Never store authoritative order status transitions only in cache.
- Cache only derived reads: store home, product pages, category grids.

## 8. Backup & Retention
- Automated daily backups.
- PITR retention based on budget.
- Retain ai_jobs outputs for a limited time (e.g., 30–90 days) unless required for audits.
