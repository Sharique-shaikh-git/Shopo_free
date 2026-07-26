# Architecture — AI Shop Builder (Production)

## 1. Goals
- Mobile-first merchant onboarding and AI-assisted product creation.
- Customer storefront optimized for low latency on mobile networks.
- COD-first ordering flow.
- Multi-tenant isolation (merchant/store separation).
- Cost-controlled AI pipeline (quota + caching + async jobs).
- Production readiness: observability, security, CI/CD, and safe rollouts.

## 2. High-Level Architecture
### 2.1 Services (serverless-first, containers)
Deploy each service as a Docker container on a serverless container runtime (example patterns: Cloud Run / AWS App Runner).
- **merchant-mobile** (React Native / Flutter app)
- **storefront-web** (mobile web app: Next.js/Remix)
- **api-service** (REST API, auth, stores, products, orders)
- **worker-service** (async jobs: image processing + AI enrichment + price suggestion)
- **object storage** (product images, generated assets/logos)
- **cdn + caching** (storefront performance)
- **managed persistence** (PostgreSQL) + **managed cache** (Redis)

### 2.2 Data Flow (happy path)
1. Merchant logs in → creates store (subdomain allocated).
2. Merchant uploads product photo(s).
3. API stores upload reference → enqueues AI product enrichment job.
4. Worker processes:
   - normalize image
   - extract candidate fields (vision/OCR)
   - generate localized listing text
   - compute suggested price range
5. Worker writes enriched results → API updates product draft.
6. Merchant confirms & publishes → storefront renders using cached pages.
7. Customer orders (COD) → API creates order and returns confirmation.
8. Merchant fulfills → API updates order status → customer sees updated status (optional).

## 3. Deployment Topology
### 3.1 Container strategy
- Docker for each service.
- Separate deployable units:
  - `api-service` container
  - `worker-service` container
  - `storefront-web` container or managed static/SSR runtime

### 3.2 Why not Kubernetes first
- Kubernetes adds cluster operations, scaling complexity, networking config, secrets management, and cost during early traction.
- Use Kubernetes later if needed for:
  - specialized networking
  - complex autoscaling policies
  - very high scale
  - long-running streaming services

## 4. Multi-Tenancy Model (how “user” is managed)
### 4.1 Identity layers
- **Auth Identity**: JWT subject identifies the merchant account (user).
- **Tenant Identity**:
  - `merchantId` (tenant root)
  - `storeId` (public storefront identity: subdomain/slug)

### 4.2 Tenant isolation enforcement
- Every API request derives the merchant from JWT and scopes queries by `merchantId` / `storeId`.
- Authorization middleware:
  - denies access if `storeId` does not belong to the merchant tenant
  - uses row-level checks or query scoping (recommended: query scoping + strict tests)

### 4.3 “500 users or 100 users” handling
- Do not shard by user count. Use:
  - managed PostgreSQL with indexes
  - read replicas if needed
  - caching via Redis for hot reads (storefront and product pages)
- Only consider sharding/partitioning when performance thresholds are exceeded (see Database docs).

## 5. Scaling & Partitioning (practical approach)
- Scale horizontally at the API/worker layer (stateless containers).
- Worker concurrency controlled by queue rate limits.
- Cache keys always include `storeId` to avoid cross-tenant leakage.
- Database tables keyed by `merchantId`/`storeId` with proper indexes.

## 6. Security Architecture
- Authentication:
  - JWT-based auth for merchant app and dashboard APIs
- Authorization:
  - tenant scoping middleware
- Transport security:
  - TLS everywhere
- Secrets:
  - managed secret store (no secrets in repo)
- API safety:
  - rate limiting (per merchant, per IP, per endpoint)
  - request size limits for uploads
  - input validation for all request bodies
- AI safety:
  - prompt injection mitigation strategy (structured prompts)
  - do not pass secrets to AI
  - content moderation (optional, depending on policy)

## 7. Observability (must-have)
- Metrics:
  - request latency, error rate (by endpoint)
  - queue depth, job success/failure rates
  - AI API usage cost proxy metrics (tokens/requests)
- Logs:
  - correlation IDs per request and per job
- Tracing:
  - trace from storefront/API → queue job → worker completion
- Error reporting:
  - centralized error capture for API + storefront
  - merchant-facing “status” pages and support-friendly identifiers

## 8. Cost Control (AI + API)
- Strict quotas per plan:
  - store creation limits
  - product enrichment limits per month
  - promotional generation limits per month
- AI caching/dedup:
  - hash of normalized product image/text inputs
  - if identical inputs exist, reuse outputs (where safe)
- Async processing:
  - AI calls never block the main request path
  - storefront remains responsive while enrichment completes
