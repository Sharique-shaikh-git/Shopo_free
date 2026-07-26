# Document 19: Authorization & Tenant Safety
## Digital Dukaan - Complete Authorization Guide

**Date:** July 8, 2026  
**Status:** MANDATORY - Every developer must read this  
**Purpose:** Ensure no cross-tenant data leaks ever

---

## 1. AUTHENTICATION vs AUTHORIZATION

```
┌─────────────────────────────────────────────────────────────┐
│                TWO DIFFERENT THINGS                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  AUTHENTICATION (Who are you?)                               │
│  ├── Login with phone + OTP                                 │
│  ├── JWT token issued                                       │
│  ├── Valid for 15 minutes                                   │
│  └── Failure → 401 UNAUTHORIZED                             │
│                                                              │
│  AUTHORIZATION (What can you do?)                            │
│  ├── Check if merchant owns this store                      │
│  ├── Check if merchant owns this product                    │
│  ├── Check if merchant owns this order                      │
│  └── Failure → 403 FORBIDDEN (or 404 to hide existence)    │
│                                                              │
│  EXAMPLE:                                                    │
│  ├── Login = "I am Ali"                                     │
│  └── Authorization = "Can Ali edit Fatima's store?" → NO    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. TENANT IDENTITY FLOW

### Merchant (Logged In)

```
┌─────────────────────────────────────────────────────────────┐
│                MERCHANT IDENTITY                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  JWT TOKEN PAYLOAD:                                          │
│  {                                                          │
│    "merchantId": "uuid-123",                                │
│    "phone": "+923001234567",                                │
│    "role": "merchant",                                      │
│    "iat": 1688836800,                                       │
│    "exp": 1688837700                                        │
│  }                                                          │
│                                                              │
│  API CALL:                                                   │
│  GET /v1/stores/abc-123/products                           │
│  Authorization: Bearer eyJhbGciOiJIUzI1NiI...               │
│                                                              │
│  MIDDLEWARE EXTRACTS:                                        │
│  req.user.merchantId = "uuid-123"                           │
│                                                              │
│  QUERY:                                                      │
│  SELECT * FROM products WHERE store_id = 'abc-123'          │
│  AND store_id IN (                                          │
│    SELECT id FROM stores WHERE merchant_id = 'uuid-123'     │
│  );                                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Customer (Visiting Storefront)

```
┌─────────────────────────────────────────────────────────────┐
│                CUSTOMER IDENTITY                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  REQUEST:                                                    │
│  GET https://ali.digitaldukaan.pk                            │
│  Host: ali.digitaldukaan.pk                                 │
│                                                              │
│  TENANT RESOLUTION MIDDLEWARE:                               │
│  1. Parse subdomain: "ali"                                  │
│  2. SELECT id, merchant_id FROM stores WHERE slug = 'ali'  │
│  3. Found: storeId="abc-123", merchantId="uuid-456"        │
│  4. Attach to request context                               │
│                                                              │
│  REQUEST CONTEXT:                                            │
│  req.context = {                                             │
│    storeId: "abc-123",                                      │
│    merchantId: "uuid-456"                                   │
│  }                                                          │
│                                                              │
│  QUERIES:                                                    │
│  SELECT * FROM products WHERE store_id = 'abc-123'          │
│  AND status = 'active';                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. THREE INVARIANTS (NON-NEGOTIABLE)

### Invariant A: Tenant Identity Mapping

```
┌─────────────────────────────────────────────────────────────┐
│                INVARIANT A                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  RULE:                                                       │
│  ├── JWT → merchantId                                        │
│  ├── storeSlug → storeId → merchantId                        │
│  └── NEVER trust client-provided tenantId                    │
│                                                              │
│  CORRECT:                                                    │
│  ✅ Extract merchantId from JWT                              │
│  ✅ Derive storeId from storeSlug lookup                     │
│  ✅ Verify store belongs to merchant                         │
│                                                              │
│  WRONG:                                                      │
│  ❌ Trust req.body.merchantId                                │
│  ❌ Trust req.query.storeId                                  │
│  ❌ Trust req.params.merchantId                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Invariant B: Every Query Scoped

```
┌─────────────────────────────────────────────────────────────┐
│                INVARIANT B                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  RULE:                                                       │
│  ├── Every merchant endpoint: WHERE merchant_id = JWT.id    │
│  ├── Every store endpoint: WHERE store_id = derived_id      │
│  └── No exceptions                                          │
│                                                              │
│  CORRECT QUERIES:                                            │
│                                                              │
│  -- Products (merchant managing own products)                │
│  SELECT * FROM products                                      │
│  WHERE store_id IN (                                         │
│    SELECT id FROM stores WHERE merchant_id = $1             │
│  );                                                         │
│                                                              │
│  -- Orders (merchant viewing own orders)                     │
│  SELECT * FROM orders                                        │
│  WHERE store_id IN (                                         │
│    SELECT id FROM stores WHERE merchant_id = $1             │
│  );                                                         │
│                                                              │
│  -- Storefront (customer viewing products)                   │
│  SELECT * FROM products                                      │
│  WHERE store_id = $1                                         │
│  AND status = 'active';                                     │
│                                                              │
│  WRONG QUERIES:                                              │
│  ❌ SELECT * FROM products WHERE id = $1 (no tenant scope)  │
│  ❌ SELECT * FROM orders WHERE id = $1 (no tenant scope)    │
│  ❌ SELECT * FROM products (returns ALL products)            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Invariant C: No ID-Only Access

```
┌─────────────────────────────────────────────────────────────┐
│                INVARIANT C                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  RULE:                                                       │
│  ├── Never fetch by orderId alone                           │
│  ├── Never fetch by productId alone                         │
│  ├── Always include tenant constraints                      │
│  └── Prevent IDOR attacks                                   │
│                                                              │
│  CORRECT:                                                    │
│  -- Get order                                                │
│  SELECT * FROM orders                                        │
│  WHERE id = $1                                               │
│  AND store_id = $2                                           │
│  AND store_id IN (                                           │
│    SELECT id FROM stores WHERE merchant_id = $3             │
│  );                                                         │
│                                                              │
│  -- Get product                                              │
│  SELECT * FROM products                                      │
│  WHERE id = $1                                               │
│  AND store_id = $2;                                          │
│                                                              │
│  WRONG:                                                      │
│  ❌ SELECT * FROM orders WHERE id = $1 (IDOR vulnerability) │
│  ❌ SELECT * FROM products WHERE id = $1 (IDOR vulnerability)│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. MIDDLEWARE IMPLEMENTATION

### Authorization Middleware

```typescript
// ============================================
// TENANT RESOLUTION MIDDLEWARE
// ============================================
function resolveTenant() {
  return async (req: Request, res: Response, next: NextFunction) => {
    // For merchant endpoints (JWT required)
    if (req.path.startsWith('/v1/stores') || req.path.startsWith('/v1/products') || 
        req.path.startsWith('/v1/orders')) {
      
      const merchantId = req.user?.merchantId;
      if (!merchantId) {
        return res.status(401).json({ error: 'AUTH_UNAUTHORIZED' });
      }
      
      // Extract storeId from URL params if present
      if (req.params.storeId) {
        const store = await db.query(
          'SELECT id FROM stores WHERE id = $1 AND merchant_id = $2',
          [req.params.storeId, merchantId]
        );
        
        if (!store) {
          return res.status(403).json({ error: 'TENANT_FORBIDDEN' });
        }
        
        req.context = { storeId: store.id, merchantId };
      } else {
        req.context = { merchantId };
      }
    }
    
    // For storefront endpoints (Host header)
    if (req.headers.host) {
      const slug = req.headers.host.split('.')[0];
      
      const store = await db.query(
        'SELECT id, merchant_id FROM stores WHERE slug = $1',
        [slug]
      );
      
      if (!store) {
        return res.status(404).json({ error: 'NOT_FOUND' });
      }
      
      req.context = { storeId: store.id, merchantId: store.merchant_id };
    }
    
    next();
  };
}

// ============================================
// STORE OWNERSHIP MIDDLEWARE
// ============================================
function requireStoreOwnership() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { storeId } = req.context;
    const merchantId = req.user?.merchantId;
    
    if (!storeId || !merchantId) {
      return res.status(403).json({ error: 'TENANT_FORBIDDEN' });
    }
    
    const store = await db.query(
      'SELECT id FROM stores WHERE id = $1 AND merchant_id = $2',
      [storeId, merchantId]
    );
    
    if (!store) {
      return res.status(403).json({ error: 'TENANT_FORBIDDEN' });
    }
    
    next();
  };
}

// ============================================
// PRODUCT OWNERSHIP MIDDLEWARE
// ============================================
function requireProductOwnership() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const merchantId = req.user?.merchantId;
    
    const product = await db.query(
      `SELECT p.id FROM products p
       JOIN stores s ON p.store_id = s.id
       WHERE p.id = $1 AND s.merchant_id = $2`,
      [productId, merchantId]
    );
    
    if (!product) {
      return res.status(403).json({ error: 'TENANT_FORBIDDEN' });
    }
    
    req.context.productId = product.id;
    next();
  };
}

// ============================================
// ORDER OWNERSHIP MIDDLEWARE
// ============================================
function requireOrderOwnership() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const merchantId = req.user?.merchantId;
    
    const order = await db.query(
      `SELECT o.id, o.store_id FROM orders o
       JOIN stores s ON o.store_id = s.id
       WHERE o.id = $1 AND s.merchant_id = $2`,
      [orderId, merchantId]
    );
    
    if (!order) {
      return res.status(403).json({ error: 'TENANT_FORBIDDEN' });
    }
    
    req.context.orderId = order.id;
    req.context.storeId = order.store_id;
    next();
  };
}
```

### Usage in Routes

```typescript
// ============================================
// MERCHANT ROUTES (JWT required)
// ============================================
router.get('/v1/stores/:storeId/products', 
  authenticate(),           // Extract JWT → merchantId
  resolveTenant(),          // Verify store belongs to merchant
  listProducts
);

router.patch('/v1/products/:productId', 
  authenticate(),
  requireProductOwnership(), // Verify product belongs to merchant
  updateProduct
);

router.patch('/v1/orders/:orderId/status', 
  authenticate(),
  requireOrderOwnership(),   // Verify order belongs to merchant
  updateOrderStatus
);

// ============================================
// STOREFRONT ROUTES (storeSlug required)
// ============================================
router.get('/', 
  resolveTenant(),          // Parse Host header → storeId
  listActiveProducts
);

router.post('/orders', 
  resolveTenant(),
  createCODOrder
);
```

---

## 5. ROW-LEVEL SECURITY (RLS)

### Enable RLS

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
-- STORES
-- ============================================
-- Merchant can only see own stores
CREATE POLICY stores_merchant_isolation ON stores
  FOR ALL
  USING (merchant_id = current_setting('app.merchant_id')::UUID);

-- ============================================
-- PRODUCTS
-- ============================================
-- Merchant: full access to own products
CREATE POLICY products_merchant_isolation ON products
  FOR ALL
  USING (store_id IN (
    SELECT id FROM stores WHERE merchant_id = current_setting('app.merchant_id')::UUID
  ));

-- Customer: read only active products for their store
CREATE POLICY products_customer_read ON products
  FOR SELECT
  USING (
    store_id = current_setting('app.store_id')::UUID
    AND status = 'active'
  );

-- ============================================
-- ORDERS
-- ============================================
-- Merchant: access orders from their stores
CREATE POLICY orders_merchant_isolation ON orders
  FOR ALL
  USING (store_id IN (
    SELECT id FROM stores WHERE merchant_id = current_setting('app.merchant_id')::UUID
  ));

-- ============================================
-- ORDER ITEMS
-- ============================================
CREATE POLICY order_items_merchant_isolation ON order_items
  FOR ALL
  USING (order_id IN (
    SELECT o.id FROM orders o
    JOIN stores s ON o.store_id = s.id
    WHERE s.merchant_id = current_setting('app.merchant_id')::UUID
  ));

-- ============================================
-- AI JOBS
-- ============================================
CREATE POLICY ai_jobs_merchant_isolation ON ai_jobs
  FOR ALL
  USING (merchant_id = current_setting('app.merchant_id')::UUID);

-- ============================================
-- AUDIT LOGS
-- ============================================
CREATE POLICY audit_logs_merchant_isolation ON audit_logs
  FOR ALL
  USING (merchant_id = current_setting('app.merchant_id')::UUID);
```

### Set Tenant Context

```typescript
// Before any query, set the tenant context
async function setTenantContext(merchantId: string, storeId?: string) {
  if (merchantId) {
    await db.query(`SET LOCAL app.merchant_id = '${merchantId}'`);
  }
  if (storeId) {
    await db.query(`SET LOCAL app.store_id = '${storeId}'`);
  }
}

// Usage in middleware
app.use(async (req, res, next) => {
  await setTenantContext(req.user?.merchantId, req.context?.storeId);
  next();
});
```

---

## 6. 5-QUESTION CHECKLIST (Before Every Feature)

```
┌─────────────────────────────────────────────────────────────┐
│                BEFORE WRITING ANY FEATURE                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Question 1: WHO CAN ACCESS THIS FEATURE?                   │
│  ├── Merchant only?                                          │
│  ├── Customer only?                                          │
│  └── Both?                                                   │
│                                                              │
│  Question 2: WHO CANNOT ACCESS THIS FEATURE?                 │
│  ├── Other merchants?                                        │
│  ├── Other customers?                                        │
│  └── Admin?                                                  │
│                                                              │
│  Question 3: WHAT DATA CAN THEY SEE?                         │
│  ├── Only their own data?                                    │
│  ├── Public data only?                                       │
│  └── Shared data?                                            │
│                                                              │
│  Question 4: WHAT DATA CAN THEY MODIFY?                      │
│  ├── Only their own data?                                    │
│  ├── No modification?                                        │
│  └── Specific fields only?                                   │
│                                                              │
│  Question 5: IS THERE AN OWNERSHIP CHECK?                    │
│  ├── Query includes merchant_id/store_id?                    │
│  ├── Middleware verifies ownership?                          │
│  └── RLS policy enforced?                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. COMMON PITFALLS

### Pitfall 1: JWT Works But Tenant Scope Missing

```typescript
// ❌ WRONG: No tenant scope
const products = await db.query(
  'SELECT * FROM products WHERE id = $1',
  [productId]
);

// ✅ CORRECT: With tenant scope
const products = await db.query(
  `SELECT p.* FROM products p
   JOIN stores s ON p.store_id = s.id
   WHERE p.id = $1 AND s.merchant_id = $2`,
  [productId, merchantId]
);
```

### Pitfall 2: Worker Writes to Wrong Tenant

```typescript
// ❌ WRONG: Worker doesn't verify tenant
async function processAIJob(job) {
  const product = await db.query(
    'SELECT * FROM products WHERE id = $1',
    [job.productId]
  );
  // This could be another merchant's product!
}

// ✅ CORRECT: Worker verifies tenant
async function processAIJob(job) {
  const product = await db.query(
    `SELECT p.* FROM products p
     JOIN stores s ON p.store_id = s.id
     WHERE p.id = $1 AND s.merchant_id = $2`,
    [job.productId, job.merchantId]
  );
  // Now we're sure it's the right merchant's product
}
```

### Pitfall 3: Cache Key Missing storeId

```typescript
// ❌ WRONG: Cache key without storeId
const cacheKey = `product:${productId}`;
// This could serve another merchant's product!

// ✅ CORRECT: Cache key with storeId
const cacheKey = `store:${storeId}:product:${productId}`;
// Now it's tenant-scoped
```

### Pitfall 4: Public Endpoint Allows Admin Data

```typescript
// ❌ WRONG: Storefront endpoint returns merchant data
router.get('/products', async (req, res) => {
  const products = await db.query('SELECT * FROM products');
  // Returns ALL products from ALL merchants!
});

// ✅ CORRECT: Storefront endpoint scoped to store
router.get('/products', async (req, res) => {
  const { storeId } = req.context;
  const products = await db.query(
    'SELECT * FROM products WHERE store_id = $1 AND status = $2',
    [storeId, 'active']
  );
  // Returns only active products for this store
});
```

### Pitfall 5: URL Manipulation (IDOR)

```typescript
// ❌ WRONG: Trusting URL parameter
router.get('/v1/orders/:orderId', async (req, res) => {
  const order = await db.query(
    'SELECT * FROM orders WHERE id = $1',
    [req.params.orderId]
  );
  // Attacker can access any order by changing the ID!
});

// ✅ CORRECT: Verify ownership
router.get('/v1/orders/:orderId', 
  requireOrderOwnership(),
  async (req, res) => {
    const order = await db.query(
      'SELECT * FROM orders WHERE id = $1 AND store_id = $2',
      [req.params.orderId, req.context.storeId]
    );
    // Now it's verified
  }
);
```

---

## 8. ERROR RESPONSES

### Never Leak Tenant Info

```typescript
// ❌ WRONG: Reveals tenant info
res.status(403).json({ 
  error: 'Access denied to store abc-123' 
});

// ❌ WRONG: Reveals resource existence
res.status(403).json({ 
  error: 'Product xyz-789 does not belong to you' 
});

// ✅ CORRECT: Generic error
res.status(403).json({ 
  error: 'TENANT_FORBIDDEN',
  message: 'You do not have access to this resource'
});
```

### Error Code Reference

| Code | HTTP Status | Message |
|------|-------------|---------|
| `AUTH_UNAUTHORIZED` | 401 | "Authentication required" |
| `AUTH_OTP_EXPIRED` | 401 | "OTP has expired" |
| `AUTH_OTP_INVALID` | 401 | "Invalid OTP" |
| `TENANT_FORBIDDEN` | 403 | "You do not have access" |
| `TENANT_NOT_FOUND` | 404 | "Resource not found" |
| `VALIDATION_FAILED` | 400 | "Invalid input" |
| `RATE_LIMITED` | 429 | "Too many requests" |

---

## 9. SECURITY TEST CASES

### Test Case 1: IDOR Attack

```
TEST: Attacker tries to access another merchant's order
STEPS:
1. Login as Merchant A (get JWT)
2. Call GET /v1/orders/{merchantB_orderId}
3. Include Merchant A's JWT in header
EXPECTED: 403 FORBIDDEN or 404 NOT FOUND
```

### Test Case 2: Store Slug Manipulation

```
TEST: Attacker tries to access another store's data
STEPS:
1. Visit ali.digitaldukaan.pk (valid store)
2. Change Host header to fatima.digitaldukaan.pk
3. Try to access products
EXPECTED: Only Fatima's products returned (tenant isolation)
```

### Test Case 3: Worker Job Tenant Violation

```
TEST: AI job tries to process another merchant's product
STEPS:
1. Create AI job for Merchant A's product
2. Modify job payload to reference Merchant B's productId
3. Worker processes job
EXPECTED: Worker detects mismatch, sets job state to 'failed'
```

### Test Case 4: Cache Cross-Tenant Leak

```
TEST: Cache serves wrong merchant's data
STEPS:
1. Merchant A caches product:abc-123
2. Merchant B requests product:abc-123
3. Check if Merchant B receives Merchant A's data
EXPECTED: Cache miss (different storeId in key)
```

### Test Case 5: RLS Bypass Attempt

```
TEST: Direct database access bypasses RLS
STEPS:
1. Connect to database directly
2. Try: SELECT * FROM products WHERE id = 'other-merchant-product'
3. Check if query returns data
EXPECTED: Empty result (RLS blocks access)
```

---

## 10. AUTHORIZATION MIDDLEWARE CHECKLIST

```
Before deploying any endpoint, verify:

- [ ] Authentication middleware applied (JWT verification)
- [ ] Tenant resolution middleware applied (storeId extraction)
- [ ] Ownership check middleware applied (merchant_id verification)
- [ ] RLS enabled on all affected tables
- [ ] Cache keys include storeId
- [ ] Error responses are generic (no tenant info leaked)
- [ ] Test case: IDOR attack with different merchant's resource
- [ ] Test case: Store slug manipulation
- [ ] Test case: URL parameter tampering
```

---

**END OF AUTHORIZATION & TENANT SAFETY DOCUMENT**
