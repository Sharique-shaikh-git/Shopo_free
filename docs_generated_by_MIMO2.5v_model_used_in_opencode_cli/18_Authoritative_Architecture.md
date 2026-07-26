# Document 18: Authoritative Architecture
## Digital Dukaan - Single Source of Truth

**Date:** July 8, 2026  
**Status:** AUTHORITATIVE - All other architecture docs reference this  
**Purpose:** Consolidate all architecture decisions into one document

---

## IMPORTANT: READ THIS FIRST

This document supersedes all other architecture documents for any contradictions. The following files are now **reference only** (their unique content is preserved here):

| File | Status | What to Use From It |
|------|--------|---------------------|
| `Production_Architecture.md` | REFERENCE | AI cost guard class, deployment commands |
| `Complete_Architecture_Guide.md` | REFERENCE | Partitioning SQL, Sentry code, WebSocket |
| `architecture_deployment_finance_doc.md` | REFERENCE | Tenant safety invariants, AI job pipeline |
| `docs/01_Architecture.md` | REFERENCE | Microservice boundaries |
| `docs/02_System_Design.md` | REFERENCE | API endpoints, cache key format |
| `docs/13_Authorization_Tenant_Safety.md` | REFERENCE | Authorization checklist |

---

## 1. CORE CONSTRAINT (NON-NEGOTIABLE)

```
┌─────────────────────────────────────────────────────────────┐
│                THE RULE                                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  CUSTOMER:                                                   │
│  ├── Does NOT download our app                               │
│  ├── Clicks ad/post → opens browser                          │
│  ├── Visits {slug}.digitaldukaan.pk                          │
│  ├── Browses products → adds to cart → checkout              │
│  └── Payment: COD-first (Pakistan), Stripe/PayPal (intl)    │
│                                                              │
│  MERCHANT:                                                   │
│  ├── Downloads mobile app (React Native)                     │
│  ├── Creates account, uploads products                       │
│  ├── AI fills product content                                │
│  ├── Manages orders via app                                  │
│  └── Shares link with customers                              │
│                                                              │
│  PLATFORM:                                                   │
│  ├── ONE deployment (GCP Cloud Run)                          │
│  ├── ONE database (PostgreSQL, multi-tenant)                 │
│  ├── ONE cache (Redis, tenant-scoped keys)                   │
│  ├── Subdomain routing: Host header → storeId                │
│  └── Tenant-safety from day 1                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                COMPLETE SYSTEM                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   CLIENTS                            │    │
│  │  ┌──────────────┐  ┌──────────────┐                │    │
│  │  │ Merchant App │  │ Customer Web │                │    │
│  │  │ (React Native)│  │ (Next.js)   │                │    │
│  │  └──────┬───────┘  └──────┬───────┘                │    │
│  └─────────┼──────────────────┼────────────────────────┘    │
│            │                  │                              │
│            ▼                  ▼                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              CDN + LOAD BALANCER                     │    │
│  │  ┌──────────────┐  ┌──────────────┐                │    │
│  │  │  Cloudflare  │  │  GCP Load    │                │    │
│  │  │  (Free Tier) │  │  Balancer    │                │    │
│  │  └──────────────┘  └──────────────┘                │    │
│  └─────────────────────────────────────────────────────┘    │
│            │                  │                              │
│            ▼                  ▼                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              CLOUD RUN (Serverless)                  │    │
│  │                                                      │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │    │
│  │  │  API    │ │ Store-  │ │  Worker │ │  Auth   │  │    │
│  │  │ Service │ │ front   │ │ Service │ │ Service │  │    │
│  │  │         │ │ Service │ │         │ │         │  │    │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘  │    │
│  │       │           │           │            │        │    │
│  └───────┼───────────┼───────────┼────────────┼────────┘    │
│          │           │           │            │              │
│          ▼           ▼           ▼            ▼              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    DATA LAYER                        │    │
│  │                                                      │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │    │
│  │  │  PostgreSQL  │  │    Redis     │  │  Cloud    │ │    │
│  │  │  (Cloud SQL) │  │ (Memorystore)│  │  Storage  │ │    │
│  │  │              │  │              │  │           │ │    │
│  │  │ Multi-tenant │  │ Tenant-scoped│  │ Images    │ │    │
│  │  │ RLS enabled  │  │ cache keys   │  │ Files     │ │    │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │    │
│  │                                                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. TECH STACK

| Layer | Technology | Decision |
|-------|------------|----------|
| **Mobile** | React Native + Expo | Cross-platform, OTA updates |
| **Customer Web** | Next.js | SSR, SEO, fast |
| **Backend** | Node.js + NestJS | TypeScript, microservices-ready |
| **Database** | PostgreSQL (Cloud SQL) | ACID, JSONB, RLS |
| **Cache** | Redis (Memorystore) | Sessions, AI cache, rate limits |
| **Queue** | BullMQ + Redis | AI jobs, async processing |
| **Storage** | Google Cloud Storage | Product images, files |
| **AI** | OpenAI / Claude API | Product analysis, content gen |
| **Auth** | Firebase Auth | Phone OTP, social login |
| **CDN** | Cloudflare (free tier) | DDoS, static assets |
| **Monitoring** | Sentry + Firebase Analytics | Errors + user behavior |
| **CI/CD** | GitHub Actions + Cloud Build | Automated deploy |

---

## 4. MULTI-TENANT DATA MODEL

### Tenant Identity Flow

```
┌─────────────────────────────────────────────────────────────┐
│                TENANT IDENTITY                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  MERCHANT (logged in):                                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ JWT Token contains:                                  │    │
│  │ {                                                    │    │
│  │   "merchantId": "uuid-123",                         │    │
│  │   "phone": "+923001234567",                         │    │
│  │   "role": "merchant"                                 │    │
│  │ }                                                    │    │
│  │                                                      │    │
│  │ Every API call:                                      │    │
│  │ Authorization: Bearer <JWT>                          │    │
│  │ → Backend extracts merchantId from JWT               │    │
│  │ → ALL queries include: WHERE merchant_id = $1       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  CUSTOMER (visiting storefront):                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Request: GET https://ali.digitaldukaan.pk            │    │
│  │ Host header: ali.digitaldukaan.pk                    │    │
│  │                                                      │    │
│  │ Backend:                                             │    │
│  │ 1. Parse subdomain: "ali"                            │    │
│  │ 2. SELECT id, merchant_id FROM stores WHERE slug='ali│
│  │ 3. Attach storeId + merchantId to request context    │    │
│  │ 4. All storefront queries: WHERE store_id = $1      │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema (Authoritative)

```sql
-- ============================================
-- MERCHANTS TABLE
-- ============================================
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100),
    email VARCHAR(200),
    language VARCHAR(10) DEFAULT 'ur',
    plan VARCHAR(20) DEFAULT 'free',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- STORES TABLE
-- ============================================
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    banner_url VARCHAR(500),
    custom_domain VARCHAR(200),
    status VARCHAR(20) DEFAULT 'active',
    plan VARCHAR(20) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_stores_merchant_id ON stores(merchant_id);

-- ============================================
-- PRODUCTS TABLE (with partitioning)
-- ============================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    title VARCHAR(300),
    description TEXT,
    price DECIMAL(10,2),
    compare_at_price DECIMAL(10,2),
    sku VARCHAR(100),
    stock_quantity INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft',
    ai_generated BOOLEAN DEFAULT FALSE,
    category VARCHAR(100),
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
) PARTITION BY HASH (store_id);

-- Create 4 partitions (add more as needed)
CREATE TABLE products_p0 PARTITION OF products FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE products_p1 PARTITION OF products FOR VALUES WITH (MODULUS 4, REMAINDER 1);
CREATE TABLE products_p2 PARTITION OF products FOR VALUES WITH (MODULUS 4, REMAINDER 2);
CREATE TABLE products_p3 PARTITION OF products FOR VALUES WITH (MODULUS 4, REMAINDER 3);

CREATE INDEX idx_products_store_id_status ON products(store_id, status);
CREATE INDEX idx_products_store_id_created ON products(store_id, created_at DESC);
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- ============================================
-- PRODUCT IMAGES TABLE
-- ============================================
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(300),
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- ============================================
-- ORDERS TABLE (with partitioning)
-- ============================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    customer_id UUID,
    order_number SERIAL,
    status VARCHAR(20) DEFAULT 'new',
    subtotal DECIMAL(10,2),
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2),
    payment_method VARCHAR(50) DEFAULT 'cod',
    payment_status VARCHAR(20) DEFAULT 'pending',
    shipping_address JSONB,
    billing_address JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create monthly partitions (example for 2026)
CREATE TABLE orders_2026_01 PARTITION OF orders FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE orders_2026_02 PARTITION OF orders FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE orders_2026_03 PARTITION OF orders FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
-- Add more monthly partitions as needed

CREATE INDEX idx_orders_store_id_status_created ON orders(store_id, status, created_at DESC);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- ============================================
-- CUSTOMERS TABLE
-- ============================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(200),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_customers_store_id ON customers(store_id);

-- ============================================
-- AI JOBS TABLE
-- ============================================
CREATE TABLE ai_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    job_type VARCHAR(50) NOT NULL,
    input_refs JSONB,
    output JSONB,
    state VARCHAR(20) DEFAULT 'queued',
    error_code VARCHAR(100),
    error_message TEXT,
    dedupe_key VARCHAR(200),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    created_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_ai_jobs_store_id_state_created ON ai_jobs(store_id, state, created_at DESC);
CREATE INDEX idx_ai_jobs_dedupe_key ON ai_jobs(dedupe_key);

-- ============================================
-- AUDIT LOGS TABLE
-- ============================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL,
    store_id UUID,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    metadata JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_merchant_id_created ON audit_logs(merchant_id, created_at DESC);

-- ============================================
-- AI USAGE TABLE (for cost tracking)
-- ============================================
CREATE TABLE ai_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    store_id UUID NOT NULL REFERENCES stores(id),
    feature VARCHAR(50),
    model_used VARCHAR(50),
    tokens_input INTEGER,
    tokens_output INTEGER,
    cost_usd DECIMAL(10,6),
    cached BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_usage_merchant_id_created ON ai_usage(merchant_id, created_at DESC);

-- ============================================
-- CUSTOM DOMAINS TABLE
-- ============================================
CREATE TABLE custom_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    domain VARCHAR(200) UNIQUE NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(100),
    ssl_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_custom_domains_domain ON custom_domains(domain);
CREATE INDEX idx_custom_domains_store_id ON custom_domains(store_id);
```

---

## 5. SUBDOMAIN ROUTING

### How Host Header → storeId Works

```
┌─────────────────────────────────────────────────────────────┐
│                SUBDOMAIN RESOLUTION                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  STEP 1: Customer visits ali.digitaldukaan.pk               │
│                                                              │
│  STEP 2: DNS resolves to Cloudflare                         │
│  └── CNAME *.digitaldukaan.pk → our-app.cloudrun.app       │
│                                                              │
│  STEP 3: Cloudflare → GCP Load Balancer                     │
│  └── Wildcard TLS cert handles *.digitaldukaan.pk          │
│                                                              │
│  STEP 4: Request arrives at Cloud Run                       │
│  └── Host header: ali.digitaldukaan.pk                      │
│                                                              │
│  STEP 5: Tenant Resolution Middleware                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ function resolveTenant(request) {                    │    │
│  │   // Extract subdomain from Host header              │    │
│  │   const host = request.headers.host;                  │    │
│  │   const slug = host.split('.')[0];                    │    │
│  │                                                      │    │
│  │   // Check subdomain first                           │    │
│  │   let store = await db.query(                         │    │
│  │     'SELECT id, merchant_id FROM stores WHERE slug = $1│   │
│  │     [slug]                                            │    │
│  │   );                                                  │    │
│  │                                                      │    │
│  │   // If not found, check custom domains              │    │
│  │   if (!store) {                                       │    │
│  │     store = await db.query(                           │    │
│  │       `SELECT s.id, s.merchant_id                      │    │
│  │        FROM stores s                                   │    │
│  │        JOIN custom_domains cd ON s.id = cd.store_id   │    │
│  │        WHERE cd.domain = $1 AND cd.verified = true`,  │    │
│  │       [host]                                          │    │
│  │     );                                                │    │
│  │   }                                                   │    │
│  │                                                      │    │
│  │   if (!store) return 404;                             │    │
│  │                                                      │    │
│  │   // Attach tenant context                            │    │
│  │   request.context = {                                 │    │
│  │     storeId: store.id,                                │    │
│  │     merchantId: store.merchant_id                     │    │
│  │   };                                                  │    │
│  │ }                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  STEP 6: All subsequent queries use request.context         │
│  └── SELECT * FROM products WHERE store_id = $1 AND ...     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Wildcard TLS Certificate

```
┌─────────────────────────────────────────────────────────────┐
│                TLS CERTIFICATE                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  OPTION: Let's Encrypt Wildcard Cert                        │
│  ├── Cert: *.digitaldukaan.pk                               │
│  ├── Covers: all subdomains automatically                   │
│  ├── Auto-renewal: certbot + Cloud DNS                      │
│  └── Cost: FREE                                              │
│                                                              │
│  SETUP:                                                      │
│  1. Use certbot with DNS-01 challenge                       │
│  2. Store cert in GCP Secret Manager                         │
│  3. Load balancer reads cert for TLS termination             │
│  4. Renewal triggers reload                                 │
│                                                              │
│  CUSTOM DOMAINS:                                             │
│  1. Merchant adds custom domain in app                       │
│  2. System generates verification token                      │
│  3. Merchant adds TXT record to their DNS                    │
│  4. System verifies and provisions cert                      │
│  └── Uses Let's Encrypt per-domain cert                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. CACHING STRATEGY (Tenant-Scoped)

### Cache Key Format (MANDATORY)

```
┌─────────────────────────────────────────────────────────────┐
│                CACHE KEY RULES                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  RULE: ALL cache keys MUST include storeId                   │
│                                                              │
│  CORRECT:                                                    │
│  ✅ store:{storeId}:product:{productId}                     │
│  ✅ store:{storeId}:home                                    │
│  ✅ store:{storeId}:category:{category}                     │
│  ✅ tenant:{merchantId}:quota:{feature}                     │
│                                                              │
│  WRONG (causes cross-tenant data leak):                     │
│  ❌ product:{productId}                                      │
│  ❌ home                                                     │
│  ❌ category:{category}                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Cache TTLs

| Data Type | Cache Key | TTL | Pattern |
|-----------|-----------|-----|---------|
| Product detail | `store:{storeId}:product:{id}` | 5 min | Cache-aside |
| Store home | `store:{storeId}:home` | 5 min | Cache-aside |
| Category list | `store:{storeId}:category:{cat}` | 5 min | Cache-aside |
| Store info | `store:{storeId}:info` | 10 min | Cache-aside |
| AI response | `ai:{storeId}:{dedupeKey}` | 7 days | Write-through |
| Session | `session:{userId}` | 15 min | Write-through |
| Rate limit | `ratelimit:{ip}:{endpoint}` | 1 min | Sliding window |
| Quota | `quota:{merchantId}:{feature}:{date}` | 24 hours | Write-through |

### Cache Invalidation

```
When product is published/unpublished:
1. Invalidate: store:{storeId}:product:{productId}
2. Invalidate: store:{storeId}:home
3. Invalidate: store:{storeId}:category:{category}
4. Purge CDN: /stores/{slug}/*
```

---

## 7. API ENDPOINTS (Authoritative)

### Merchant App Endpoints (JWT required)

```
AUTH:
POST   /v1/auth/otp/request          (send OTP)
POST   /v1/auth/otp/verify           (verify OTP, return JWT)
POST   /v1/auth/refresh              (refresh token)
DELETE /v1/auth/logout               (invalidate session)

STORE:
POST   /v1/stores                    (create store)
GET    /v1/stores                    (list merchant's stores)
GET    /v1/stores/{storeId}          (get store details)
PATCH  /v1/stores/{storeId}          (update store)

PRODUCTS:
POST   /v1/stores/{storeId}/products/uploads/presign  (get upload URL)
POST   /v1/stores/{storeId}/products  (create draft with AI)
GET    /v1/stores/{storeId}/products  (list products)
GET    /v1/products/{productId}       (get product)
PATCH  /v1/products/{productId}       (update product)
POST   /v1/products/{productId}/publish  (publish to storefront)
DELETE /v1/products/{productId}       (soft delete)

ORDERS:
GET    /v1/stores/{storeId}/orders    (list orders)
GET    /v1/orders/{orderId}           (get order details)
PATCH  /v1/orders/{orderId}/status    (update status)

AI:
POST   /v1/products/{productId}/enrich   (enqueue AI job)
GET    /v1/ai-jobs/{jobId}               (check job status)

ANALYTICS:
GET    /v1/stores/{storeId}/analytics    (dashboard stats)
```

### Customer Storefront Endpoints (storeSlug required)

```
STOREFRONT:
GET    /                              (store home - server rendered)
GET    /category/{category}           (product listing)
GET    /product/{productSlug}         (product detail)

CHECKOUT:
POST   /orders                        (place COD order)
GET    /orders/{orderNumber}/track    (track order)

SEARCH:
GET    /search?q={query}              (search products)
```

---

## 8. RATE LIMITING (Concrete Specs)

### Rate Limits

| Endpoint | Limit | Window | Scope |
|----------|-------|--------|-------|
| `POST /auth/otp/request` | 5 | 1 hour | per phone |
| `POST /auth/otp/verify` | 5 | 5 min | per phone |
| `POST /auth/refresh` | 10 | 1 hour | per session |
| `POST /stores` | 3 | 1 day | per merchant |
| `POST /products/*/uploads/presign` | 50 | 1 day | per merchant |
| `POST /products/*/enrich` | 10 | 1 day | per merchant |
| `POST /orders` | 20 | 1 hour | per store |
| `GET /*` (merchant) | 100 | 1 min | per merchant |
| `GET /*` (storefront) | 1000 | 1 min | per IP |
| `POST /auth/*` | 10 | 1 min | per IP |

### Implementation (Redis)

```typescript
// Rate limiting middleware
async function rateLimit(key: string, limit: number, windowSec: number): Promise<boolean> {
  const now = Date.now();
  const windowMs = windowSec * 1000;
  
  const pipe = redis.pipeline();
  pipe.zremrangebyscore(key, 0, now - windowMs);  // Remove old entries
  pipe.zadd(key, now.toString(), `${now}:${Math.random()}`);  // Add current request
  pipe.zcard(key);  // Count requests in window
  pipe.expire(key, windowSec);  // Set expiry
  
  const results = await pipe.exec();
  const count = results[2][1] as number;
  
  return count <= limit;
}

// Usage in middleware
app.use(async (req, res, next) => {
  const key = `ratelimit:${req.ip}:${req.route}`;
  const allowed = await rateLimit(key, 100, 60);
  if (!allowed) return res.status(429).json({ error: 'RATE_LIMITED' });
  next();
});
```

---

## 9. AI COST CONTROL

### AI Job Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                AI JOB FLOW                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Merchant uploads product photo                           │
│     ↓                                                        │
│  2. API: Check dedupe key (image hash + storeId)            │
│     ├── Cache hit → return cached AI response (FREE)         │
│     └── Cache miss → continue                                │
│     ↓                                                        │
│  3. API: Check merchant quota                                │
│     ├── Free: 5 AI jobs/day                                  │
│     ├── Starter: 50 AI jobs/day                              │
│     ├── Business: 500 AI jobs/day                            │
│     └── Over quota → reject with UPGRADE_PLAN message        │
│     ↓                                                        │
│  4. API: Create ai_job record (state=queued)                 │
│     ↓                                                        │
│  5. API: Add to BullMQ queue                                 │
│     ↓                                                        │
│  6. API: Return immediately (job_id + status)                │
│     ↓                                                        │
│  7. Worker: Pick up job from queue                            │
│     ├── Set state=running                                    │
│     ├── Call AI API (OpenAI/Claude)                          │
│     ├── Store result in ai_job.output                        │
│     ├── Set state=completed                                  │
│     ├── Cache response (store:{storeId}:ai:{dedupeKey})     │
│     └── Track usage in ai_usage table                        │
│     ↓                                                        │
│  8. App polls job status → shows result to merchant          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### AI Cost Guard (Per-Merchant Limits)

```typescript
const AI_TIER_LIMITS = {
  free: {
    dailyJobs: 5,
    monthlyCostUsd: 5.00,
    maxTokensPerRequest: 500,
    allowedModels: ['gpt-4o-mini', 'gemini-flash']
  },
  starter: {
    dailyJobs: 50,
    monthlyCostUsd: 25.00,
    maxTokensPerRequest: 1000,
    allowedModels: ['gpt-4o-mini', 'gemini-flash', 'gpt-4o']
  },
  business: {
    dailyJobs: 500,
    monthlyCostUsd: 100.00,
    maxTokensPerRequest: 2000,
    allowedModels: ['gpt-4o-mini', 'gemini-flash', 'gpt-4o', 'claude-sonnet']
  }
};

async function checkQuota(merchantId: string, plan: string): Promise<boolean> {
  const limits = AI_TIER_LIMITS[plan];
  const today = new Date().toISOString().split('T')[0];
  
  const count = await redis.get(`quota:${merchantId}:ai:${today}`);
  if (count && parseInt(count) >= limits.dailyJobs) {
    return false;  // Over quota
  }
  
  await redis.incr(`quota:${merchantId}:ai:${today}`);
  await redis.expire(`quota:${merchantId}:ai:${today}`, 86400);
  return true;
}
```

### AI Dedupe Key

```typescript
function computeDedupeKey(imageUrl: string, storeId: string, locale: string): string {
  // Download image, compute hash
  const imageBuffer = await downloadImage(imageUrl);
  const hash = crypto.createHash('sha256').update(imageBuffer).digest('hex');
  
  // Include storeId to prevent cross-tenant cache hits
  return `ai:${storeId}:${locale}:${hash}`;
}
```

---

## 10. ROW-LEVEL SECURITY (RLS)

### Enable RLS on All Tables

```sql
-- Enable RLS on all tenant tables
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
```

### RLS Policies

```sql
-- ============================================
-- STORES POLICY
-- ============================================
CREATE POLICY stores_merchant_isolation ON stores
  FOR ALL
  USING (merchant_id = current_setting('app.merchant_id')::UUID);

-- ============================================
-- PRODUCTS POLICY
-- ============================================
-- Merchant: full access to own products
CREATE POLICY products_merchant_isolation ON products
  FOR ALL
  USING (store_id IN (
    SELECT id FROM stores WHERE merchant_id = current_setting('app.merchant_id')::UUID
  ));

-- Customer: read only active products
CREATE POLICY products_customer_read ON products
  FOR SELECT
  USING (
    store_id = current_setting('app.store_id')::UUID
    AND status = 'active'
  );

-- ============================================
-- ORDERS POLICY
-- ============================================
-- Merchant: access orders from their stores
CREATE POLICY orders_merchant_isolation ON orders
  FOR ALL
  USING (store_id IN (
    SELECT id FROM stores WHERE merchant_id = current_setting('app.merchant_id')::UUID
  ));

-- ============================================
-- ORDER ITEMS POLICY
-- ============================================
CREATE POLICY order_items_merchant_isolation ON order_items
  FOR ALL
  USING (order_id IN (
    SELECT o.id FROM orders o
    JOIN stores s ON o.store_id = s.id
    WHERE s.merchant_id = current_setting('app.merchant_id')::UUID
  ));

-- ============================================
-- AI JOBS POLICY
-- ============================================
CREATE POLICY ai_jobs_merchant_isolation ON ai_jobs
  FOR ALL
  USING (merchant_id = current_setting('app.merchant_id')::UUID);

-- ============================================
-- AUDIT LOGS POLICY
-- ============================================
CREATE POLICY audit_logs_merchant_isolation ON audit_logs
  FOR ALL
  USING (merchant_id = current_setting('app.merchant_id')::UUID);
```

### Set Tenant Context (Middleware)

```typescript
// In middleware, set the tenant context before queries
async function setTenantContext(req, res, next) {
  const merchantId = req.user?.merchantId;
  const storeId = req.context?.storeId;
  
  if (merchantId) {
    await db.query(`SET LOCAL app.merchant_id = '${merchantId}'`);
  }
  if (storeId) {
    await db.query(`SET LOCAL app.store_id = '${storeId}'`);
  }
  
  next();
}
```

---

## 11. DEPLOYMENT

### Infrastructure (GCP)

```
┌─────────────────────────────────────────────────────────────┐
│                GCP SERVICES                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  COMPUTE:                                                    │
│  └── Cloud Run (serverless)                                  │
│      ├── Min instances: 0 (scale to zero)                    │
│      ├── Max instances: 10                                   │
│      ├── CPU: 1 per instance                                 │
│      ├── Memory: 512Mi                                       │
│      └── Region: asia-south1 (Mumbai)                        │
│                                                              │
│  DATABASE:                                                   │
│  └── Cloud SQL (PostgreSQL 15)                               │
│      ├── Tier: db-f1-micro (MVP)                             │
│      ├── Storage: 10GB                                       │
│      ├── Backups: Daily                                      │
│      └── Region: asia-south1                                 │
│                                                              │
│  CACHE:                                                      │
│  └── Memorystore (Redis 7)                                   │
│      ├── Tier: Standard                                      │
│      ├── Memory: 1GB                                         │
│      └── Region: asia-south1                                 │
│                                                              │
│  STORAGE:                                                    │
│  └── Google Cloud Storage                                    │
│      ├── Bucket: digitaldukaan-assets                        │
│      └── Region: asia-south1                                 │
│                                                              │
│  CDN:                                                        │
│  └── Cloudflare (free tier)                                  │
│      ├── DDoS protection                                     │
│      ├── Static asset caching                                │
│      └── Wildcard TLS                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Cost Projections (Monthly)

| Phase | Users | Compute | Database | Cache | Storage | Total |
|-------|-------|---------|----------|-------|---------|-------|
| MVP | 0-1K | $50 | $15 | $20 | $5 | ~$100 |
| Growth | 1K-10K | $200 | $50 | $50 | $20 | ~$320 |
| Scale | 10K-100K | $600 | $150 | $100 | $50 | ~$900 |
| Enterprise | 100K+ | $2000 | $400 | $200 | $100 | ~$2,700 |

---

## 12. ERROR CODES

```typescript
enum ErrorCode {
  // Auth
  AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED',
  AUTH_OTP_EXPIRED = 'AUTH_OTP_EXPIRED',
  AUTH_OTP_INVALID = 'AUTH_OTP_INVALID',
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  
  // Tenant
  TENANT_FORBIDDEN = 'TENANT_FORBIDDEN',
  TENANT_NOT_FOUND = 'TENANT_NOT_FOUND',
  
  // Validation
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  
  // Products
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  PRODUCT_ALREADY_ACTIVE = 'PRODUCT_ALREADY_ACTIVE',
  
  // Orders
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
  ORDER_INVALID_STATE = 'ORDER_INVALID_STATE',
  
  // AI
  AI_JOB_PENDING = 'AI_JOB_PENDING',
  AI_QUOTA_EXCEEDED = 'AI_QUOTA_EXCEEDED',
  AI_MODEL_UNAVAILABLE = 'AI_MODEL_UNAVAILABLE',
  
  // Rate limiting
  RATE_LIMITED = 'RATE_LIMITED',
  
  // General
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}
```

---

## 13. WHAT'S IN OTHER DOCS (Reference Only)

| Topic | Where It Lives | Notes |
|-------|----------------|-------|
| AI cost guard class | `Production_Architecture.md:464-496` | Use as reference |
| Sentry integration code | `Complete_Architecture_Guide.md:583-782` | Use as reference |
| WebSocket implementation | `Complete_Architecture_Guide.md:1510-1608` | Use as reference |
| Blue-green deployment | `Development_Workflow_BlueGreen_Deployment.md` | Use as reference |
| Domain strategy | `11_Domain_Strategy.md` | Use as reference |
| Email setup | `12_Email_Deployment.md` | Use as reference |
| Stitcher prompts | `16_Stitcher_Prompts.md` | Use for merchant app |
| Customer website pages | `17_Customer_Website.md` | Use for Next.js build |

---

**END OF AUTHORITATIVE ARCHITECTURE DOCUMENT**
