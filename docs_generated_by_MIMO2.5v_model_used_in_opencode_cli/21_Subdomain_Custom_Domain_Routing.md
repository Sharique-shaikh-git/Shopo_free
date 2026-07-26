# Document 21: Subdomain & Custom Domain Routing
## Digital Dukaan - Storefront URL Resolution

**Date:** July 8, 2026  
**Status:** MANDATORY - How customers reach merchant stores  
**Purpose:** DNS setup, wildcard TLS, tenant resolution middleware

---

## 1. HOW IT WORKS

```
┌─────────────────────────────────────────────────────────────┐
│                STOREFRONT URL FLOW                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  OPTION A: SUBDOMAIN (default, free)                        │
│  ├── ali.digitaldukaan.pk                                   │
│  ├── fatima.digitaldukaan.pk                                │
│  └── ahmed.digitaldukaan.pk                                 │
│                                                              │
│  OPTION B: CUSTOM DOMAIN (paid upgrade)                      │
│  ├── ali-clothing.pk                                        │
│  ├── fatimastore.com                                        │
│  └── ahmed-bazaar.pk                                        │
│                                                              │
│  HOW CUSTOMER ARRIVES:                                       │
│  1. Merchant shares link on WhatsApp/Facebook/Instagram      │
│  2. Customer clicks link                                     │
│  3. Opens in Chrome/Safari (browser)                         │
│  4. Sees storefront (no app download)                        │
│  5. Browses → Cart → Checkout (COD)                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. DNS CONFIGURATION

### Wildcard Subdomain Setup

```
┌─────────────────────────────────────────────────────────────┐
│                DNS RECORDS                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  CLOUDFLARE DNS:                                             │
│  ├── Type: CNAME                                             │
│  ├── Name: * (wildcard)                                     │
│  ├── Target: our-app.cloudrun.app                           │
│  ├── Proxy: ON (orange cloud)                               │
│  └── TTL: Auto                                              │
│                                                              │
│  THIS MEANS:                                                 │
│  ├── ali.digitaldukaan.pk → CNAME → our-app.cloudrun.app   │
│  ├── fatima.digitaldukaan.pk → CNAME → our-app.cloudrun.app│
│  ├── anything.digitaldukaan.pk → CNAME → our-app.cloudrun.app│
│  └── All route to SAME Cloud Run service                     │
│                                                              │
│  ADDITIONAL RECORDS:                                         │
│  ├── Type: A                                                 │
│  ├── Name: @                                                │
│  ├── Content: GCP Load Balancer IP                          │
│  └── TTL: Auto                                              │
│                                                              │
│  ├── Type: MX                                               │
│  ├── Name: mail                                             │
│  ├── Mail server: route to email service                     │
│  └── Priority: 10                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Wildcard TLS Certificate

```
┌─────────────────────────────────────────────────────────────┐
│                TLS CERTIFICATE                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  OPTION: Let's Encrypt Wildcard                             │
│  ├── Cert: *.digitaldukaan.pk                               │
│  ├── Covers: all subdomains automatically                   │
│  ├── Auto-renewal: every 60 days                            │
│  └── Cost: FREE                                              │
│                                                              │
│  SETUP (certbot with DNS-01 challenge):                      │
│                                                              │
│  1. Install certbot:                                        │
│     $ sudo apt install certbot                              │
│                                                              │
│  2. Get wildcard cert:                                      │
│     $ certbot certonly --manual --preferred-challenges dns \│
│       --dns-cloudflare \                                    │
│       --dns-cloudflare-credentials ~/.secrets/cloudflare.ini │
│       -d "*.digitaldukaan.pk" \                             │
│       -d "digitaldukaan.pk"                                 │
│                                                              │
│  3. Store cert in GCP Secret Manager:                       │
│     $ gcloud secrets create wildcard-tls \                  │
│       --data-file=/etc/letsencrypt/live/digitaldukaan.pk/   │
│                                                              │
│  4. Load balancer reads cert:                               │
│     - Cloudflare handles TLS termination                    │
│     - Or GCP Load Balancer with cert from Secret Manager    │
│                                                              │
│  5. Auto-renewal cron job:                                  │
│     0 0 1 * * certbot renew && gcloud secrets update ...    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. TENANT RESOLUTION MIDDLEWARE

### Complete Implementation

```typescript
// ============================================
// TENANT RESOLUTION MIDDLEWARE
// ============================================
import { Request, Response, NextFunction } from 'express';

interface TenantContext {
  storeId: string;
  merchantId: string;
  storeSlug: string;
}

declare global {
  namespace Express {
    interface Request {
      context: TenantContext;
    }
  }
}

async function resolveTenant(
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  try {
    const host = req.headers.host || '';
    
    // Skip tenant resolution for API endpoints
    if (host === 'api.digitaldukaan.pk' || req.path.startsWith('/v1/')) {
      return next();
    }
    
    // Extract subdomain
    const slug = host.split('.')[0];
    
    if (!slug || slug === 'www' || slug === 'api' || slug === 'mail') {
      // These are not store subdomains
      return res.status(404).json({ error: 'NOT_FOUND' });
    }
    
    // Check subdomain first (most common case)
    let store = await db.query(
      `SELECT id, merchant_id, name, slug, status 
       FROM stores WHERE slug = $1`,
      [slug]
    );
    
    // If not found, check custom domains
    if (!store) {
      store = await db.query(
        `SELECT s.id, s.merchant_id, s.name, s.slug, s.status
         FROM stores s
         JOIN custom_domains cd ON s.id = cd.store_id
         WHERE cd.domain = $1 AND cd.verified = true`,
        [host]
      );
    }
    
    if (!store) {
      return res.status(404).json({ error: 'NOT_FOUND' });
    }
    
    // Check store is active
    if (store.status !== 'active') {
      return res.status(404).json({ error: 'NOT_FOUND' });
    }
    
    // Attach tenant context to request
    req.context = {
      storeId: store.id,
      merchantId: store.merchant_id,
      storeSlug: store.slug
    };
    
    // Set RLS context (if using RLS)
    await db.query(`SET LOCAL app.store_id = '${store.id}'`);
    await db.query(`SET LOCAL app.merchant_id = '${store.merchant_id}'`);
    
    next();
  } catch (error) {
    console.error('Tenant resolution error:', error);
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
}

// ============================================
// MERCHANT ROUTES (JWT required)
// ============================================
function resolveMerchantTenant() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const merchantId = req.user?.merchantId;
    
    if (!merchantId) {
      return res.status(401).json({ error: 'AUTH_UNAUTHORIZED' });
    }
    
    // Extract storeId from URL
    const storeId = req.params.storeId;
    
    if (storeId) {
      // Verify store belongs to merchant
      const store = await db.query(
        'SELECT id FROM stores WHERE id = $1 AND merchant_id = $2',
        [storeId, merchantId]
      );
      
      if (!store) {
        return res.status(403).json({ error: 'TENANT_FORBIDDEN' });
      }
      
      req.context = { storeId: store.id, merchantId, storeSlug: '' };
    } else {
      req.context = { storeId: '', merchantId, storeSlug: '' };
    }
    
    // Set RLS context
    await db.query(`SET LOCAL app.merchant_id = '${merchantId}'`);
    if (storeId) {
      await db.query(`SET LOCAL app.store_id = '${storeId}'`);
    }
    
    next();
  };
}

// ============================================
// USAGE IN ROUTES
// ============================================
const router = express.Router();

// Storefront routes (customer-facing)
router.get('/', resolveTenant, storefrontController.home);
router.get('/category/:category', resolveTenant, storefrontController.category);
router.get('/product/:slug', resolveTenant, storefrontController.product);
router.post('/orders', resolveTenant, storefrontController.checkout);

// Merchant routes (JWT required)
router.get('/v1/stores', authenticate(), resolveMerchantTenant(), merchantController.listStores);
router.get('/v1/stores/:storeId/products', authenticate(), resolveMerchantTenant(), merchantController.listProducts);
router.post('/v1/stores/:storeId/products', authenticate(), resolveMerchantTenant(), merchantController.createProduct);
```

---

## 4. CUSTOM DOMAIN SETUP

### Database Schema

```sql
-- Custom domains table
CREATE TABLE custom_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  domain VARCHAR(200) UNIQUE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(100) DEFAULT gen_random_uuid()::text,
  ssl_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP
);

CREATE INDEX idx_custom_domains_domain ON custom_domains(domain);
CREATE INDEX idx_custom_domains_store_id ON custom_domains(store_id);
```

### Custom Domain Flow

```
┌─────────────────────────────────────────────────────────────┐
│                CUSTOM DOMAIN FLOW                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  STEP 1: Merchant adds custom domain in app                 │
│  └── POST /v1/stores/{storeId}/domains                      │
│      Body: { domain: "ali-clothing.pk" }                    │
│                                                              │
│  STEP 2: System creates verification token                  │
│  └── INSERT INTO custom_domains (...)                        │
│      verification_token: "abc-123-def-456"                  │
│                                                              │
│  STEP 3: System returns DNS instructions                     │
│  └── Response: {                                             │
│        verification_token: "abc-123-def-456",               │
│        instructions: {                                        │
│          CNAME: { name: "@", value: "our-app.cloudrun.app" }│
│          TXT: { name: "_verify", value: "abc-123-def-456" } │
│        }                                                     │
│      }                                                       │
│                                                              │
│  STEP 4: Merchant adds DNS records                          │
│  ├── CNAME: ali-clothing.pk → our-app.cloudrun.app         │
│  └── TXT: _verify.ali-clothing.pk → abc-123-def-456        │
│                                                              │
│  STEP 5: Merchant clicks "Verify" in app                    │
│  └── POST /v1/stores/{storeId}/domains/{domainId}/verify    │
│                                                              │
│  STEP 6: System verifies DNS records                        │
│  ├── Check CNAME resolves correctly                         │
│  ├── Check TXT record contains verification token           │
│  └── If both pass: verified = true                          │
│                                                              │
│  STEP 7: System provisions SSL cert                         │
│  ├── Request Let's Encrypt cert for custom domain           │
│  ├── Store cert in Secret Manager                           │
│  └── ssl_status = 'active'                                  │
│                                                              │
│  STEP 8: Store now accessible at custom domain              │
│  └── ali-clothing.pk → same store as ali.digitaldukaan.pk  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Custom Domain Middleware

```typescript
// ============================================
// CUSTOM DOMAIN VERIFICATION
// ============================================
async function verifyCustomDomain(domain: string): Promise<boolean> {
  // 1. Check DNS records
  const cname = await dns.resolveCname(domain);
  if (!cname.includes('our-app.cloudrun.app')) {
    return false;
  }
  
  // 2. Check TXT record
  const txt = await dns.resolveTxt(`_verify.${domain}`);
  const token = await db.query(
    'SELECT verification_token FROM custom_domains WHERE domain = $1',
    [domain]
  );
  
  if (!txt.includes(token.verification_token)) {
    return false;
  }
  
  // 3. Mark as verified
  await db.query(
    `UPDATE custom_domains 
     SET verified = true, verified_at = NOW(), ssl_status = 'pending'
     WHERE domain = $1`,
    [domain]
  );
  
  // 4. Provision SSL cert
  await provisionSSLCert(domain);
  
  return true;
}

// ============================================
// SSL CERT PROVISIONING
// ============================================
async function provisionSSLCert(domain: string): Promise<void> {
  // Use certbot with DNS-01 challenge
  const result = await exec(`certbot certonly --manual --preferred-challenges dns \
    --dns-cloudflare \
    --dns-cloudflare-credentials ~/.secrets/cloudflare.ini \
    -d "${domain}" \
    --non-interactive \
    --agree-tos \
    --email admin@digitaldukaan.pk`);
  
  if (result.exitCode === 0) {
    // Store cert in Secret Manager
    await exec(`gcloud secrets create "ssl-${domain}" \
      --data-file=/etc/letsencrypt/live/${domain}/fullchain.pem`);
    
    await exec(`gcloud secrets create "ssl-key-${domain}" \
      --data-file=/etc/letsencrypt/live/${domain}/privkey.pem`);
    
    await db.query(
      'UPDATE custom_domains SET ssl_status = $1 WHERE domain = $2',
      ['active', domain]
    );
  }
}
```

---

## 5. SLUG GENERATION & VALIDATION

### Slug Rules

```typescript
// Slug validation regex
const SLUG_REGEX = /^[a-z0-9-]{3,30}$/;

// Slug generation from shop name
function generateSlug(name: string): string {
  // 1. Convert to lowercase
  let slug = name.toLowerCase();
  
  // 2. Transliterate Urdu/Arabic to ASCII
  slug = transliterateToASCII(slug);
  
  // 3. Replace spaces with hyphens
  slug = slug.replace(/\s+/g, '-');
  
  // 4. Remove special characters
  slug = slug.replace(/[^a-z0-9-]/g, '');
  
  // 5. Remove consecutive hyphens
  slug = slug.replace(/--+/g, '-');
  
  // 6. Remove leading/trailing hyphens
  slug = slug.replace(/^-|-$/g, '');
  
  // 7. Truncate to 30 chars
  slug = slug.substring(0, 30);
  
  // 8. Ensure minimum length
  if (slug.length < 3) {
    slug = slug + '-shop';
  }
  
  return slug;
}

// Slug uniqueness check
async function isSlugAvailable(slug: string): Promise<boolean> {
  const existing = await db.query(
    'SELECT id FROM stores WHERE slug = $1',
    [slug]
  );
  
  if (existing) {
    return false;
  }
  
  // Also check custom domains
  const customDomain = await db.query(
    'SELECT id FROM custom_domains WHERE domain = $1',
    [`${slug}.digitaldukaan.pk`]
  );
  
  return !customDomain;
}

// Slug reservation on store creation
async function reserveSlug(merchantId: string, name: string): Promise<string> {
  let slug = generateSlug(name);
  
  // Check availability
  let isAvailable = await isSlugAvailable(slug);
  let attempts = 0;
  
  while (!isAvailable && attempts < 10) {
    // Append random number
    slug = `${generateSlug(name)}-${Math.floor(Math.random() * 1000)}`;
    isAvailable = await isSlugAvailable(slug);
    attempts++;
  }
  
  if (!isAvailable) {
    throw new Error('Could not generate unique slug');
  }
  
  // Reserve slug (create store with slug)
  await db.query(
    'UPDATE stores SET slug = $1 WHERE id = $2',
    [slug, merchantId]
  );
  
  return slug;
}
```

---

## 6. CACHE INVALIDATION FOR DOMAINS

### When Store Slug Changes

```typescript
async function invalidateDomainCache(storeId: string, oldSlug: string, newSlug: string): Promise<void> {
  // 1. Purge old subdomain cache
  await cloudflare.purgeCache(`https://${oldSlug}.digitaldukaan.pk`);
  
  // 2. Purge new subdomain cache
  await cloudflare.purgeCache(`https://${newSlug}.digitaldukaan.pk`);
  
  // 3. Clear Redis cache
  await redis.del(`store:${storeId}:home`);
  await redis.del(`store:${storeId}:products`);
  await redis.del(`store:${storeId}:info`);
}
```

---

## 7. PRODUCTION CHECKLIST

```
Before deploying domain routing:

- [ ] Wildcard DNS record created (*.digitaldukaan.pk)
- [ ] Wildcard TLS cert provisioned (*.digitaldukaan.pk)
- [ ] Tenant resolution middleware tested
- [ ] Custom domain flow implemented
- [ ] DNS verification working
- [ ] SSL provisioning working
- [ ] Slug validation regex tested
- [ ] Slug uniqueness check working
- [ ] Cache invalidation working
- [ ] IDOR test passed (different storeSlug → different store)
- [ ] 404 returned for non-existent stores
- [ ] Custom domains resolve correctly
```

---

**END OF SUBDOMAIN & CUSTOM DOMAIN ROUTING DOCUMENT**
