# Document 20: AI Cost Control
## Digital Dukaan - Queue, Caching, Quotas, Rate Limiting

**Date:** July 8, 2026  
**Status:** MANDATORY - AI costs can bankrupt you if not controlled  
**Purpose:** Every AI call must be cached, queued, and rate-limited

---

## 1. THE PROBLEM

```
┌─────────────────────────────────────────────────────────────┐
│                WHY AI COST CONTROL MATTERS                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  WITHOUT CONTROL:                                            │
│  ├── 1,000 merchants × 100 AI calls/day = 100,000 calls/day │
│  ├── At $0.02/call = $2,000/day                             │
│  ├── Monthly = $60,000                                      │
│  └── YOU GO BROKE IN MONTH 1                                │
│                                                              │
│  WITH CONTROL:                                               │
│  ├── Cache: 90% of calls are duplicates                     │
│  ├── Queue: Only 10,000 unique calls/day                    │
│  ├── Quota: 5 AI calls/day per free merchant                │
│  ├── Cost: $200/day = $6,000/month                          │
│  └── PROFITABLE from day 1                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. AI JOB PIPELINE

### Flow

```
┌─────────────────────────────────────────────────────────────┐
│                AI JOB LIFECYCLE                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  STEP 1: Merchant uploads photo                              │
│  └── POST /v1/stores/{storeId}/products                     │
│                                                              │
│  STEP 2: API checks dedupe key                               │
│  ├── Compute: ai:{storeId}:{imageHash}:{locale}             │
│  ├── Check Redis cache                                       │
│  ├── HIT → return cached response (FREE, instant)           │
│  └── MISS → continue                                        │
│                                                              │
│  STEP 3: API checks merchant quota                           │
│  ├── Get today's usage: GET quota:{merchantId}:ai:{date}    │
│  ├── Check against tier limit                                │
│  ├── OVER QUOTA → reject with UPGRADE_PLAN message          │
│  └── UNDER QUOTA → continue                                 │
│                                                              │
│  STEP 4: API creates ai_job record                           │
│  ├── INSERT INTO ai_jobs (state='queued')                   │
│  └── Return job_id to merchant immediately                  │
│                                                              │
│  STEP 5: API enqueues to BullMQ                              │
│  └── Queue name: ai-jobs                                    │
│                                                              │
│  STEP 6: Worker picks up job                                 │
│  ├── SET state='running'                                     │
│  ├── SELECT model based on complexity                        │
│  ├── CALL AI API (OpenAI/Claude)                            │
│  ├── Store result in ai_job.output                          │
│  ├── SET state='completed'                                  │
│  ├── CACHE response in Redis                                │
│  └── TRACK usage in ai_usage table                          │
│                                                              │
│  STEP 7: App polls job status                                │
│  └── GET /v1/ai-jobs/{jobId} → shows result to merchant    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Job States

```
queued → running → completed
                  → failed
                  → rejected (over quota, invalid input)
```

---

## 3. QUEUE TECHNOLOGY: BULLMQ + REDIS

### Why BullMQ?

| Feature | Benefit |
|---------|---------|
| Redis-backed | We already use Redis |
| Delayed jobs | Retry with backoff |
| Rate limiting | Built-in per-queue limits |
| Concurrency control | Limit parallel AI calls |
| Dead letter queue | Handle failed jobs |
| Job progress | Track AI job progress |
| TypeScript | Matches our stack |

### Queue Configuration

```typescript
// ============================================
// BULLMQ QUEUE SETUP
// ============================================
import { Queue, Worker } from 'bullmq';

const connection = { host: 'localhost', port: 6379 };

// AI Jobs Queue
const aiQueue = new Queue('ai-jobs', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 100,    // Keep last 100 completed jobs
    removeOnFail: 500,        // Keep last 500 failed jobs
    attempts: 3,              // Retry 3 times
    backoff: {
      type: 'exponential',    // Exponential backoff
      delay: 2000,            // Start with 2 second delay
    }
  }
});

// AI Worker
const aiWorker = new Worker('ai-jobs', async (job) => {
  // Process AI job
  const { storeId, productId, imageUrl, merchantId, locale } = job.data;
  
  // Verify tenant ownership (CRITICAL!)
  const product = await db.query(
    `SELECT p.id FROM products p
     JOIN stores s ON p.store_id = s.id
     WHERE p.id = $1 AND s.merchant_id = $2`,
    [productId, merchantId]
  );
  
  if (!product) {
    throw new Error('TENANT_VIOLATION: Product does not belong to merchant');
  }
  
  // Call AI API
  const result = await callAI(imageUrl, locale);
  
  // Store result
  await db.query(
    'UPDATE ai_jobs SET output = $1, state = $2 WHERE id = $3',
    [JSON.stringify(result), 'completed', job.id]
  );
  
  // Cache result
  const dedupeKey = `ai:${storeId}:${job.data.imageHash}:${locale}`;
  await redis.setex(dedupeKey, 604800, JSON.stringify(result)); // 7 days
  
  // Track usage
  await trackAIUsage(merchantId, storeId, 'product_enrichment', result.model, result.tokens);
  
  return result;
}, {
  connection,
  concurrency: 5,  // Process 5 AI jobs in parallel
  limiter: {
    max: 50,       // Max 50 jobs
    duration: 60000 // per minute
  }
});
```

### Dead Letter Queue (Failed Jobs)

```typescript
const dlqQueue = new Queue('ai-jobs-dlq', { connection });

aiWorker.on('failed', async (job, err) => {
  if (job.attemptsMade >= job.opts.attempts) {
    // Move to dead letter queue
    await dlqQueue.add('failed-job', {
      ...job.data,
      error: err.message,
      failedAt: new Date().toISOString()
    });
    
    // Update job state
    await db.query(
      'UPDATE ai_jobs SET state = $1, error_message = $2 WHERE id = $3',
      ['failed', err.message, job.id]
    );
  }
});
```

---

## 4. DEDUPLICATION

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                DEDUPLICATION                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SCENARIO:                                                   │
│  Merchant uploads same product photo twice                   │
│  ├── First upload: AI generates title, description          │
│  └── Second upload: Should return SAME result (FREE)        │
│                                                              │
│  HOW:                                                        │
│  1. Download image                                           │
│  2. Compute SHA-256 hash                                     │
│  3. Create cache key: ai:{storeId}:{hash}:{locale}          │
│  4. Check Redis                                              │
│  5. HIT → return cached (FREE)                               │
│  6. MISS → process, cache, return                            │
│                                                              │
│  CACHE KEY FORMAT:                                           │
│  ai:{storeId}:{imageHash}:{locale}                          │
│                                                              │
│  EXAMPLE:                                                    │
│  ai:abc-123:e3b0c44298fc1c149afbf4c8996fb924...:en          │
│                                                              │
│  TTL: 7 days (product descriptions)                          │
│        90 days (image recognition)                           │
│        24 hours (price suggestions)                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Implementation

```typescript
// ============================================
// DEDUPE KEY COMPUTATION
// ============================================
import crypto from 'crypto';

async function computeDedupeKey(
  imageUrl: string, 
  storeId: string, 
  locale: string
): Promise<string> {
  // Download image
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  
  // Compute hash
  const hash = crypto
    .createHash('sha256')
    .update(Buffer.from(buffer))
    .digest('hex');
  
  // Include storeId for tenant isolation
  return `ai:${storeId}:${hash}:${locale}`;
}

// ============================================
// CHECK CACHE BEFORE AI CALL
// ============================================
async function checkAICache(dedupeKey: string): Promise<any | null> {
  const cached = await redis.get(dedupeKey);
  if (cached) {
    // Track that this was a cache hit (FREE!)
    await trackCacheHit(dedupeKey);
    return JSON.parse(cached);
  }
  return null;
}

// ============================================
// CACHE AI RESPONSE
// ============================================
async function cacheAIResponse(dedupeKey: string, result: any, ttl: number): Promise<void> {
  await redis.setex(dedupeKey, ttl, JSON.stringify(result));
}
```

---

## 5. PER-MERCHANT QUOTAS

### Quota Structure

```typescript
const QUOTA_LIMITS = {
  free: {
    dailyAiJobs: 5,
    monthlyAiJobs: 50,
    monthlyCostUsd: 5.00,
    maxTokensPerRequest: 500,
    allowedModels: ['gpt-4o-mini', 'gemini-flash'],
    maxProducts: 50,
    maxImagesPerProduct: 5
  },
  starter: {
    dailyAiJobs: 50,
    monthlyAiJobs: 500,
    monthlyCostUsd: 25.00,
    maxTokensPerRequest: 1000,
    allowedModels: ['gpt-4o-mini', 'gemini-flash', 'gpt-4o'],
    maxProducts: 500,
    maxImagesPerProduct: 10
  },
  business: {
    dailyAiJobs: 500,
    monthlyAiJobs: 5000,
    monthlyCostUsd: 100.00,
    maxTokensPerRequest: 2000,
    allowedModels: ['gpt-4o-mini', 'gemini-flash', 'gpt-4o', 'claude-sonnet'],
    maxProducts: -1,  // unlimited
    maxImagesPerProduct: 20
  }
};
```

### Quota Enforcement

```typescript
// ============================================
// CHECK QUOTA
// ============================================
async function checkQuota(
  merchantId: string, 
  plan: string, 
  feature: string
): Promise<{ allowed: boolean; remaining: number }> {
  const limits = QUOTA_LIMITS[plan];
  const today = new Date().toISOString().split('T')[0];
  const month = today.substring(0, 7);
  
  // Check daily limit
  const dailyKey = `quota:${merchantId}:${feature}:daily:${today}`;
  const dailyCount = await redis.get(dailyKey);
  if (dailyCount && parseInt(dailyCount) >= limits.dailyAiJobs) {
    return { allowed: false, remaining: 0 };
  }
  
  // Check monthly limit
  const monthlyKey = `quota:${merchantId}:${feature}:monthly:${month}`;
  const monthlyCount = await redis.get(monthlyKey);
  if (monthlyCount && parseInt(monthlyCount) >= limits.monthlyAiJobs) {
    return { allowed: false, remaining: 0 };
  }
  
  return { 
    allowed: true, 
    remaining: limits.dailyAiJobs - (dailyCount ? parseInt(dailyCount) : 0)
  };
}

// ============================================
// INCREMENT QUOTA
// ============================================
async function incrementQuota(
  merchantId: string, 
  feature: string
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const month = today.substring(0, 7);
  
  const dailyKey = `quota:${merchantId}:${feature}:daily:${today}`;
  const monthlyKey = `quota:${merchantId}:${feature}:monthly:${month}`;
  
  const pipe = redis.pipeline();
  pipe.incr(dailyKey);
  pipe.expire(dailyKey, 86400);  // 24 hours
  pipe.incr(monthlyKey);
  pipe.expire(monthlyKey, 2592000);  // 30 days
  await pipe.exec();
}

// ============================================
// USAGE IN ENDPOINT
// ============================================
async function enrichProduct(req, res) {
  const { merchantId } = req.user;
  const { storeId } = req.context;
  const plan = req.user.plan;
  
  // Check quota
  const { allowed, remaining } = await checkQuota(merchantId, plan, 'ai');
  if (!allowed) {
    return res.status(429).json({
      error: 'AI_QUOTA_EXCEEDED',
      message: 'You have reached your daily AI limit. Upgrade your plan for more.',
      upgradeUrl: '/pricing'
    });
  }
  
  // Continue with AI job...
}
```

---

## 6. RATE LIMITING

### Rate Limit Rules

| Endpoint | Limit | Window | Scope |
|----------|-------|--------|-------|
| `POST /auth/otp/request` | 5 | 1 hour | per phone |
| `POST /auth/otp/verify` | 5 | 5 min | per phone |
| `POST /stores` | 3 | 1 day | per merchant |
| `POST /products` | 50 | 1 day | per merchant |
| `POST /products/*/enrich` | 10 | 1 day | per merchant |
| `POST /orders` | 20 | 1 hour | per store |
| `GET /*` (merchant) | 100 | 1 min | per merchant |
| `GET /*` (storefront) | 1000 | 1 min | per IP |
| `POST /auth/*` | 10 | 1 min | per IP |

### Implementation

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ============================================
// RATE LIMITER SETUP
// ============================================
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '60 s'),  // 100 requests per minute
  analytics: true,
  timeout: 1000,
});

// ============================================
// RATE LIMIT MIDDLEWARE
// ============================================
function rateLimit(key: string, limit: number, window: string) {
  return async (req, res, next) => {
    const identifier = `${key}:${req.ip}`;
    const { success, limit, reset, remaining } = await ratelimit.limit(identifier);
    
    if (!success) {
      return res.status(429).json({
        error: 'RATE_LIMITED',
        retryAfter: Math.ceil((reset - Date.now()) / 1000)
      });
    }
    
    res.set('X-RateLimit-Limit', limit.toString());
    res.set('X-RateLimit-Remaining', remaining.toString());
    res.set('X-RateLimit-Reset', reset.toString());
    
    next();
  };
}

// ============================================
// USAGE
// ============================================
app.post('/auth/otp/request', 
  rateLimit('otp', 5, '1h'),
  requestOTP
);

app.get('/v1/stores/:storeId/products', 
  authenticate(),
  rateLimit('merchant', 100, '1m'),
  listProducts
);
```

---

## 7. COST TRACKING

### AI Usage Table

```typescript
async function trackAIUsage(
  merchantId: string,
  storeId: string,
  feature: string,
  model: string,
  tokensInput: number,
  tokensOutput: number,
  cached: boolean
): Promise<void> {
  // Calculate cost
  const modelPricing: Record<string, { input: number; output: number }> = {
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'gpt-4o': { input: 0.005, output: 0.015 },
    'claude-sonnet': { input: 0.003, output: 0.015 },
    'gemini-flash': { input: 0.000075, output: 0.0003 }
  };
  
  const pricing = modelPricing[model] || modelPricing['gpt-4o-mini'];
  const costUsd = (tokensInput * pricing.input) + (tokensOutput * pricing.output);
  
  // Insert usage record
  await db.query(
    `INSERT INTO ai_usage (merchant_id, store_id, feature, model_used, 
     tokens_input, tokens_output, cost_usd, cached)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [merchantId, storeId, feature, model, tokensInput, tokensOutput, costUsd, cached]
  );
  
  // Update quota in Redis
  const today = new Date().toISOString().split('T')[0];
  const costKey = `quota:${merchantId}:cost:${today}`;
  await redis.incrbyfloat(costKey, costUsd);
  await redis.expire(costKey, 86400);
}
```

### Cost Alerts

```typescript
async function checkCostAlerts(merchantId: string, plan: string): Promise<void> {
  const limits = QUOTA_LIMITS[plan];
  const today = new Date().toISOString().split('T')[0];
  const costKey = `quota:${merchantId}:cost:${today}`;
  
  const currentCost = parseFloat(await redis.get(costKey) || '0');
  const threshold = limits.monthlyCostUsd * 0.8; // 80% threshold
  
  if (currentCost >= threshold) {
    // Send alert
    await sendNotification(merchantId, {
      type: 'COST_WARNING',
      message: `You have used ${currentCost.toFixed(2)} of your $${limits.monthlyCostUsd} monthly AI budget.`,
      upgradeUrl: '/pricing'
    });
  }
}
```

---

## 8. AI MODEL TIERING

### Complexity-Based Routing

```typescript
function selectModel(complexity: 'simple' | 'medium' | 'complex'): string {
  const routing = {
    simple: {
      model: 'gpt-4o-mini',
      costPer1k: 0.00075,
      useCase: 'Product titles, basic descriptions'
    },
    medium: {
      model: 'gemini-flash',
      costPer1k: 0.000375,
      useCase: 'Detailed descriptions, ad copy'
    },
    complex: {
      model: 'gpt-4o',
      costPer1k: 0.02,
      useCase: 'Image analysis, complex reasoning'
    }
  };
  
  return routing[complexity].model;
}

// Route based on job type
function getComplexity(jobType: string): 'simple' | 'medium' | 'complex' {
  const complexityMap = {
    'generate_title': 'simple',
    'generate_description': 'medium',
    'analyze_image': 'complex',
    'suggest_price': 'medium',
    'generate_ad_copy': 'complex'
  };
  
  return complexityMap[jobType] || 'medium';
}
```

---

## 9. COST PROJECTIONS

### Monthly Cost at Scale

| Merchants | AI Calls/Day | Cache Hit Rate | Unique Calls | Cost/Day | Cost/Month |
|-----------|--------------|----------------|--------------|----------|------------|
| 100 | 500 | 90% | 50 | $1 | $30 |
| 1,000 | 5,000 | 90% | 500 | $10 | $300 |
| 10,000 | 50,000 | 90% | 5,000 | $100 | $3,000 |
| 100,000 | 500,000 | 90% | 50,000 | $1,000 | $30,000 |

### Revenue vs Cost

| Merchants | Revenue (at $10/mo) | AI Cost | Other Infra | Profit |
|-----------|---------------------|---------|-------------|--------|
| 100 | $1,000 | $30 | $100 | $870 |
| 1,000 | $10,000 | $300 | $200 | $9,500 |
| 10,000 | $100,000 | $3,000 | $500 | $96,500 |
| 100,000 | $1,000,000 | $30,000 | $2,000 | $968,000 |

---

**END OF AI COST CONTROL DOCUMENT**
