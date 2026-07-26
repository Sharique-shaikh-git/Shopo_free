# Implementation Plan

[Overview]
Design and implement a production-grade, mobile-first AI shop platform with merchant onboarding, AI-assisted product creation, COD-ready ordering, order management, promotions, and secure, cost-controlled cloud deployment.

This implementation is intentionally structured around your constraints: production readiness (not a demo), strong architecture (system design, security, caching, rate limiting, observability, CI/CD), and cost control for AI/API usage.

We will build a multi-service architecture (serverless-first) where each service is containerized with Docker and deployed on a serverless container runtime (e.g., Cloud Run/App Runner). We will avoid Kubernetes at the beginning to keep operational complexity and cost low; Kubernetes is only considered later if advanced scaling/networking needs appear.
- Merchant mobile app (offline-capable UI flows where possible)
- Customer-facing storefront (mobile web)
- Backend API services (auth, stores, products, orders)
- Background workers for AI enrichment and media processing
- CDN + caching for storefront performance
- Asynchronous AI generation with strict quotas, caching, and fallbacks to minimize expensive LLM/API calls

We will choose a deployment strategy that supports serverless-first scaling (cheaper early days), zero/low-downtime deployments, and controlled egress/API spend.

Because you requested “no database” and “no crashes/cost explosion,” we interpret it as: (1) no self-managed database servers, and (2) minimal DB cost through caching + batching, while still using persistent storage server-side for products/orders.

We will use:
- Managed PostgreSQL for transactional data (stores, products, orders, inventory)
- Managed Redis/KV for hot reads + AI job state + rate limiting buckets

Data partitioning is multi-tenant-by-design using `merchantId` / `storeId` as the partition key for authorization and query scoping. For early scale (e.g., first 500–10,000 merchants), sharding is not required; we rely on indexes, query scoping, and read replicas. If/when write scale grows, we introduce table partitioning or store-range sharding only after measurable performance thresholds.

[Types]  
Single sentence describing the type system changes.

Introduce a shared canonical domain model (DTOs + validation schemas) for Store, Product, Order, Payment/Delivery status, AI generation artifacts, and Promotion objects, with strict field validation and versioning.

Detailed type definitions (canonical API DTOs):

1) Locale
- type Locale = {
  - code: string; // e.g. "ur-PK", "sd-PK", "bs-PK", "en"
  - direction: 'rtl' | 'ltr';
}

2) MerchantProfile
- type MerchantProfile = {
  - id: string; // uuid
  - userId: string; // auth subject
  - businessType: 'shop' | 'home_business' | 'reseller' | 'digital_services' | 'other'
  - displayName: string; // merchant name
  - phoneE164?: string
  - createdAt: string; // ISO
}

3) Store
- type Store = {
  - id: string; // uuid
  - merchantId: string
  - slug: string; // stable subdomain part
  - name: string
  - logoUrl?: string
  - theme: {
    - primaryColor: string; // hex
    - accentColor: string; // hex
  }
  - locale: Locale
  - status: 'active' | 'paused' | 'deleted'
  - plan: 'free' | 'starter' | 'business'
  - limits: {
    - maxProducts: number
  }
  - createdAt: string
}

Validation:
- slug: /^[a-z0-9-]{3,30}$/
- name length: 2..60

4) Product
- type Product = {
  - id: string
  - storeId: string
  - sku?: string
  - title: string
  - description: string
  - category: string
  - brand?: string
  - attributes?: Record<string, string> // size, color, weight, etc.
  - tags: string[]
  - images: { url: string; alt?: string }[]
  - price: {
    - currency: 'PKR'
    - amount: number // integer paise or major units
  }
  - stock?: {
    - quantity: number
    - lowStockThreshold: number
  }
  - status: 'draft' | 'active' | 'archived'
  - createdAt: string
  - updatedAt: string
}

5) AI Generation Job + Artifacts
- type AiJob = {
  - id: string
  - storeId: string
  - merchantId: string
  - productId?: string
  - input: {
    - imageUrl?: string
    - rawText?: string
    - localeCode: string
  }
  - output: {
    - title?: string
    - description?: string
    - category?: string
    - tags?: string[]
    - suggestedPrice?: { low: number; high: number; currency: 'PKR' }
    - confidence?: number // 0..1
  }
  - state: 'queued' | 'running' | 'completed' | 'failed' | 'rejected'
  - createdAt: string
}

6) Order (COD-first)
- type Order = {
  - id: string
  - storeId: string
  - customer: {
    - name: string
    - phoneE164: string
  }
  - items: {
    - productId: string
    - titleSnapshot: string
    - unitPrice: number
    - quantity: number
  }[]
  - pricing: {
    - currency: 'PKR'
    - subtotal: number
    - deliveryFee: number
    - total: number
  }
  - delivery: {
    - addressLine1: string
    - city: string
    - notes?: string
  }
  - payment: {
    - method: 'COD' | 'BANK_TRANSFER' | 'WALLET'
    - status: 'pending' | 'paid' | 'failed'
  }
  - status: 'new' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
  - placedAt: string
  - updatedAt: string
}

7) Promotion
- type Promotion = {
  - id: string
  - storeId: string
  - productId?: string
  - type: 'whatsapp_message' | 'facebook_post' | 'instagram_post'
  - status: 'draft' | 'ready' | 'scheduled'
  - contentByLocale: Record<string, string> // localeCode -> message
  - createdAt: string
}

[Files]
Single sentence describing file modifications.

Create a new fullstack repository structure (or extend existing one if present) containing mobile apps, web storefront, backend API, workers, and CI/CD + infrastructure as code.

Assuming a fresh repo, create:
- /apps/merchant-mobile/ (React Native or Flutter)
- /apps/storefront-web/ (Next.js or Remix)
- /apps/api/ (Node.js NestJS or Go)
- /apps/worker/ (queue consumer for AI + media)
- /packages/shared/ (DTOs, validation schemas, OpenAPI types)
- /infra/terraform/ (VPC, load balancers, managed DB/KV, CDN, secrets)
- /infra/k8s/ or /infra/ecs/ (if using containers)
- /.github/workflows/ (CI/CD)

Configuration updates:
- OpenAPI/Swagger generation
- Environment variable templates
- Secret management integration (AWS Secrets Manager or GCP Secret Manager)

[Functions]
Single sentence describing function modifications.

Implement backend endpoint handlers and background worker functions for:
- auth and store provisioning
- product CRUD
- order creation and status transitions
- AI generation orchestration with caching/quotas
- storefront rendering endpoints
- promotion content generation

New backend functions/endpoints (API service):
- POST /v1/auth/login (or OAuth signup)
- POST /v1/stores (create store + allocate subdomain)
- GET /v1/stores/:id
- POST /v1/stores/:id/products (create product as draft via upload reference)
- POST /v1/ai/jobs/product-enrichment (enqueue AI job)
- GET /v1/ai/jobs/:jobId
- POST /v1/products/:id/publish
- POST /v1/stores/:id/orders (customer checkout -> create COD order)
- PATCH /v1/orders/:id/status (merchant fulfillment)
- GET /v1/merchant/orders (filter by storeId + status)
- POST /v1/stores/:id/promotions (generate promotion copy)

Worker functions:
- processImageIngestion(imageUrl) -> produces normalized image assets
- runVisionExtract(productImage) -> candidate brand/name/category
- runTextGeneration(input, locale) -> title/description/tags
- runPriceSuggestion(storeId, product) -> suggested price range using curated sources
- writeToProduct(productId, enrichedFields)

[Classes]
Single sentence describing class modifications.

Introduce service classes for domain logic and AI orchestration with clear boundaries (StoreService, ProductService, OrderService, AiOrchestrator, PromotionService) plus repository/data access layers.

Example classes (backend):
- StoreService (createStore, publishStoreUrl allocation, plan limits)
- ProductService (createDraftFromUpload, updateFromAi, publish)
- OrderService (createCodOrder, validate inventory, status transitions)
- AiOrchestrator (enqueue job, dedupe, caching, quota enforcement)
- PriceSuggestionService (compute range, confidence)
- PromotionService (generate localized promotion content)

[Dependencies]
Single sentence describing dependency modifications.

Add production-grade dependencies: HTTP framework, validation, auth, job queue, object storage, CDN, and AI SDK; ensure versions are pinned.

Expected dependencies (high level):
- API:
  - request validation (zod/joi/class-validator)
  - OpenAPI generation
  - auth middleware (JWT)
  - rate limiting + request tracing
  - job queue (BullMQ/Redis or cloud queue)
- Worker:
  - queue consumer
  - AI client SDK
  - image processing (Sharp)
- Storefront:
  - SSR/SSG with caching
  - image optimization
- Infra:
  - Terraform
  - container registry

[Testing]
Single sentence describing testing approach.

Use layered testing: unit tests for services, contract tests for API DTOs, integration tests with a real staging environment for order flows, and load tests for storefront performance; include AI job tests with mocked AI responses.

Testing artifacts:
- /apps/api/test/
- /apps/worker/test/
- /apps/storefront-web/test/
- Contract tests verifying DTO schemas and OpenAPI.

[Implementation Order]
Single sentence describing the implementation sequence.

Numbered steps showing the logical order of changes to minimize conflicts and ensure successful integration.

1) Architecture & constraints confirmation: choose cloud provider, container strategy, queue, caching, managed persistence, secrets.
2) Define shared types + OpenAPI contracts; finalize store/product/order schemas and validation.
3) Implement backend skeleton (auth, store provisioning, product CRUD draft/publish, order creation/status transitions) with mocked AI.
4) Implement AI worker pipeline (image ingestion -> vision extraction -> text generation -> suggested price -> write back), including caching and quotas.
5) Implement storefront web (mobile-first) backed by API; ensure CDN caching for product pages.
6) Implement merchant mobile app (onboarding, product upload, AI confirm UI, orders dashboard, promotions screen).
7) Add observability (logs/metrics/traces), rate limiting, WAF rules, and secure auth.
8) Implement CI/CD (build/test, migrations, deploy to staging, smoke tests, then production).
9) Performance + cost tuning: cache strategy, AI dedupe, background job retries, load tests, fail-safes.
10) Launch readiness: security review, incident runbooks, backup/restore validation, and final store order sandbox test.

---

task_progress Items:
- [x] Step 1: Choose serverless-first deployment + low-cost architecture (Docker containers on serverless runtime, avoid Kubernetes early; managed queue/CDN/Redis/Postgres)
- [ ] Step 2: Create shared API contracts/types and implement backend skeleton with mocked AI
- [ ] Step 3: Implement AI worker pipeline with caching/quotas + background processing
- [ ] Step 4: Implement storefront + merchant app, then CI/CD, security, load, and launch readiness

