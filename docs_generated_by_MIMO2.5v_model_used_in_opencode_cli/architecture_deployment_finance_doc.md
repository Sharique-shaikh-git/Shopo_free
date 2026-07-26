# AI Shop Builder — Architecture, Deployment, Database, Observability, and Build Plan (Production-Ready)

## 0) Updated Core Requirement (must not change)
- **Merchant**: uses the **mobile app** to create an account/store, upload products, and manage orders.
- **Customer**: **does NOT install your app**. They land on a **web storefront URL** (Shopify-like) from ads/posts and complete checkout on the **web**.
- **Checkout**: **Web checkout page** (phone/address) → **COD order created** → merchant sees it in dashboard.
- **AI enrichment**: **Enabled** for proof, but must be **cached, rate-limited, and queued** to control cost and reliability.

---

## 1) High-Level Architecture (System Design)
### 1.1 Components
1. **Merchant Mobile App**
   - Onboarding: language → store setup basics (logo/name/theme)
   - Product upload: photo(s) + minimal inputs
   - AI enrichment review/approval
   - Orders dashboard: new orders → fulfill → update status

2. **Customer Web Storefront**
   - Store landing page (storeSlug)
   - Product catalog pages (by category)
   - Product detail pages
   - **Web checkout page** (COD-first)

3. **Backend API (Multi-tenant SaaS)**
   - Auth for merchant
   - Store provisioning (creates storeSlug mapping)
   - Product CRUD (draft → active)
   - Order creation (from checkout) and status updates (merchant)
   - Promotions (future)
   - AI job orchestration endpoints

4. **Async Workers**
   - Media processing (optimize images)
   - Vision extraction (brand/name/category hints)
   - Text generation (title/description/tags)
   - Price suggestion (range)
   - Store AI outputs back to DB

5. **Cache + CDN**
   - CDN for storefront static/HTML and images
   - Server-side cache for product lists and frequently accessed store pages

6. **Observability & Support Tooling**
   - Error tracking (request-level)
   - Audit logs (for security/tenant safety)
   - Metrics dashboards (health, latency, AI queue status)

---

## 2) Multi-tenant Data Model (Isolation & Tenant Safety)
**You must design tenant safety from day 1.** No shortcuts.

### 2.1 Tenant boundaries
- `merchantId` is the ultimate owner of all data.
- `storeId` belongs to a merchant and is used for routing.
- Storefront is accessed by `storeSlug` (public), but every sensitive API call requires `merchantId` authorization.

### 2.2 Tenant safety rules (non-negotiable)
1. Every API query that reads merchant data must include `(merchantId = session.merchantId)`.
2. Every order status update must verify the order belongs to the merchant’s store.
3. Frontend storefront (public) can only read **active** products for that `storeId`.
4. Prevent IDOR by never allowing raw `storeId` or `orderId` without checking ownership.
5. All authorization failures return the same generic error format (avoid data-leak through error messages).

---

## 3) Database Design (What we store, which DB, indexes, and scaling)
### 3.1 What database we use
Use **managed PostgreSQL**.
- Reliable
- Easy to index for tenant routing
- Low operational burden

Add **managed Redis** (optional initially) for caching hot reads and rate-limiting.

> Reality check: you cannot truly avoid persistent storage in a production commerce system. What you can avoid is “managing the DB yourself” and “heavy always-on infrastructure.” Managed DB is the correct production approach.

### 3.2 Core tables (minimum viable production set)
1. `merchants`
   - `id (uuid)`, auth subject, plan, status, createdAt

2. `stores`
   - `id (uuid)`, `merchantId`, `slug`, locale/theme, status, plan limits

3. `products`
   - `id`, `storeId`, title/description/category/brand/tags
   - `priceAmount`, `priceCurrency`
   - `status` (draft/active/archived)

4. `product_images`
   - `id`, `productId`, image URLs, hash, metadata

5. `orders`
   - `id`, `storeId`, customer snapshot (name/phone/address)
   - `items[]` (either JSON snapshot or normalized order_items table)
   - `status` (new/packed/shipped/delivered/cancelled)
   - COD fields (delivery fee if any, notes)

6. `ai_jobs`
   - `id`, `storeId`, `productId?`, input refs (image hash/objectStorage key)
   - output JSON fields (title/description/tags/price suggestion)
   - `state`, `errorCode`, timestamps

7. `audit_logs`
   - `id`, `merchantId`, `storeId`, `action`, `resourceType`, `resourceId`, metadata

### 3.3 Indexing strategy
- `stores(slug UNIQUE)`
- `products(storeId, status, createdAt)`
- `products(storeId, category, status)`
- `orders(storeId, status, createdAt)`
- `ai_jobs(storeId, state, createdAt)`
- `orders(id)` for fast direct lookup with ownership checks in API layer.

### 3.4 Partitioning & sharding
- **No sharding early**.
- If needed later, partition by `storeId` hash ranges or by time.
- Design queries so tenant filters are always present; this delays the need for sharding.

---

## 4) Caching Strategy (Performance + AI Cost Control)
### 4.1 What to cache
1. **Storefront HTML pages** per storeSlug
2. **Product lists** per storeId + category
3. **Product detail** per productId (or by slug)

### 4.2 AI output caching
- Use **image content hash** as a dedupe key.
- If the same image hash is uploaded again for the same locale/category, reuse extracted output.
- Cache AI outputs with a TTL and strong “tenant-safe” scoping (storeId).

### 4.3 Cache invalidation
- When merchant publishes a product, invalidate relevant storefront cache keys.

---

## 5) Security Architecture (production-grade basics)
### 5.1 Auth vs Authorization
- **Authentication**: identify merchant (session/JWT)
- **Authorization**: verify the merchant can access a specific store/order/product

### 5.2 Threats you must handle
- IDOR: ensure order/product/store ownership is checked
- Broken access control: enforce tenant filters in all endpoints
- Rate limiting: protect AI endpoints and auth endpoints
- Secure file uploads: virus scan optional; enforce mime types and size limits

### 5.3 Security stack
- TLS everywhere
- WAF/rate limiting at edge
- Request validation (strict schemas)
- Secrets manager for API keys

---

## 6) AI/API Cost Control (How we avoid “LLM ruins us”)
### 6.1 Queue everything AI-related
- Merchant uploads photo → create `ai_job` in DB → respond quickly.
- Worker processes jobs asynchronously.

### 6.2 Strict quotas
- Limit jobs per merchant per day/week/month.
- Limit concurrent AI jobs per store/merchant.

### 6.3 Dedupe & reuse
- Image hash dedupe
- Reuse category inference and text generation if same inputs

### 6.4 Conservative AI mode for proof
- Start with smaller prompt outputs (title/description/tags/price range) not huge text.
- Allow merchant override quickly.

---

## 7) Deployment Architecture (What to deploy where)
### 7.1 Recommended provider approach
Use **one cloud** to reduce complexity.
- AWS or GCP are both fine.
- For cost control, choose managed services and avoid Kubernetes until scale.

### 7.2 Serverless-first deployment (avoid Kubernetes)
- API via serverless/container service
- Workers via queue-consumer service
- DB managed
- Object storage managed
- CDN in front of storefront

### 7.3 Load balancing
- Use provider-managed load balancing or edge routing.

### 7.4 CDN / CX
Yes, CDN is recommended for storefront performance and to reduce origin load.
- It improves page speed in Pakistan networks.
- It reduces backend cost.

---

## 8) Observability: Analytics, Bug reports, Error reporting (how we know it’s working)
### 8.1 What to track
1. **Health/metrics**
   - API latency (p50/p95), error rate
   - queue depth, AI job success/fail rate
   - order creation count

2. **Frontend metrics**
   - page load time (web storefront)
   - checkout conversion rate

3. **Error reporting**
   - centralized error logs
   - request correlation IDs (trace every request)

4. **Merchant support signals**
   - “Report bug” button opens a prefilled form + includes context (route, merchantId, orderId if any, logs correlation id).

### 8.2 Tooling
- Error tracking: one dedicated service (Sentry-like)
- Analytics: event-based instrumentation (e.g., checkout_started, checkout_completed)
- Audit logs for security actions

### 8.3 “If something is not working” workflow
- Merchant reports “checkout failing”
- System shows error tracking entry by correlation id
- Engineers see root cause quickly

---

## 9) CI/CD and Release Safety (blue/green-like + feature flags)
### 9.1 Required pipeline stages
1. PR build + unit tests
2. Contract tests for API DTO validation
3. Deploy to staging
4. Smoke tests (storefront render, auth, one order flow)
5. Deploy to production with rollback plan

### 9.2 Feature flags
- Enable/disable AI enrichment per environment
- Enable cashless later without breaking checkout

---

## 10) What to build first (working proof in Pakistan)
### Proof milestone must demonstrate:
1. Merchant can create store and get a store URL
2. Merchant can upload product photo
3. AI generates listing content (cached)
4. Customer can open web storefront URL
5. Customer can place COD order on web checkout
6. Merchant dashboard shows new order and can mark fulfilled

### Minimal proof scope
- COD only
- Basic merchant auth
- Storefront pages + checkout
- Orders API + dashboard
- AI enrichment: title/description/tags/price range

---

## 11) Build Strategy with limited money
### 11.1 Use free tiers for early proof
- local dev
- free cloud tiers for staging

### 11.2 Avoid expensive integration early
- Email/SMS notifications later (you said future)
- Courier integration later if too complex (start with “merchant marks shipped”)

### 11.3 Payments for subscriptions
- Use **Google Play / Apple IAP** for app subscriptions.
- You don’t need Stripe for app-store subscriptions.
- Stripe-like providers are for web/merchant billing; skip until needed.

---

## 12) Implementation Rollout Plan (sequence)
1. Backend API skeleton + DTOs + tenant-safe authorization rules
2. DB schema + indexes + migrations
3. Store provisioning (storeSlug) and storefront data endpoints
4. Web storefront + web checkout (COD) + order creation
5. Merchant mobile app minimum screens (upload, review, orders)
6. AI enrichment workers with queue + caching + quotas
7. Observability setup (logs/metrics/errors) + merchant “report bug”
8. CI/CD pipeline (staging then production) + rollbacks

---

## 13) Notes on coding agents and tools
- Use your own IDE locally for development: **VS Code** or **Cursor**.
- Coding agents should be used for tasks with clear specs and acceptance tests.
- Avoid “big bang coding”; implement in slices tied to the proof milestone.

---

## Appendix A: Answers to your direct questions
### Q1) Do we need hosting for every merchant?
No. Platform is hosted once; each merchant is a tenant in your system.

### Q2) What about database?
You will use a managed DB (PostgreSQL). This is required for orders/products/tenants.

### Q3) How do we scale without rebuilding?
Tenant-aware schema from day 1, stateless APIs, async workers, caching, and horizontal scaling.

### Q4) Can you complete the app if no money?
Code can be written, but deployment/AI usage/observability require some budget. With free tiers and minimal proof scope you can reach working demo, then scale with subscriptions.

### Q5) Do we need CDN/CX?
Yes for storefront speed and lower origin load—especially important in Pakistan.

