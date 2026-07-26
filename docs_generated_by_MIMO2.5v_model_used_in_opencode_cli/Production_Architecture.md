# Production Architecture Document
## AI-Powered Mobile-First Store Builder

**Document Version:** 1.0  
**Date:** July 8, 2026  
**Status:** Production Ready  
**Platform:** Google Cloud Platform (GCP)  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Deployment Platform](#2-deployment-platform)
3. [System Architecture](#3-system-architecture)
4. [Software Architecture](#4-software-architecture)
5. [AI Cost Optimization](#5-ai-cost-optimization)
6. [CI/CD Pipeline](#6-cicd-pipeline)
7. [Security Architecture](#7-security-architecture)
8. [Database & Caching](#8-database--caching)
9. [Budget Projections](#9-budget-projections)
10. [Production Checklist](#10-production-checklist)

---

## 1. Executive Summary

### Architecture Principles

1. **Mobile-First**: Android primary, iOS secondary, Desktop later
2. **Cost-Effective**: AI costs controlled through tiering and caching
3. **Scalable**: From 1K to 1M+ users without re-architecture
4. **Secure**: Enterprise-grade security from day one
5. **Observable**: Full monitoring, logging, and tracing

### Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Cloud Provider | GCP | 5-10% cheaper, Firebase integration, auto-discounts |
| Mobile Framework | React Native + Expo | Cross-platform, OTA updates, fast development |
| Backend | Node.js + NestJS | TypeScript, microservices ready |
| Database | PostgreSQL (Cloud SQL) | ACID, reliable, JSON support |
| Cache | Redis (Memorystore) | Session, AI cache, rate limiting |
| AI Gateway | LiteLLM | Multi-provider abstraction, cost tracking |
| Queue | Cloud Pub/Sub | Event-driven, async processing |

---

## 2. Deployment Platform

### Recommended: Google Cloud Platform (GCP)

**Why GCP over AWS:**

| Factor | GCP | AWS |
|--------|-----|-----|
| **Base Cost** | 5-10% cheaper | More expensive |
| **Free Tier** | 200GB free egress/month | No free egress |
| **Firebase** | Native integration | Requires third-party |
| **Auto-Discounts** | Sustained Use Discounts (20-30%) | Requires Reserved Instances |
| **Startup Friendly** | Better DX, simpler pricing | Complex pricing |
| **AI/ML** | Vertex AI, Gemini API | SageMaker |

### Infrastructure Components

```
┌─────────────────────────────────────────────────────────────┐
│                    GCP SERVICES                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  COMPUTE                                                     │
│  ├── Cloud Run (serverless containers)                       │
│  ├── GKE (Kubernetes for complex workloads)                  │
│  └── Cloud Functions (event-driven)                          │
│                                                              │
│  DATABASE                                                    │
│  ├── Cloud SQL (PostgreSQL)                                  │
│  ├── Memorystore (Redis)                                     │
│  └── Firestore (optional, for real-time)                     │
│                                                              │
│  STORAGE                                                     │
│  ├── Cloud Storage (images, assets)                          │
│  └── Persistent Disk (database storage)                      │
│                                                              │
│  NETWORKING                                                  │
│  ├── Cloud CDN (global edge caching)                         │
│  ├── Cloud Load Balancing                                    │
│  └── Cloud NAT (outbound internet)                           │
│                                                              │
│  SECURITY                                                    │
│  ├── Cloud IAM (identity & access)                           │
│  ├── Secret Manager (API keys, secrets)                      │
│  ├── Cloud Armor (WAF, DDoS protection)                      │
│  └── SSL Certificates (automatic)                            │
│                                                              │
│  MONITORING                                                  │
│  ├── Cloud Monitoring (metrics)                              │
│  ├── Cloud Logging (logs)                                    │
│  ├── Cloud Trace (distributed tracing)                       │
│  └── Error Reporting                                          │
│                                                              │
│  AI/ML                                                       │
│  ├── Vertex AI (model hosting)                               │
│  ├── Gemini API (content generation)                         │
│  └── Vision API (image recognition)                          │
│                                                              │
│  CI/CD                                                       │
│  ├── Cloud Build (CI/CD pipeline)                            │
│  ├── Artifact Registry (container images)                    │
│  └── Cloud Deploy (deployment automation)                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Cost Comparison at Scale

| Users | GCP/Month | AWS/Month | Savings |
|-------|-----------|-----------|---------|
| 1,000 | $150-200 | $200-300 | $50-100 |
| 10,000 | $1,200-1,400 | $1,500-1,600 | $300-200 |
| 100,000 | $3,200-3,600 | $3,500-4,000 | $300-400 |
| 1,000,000 | $10,000-12,000 | $11,000-13,000 | $1,000-1,000 |

---

## 3. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Mobile App (React Native/Flutter)    Web Store (Next.js)      │
│  - Android (primary)                  - Customer-facing         │
│  - iOS (later)                        - Mobile-optimized        │
│  - Merchant Admin                     - SEO-optimized           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  Cloud Endpoints / Kong / AWS API Gateway                       │
│  - Rate Limiting (per merchant)                                 │
│  - JWT Validation                                               │
│  - Request Routing                                              │
│  - Circuit Breaker                                              │
│  - API Versioning                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   MICROSERVICES LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │  Auth    │ │  Store   │ │ Product  │ │  Order   │          │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Payment  │ │   AI     │ │Notifica- │ │Analytics │          │
│  │ Service  │ │ Service  │ │  tion    │ │ Service  │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                   │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL (Cloud SQL)  │  Redis (Memorystore)  │  S3/GCS    │
│  - Primary DB            │  - Session cache       │  - Images  │
│  - ACID transactions     │  - AI response cache   │  - Assets  │
│  - Per-service DBs       │  - Rate limiting       │  - Backups │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  AI/ML LAYER                                    │
├─────────────────────────────────────────────────────────────────┤
│  Model Tiering Router                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Simple (60%) → GPT-4o-mini / Gemini Flash              │   │
│  │ Medium (30%) → GPT-4o / Claude Haiku                   │   │
│  │ Complex (10%) → GPT-4o / Claude Sonnet                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│  Prompt Caching │ Batch API │ Response Caching                  │
└─────────────────────────────────────────────────────────────────┘
```

### Request Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    REQUEST FLOW                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Client Request                                           │
│     │                                                        │
│     ▼                                                        │
│  2. Cloud CDN (cache static assets)                          │
│     │                                                        │
│     ▼                                                        │
│  3. Cloud Load Balancer                                      │
│     │                                                        │
│     ▼                                                        │
│  4. Cloud Armor (WAF, DDoS)                                  │
│     │                                                        │
│     ▼                                                        │
│  5. API Gateway                                              │
│     ├── Rate Limiting                                         │
│     ├── JWT Validation                                        │
│     └── Request Routing                                       │
│     │                                                        │
│     ▼                                                        │
│  6. Microservice (Cloud Run)                                 │
│     ├── Business Logic                                        │
│     ├── Database Query                                        │
│     └── AI Call (if needed)                                   │
│     │                                                        │
│     ▼                                                        │
│  7. Response                                                  │
│     ├── Cache in Redis (if cacheable)                         │
│     └── Return to Client                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Software Architecture

### Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Mobile App** | React Native + Expo | Cross-platform, OTA updates |
| **Web Store** | Next.js 15 | SSR/SSG, SEO, performance |
| **Backend API** | Node.js + NestJS | TypeScript, microservices ready |
| **Database** | PostgreSQL (Cloud SQL) | ACID, JSON support |
| **Cache** | Redis (Memorystore) | Session, AI cache |
| **Object Storage** | Google Cloud Storage | Images, assets |
| **AI Gateway** | LiteLLM | Multi-provider abstraction |
| **Queue** | Cloud Pub/Sub | Async processing |
| **Search** | Elasticsearch | Product search |
| **CDN** | Cloudflare | Global edge, DDoS |

### Microservices Design

```
┌─────────────────────────────────────────────────────────────┐
│                    SERVICE BOUNDARIES                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  AUTH SERVICE                                                │
│  ├── JWT token generation                                   │
│  ├── OAuth2 (Google, Facebook, Apple)                       │
│  ├── Phone OTP verification                                 │
│  ├── Session management                                     │
│  └── RBAC (roles: merchant, customer, admin)                │
│                                                              │
│  STORE SERVICE                                               │
│  ├── Store CRUD                                             │
│  ├── Subdomain management (mystore.yourbrand.pk)            │
│  ├── Custom domain setup                                    │
│  ├── Theme/design management                                │
│  └── Store settings                                         │
│                                                              │
│  PRODUCT SERVICE                                             │
│  ├── Product CRUD                                           │
│  ├── Image upload & processing                              │
│  ├── Category management                                    │
│  ├── Inventory tracking                                     │
│  └── Product variants (size, color)                         │
│                                                              │
│  ORDER SERVICE                                               │
│  ├── Order lifecycle management                             │
│  ├── Cart management                                        │
│  ├── Checkout orchestration                                 │
│  ├── Order status tracking                                  │
│  └── Returns/Refunds                                        │
│                                                              │
│  PAYMENT SERVICE                                             │
│  ├── COD management                                         │
│  ├── JazzCash/EasyPaisa integration                         │
│  ├── Bank transfer handling                                 │
│  ├── Payment reconciliation                                 │
│  └── Refund processing                                      │
│                                                              │
│  AI SERVICE                                                  │
│  ├── Product recognition (image → data)                     │
│  ├── Content generation (descriptions, marketing)           │
│  ├── Price suggestion engine                                │
│  ├── Store builder AI                                       │
│  ├── Model tiering router                                   │
│  └── Cost tracking per merchant                             │
│                                                              │
│  NOTIFICATION SERVICE                                        │
│  ├── Push notifications (FCM)                               │
│  ├── SMS (Twilio/local provider)                            │
│  ├── Email (SendGrid)                                       │
│  ├── In-app notifications                                   │
│  └── Order status updates                                   │
│                                                              │
│  ANALYTICS SERVICE                                           │
│  ├── Sales analytics                                        │
│  ├── Customer behavior                                      │
│  ├── Product performance                                    │
│  ├── Marketing ROI                                          │
│  └── Business insights                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Event-Driven Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    EVENT BUS (Cloud Pub/Sub)                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Events:                                                     │
│  ├── order.created                                           │
│  ├── order.paid                                              │
│  ├── order.shipped                                           │
│  ├── order.delivered                                         │
│  ├── product.created                                         │
│  ├── product.updated                                         │
│  ├── store.created                                           │
│  ├── payment.received                                        │
│  ├── inventory.low                                           │
│  └── marketing.campaign.created                              │
│                                                              │
│  Consumers:                                                  │
│  ├── Notification Service (sends alerts)                     │
│  ├── Analytics Service (updates dashboards)                  │
│  ├── AI Service (triggers insights)                          │
│  ├── Inventory Service (updates stock)                       │
│  └── Marketing Service (triggers campaigns)                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### API Design

```typescript
// Example: Product API Endpoints
// Base URL: https://api.yourbrand.pk/v1

// Products
POST   /products              // Create product
GET    /products              // List products
GET    /products/:id          // Get product
PUT    /products/:id          // Update product
DELETE /products/:id          // Delete product
POST   /products/:id/images   // Upload product image
DELETE /products/:id/images/:imageId  // Delete image

// AI Features
POST   /ai/recognize          // Recognize product from image
POST   /ai/generate-content   // Generate product description
POST   /ai/suggest-price      // Suggest product price
POST   /ai/generate-marketing // Generate marketing content

// Orders
POST   /orders                // Create order
GET    /orders                // List orders
GET    /orders/:id            // Get order
PUT    /orders/:id/status     // Update order status

// Store
GET    /store                 // Get store details
PUT    /store                 // Update store
GET    /store/products        // Get store products
GET    /store/orders          // Get store orders

// Analytics
GET    /analytics/sales       // Get sales analytics
GET    /analytics/products    // Get product analytics
GET    /analytics/customers   // Get customer analytics
```

---

## 5. AI Cost Optimization

### The #1 Concern: AI Costs Will Eat Revenue

**Without optimization, AI costs can destroy your business. Here's the solution:**

### Model Tiering Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                AI REQUEST ROUTER                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 1: Classify Request Complexity                         │
│  ├── Simple (60-70%): Classification, extraction, tags      │
│  ├── Medium (20-30%): Content generation, descriptions      │
│  └── Complex (5-10%): Reasoning, planning, analysis         │
│                                                              │
│  Step 2: Route to Cheapest Qualified Model                   │
│  ├── Simple → GPT-4o-mini ($0.15/$0.60 per MTok)            │
│  │            OR Gemini Flash ($0.075/$0.30)                 │
│  │            OR Self-hosted Llama 8B ($0.02/MTok)           │
│  │                                                           │
│  ├── Medium → GPT-4o ($2.50/$10)                             │
│  │            OR Claude Haiku 4.5 ($1/$5)                    │
│  │                                                           │
│  └── Complex → GPT-4o ($2.50/$10)                            │
│               OR Claude Sonnet 4.6 ($3/$15)                  │
│                                                              │
│  Step 3: Apply Cost Optimizations                            │
│  ├── Prompt Caching (90% off on cache hits)                  │
│  ├── Batch API (50% off for async)                           │
│  ├── Response Caching (Redis, avoid API call entirely)       │
│  └── Image Preprocessing (resize to 768px = 14x savings)    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### AI Pricing Reference

**OpenAI GPT-4o:**
| Metric | Price |
|--------|-------|
| Input tokens | $2.50 per 1M tokens |
| Output tokens | $10.00 per 1M tokens |
| Cached input | $1.25 per 1M tokens (50% off) |
| Batch API | 50% discount |
| Image (high detail) | ~$0.002 per image |
| Image (low detail) | ~$0.0002 per image |

**Claude:**
| Model | Input/1M | Output/1M | Cached/1M |
|-------|----------|-----------|-----------|
| Haiku 4.5 | $1.00 | $5.00 | $0.10 |
| Sonnet 4.6 | $3.00 | $15.00 | $0.30 |
| Opus 4.8 | $5.00 | $25.00 | $0.50 |

**Budget API Options:**
| Model | Input/1M | Output/1M |
|-------|----------|-----------|
| Gemini 2.0 Flash | $0.075 | $0.30 |
| GPT-4o-mini | $0.15 | $0.60 |
| DeepSeek V4 Flash | $0.14 | $0.28 |

### Cost Per Feature (Optimized)

| Feature | Cost/Request | Monthly (10K merchants) |
|---------|--------------|-------------------------|
| **Store Creation** | $0.02 | $200 |
| **Product Addition** | $0.004 | $400 |
| **Image Recognition** | $0.0002 | $20 |
| **Content Generation** | $0.003 | $300 |
| **Price Suggestions** | $0.002 | $200 |
| **Marketing Content** | $0.015 | $150 |
| **AI Assistant** | $0.005 | $500 |
| **TOTAL per merchant** | ~$0.03 | ~$300/month |

### Cost Explosion Prevention

```typescript
// Per-Merchant Budget Guard
class AICostGuard {
  private merchantId: string;
  private monthlyLimit: number;
  private currentUsage: number;

  constructor(merchantId: string, tier: 'free' | 'starter' | 'business') {
    this.merchantId = merchantId;
    this.monthlyLimit = this.getTierLimit(tier);
    this.currentUsage = 0;
  }

  private getTierLimit(tier: string): number {
    const limits = {
      free: 5,      // $5/month AI budget
      starter: 25,  // $25/month AI budget
      business: 100 // $100/month AI budget
    };
    return limits[tier];
  }

  async checkBudget(estimatedCost: number): Promise<boolean> {
    if (this.currentUsage + estimatedCost > this.monthlyLimit) {
      // Option 1: Use cheaper model
      // Option 2: Return cached response
      // Option 3: Queue for batch processing
      return false; // Budget exceeded
    }
    this.currentUsage += estimatedCost;
    return true; // Within budget
  }
}
```

### Response Caching Strategy

```typescript
// Cache AI responses in Redis
class AICache {
  private redis: Redis;

  async getCachedResponse(prompt: string, model: string): Promise<any> {
    const cacheKey = this.generateCacheKey(prompt, model);
    const cached = await this.redis.get(cacheKey);
    return cached ? JSON.parse(cached) : null;
  }

  async cacheResponse(prompt: string, model: string, response: any, ttl: number): Promise<void> {
    const cacheKey = this.generateCacheKey(prompt, model);
    await this.redis.setex(cacheKey, ttl, JSON.stringify(response));
  }

  private generateCacheKey(prompt: string, model: string): string {
    return `ai:${model}:${crypto.createHash('sha256').update(prompt).digest('hex')}`;
  }
}

// Cache TTLs by use case
const CACHE_TTLS = {
  productDescription: 7 * 24 * 60 * 60,  // 7 days
  priceSuggestion: 24 * 60 * 60,          // 24 hours
  imageRecognition: 90 * 24 * 60 * 60,    // 90 days
  marketingContent: 24 * 60 * 60,         // 24 hours
  storeCreation: 30 * 24 * 60 * 60        // 30 days
};
```

---

## 6. CI/CD Pipeline

### Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CI/CD PIPELINE                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Developer → Git Push → GitHub/GitLab                        │
│                              │                               │
│                              ▼                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 CI Pipeline                          │    │
│  │  ├── Linting (ESLint, Prettier)                     │    │
│  │  ├── Unit Tests (Jest, Pytest)                      │    │
│  │  ├── Integration Tests                              │    │
│  │  ├── Security Scan (Snyk, Trivy)                    │    │
│  │  ├── Build Docker Image                             │    │
│  │  └── Push to Container Registry (GCR/Artifact)      │    │
│  └─────────────────────────────────────────────────────┘    │
│                              │                               │
│                              ▼                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 CD Pipeline                          │    │
│  │  ├── Deploy to Staging (auto)                       │    │
│  │  ├── E2E Tests (Cypress, Playwright)                │    │
│  │  ├── Performance Tests (k6, Artillery)              │    │
│  │  ├── Manual Approval (production)                   │    │
│  │  ├── Blue/Green Deployment                          │    │
│  │  └── Canary Release (10% → 50% → 100%)              │    │
│  └─────────────────────────────────────────────────────┘    │
│                              │                               │
│                              ▼                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Monitoring & Rollback                   │    │
│  │  ├── Prometheus + Grafana (metrics)                 │    │
│  │  ├── ELK Stack (logs)                               │    │
│  │  ├── Jaeger (tracing)                               │    │
│  │  ├── Error rate > 1% → Auto Rollback                │    │
│  │  └── Latency p99 > 2s → Alert                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Infrastructure as Code

| Tool | Purpose |
|------|---------|
| **Terraform** | Cloud infrastructure provisioning |
| **Kubernetes (GKE)** | Container orchestration |
| **Helm** | K8s package management |
| **ArgoCD** | GitOps deployment |
| **GitHub Actions** | CI/CD orchestration |

### Environment Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    ENVIRONMENTS                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Development (local)                                         │
│  ├── Docker Compose for all services                         │
│  ├── Local PostgreSQL + Redis                                │
│  └── Mock AI responses                                       │
│                                                              │
│  Staging (cloud)                                             │
│  ├── Mirror production architecture                         │
│  ├── Synthetic data                                          │
│  └── Integration tests                                       │
│                                                              │
│  Production (cloud)                                          │
│  ├── Auto-scaling                                            │
│  ├── Multi-AZ deployment                                     │
│  ├── Real AI APIs (with cost guards)                         │
│  └── Real payment gateways                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Run linter
        run: npm run lint
      - name: Run tests
        run: npm run test:coverage
      - name: Security scan
        run: npm audit --production

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t gcr.io/${{ secrets.GCP_PROJECT_ID }}/api:${{ github.sha }} .
      - name: Push to GCR
        run: docker push gcr.io/${{ secrets.GCP_PROJECT_ID }}/api:${{ github.sha }}

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy api-staging \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/api:${{ github.sha }} \
            --platform managed \
            --region asia-south1

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy api-production \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/api:${{ github.sha }} \
            --platform managed \
            --region asia-south1
```

---

## 7. Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  LAYER 1: EDGE SECURITY                                     │
│  ├── Cloudflare WAF (Web Application Firewall)              │
│  ├── DDoS Protection (automatic)                            │
│  ├── Rate Limiting (per IP, per user)                        │
│  ├── SSL/TLS (automatic)                                    │
│  └── Bot Protection                                          │
│                                                              │
│  LAYER 2: AUTHENTICATION                                     │
│  ├── JWT tokens (short-lived: 15min)                         │
│  ├── Refresh tokens (7-day, rotate on use)                   │
│  ├── OAuth2 (Google, Facebook, Apple)                        │
│  ├── Phone OTP (SMS verification)                            │
│  ├── Biometric (fingerprint/face)                            │
│  └── Multi-factor authentication (optional)                  │
│                                                              │
│  LAYER 3: AUTHORIZATION                                      │
│  ├── RBAC (Role-Based Access Control)                        │
│  │   ├── Merchant: own store only                            │
│  │   ├── Customer: own orders only                           │
│  │   └── Admin: full access                                  │
│  ├── Row-level security (PostgreSQL RLS)                     │
│  └── API key scoping                                         │
│                                                              │
│  LAYER 4: DATA SECURITY                                      │
│  ├── Encryption at rest (AES-256)                            │
│  ├── Encryption in transit (TLS 1.3)                         │
│  ├── Database encryption (Cloud SQL)                         │
│  ├── PII masking in logs                                     │
│  └── GDPR compliance (data export, deletion)                 │
│                                                              │
│  LAYER 5: APPLICATION SECURITY                               │
│  ├── Input validation (Zod schemas)                          │
│  ├── SQL injection prevention (ORM)                          │
│  ├── XSS prevention (Content Security Policy)                │
│  ├── CORS configuration                                      │
│  └── Dependency scanning (Snyk)                              │
│                                                              │
│  LAYER 6: MONITORING & RESPONSE                              │
│  ├── Security event logging                                  │
│  ├── Intrusion detection                                     │
│  ├── Anomaly detection (unusual API usage)                   │
│  ├── Incident response playbook                              │
│  └── Regular security audits                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│              AUTHENTICATION FLOW                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User opens app                                           │
│     │                                                        │
│     ▼                                                        │
│  2. Login screen (phone number / email)                      │
│     │                                                        │
│     ▼                                                        │
│  3. OTP sent via SMS/Email                                   │
│     │                                                        │
│     ▼                                                        │
│  4. User enters OTP                                          │
│     │                                                        │
│     ▼                                                        │
│  5. Backend validates OTP                                    │
│     │                                                        │
│     ├── Invalid → Show error, retry                          │
│     │                                                        │
│     └── Valid → Generate JWT + Refresh Token                 │
│                │                                             │
│                ▼                                             │
│  6. Store tokens securely                                    │
│     ├── Access Token: 15min (in memory)                      │
│     └── Refresh Token: 7 days (secure storage)               │
│                │                                             │
│                ▼                                             │
│  7. Auto-refresh flow                                        │
│     ├── On 401 error → Use refresh token                     │
│     ├── New tokens issued                                    │
│     └── Retry original request                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Security Checklist

- [ ] **Authentication**
  - [ ] JWT with short expiry (15 min)
  - [ ] Refresh token rotation
  - [ ] OAuth2 integration
  - [ ] Phone OTP verification
  - [ ] Biometric authentication

- [ ] **Authorization**
  - [ ] Role-based access control
  - [ ] Row-level security
  - [ ] API key scoping
  - [ ] Permission inheritance

- [ ] **Data Protection**
  - [ ] Encryption at rest
  - [ ] Encryption in transit
  - [ ] PII masking
  - [ ] Data export/deletion
  - [ ] Audit logging

- [ ] **Application Security**
  - [ ] Input validation
  - [ ] SQL injection prevention
  - [ ] XSS protection
  - [ ] CORS configuration
  - [ ] Dependency scanning

---

## 8. Database & Caching

### Database Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PostgreSQL (Cloud SQL) - Primary Database                   │
│  ├── Merchants DB                                            │
│  │   ├── merchants (id, name, phone, email, plan)            │
│  │   ├── stores (id, merchant_id, name, subdomain, theme)    │
│  │   └── store_settings (id, store_id, key, value)           │
│  │                                                           │
│  ├── Products DB                                             │
│  │   ├── products (id, store_id, name, description, price)   │
│  │   ├── categories (id, store_id, name, parent_id)          │
│  │   ├── product_images (id, product_id, url, order)         │
│  │   └── inventory (id, product_id, quantity, sku)           │
│  │                                                           │
│  ├── Orders DB                                               │
│  │   ├── orders (id, store_id, customer_id, status, total)   │
│  │   ├── order_items (id, order_id, product_id, qty, price)  │
│  │   └── order_status_history (id, order_id, status, time)   │
│  │                                                           │
│  ├── Customers DB                                            │
│  │   ├── customers (id, store_id, name, phone, email)        │
│  │   └── customer_addresses (id, customer_id, address)       │
│  │                                                           │
│  └── Analytics DB (separate, read-only replica)              │
│      ├── sales_summary (date, store_id, revenue, orders)     │
│      └── product_performance (product_id, views, sales)      │
│                                                              │
│  Redis (Memorystore) - Cache Layer                           │
│  ├── Session storage (user sessions)                         │
│  ├── AI response cache (product descriptions, etc.)          │
│  ├── Rate limiting counters                                  │
│  ├── Hot data cache (product details, store info)            │
│  └── Pub/Sub for real-time updates                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema

```sql
-- Merchants Table
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    plan VARCHAR(20) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Stores Table
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    custom_domain VARCHAR(255),
    description TEXT,
    logo_url VARCHAR(500),
    theme_color VARCHAR(7) DEFAULT '#000000',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2),
    category_id UUID REFERENCES categories(id),
    sku VARCHAR(100),
    barcode VARCHAR(100),
    weight DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Product Images Table
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id),
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES categories(id),
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id),
    customer_id UUID REFERENCES customers(id),
    status VARCHAR(20) DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    shipping_address JSONB,
    billing_address JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id),
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Customers Table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id),
    name VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_stores_merchant ON stores(merchant_id);
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_customers_store ON customers(store_id);

-- Full-Text Search Index
CREATE INDEX idx_products_search ON products 
    USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
```

### Caching Strategy

| Data Type | Cache TTL | Strategy |
|-----------|-----------|----------|
| Product details | 5 min | Write-through |
| Store info | 10 min | Cache-aside |
| AI responses | 24 hours | Write-through |
| User sessions | 15 min | Write-through |
| Search results | 1 min | Cache-aside |
| Analytics data | 5 min | Write-behind |

### Redis Implementation

```typescript
// Redis Cache Implementation
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  tls: process.env.NODE_ENV === 'production' ? {} : undefined
});

// Cache-aside pattern
async function getProduct(productId: string): Promise<Product | null> {
  const cacheKey = `product:${productId}`;
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Cache miss - fetch from database
  const product = await db.product.findUnique({ where: { id: productId } });
  
  if (product) {
    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(product));
  }
  
  return product;
}

// Write-through pattern
async function updateProduct(productId: string, data: Partial<Product>): Promise<Product> {
  const product = await db.product.update({ where: { id: productId }, data });
  
  // Update cache
  const cacheKey = `product:${productId}`;
  await redis.setex(cacheKey, 300, JSON.stringify(product));
  
  // Invalidate related caches
  await redis.del(`store:${product.storeId}:products`);
  
  return product;
}

// Rate limiting
async function checkRateLimit(key: string, limit: number, window: number): Promise<boolean> {
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, window);
  }
  return current <= limit;
}
```

---

## 9. Budget Projections

### Infrastructure Cost (GCP)

| Scale | Monthly Cost | Breakdown |
|-------|--------------|-----------|
| **1,000 users** | $200-300 | Compute: $50, DB: $50, Cache: $20, Storage: $30, CDN: $20, Auth: $0 |
| **10,000 users** | $1,200-1,400 | Compute: $200, DB: $150, Cache: $50, Storage: $100, CDN: $80, Auth: $50 |
| **100,000 users** | $3,200-3,600 | Compute: $600, DB: $400, Cache: $100, Storage: $300, CDN: $200, Auth: $250 |
| **1,000,000 users** | $10,000-12,000 | Compute: $2,000, DB: $1,500, Cache: $300, Storage: $1,000, CDN: $800, Auth: $2,500 |

### AI Cost (Optimized)

| Scale | Monthly AI Cost | Per Merchant |
|-------|-----------------|--------------|
| **1,000 merchants** | $500-1,000 | $0.50-1.00 |
| **10,000 merchants** | $3,000-5,000 | $0.30-0.50 |
| **100,000 merchants** | $15,000-25,000 | $0.15-0.25 |

### Total Monthly Cost Projection

| Scale | Infrastructure | AI | Total | Revenue (at $10/mo) | Profit |
|-------|----------------|-----|-------|---------------------|--------|
| **1K merchants** | $300 | $1,000 | $1,300 | $10,000 | $8,700 |
| **10K merchants** | $1,400 | $5,000 | $6,400 | $100,000 | $93,600 |
| **100K merchants** | $3,600 | $25,000 | $28,600 | $1,000,000 | $971,400 |

### First 6 Months Budget

| Month | Infrastructure | AI | Total | Notes |
|-------|----------------|-----|-------|-------|
| **Month 1** | $200 | $500 | $700 | MVP launch, 100 merchants |
| **Month 2** | $300 | $800 | $1,100 | Growth, 300 merchants |
| **Month 3** | $400 | $1,200 | $1,600 | Growth, 500 merchants |
| **Month 4** | $500 | $1,500 | $2,000 | Scaling, 800 merchants |
| **Month 5** | $600 | $2,000 | $2,600 | Scaling, 1,000 merchants |
| **Month 6** | $700 | $2,500 | $3,200 | Scaling, 1,200 merchants |
| **TOTAL** | $2,700 | $8,500 | $11,200 | |

### Break-Even Analysis

| Metric | Value |
|--------|-------|
| **Average revenue per merchant** | $10/month |
| **Break-even point** | 1,120 merchants |
| **Time to break-even** | Month 6 |
| **Total investment needed** | $11,200 |
| **Expected revenue at break-even** | $11,200/month |

---

## 10. Production Checklist

### Before Launch

- [ ] **Security**
  - [ ] JWT authentication implemented
  - [ ] Rate limiting configured
  - [ ] Input validation on all endpoints
  - [ ] SQL injection prevention
  - [ ] XSS protection
  - [ ] CORS configured
  - [ ] HTTPS enforced
  - [ ] PII encryption at rest

- [ ] **Performance**
  - [ ] Database indexes optimized
  - [ ] Redis caching implemented
  - [ ] CDN configured
  - [ ] Image optimization pipeline
  - [ ] Lazy loading implemented
  - [ ] API response compression

- [ ] **Reliability**
  - [ ] Auto-scaling configured
  - [ ] Health checks implemented
  - [ ] Circuit breakers in place
  - [ ] Retry logic with exponential backoff
  - [ ] Dead letter queues for failed messages
  - [ ] Backup and restore tested

- [ ] **Monitoring**
  - [ ] Prometheus metrics
  - [ ] Grafana dashboards
  - [ ] Log aggregation (ELK)
  - [ ] Distributed tracing (Jaeger)
  - [ ] Alerting rules configured
  - [ ] Error tracking (Sentry)

- [ ] **CI/CD**
  - [ ] Automated tests (>80% coverage)
  - [ ] Security scanning in pipeline
  - [ ] Blue/green deployment
  - [ ] Rollback procedures tested
  - [ ] Feature flags implemented
  - [ ] Canary releases configured

- [ ] **AI Cost Control**
  - [ ] Per-merchant budget limits
  - [ ] Model tiering implemented
  - [ ] Prompt caching enabled
  - [ ] Batch API for async tasks
  - [ ] Response caching in Redis
  - [ ] Cost monitoring dashboard

---

## Appendix A: Technology Decisions

### Why React Native + Expo

| Factor | Benefit |
|--------|---------|
| **Cross-platform** | Single codebase for Android + iOS |
| **OTA Updates** | Push updates without app store approval |
| **EAS Build** | Cloud-based builds, no Mac required |
| **TypeScript** | Type safety, better DX |
| **Community** | Large ecosystem, many libraries |

### Why Node.js + NestJS

| Factor | Benefit |
|--------|---------|
| **TypeScript** | Same language as frontend |
| **Microservices** | Built-in support |
| **Modularity** | Clean architecture |
| **Performance** | Non-blocking I/O |
| **Ecosystem** | npm packages |

### Why PostgreSQL

| Factor | Benefit |
|--------|---------|
| **ACID** | Data integrity |
| **JSON support** | Flexible schema |
| **Full-text search** | Built-in |
| **Extensions** | PostGIS, pg_trgm |
| **Reliability** | Battle-tested |

---

## Appendix B: Deployment Commands

### Initial Setup

```bash
# Install GCP CLI
curl https://sdk.cloud.google.com | bash

# Authenticate
gcloud auth login

# Set project
gcloud config set project your-project-id

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  redis.googleapis.com \
  storage.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com
```

### Deploy Services

```bash
# Build and push Docker image
docker build -t gcr.io/your-project-id/api .
docker push gcr.io/your-project-id/api

# Deploy to Cloud Run
gcloud run deploy api \
  --image gcr.io/your-project-id/api \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production" \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 10
```

### Database Setup

```bash
# Create Cloud SQL instance
gcloud sql instances create your-instance \
  --database-version=POSTGRES_15 \
  --tier=db-custom-2-8192 \
  --region=asia-south1 \
  --storage-size=10GB \
  --storage-auto-increase

# Create database
gcloud sql databases create your-db --instance=your-instance

# Connect
gcloud sql connect your-instance --user=postgres
```

---

**Document End**

*This architecture document provides a complete blueprint for building a production-ready AI-powered mobile-first store builder. It covers deployment, system design, software architecture, AI cost optimization, CI/CD, security, database design, and budget projections.*
