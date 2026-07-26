# Software Design — AI Shop Builder

## 1. Overview
This document describes how software modules/classes/functions should be organized, key interfaces, and internal contracts needed to implement the system design safely and cost-effectively.

## 2. Software Modules (Backend)
### 2.1 API Layer (HTTP)
- **AuthController**
  - login, refresh, logout
- **MerchantController**
  - create store, update store settings, upload logo/theme
- **ProductController**
  - upload product media references
  - create draft product
  - publish/unpublish product
- **OrderController**
  - create COD order
  - read orders (merchant)
  - update order status transitions
- **AIController**
  - enqueue AI jobs (product enrichment)
  - query job status
- **PromotionController**
  - generate WhatsApp/Facebook/Instagram content
  - store and schedule promotion

### 2.2 Domain Services (business logic)
- **StoreService**
  - enforce plan limits
  - manage store slug allocation
- **ProductService**
  - draft → enrichment → publish
  - validate ownership and store state
- **OrderService**
  - status transition rules
  - COD order validation
- **AiJobService**
  - enqueue/dedupe jobs
  - enforce quotas
  - store job metadata and outputs
- **PromotionService**
  - generate localized promotion copy
  - ensure output constraints (no restricted content)

### 2.3 Worker Modules (async)
- **IngestionWorker**
  - validate and normalize image uploads
- **VisionExtractorWorker**
  - image → candidate brand/name/category/attributes
- **TextGeneratorWorker**
  - locale-based title/description/tags generation
- **PriceSuggestionWorker**
  - compute suggested price range + confidence
- **WriterWorker**
  - merge results into product draft output fields

## 3. Internal Interfaces (Key Contracts)
### 3.1 Upload Contract
**PresignUploadResponse**
- `uploadUrl`: string
- `objectKey`: string
- `expiresAt`: ISO string

### 3.2 AI Job Contract
**AiJobRequest**
- `jobType`: 'product_enrichment' | 'promotion_generation'
- `merchantId`
- `storeId`
- `productId?`
- `dedupeKey`: string
- `input`: { imageUrl?, rawText?, localeCode, categoryHints? }

**AiJobOutput**
- `title?`
- `description?`
- `category?`
- `tags?`
- `suggestedPrice?`: { low, high, currency }
- `confidence?`: number

### 3.3 Error Contract
All errors should be:
- deterministic error codes
- safe for end-users (no stack traces)
- include correlationId for support

## 4. State Machines
### 4.1 Product State
- `draft` (waiting for AI enrichment)
- `active` (published and visible)
- `archived` (hidden)

### 4.2 Order State (COD)
- `new` → `packed` → `shipped` → `delivered`
- cancellations only allowed at specific states (define in code)

## 5. Multi-tenant Guardrails (Implementation)
- Every query must be scoped by:
  - `merchantId` from JWT (for merchant-only actions)
  - `storeId` / `storeSlug` for storefront actions
- Never trust client-provided `merchantId` for ownership; derive from JWT.

## 6. Rate Limiting and Quotas (Implementation Guidance)
- Per merchant:
  - max AI jobs/day
  - max product uploads/day
  - max promotions/day
- Per IP:
  - protect auth endpoints and uploads
- Implement in API gateway or middleware to prevent worker overload.

## 7. Caching Boundaries
- Cache only GET responses.
- Cache keys include `storeId`.
- Invalidate when:
  - product published/unpublished
  - store theme/logo updated
  - order status changes (if storefront displays it)

## 8. Logging + Tracing hooks
- Middleware adds:
  - `requestId`
  - `merchantId` (if available)
  - `storeId` (if available)
- Worker logs:
  - `jobId`
  - `dedupeKey`
  - input sizes (not raw content)
