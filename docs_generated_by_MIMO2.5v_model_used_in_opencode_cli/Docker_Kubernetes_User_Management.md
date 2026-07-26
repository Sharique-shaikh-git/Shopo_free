# Docker, Kubernetes & User Management Guide
## AI-Powered Mobile-First Store Builder

**Date:** July 8, 2026  
**Status:** Production Guide  

---

## Table of Contents

1. [Docker vs Kubernetes vs Cloud Run](#1-docker-vs-kubernetes-vs-cloud-run)
2. [Recommended Deployment Strategy](#2-recommended-deployment-strategy)
3. [User Management & Analytics](#3-user-management--analytics)
4. [Cohort Analysis & Retention](#4-cohort-analysis--retention)
5. [Managing 100-500 Users](#5-managing-100-500-users)

---

## 1. Docker vs Kubernetes vs Cloud Run

### The Short Answer

**For your project: Start with Cloud Run (NOT Kubernetes)**

```
┌─────────────────────────────────────────────────────────────┐
│                RECOMMENDATION FOR YOUR PROJECT               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  YOUR SITUATION:                                             │
│  ├── Team size: 1-3 developers                               │
│  ├── Users: 0-10K initially                                  │
│  ├── Services: 5-8 microservices                             │
│  ├── Budget: Limited (PKR)                                   │
│  └── Priority: Ship fast, iterate                            │
│                                                              │
│  RECOMMENDATION: CLOUD RUN                                   │
│  ├── ✅ No Kubernetes needed yet                              │
│  ├── ✅ Auto-scaling (0 to 10 instances)                     │
│  ├── ✅ Pay per request (saves money)                        │
│  ├── ✅ No ops overhead                                      │
│  ├── ✅ Free tier: 240,000 vCPU-seconds/month                │
│  └── ✅ Perfect for 0-100K users                             │
│                                                              │
│  KUBERNETES IS OVERKILL WHEN:                                │
│  ├── You have < 15 services                                  │
│  ├── You have < 15 engineers                                 │
│  ├── Your compute bill is < $5,000/month                     │
│  ├── You don't need fine-grained traffic control             │
│  └── You don't have K8s operational experience               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Comparison Table

| Factor | Docker Compose | Cloud Run | Kubernetes (GKE) |
|--------|----------------|-----------|------------------|
| **Setup Time** | Minutes | Minutes | Hours-Days |
| **Cost (your scale)** | $50-200/month | $0-500/month | $500-3,000/month |
| **Auto-scaling** | ❌ Manual | ✅ Automatic | ✅ Automatic |
| **Self-healing** | ❌ No | ✅ Yes | ✅ Yes |
| **Zero-downtime deploys** | ❌ Manual | ✅ Yes | ✅ Yes |
| **Learning curve** | Low | Low | High |
| **Ops overhead** | Medium | None | High |
| **Best for** | Local dev | MVP → 100K users | 100K+ users |

### When to Use Each

```
┌─────────────────────────────────────────────────────────────┐
│                WHEN TO USE EACH                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  DOCKER COMPOSE (Local Development)                          │
│  ├── ✅ Local development environment                        │
│  ├── ✅ Testing all services together                        │
│  ├── ✅ Quick setup for new developers                       │
│  ├── ✅ Consistent environment across team                   │
│  └── ❌ NOT for production at scale                           │
│                                                              │
│  CLOUD RUN (Production - YOUR CHOICE)                        │
│  ├── ✅ MVP to 100K users                                    │
│  ├── ✅ Auto-scaling based on traffic                        │
│  ├── ✅ Pay per request (cost-effective)                      │
│  ├── ✅ No infrastructure management                         │
│  ├── ✅ Built-in load balancing                              │
│  ├── ✅ Zero-downtime deployments                            │
│  └── ✅ Free tier available                                  │
│                                                              │
│  KUBERNETES (Future - IF NEEDED)                             │
│  ├── ✅ 100K+ users                                          │
│  ├── ✅ 15+ microservices                                    │
│  ├── ✅ Multiple teams deploying independently               │
│  ├── ✅ Fine-grained traffic control needed                  │
│  ├── ✅ Canary/blue-green deployments required               │
│  ├── ✅ Compute bill > $5,000/month                          │
│  └── ❌ Overkill for MVP and early growth                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Graduation Path

```
┌─────────────────────────────────────────────────────────────┐
│                DEPLOYMENT GRADUATION PATH                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PHASE 1: MVP (0-1K users)                                   │
│  ├── Docker Compose (local dev)                              │
│  ├── Cloud Run (production)                                  │
│  ├── Cloud SQL (database)                                    │
│  └── Memorystore (Redis)                                     │
│                                                              │
│  PHASE 2: GROWTH (1K-10K users)                              │
│  ├── Docker Compose (local dev)                              │
│  ├── Cloud Run (auto-scaling 1-10 instances)                 │
│  ├── Cloud SQL (with read replica)                           │
│  └── Memorystore (5GB)                                       │
│                                                              │
│  PHASE 3: SCALE (10K-100K users)                             │
│  ├── Docker Compose (local dev)                              │
│  ├── Cloud Run (auto-scaling 5-20 instances)                 │
│  ├── Cloud SQL (multiple read replicas)                      │
│  └── Memorystore (20GB cluster)                              │
│                                                              │
│  PHASE 4: ENTERPRISE (100K+ users)                           │
│  ├── Docker Compose (local dev)                              │
│  ├── GKE (Kubernetes) IF NEEDED                              │
│  ├── Cloud SQL (high-availability)                           │
│  └── Memorystore (cluster)                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Recommended Deployment Strategy

### Cloud Run Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                CLOUD RUN DEPLOYMENT                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                    ┌─────────────┐                           │
│                    │  Mobile App │                           │
│                    │ (React Native)│                         │
│                    └──────┬──────┘                           │
│                           │                                  │
│                           ▼                                  │
│                    ┌─────────────┐                           │
│                    │  Cloudflare │                           │
│                    │    (CDN)    │                           │
│                    └──────┬──────┘                           │
│                           │                                  │
│                           ▼                                  │
│                    ┌─────────────┐                           │
│                    │ GCP Load    │                           │
│                    │ Balancer    │                           │
│                    └──────┬──────┘                           │
│                           │                                  │
│                           ▼                                  │
│            ┌─────────────────────────────┐                   │
│            │        Cloud Run            │                   │
│            │  ┌─────┐ ┌─────┐ ┌─────┐   │                   │
│            │  │Auth │ │Store│ │  AI │   │                   │
│            │  │Svc  │ │Svc  │ │ Svc │   │                   │
│            │  └─────┘ └─────┘ └─────┘   │                   │
│            └─────────────┬───────────────┘                   │
│                          │                                   │
│                          ▼                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Cloud SQL   │  │ Memorystore  │  │   Cloud      │       │
│  │ (PostgreSQL) │  │   (Redis)    │  │  Storage     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Docker Compose for Local Development

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Backend API
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://storeuser:password@postgres:5432/storebuilder
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=dev-secret-key
      - NODE_ENV=development
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=storebuilder
      - POSTGRES_USER=storeuser
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Frontend (Next.js)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next

volumes:
  postgres_data:
  redis_data:
```

### Cloud Run Deployment Commands

```bash
# ============================================
# CLOUD RUN DEPLOYMENT
# ============================================

# 1. Build and push Docker image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/api

# 2. Deploy to Cloud Run
gcloud run deploy api-service \
  --image gcr.io/YOUR_PROJECT_ID/api \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 10 \
  --set-env-vars "NODE_ENV=production,DATABASE_URL=postgresql://..." \
  --concurrency 80 \
  --timeout 300

# 3. Check deployment
gcloud run services list
gcloud run services describe api-service --region asia-south1

# 4. View logs
gcloud run services logs read api-service --region asia-south1 --limit 50
```

---

## 3. User Management & Analytics

### Firebase Analytics Stack

```
┌─────────────────────────────────────────────────────────────┐
│                USER TRACKING STACK                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  FIREBASE ANALYTICS (Free)                                   │
│  ├── Automatic events:                                       │
│  │   ├── first_open (first time user opens app)              │
│  │   ├── session_start (each new session)                    │
│  │   ├── app_background (user leaves app)                    │
│  │   ├── app_foreground (user returns)                       │
│  │   └── user_engagement (active usage)                      │
│  │                                                           │
│  ├── Key metrics:                                            │
│  │   ├── DAU (Daily Active Users)                            │
│  │   ├── MAU (Monthly Active Users)                          │
│  │   ├── DAU/MAU ratio (stickiness - target 20%+)            │
│  │   ├── Session duration                                    │
│  │   └── Screen views per session                            │
│  │                                                           │
│  └── Retention tracking:                                     │
│      ├── Day 1 retention (target: 25-40%)                    │
│      ├── Day 7 retention (target: 10-20%)                    │
│      └── Day 30 retention (target: 5-15%)                    │
│                                                              │
│  SENTRY (Error Tracking - Free)                              │
│  ├── Error monitoring                                        │
│  ├── Performance tracking                                    │
│  ├── Session replay                                          │
│  └── User feedback                                           │
│                                                              │
│  CUSTOM EVENTS (Your Business Metrics)                       │
│  ├── store_created                                           │
│  ├── product_added                                           │
│  ├── product_viewed                                          │
│  ├── add_to_cart                                             │
│  ├── order_placed                                            │
│  ├── order_completed                                         │
│  ├── payment_received                                        │
│  ├── ai_feature_used                                         │
│  ├── campaign_created                                        │
│  └── campaign_sent                                           │
│                                                              │
│  USER PROPERTIES (Segmentation)                              │
│  ├── user_type (merchant/customer)                           │
│  ├── plan (free/starter/business)                            │
│  ├── store_category (clothing/cosmetics/grocery)             │
│  ├── signup_date                                             │
│  ├── last_active_date                                        │
│  ├── total_orders                                            │
│  └── total_revenue                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Firebase Analytics Implementation

```typescript
// ============================================
// FIREBASE ANALYTICS SETUP
// ============================================

// src/analytics.ts
import analytics from "@react-native-firebase/analytics";

// Track custom events
export const trackEvent = async (
  eventName: string,
  params?: Record<string, any>
) => {
  await analytics().logEvent(eventName, params);
};

// Track user properties
export const setUserProperties = async (properties: Record<string, string>) => {
  for (const [key, value] of Object.entries(properties)) {
    await analytics().setUserProperty(key, value);
  }
};

// Set user ID for cross-device tracking
export const setUserId = async (userId: string) => {
  await analytics().setUserId(userId);
};

// ============================================
// USAGE EXAMPLES
// ============================================

// When user signs up
const handleSignup = async (user: User) => {
  await setUserId(user.id);
  await setUserProperties({
    user_type: "merchant",
    plan: "free",
    signup_date: new Date().toISOString(),
  });
  await trackEvent("user_signup", {
    method: "phone",
    user_id: user.id,
  });
};

// When store is created
const handleStoreCreated = async (store: Store) => {
  await trackEvent("store_created", {
    store_id: store.id,
    store_name: store.name,
    category: store.category,
  });
  await setUserProperties({
    store_category: store.category,
  });
};

// When product is added
const handleProductAdded = async (product: Product) => {
  await trackEvent("product_added", {
    product_id: product.id,
    product_name: product.name,
    price: product.price,
    is_ai_generated: product.aiGenerated,
  });
};

// When order is placed
const handleOrderPlaced = async (order: Order) => {
  await trackEvent("order_placed", {
    order_id: order.id,
    total: order.total,
    payment_method: order.paymentMethod,
    items_count: order.items.length,
  });
};

// When AI feature is used
const handleAIFeatureUsed = async (feature: string, model: string) => {
  await trackEvent("ai_feature_used", {
    feature,
    model,
    timestamp: Date.now(),
  });
};
```

### Key Metrics to Track

```
┌─────────────────────────────────────────────────────────────┐
│                KEY METRICS DASHBOARD                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ACQUISITION                                                 │
│  ├── New users today: _____                                  │
│  ├── New users this week: _____                              │
│  ├── New users this month: _____                             │
│  └── Signup conversion rate: _____%                          │
│                                                              │
│  ENGAGEMENT                                                  │
│  ├── DAU (Daily Active Users): _____                         │
│  ├── MAU (Monthly Active Users): _____                       │
│  ├── DAU/MAU ratio: _____% (target: 20%+)                   │
│  ├── Avg session duration: _____ minutes                     │
│  └── Sessions per user: _____                                │
│                                                              │
│  RETENTION                                                   │
│  ├── Day 1 retention: _____% (target: 25-40%)                │
│  ├── Day 7 retention: _____% (target: 10-20%)                │
│  ├── Day 30 retention: _____% (target: 5-15%)                │
│  └── Churn rate: _____%                                      │
│                                                              │
│  CONVERSION                                                  │
│  ├── Stores created: _____                                   │
│  ├── Products added: _____                                   │
│  ├── Orders placed: _____                                    │
│  ├── Revenue: PKR _____                                      │
│  └── Average order value: PKR _____                          │
│                                                              │
│  AI USAGE                                                    │
│  ├── AI store creations: _____                               │
│  ├── AI products generated: _____                            │
│  ├── AI content generated: _____                             │
│  └── AI cost: PKR _____                                      │
│                                                              │
│  HEALTH                                                      │
│  ├── Error rate: _____% (target: <1%)                        │
│  ├── API latency p99: _____ms (target: <2s)                  │
│  ├── Uptime: _____% (target: 99.9%)                          │
│  └── Active issues (Sentry): _____                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Cohort Analysis & Retention

### What is Cohort Analysis?

```
┌─────────────────────────────────────────────────────────────┐
│                COHORT ANALYSIS                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  WHAT IS COHORT ANALYSIS?                                    │
│  ├── Group users by signup date                              │
│  ├── Track their behavior over time                          │
│  ├── See who stays, who leaves                               │
│  └── Identify patterns in retention                          │
│                                                              │
│  EXAMPLE COHORT TABLE:                                       │
│                                                              │
│  Signup Week  │ Week 1 │ Week 2 │ Week 3 │ Week 4            │
│  ─────────────┼────────┼────────┼────────┼────────           │
│  Jan 1-7      │  100%  │  45%   │  30%   │  25%             │
│  Jan 8-14     │  100%  │  50%   │  35%   │  28%             │
│  Jan 15-21    │  100%  │  55%   │  40%   │  --              │
│  Jan 22-28    │  100%  │  48%   │  --    │  --              │
│                                                              │
│  READING THIS:                                               │
│  ├── Week 1: Everyone who signed up                          │
│  ├── Week 2: 45% of Jan 1-7 users came back                 │
│  ├── Week 3: 30% of Jan 1-7 users still active               │
│  └── Week 4: 25% of Jan 1-7 users still active               │
│                                                              │
│  BENCHMARKS (Mobile Apps):                                   │
│  ├── Day 1 retention: 25-40% is good                         │
│  ├── Day 7 retention: 10-20% is good                         │
│  ├── Day 30 retention: 5-15% is good                         │
│  └── DAU/MAU ratio: 20%+ is strong                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### User Lifecycle Tracking

```typescript
// ============================================
// USER LIFECYCLE EVENTS
// ============================================

// src/user-lifecycle.ts

export const UserLifecycle = {
  // Acquisition
  SIGNUP: "user_signup",
  FIRST_STORE_CREATED: "first_store_created",
  FIRST_PRODUCT_ADDED: "first_product_added",
  FIRST_ORDER: "first_order",
  
  // Engagement
  DAILY_LOGIN: "daily_login",
  PRODUCT_VIEWED: "product_viewed",
  PRODUCT_ADDED_TO_CART: "product_added_to_cart",
  AI_FEATURE_USED: "ai_feature_used",
  
  // Conversion
  PLAN_UPGRADED: "plan_upgraded",
  CUSTOM_DOMAIN_ADDED: "custom_domain_added",
  MARKETING_CAMPAIGN_SENT: "marketing_campaign_sent",
  
  // Retention
  APP_OPENED_AFTER_7_DAYS: "return_after_7_days",
  APP_OPENED_AFTER_30_DAYS: "return_after_30_days",
  
  // Churn Risk
  INACTIVE_3_DAYS: "inactive_3_days",
  INACTIVE_7_DAYS: "inactive_7_days",
  INACTIVE_30_DAYS: "inactive_30_days",
};

// Track user activity
export const trackUserActivity = async (userId: string) => {
  const lastActive = await getUserLastActive(userId);
  const daysSinceActive = Math.floor(
    (Date.now() - lastActive) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceActive >= 30) {
    await trackEvent(UserLifecycle.INACTIVE_30_DAYS, { user_id: userId });
    // Trigger re-engagement campaign
    await sendReengagementEmail(userId);
  } else if (daysSinceActive >= 7) {
    await trackEvent(UserLifecycle.INACTIVE_7_DAYS, { user_id: userId });
    // Send push notification
    await sendPushNotification(userId, "We miss you!");
  } else if (daysSinceActive >= 3) {
    await trackEvent(UserLifecycle.INACTIVE_3_DAYS, { user_id: userId });
  }
};
```

### Retention Strategies

```
┌─────────────────────────────────────────────────────────────┐
│                RETENTION STRATEGIES                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  DAY 1 RETENTION (Target: 25-40%)                            │
│  ├── Welcome email/push notification                         │
│  ├── Onboarding tutorial                                     │
│  ├── Quick win (create first product)                        │
│  └── Personalized greeting                                   │
│                                                              │
│  DAY 7 RETENTION (Target: 10-20%)                            │
│  ├── Progress reminder ("You're 80% set up!")                │
│  ├── Feature discovery ("Try AI product generation")         │
│  ├── Success story ("Merchants like you sold 10 products")   │
│  └── Limited-time offer                                      │
│                                                              │
│  DAY 30 RETENTION (Target: 5-15%)                            │
│  ├── Monthly summary ("You made PKR X this month!")          │
│  ├── New feature announcement                                │
│  ├── Upgrade incentive                                       │
│  └── Community invitation                                    │
│                                                              │
│  CHURN PREVENTION                                            │
│  ├── Inactive 3 days → Push notification                     │
│  ├── Inactive 7 days → Email campaign                        │
│  ├── Inactive 30 days → Personal outreach                    │
│  └── Exit survey ("Why are you leaving?")                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Managing 100-500 Users

### What You Need at This Scale

```
┌─────────────────────────────────────────────────────────────┐
│                MANAGING 100-500 USERS                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  DATABASE (PostgreSQL)                                       │
│  ├── 100 users = tiny (no partitioning needed)               │
│  ├── 500 users = tiny (no partitioning needed)               │
│  ├── Partitioning needed at: 10,000+ users                   │
│  └── Sharding needed at: 100,000+ users                      │
│                                                              │
│  WHAT TO TRACK NOW:                                          │
│  ├── ✅ Firebase Analytics (automatic)                        │
│  ├── ✅ Custom events (products, orders)                      │
│  ├── ✅ User properties (plan, category)                      │
│  ├── ✅ Sentry error tracking                                 │
│  └── ✅ Weekly cohort analysis                                │
│                                                              │
│  WHAT NOT TO WORRY ABOUT YET:                                │
│  ├── ❌ Database partitioning (not needed)                    │
│  ├── ❌ Sharding (not needed)                                 │
│  ├── ❌ Kubernetes (not needed)                               │
│  ├── ❌ Complex caching (not needed)                          │
│  └── ❌ Load balancing (Cloud Run handles it)                 │
│                                                              │
│  FOCUS ON:                                                   │
│  ├── 🎯 Getting first 100 users                              │
│  ├── 🎯 Understanding their behavior                         │
│  ├── 🎯 Improving retention                                  │
│  ├── 🎯 Fixing bugs fast                                     │
│  └── 🎯 Iterating based on feedback                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### User Management Dashboard

```typescript
// ============================================
// USER MANAGEMENT QUERIES
// ============================================

// Get user activity summary
const getUserActivitySummary = async () => {
  const today = new Date();
  const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Daily Active Users
  const dau = await db.user.count({
    where: { lastActiveAt: { gte: today } }
  });

  // Weekly Active Users
  const wau = await db.user.count({
    where: { lastActiveAt: { gte: last7Days } }
  });

  // Monthly Active Users
  const mau = await db.user.count({
    where: { lastActiveAt: { gte: last30Days } }
  });

  // DAU/MAU ratio
  const stickiness = (dau / mau) * 100;

  return { dau, wau, mau, stickiness };
};

// Get retention cohort
const getRetentionCohort = async (signupWeek: Date) => {
  const weekEnd = new Date(signupWeek.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Users who signed up this week
  const cohortUsers = await db.user.findMany({
    where: {
      createdAt: { gte: signupWeek, lt: weekEnd }
    },
    select: { id: true, lastActiveAt: true }
  });

  const cohortSize = cohortUsers.length;

  // Calculate retention for each day
  const retention = {};
  for (let day = 1; day <= 30; day++) {
    const checkDate = new Date(signupWeek.getTime() + day * 24 * 60 * 60 * 1000);
    const activeUsers = cohortUsers.filter(
      user => user.lastActiveAt >= checkDate
    ).length;
    retention[`day${day}`] = (activeUsers / cohortSize) * 100;
  }

  return { signupWeek, cohortSize, retention };
};

// Get inactive users
const getInactiveUsers = async (days: number) => {
  const cutoffDate = new Date(
    Date.now() - days * 24 * 60 * 60 * 1000
  );

  return db.user.findMany({
    where: {
      lastActiveAt: { lt: cutoffDate },
      status: 'active'
    },
    select: {
      id: true,
      name: true,
      email: true,
      lastActiveAt: true,
      store: { select: { name: true } }
    }
  });
};

// Get user lifecycle events
const getUserLifecycle = async (userId: string) => {
  const events = await db.analyticsEvent.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' }
  });

  return {
    signupDate: events.find(e => e.event === 'user_signup')?.createdAt,
    firstStore: events.find(e => e.event === 'first_store_created')?.createdAt,
    firstProduct: events.find(e => e.event === 'first_product_added')?.createdAt,
    firstOrder: events.find(e => e.event === 'first_order')?.createdAt,
    lastActive: events[events.length - 1]?.createdAt,
    totalEvents: events.length,
    aiFeaturesUsed: events.filter(e => e.event === 'ai_feature_used').length,
    ordersPlaced: events.filter(e => e.event === 'order_placed').length,
  };
};
```

### Automated User Engagement

```typescript
// ============================================
// AUTOMATED USER ENGAGEMENT
// ============================================

// src/user-engagement.ts

export class UserEngagementService {
  // Daily job: Check for inactive users
  async checkInactiveUsers() {
    // Inactive 3 days
    const inactive3Days = await getInactiveUsers(3);
    for (const user of inactive3Days) {
      await this.sendPushNotification(user.id, {
        title: "We miss you!",
        body: `Your store ${user.store.name} is waiting. Come back and check your orders!`
      });
    }

    // Inactive 7 days
    const inactive7Days = await getInactiveUsers(7);
    for (const user of inactive7Days) {
      await this.sendEmail(user.email, {
        subject: "Your store is getting lonely...",
        body: `Hi ${user.name}, we noticed you haven't visited in a while. Here's what you're missing...`
      });
    }

    // Inactive 30 days
    const inactive30Days = await getInactiveUsers(30);
    for (const user of inactive30Days) {
      await this.sendPersonalEmail(user, {
        subject: "Special offer just for you",
        body: `Hi ${user.name}, we'd love to have you back. Here's 20% off your next month...`
      });
    }
  }

  // Weekly job: Send progress reports
  async sendWeeklyReports() {
    const activeUsers = await getActiveUsersLast7Days();
    
    for (const user of activeUsers) {
      const stats = await this.getUserWeeklyStats(user.id);
      
      await this.sendEmail(user.email, {
        subject: "Your weekly store summary",
        body: `
          Hi ${user.name},
          
          Here's what happened this week:
          - Products viewed: ${stats.productsViewed}
          - Orders received: ${stats.ordersReceived}
          - Revenue: PKR ${stats.revenue}
          
          Keep up the great work!
        `
      });
    }
  }

  // Monthly job: Send retention cohorts
  async analyzeRetentionCohorts() {
    const cohorts = await this.getCohortAnalysis();
    
    // Identify improving/declining cohorts
    for (const cohort of cohorts) {
      if (cohort.retention.day7 > cohort.prevWeekRetention.day7) {
        // Improving cohort - learn from it
        console.log(`Cohort ${cohort.signupWeek} improving`);
      } else {
        // Declining cohort - investigate
        console.log(`Cohort ${cohort.signupWeek} declining`);
      }
    }
  }
}
```

---

## Summary

| Topic | Recommendation |
|-------|----------------|
| **Docker vs Kubernetes** | **Cloud Run** (managed, auto-scaling, no ops) |
| **When to add Kubernetes** | 100K+ users OR 15+ services OR $5K+/month compute |
| **User tracking** | Firebase Analytics (free, automatic) |
| **Retention tracking** | Cohort analysis, DAU/MAU ratio |
| **Managing 100-500 users** | Just PostgreSQL + Firebase, focus on product |
| **When to add partitioning** | 10,000+ users |
| **When to add sharding** | 100,000+ users |

---

## Quick Reference

### Your Tech Stack

```
LOCAL DEVELOPMENT:
├── Docker Compose (all services)
├── PostgreSQL (local)
├── Redis (local)
└── Cost: Free

PRODUCTION (Cloud Run):
├── Cloud Run (API, AI, Services)
├── Cloud SQL (PostgreSQL)
├── Memorystore (Redis)
├── Cloudflare (CDN)
├── Sentry (Error Tracking)
├── Firebase Analytics (User Tracking)
└── Cost: $200-500/month (0-10K users)
```

### Key Numbers

| Metric | Target |
|--------|--------|
| Day 1 retention | 25-40% |
| Day 7 retention | 10-20% |
| Day 30 retention | 5-15% |
| DAU/MAU ratio | 20%+ |
| Error rate | <1% |
| API latency p99 | <2s |
| Uptime | 99.9% |

---

**Document End**

*This guide covers Docker, Kubernetes, Cloud Run, user management, analytics, retention tracking, and managing your first 100-500 users.*
