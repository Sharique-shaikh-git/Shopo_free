# System Design — AI Shop Builder

## 1. Overview
This document defines the system design for the AI Shop Builder: request flows, data flows, async job orchestration, caching strategy, and key scalability concerns.

## 2. System Components
1. **API Service**
   - REST endpoints for merchant + customer storefront
   - Auth, store provisioning, product CRUD, order CRUD/status transitions
   - Upload presigned URL issuance
   - Enqueues AI jobs (never runs long AI calls synchronously)
2. **Worker Service**
   - Consumes queue jobs
   - Executes: image normalization, vision extraction, text generation, price suggestion, asset/logo generation
   - Writes enriched results back to storage/db
3. **Storefront Service**
   - Renders public storefront pages
   - Uses CDN + edge caching for product pages
   - Calls API for dynamic data when cache miss occurs
4. **Queue**
   - Durable queue for AI jobs
   - Reties with backoff; dead-letter queue after max attempts
5. **Object Storage**
   - Stores product images, merchant logo assets, generated thumbnails
6. **Cache**
   - Redis (or managed KV) for hot reads and rate-limiting counters

## 3. Request Flows
### 3.1 Store creation
- Client: Merchant app → `POST /v1/stores`
- API:
  - validates plan limits
  - creates Store record
  - allocates store slug
  - returns `storeUrl` to merchant

### 3.2 Product upload + AI enrichment (async)
- Merchant selects photos → client requests upload URL:
  - `POST /v1/stores/{storeId}/products/uploads/presign`
- Client uploads to object storage using presigned URL
- Client then creates draft:
  - `POST /v1/stores/{storeId}/products` with `imageUrls[]`
- API:
  - creates Product in `draft`
  - enqueues AI job: `product-enrichment` with a stable `jobId` + dedupeKey
  - returns product draft and `aiJobId`

### 3.3 Product publish
- Merchant reviews AI output → `POST /v1/products/{productId}/publish`
- API:
  - checks ownership + readiness
  - sets product status to `active`

### 3.4 Customer ordering (COD-first)
- Customer visits storefront → `GET /{storeSlug}/product/{productSlug}`
- Storefront loads product details (cached)
- Customer submits order:
  - `POST /v1/stores/{storeSlug}/orders` (COD)
- API:
  - validates products are active
  - computes pricing
  - creates Order `status=new`

### 3.5 Merchant order fulfillment
- Merchant `PATCH /v1/orders/{orderId}/status`
- API:
  - enforces allowed transitions
  - sends notification events (optional)

## 4. Async AI Job Pipeline
### 4.1 Job states
- queued → running → completed OR failed
- rejected for invalid inputs

### 4.2 Dedupe & caching (cost control)
- Compute `dedupeKey` from:
  - normalized image hash (per image)
  - locale
  - store category context (optional)
- If a completed output exists with same `dedupeKey`, reuse it:
  - prevents repeated AI calls for identical products/photos

### 4.3 Retry policy
- Vision/Text generation failures:
  - retry up to N (e.g., 2–3)
- Permanent failures:
  - mark job failed and allow merchant to retry manually

## 5. Database Design (high-level)
Use **PostgreSQL** with:
- strict foreign keys (merchant/store/product/order relations)
- indexes:
  - `(storeId, status)` for products/orders
  - `(storeSlug)` unique
  - `(merchantId)` for tenancy scoping
- Partitioning later if needed:
  - time-based or storeId-based partitioning when table sizes grow

## 6. Caching Strategy
### 6.1 Cache layers
- **CDN cache**: static storefront pages, product pages where possible
- **Server cache**: Redis cache for API responses (storefront-specific)
- **Client cache**: merchant app local caching for quick UI

### 6.2 Cache keys
Always include `storeId` (or `storeSlug`) in keys:
- `store:{storeId}:product:{productId}`
- `store:{storeId}:home`

### 6.3 Invalidation
- On product publish/unpublish:
  - invalidate product caches
  - purge relevant CDN paths (or bump cache version)

## 7. Pagination and Load
- All list endpoints use cursor-based pagination
- Avoid “load more” overfetch on mobile

## 8. Security in Design
- Signed uploads only
- Validate all ownership boundaries
- Rate limits:
  - login attempts
  - store creation attempts
  - upload size limits
  - AI job enqueue limits

## 9. Observability
- correlation IDs:
  - storefront request ID
  - API request ID
  - worker job ID
- metrics:
  - AI job latency, token usage estimate, success rate
  - order creation success/fail
  - cache hit rate

## 10. Error Handling Model
- API returns structured error codes:
  - `AUTH_UNAUTHORIZED`
  - `TENANT_FORBIDDEN`
  - `VALIDATION_FAILED`
  - `AI_JOB_PENDING`
  - `ORDER_INVALID_STATE`
- Storefront shows friendly “try again” states; never expose internals.
