# Complete Architecture & Development Guide
## AI-Powered Mobile-First Store Builder

**Date:** July 8, 2026  
**Status:** Production Architecture  

---

## Table of Contents

1. [Fundamental Design System](#1-fundamental-design-system)
2. [Database Design & Partitioning](#2-database-design--partitioning)
3. [Load Balancing](#3-load-balancing)
4. [Scalability Design](#4-scalability-design)
5. [App Monitoring & Observability](#5-app-monitoring--observability)
6. [How to Start Building](#6-how-to-start-building)
7. [Cost in PKR](#7-cost-in-pkr)
8. [CDN & Networking](#8-cdn--networking)
9. [Communication Protocols & API Design](#9-communication-protocols--api-design)

---

## 1. Fundamental Design System

### Design Principles

```
┌─────────────────────────────────────────────────────────────┐
│                FUNDAMENTAL DESIGN PRINCIPLES                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. MOBILE-FIRST                                             │
│  ├── Android primary (90% Pakistan market)                   │
│  ├── iOS secondary                                           │
│  ├── Desktop later                                           │
│  └── All UI optimized for touch                              │
│                                                              │
│  2. SIMPLICITY                                                │
│  ├── No technical jargon in UI                               │
│  ├── Everyday language (My Products, My Orders)              │
│  ├── Maximum 3 taps for any action                           │
│  └── AI handles complexity                                   │
│                                                              │
│  3. RELIABILITY                                               │
│  ├── 99.9% uptime target                                    │
│  ├── Auto-retry on failures                                  │
│  ├── Offline support for critical features                   │
│  └── Graceful degradation                                    │
│                                                              │
│  4. COST-EFFECTIVE                                            │
│  ├── AI tiering (cheap for simple, expensive for complex)    │
│  ├── Aggressive caching                                      │
│  ├── CDN for static assets                                   │
│  └── Serverless where possible                               │
│                                                              │
│  5. SECURE                                                    │
│  ├── HTTPS everywhere                                        │
│  ├── JWT authentication                                      │
│  ├── Data encryption                                         │
│  └── Rate limiting                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### System Design Overview

```
┌─────────────────────────────────────────────────────────────┐
│                HIGH-LEVEL SYSTEM DESIGN                      │
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
│                    │   GCP Load  │                           │
│                    │  Balancer   │                           │
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
│  │  PostgreSQL  │  │    Redis     │  │   Cloud      │       │
│  │  (Cloud SQL) │  │(Memorystore) │  │  Storage     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Database Design & Partitioning

### PostgreSQL Schema

```sql
-- ============================================
-- CORE TABLES
-- ============================================

-- Merchants Table
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'business')),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Stores Table (Partitioned by merchant_id)
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

-- Products Table (Partitioned by store_id)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2),
    sku VARCHAR(100),
    barcode VARCHAR(100),
    weight DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'active',
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
) PARTITION BY HASH (store_id);

-- Create 4 partitions for products
CREATE TABLE products_p0 PARTITION OF products 
    FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE products_p1 PARTITION OF products 
    FOR VALUES WITH (MODULUS 4, REMAINDER 1);
CREATE TABLE products_p2 PARTITION OF products 
    FOR VALUES WITH (MODULUS 4, REMAINDER 2);
CREATE TABLE products_p3 PARTITION OF products 
    FOR VALUES WITH (MODULUS 4, REMAINDER 3);

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

-- Orders Table (Partitioned by created_at)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id),
    customer_id UUID REFERENCES customers(id),
    status VARCHAR(20) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded')),
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    shipping_address JSONB,
    billing_address JSONB,
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Monthly partitions for orders
CREATE TABLE orders_2026_01 PARTITION OF orders
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE orders_2026_02 PARTITION OF orders
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE orders_2026_03 PARTITION OF orders
    FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
-- Add more partitions as needed

-- Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id),
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
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

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Stores indexes
CREATE INDEX idx_stores_merchant ON stores(merchant_id);
CREATE INDEX idx_stores_subdomain ON stores(subdomain);
CREATE INDEX idx_stores_status ON stores(status);

-- Products indexes
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created ON products(created_at DESC);

-- Full-text search index
CREATE INDEX idx_products_search ON products 
    USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Product images indexes
CREATE INDEX idx_product_images_product ON product_images(product_id);

-- Categories indexes
CREATE INDEX idx_categories_store ON categories(store_id);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- Orders indexes
CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Order items indexes
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Customers indexes
CREATE INDEX idx_customers_store ON customers(store_id);
CREATE INDEX idx_customers_phone ON customers(phone);

-- ============================================
-- AI TRACKING TABLE
-- ============================================

CREATE TABLE ai_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    feature VARCHAR(50) NOT NULL,
    model_used VARCHAR(100) NOT NULL,
    tokens_input INTEGER,
    tokens_output INTEGER,
    cost_usd DECIMAL(10,6),
    cached BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_usage_merchant ON ai_usage(merchant_id);
CREATE INDEX idx_ai_usage_created ON ai_usage(created_at);
```

### Partitioning Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                PARTITIONING STRATEGY                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PRODUCTS TABLE: HASH Partitioning                           │
│  ├── Partition key: store_id                                 │
│  ├── Why: Most queries filter by store_id                    │
│  ├── Start: 4 partitions                                     │
│  └── Scale: Add partitions as data grows                     │
│                                                              │
│  ORDERS TABLE: RANGE Partitioning                            │
│  ├── Partition key: created_at                               │
│  ├── Why: Time-based queries, data retention                 │
│  ├── Strategy: Monthly partitions                            │
│  └── Archive: Move old partitions to cold storage            │
│                                                              │
│  When to Shard (NOT YET):                                    │
│  ├── ❌ Don't shard until 100K+ active users                 │
│  ├── ✅ Use partitioning first                                │
│  ├── ✅ Add read replicas                                    │
│  ├── ✅ Use Redis caching                                    │
│  └── ✅ Optimize queries before sharding                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Load Balancing

### Load Balancing Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                LOAD BALANCING ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  LAYER 1: GLOBAL (Cloudflare)                                │
│  ├── Geographic routing                                      │
│  │   └── Pakistan → Asia-South1 (Mumbai)                     │
│  ├── DDoS protection                                         │
│  ├── SSL termination                                         │
│  ├── Static asset caching                                    │
│  └── Bandwidth: 10TB free/month                              │
│                                                              │
│  LAYER 2: APPLICATION (GCP Load Balancer)                    │
│  ├── Health checks (every 10 seconds)                        │
│  ├── Session affinity (sticky sessions for cart)             │
│  ├── Auto-scaling (1-10 instances)                           │
│  ├── SSL termination                                         │
│  └── Request routing                                         │
│                                                              │
│  LAYER 3: DATABASE                                            │
│  ├── Primary (write operations)                              │
│  ├── Read replica (read operations)                          │
│  ├── Connection pooling (PgBouncer)                          │
│  └── Redis for caching (90% reads from cache)                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Auto-Scaling Configuration

```yaml
# Cloud Run auto-scaling
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: api-service
spec:
  template:
    metadata:
      annotations:
        # Minimum instances (always running)
        autoscaling.knative.dev/minScale: "1"
        # Maximum instances (scale limit)
        autoscaling.knative.dev/maxScale: "10"
        # Scale up when CPU > 70%
        autoscaling.knative.dev/target: "70"
    spec:
      containers:
        - image: gcr.io/your-project/api
          resources:
            limits:
              memory: "512Mi"
              cpu: "1"
```

### Load Balancing Rules

```
┌─────────────────────────────────────────────────────────────┐
│                LOAD BALANCING RULES                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  REQUEST ROUTING:                                            │
│  ├── /api/* → Backend API service                            │
│  ├── /store/* → Customer storefront service                  │
│  ├── /admin/* → Merchant admin service                       │
│  └── /* → Static assets (CDN)                                │
│                                                              │
│  HEALTH CHECKS:                                              │
│  ├── Endpoint: /health                                       │
│  ├── Interval: 10 seconds                                    │
│  ├── Timeout: 5 seconds                                      │
│  ├── Healthy threshold: 2 consecutive                        │
│  └── Unhealthy threshold: 3 consecutive                      │
│                                                              │
│  STICKY SESSIONS:                                            │
│  ├── Cart data (temporary session)                           │
│  ├── Checkout flow                                           │
│  └── Session timeout: 30 minutes                             │
│                                                              │
│  RATE LIMITING:                                              │
│  ├── Global: 1000 requests/minute per IP                     │
│  ├── Per user: 100 requests/minute                           │
│  ├── API endpoints: 50 requests/minute                       │
│  └── AI endpoints: 10 requests/minute                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Scalability Design

### Scalability Phases

```
┌─────────────────────────────────────────────────────────────┐
│                SCALABILITY PHASES                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PHASE 1: MVP (0-1K Users)                                   │
│  ├── Infrastructure:                                         │
│  │   ├── Cloud Run: 1 instance ($50/month)                  │
│  │   ├── Cloud SQL: db-f1-micro ($15/month)                 │
│  │   ├── Redis: 1GB ($20/month)                             │
│  │   └── Storage: 10GB ($0.50)                              │
│  ├── Cost: $85/month                                        │
│  └── Supports: 1K users, 100 merchants                      │
│                                                              │
│  PHASE 2: GROWTH (1K-10K Users)                              │
│  ├── Infrastructure:                                         │
│  │   ├── Cloud Run: 2-5 instances ($200/month)              │
│  │   ├── Cloud SQL: db-g1-small ($50/month)                 │
│  │   ├── Redis: 5GB ($50/month)                             │
│  │   ├── Read replica ($50/month)                           │
│  │   └── Storage: 100GB ($5)                                │
│  ├── Cost: $355/month                                       │
│  └── Supports: 10K users, 1K merchants                      │
│                                                              │
│  PHASE 3: SCALE (10K-100K Users)                             │
│  ├── Infrastructure:                                         │
│  │   ├── Cloud Run: 5-10 instances ($500/month)             │
│  │   ├── Cloud SQL: db-standard-4 ($200/month)              │
│  │   ├── Redis: 20GB ($150/month)                           │
│  │   ├── Multiple read replicas ($150/month)                │
│  │   └── Storage: 1TB ($50)                                 │
│  ├── Cost: $1,050/month                                     │
│  └── Supports: 100K users, 10K merchants                    │
│                                                              │
│  PHASE 4: ENTERPRISE (100K-1M Users)                         │
│  ├── Infrastructure:                                         │
│  │   ├── GKE Cluster ($500/month)                           │
│  │   ├── Cloud SQL: db-standard-8 ($500/month)              │
│  │   ├── Redis Cluster ($300/month)                         │
│  │   ├── Multiple read replicas ($300/month)                │
│  │   └── Storage: 10TB ($500)                               │
│  ├── Cost: $2,100/month                                     │
│  └── Supports: 1M users, 100K merchants                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                PERFORMANCE OPTIMIZATION                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  DATABASE OPTIMIZATION:                                      │
│  ├── Connection pooling (PgBouncer)                          │
│  ├── Query optimization (EXPLAIN ANALYZE)                    │
│  ├── Index optimization                                      │
│  ├── Read replicas for read-heavy queries                    │
│  └── Materialized views for analytics                        │
│                                                              │
│  CACHING STRATEGY:                                           │
│  ├── Redis for session data (TTL: 30 min)                    │
│  ├── Redis for product data (TTL: 5 min)                     │
│  ├── Redis for AI responses (TTL: 24 hours)                  │
│  ├── CDN for static assets (TTL: 30 days)                    │
│  └── Browser cache for CSS/JS (TTL: 7 days)                 │
│                                                              │
│  API OPTIMIZATION:                                           │
│  ├── Pagination (cursor-based for mobile)                    │
│  ├── Field selection (only return needed fields)             │
│  ├── Compression (gzip/br)                                   │
│  ├── Response caching (ETags)                                │
│  └── Batch operations                                        │
│                                                              │
│  MOBILE OPTIMIZATION:                                        │
│  ├── Image compression (WebP format)                         │
│  ├── Lazy loading                                            │
│  ├── Offline support (Service Worker)                        │
│  ├── Background sync                                         │
│  └── Push notifications                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. App Monitoring & Observability

### Complete Monitoring Stack

```
┌─────────────────────────────────────────────────────────────┐
│                MONITORING ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ERROR TRACKING (Sentry)                                     │
│  ├── Free tier: 50K errors/month                             │
│  ├── Features:                                               │
│  │   ├── Stack traces                                        │
│  │   ├── User context (device, OS, app version)              │
│  │   ├── Breadcrumbs (user actions before error)             │
│  │   ├── Performance monitoring (tracing)                    │
│  │   ├── Session replay (see what user did)                  │
│  │   └── Alerts (email, Slack, webhook)                      │
│  └── Cost: Free                                              │
│                                                              │
│  ANALYTICS (Firebase Analytics)                              │
│  ├── Free tier: Unlimited                                    │
│  ├── Features:                                               │
│  │   ├── User behavior tracking                              │
│  │   ├── Conversion funnels                                  │
│  │   ├── Screen views                                        │
│  │   ├── Events (add_to_cart, purchase, etc.)                │
│  │   └── Custom events                                       │
│  └── Cost: Free                                              │
│                                                              │
│  PERFORMANCE MONITORING (Firebase Performance)               │
│  ├── Free tier: Unlimited                                    │
│  ├── Features:                                               │
│  │   ├── App startup time                                    │
│  │   ├── Screen rendering time                               │
│  │   ├── Network request latency                             │
│  │   └── Custom traces                                       │
│  └── Cost: Free                                              │
│                                                              │
│  INFRASTRUCTURE MONITORING (GCP Cloud Monitoring)            │
│  ├── Free tier: 50MB metrics/month                           │
│  ├── Features:                                               │
│  │   ├── CPU, memory, disk usage                             │
│  │   ├── Request count and latency                           │
│  │   ├── Error rates                                         │
│  │   └── Custom metrics                                      │
│  └── Cost: Free (under 50MB)                                 │
│                                                              │
│  UPTIME MONITORING (GCP Uptime Checks)                       │
│  ├── Free tier: 3 checks                                    │
│  ├── Features:                                               │
│  │   ├── HTTP/HTTPS checks                                   │
│  │   ├── TCP checks                                          │
│  │   ├── Global monitoring                                   │
│  │   └── Alerts                                              │
│  └── Cost: Free (3 checks)                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Sentry Integration

```typescript
// ============================================
// BACKEND: Node.js + NestJS
// ============================================

// src/sentry.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express(),
    new Sentry.Integrations.Postgres(),
  ],
});

// src/main.ts
import * as Sentry from "@sentry/node";
import "./sentry";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Sentry error handler (must be before other middleware)
  Sentry.setupErrorHandler(app);
  
  await app.listen(3000);
}
bootstrap();

// src/products/products.service.ts
import * as Sentry from "@sentry/node";

@Injectable()
export class ProductsService {
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const span = Sentry.startSpan({
      op: "product.create",
      name: "Create Product",
    });

    try {
      const product = await this.productRepository.create(createProductDto);
      
      // Track AI usage if AI-generated
      if (createProductDto.aiGenerated) {
        Sentry.setContext("ai", {
          feature: "product_generation",
          model: createProductDto.aiModel,
          tokens: createProductDto.aiTokens,
        });
      }
      
      return product;
    } catch (error) {
      Sentry.captureException(error);
      Sentry.setContext("product", {
        storeId: createProductDto.storeId,
        productName: createProductDto.name,
      });
      throw error;
    } finally {
      span?.end();
    }
  }
}

// ============================================
// FRONTEND: React Native
// ============================================

// src/sentry.ts
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: __DEV__ ? "development" : "production",
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 30000,
});

// App.tsx
import * as Sentry from "./sentry";

function App() {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <NavigationContainer>
        {/* Your app content */}
      </NavigationContainer>
    </Sentry.ErrorBoundary>
  );
}

// src/screens/ProductScreen.tsx
import * as Sentry from "@sentry/react-native";

const ProductScreen = () => {
  const handleAddToCart = async (product: Product) => {
    const span = Sentry.startSpan({
      op: "cart.add",
      name: "Add to Cart",
    });

    try {
      await cartService.add(product);
      Sentry.captureMessage("Product added to cart", "info");
    } catch (error) {
      Sentry.captureException(error);
      Sentry.setContext("cart", {
        productId: product.id,
        productName: product.name,
        price: product.price,
      });
    } finally {
      span?.end();
    }
  };

  return (
    <View>
      <Button title="Add to Cart" onPress={() => handleAddToCart(product)} />
    </View>
  );
};

// ============================================
// USER FEEDBACK COMPONENT
// ============================================

// src/components/FeedbackButton.tsx
import React, { useState } from "react";
import { TouchableOpacity, Text, Modal, TextInput, View } from "react-native";
import * as Sentry from "@sentry/react-native";

export const FeedbackButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"bug" | "feature" | "other">("bug");

  const handleSubmit = () => {
    Sentry.captureMessage(`User Feedback: ${message}`, "info");
    Sentry.setContext("feedback", {
      type,
      message,
      timestamp: new Date().toISOString(),
    });
    
    // Send to your backend
    api.post("/feedback", { type, message });
    
    setShowModal(false);
    setMessage("");
  };

  return (
    <>
      <TouchableOpacity onPress={() => setShowModal(true)}>
        <Text>Report Issue</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide">
        <View style={styles.container}>
          <Text>Report an Issue</Text>
          
          <View style={styles.typeSelector}>
            <TouchableOpacity onPress={() => setType("bug")}>
              <Text style={type === "bug" && styles.active}>Bug</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setType("feature")}>
              <Text style={type === "feature" && styles.active}>Feature</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setType("other")}>
              <Text style={type === "other" && styles.active}>Other</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            multiline
            placeholder="Describe the issue..."
            value={message}
            onChangeText={setMessage}
          />

          <View style={styles.buttons}>
            <Button title="Cancel" onPress={() => setShowModal(false)} />
            <Button title="Submit" onPress={handleSubmit} />
          </View>
        </View>
      </Modal>
    </>
  );
};
```

### What You'll See in Sentry

```
┌─────────────────────────────────────────────────────────────┐
│                SENTRY DASHBOARD                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ISSUES PAGE                                                 │
│  └── Shows all errors with:                                  │
│      ├── Stack trace (exact line of code)                    │
│      ├── User context (device, OS, app version)              │
│      ├── Breadcrumbs (what user did before error)            │
│      ├── Frequency (how often it occurs)                     │
│      └── Affected users (how many people impacted)           │
│                                                              │
│  PERFORMANCE PAGE                                            │
│  └── Shows:                                                  │
│      ├── API response times (p50, p95, p99)                  │
│      ├── Database query performance                          │
│      ├── AI API latency                                      │
│      └── Mobile app performance                              │
│                                                              │
│  ALERTS                                                      │
│  └── Configure:                                              │
│      ├── Error rate > 5% → Email + Slack                     │
│      ├── API latency p99 > 2s → Email                        │
│      └── Database connections > 80% → Slack                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Analytics Events to Track

```typescript
// src/analytics/events.ts

export const AnalyticsEvents = {
  // Store Events
  STORE_CREATED: "store_created",
  STORE_UPDATED: "store_updated",
  STORE_VIEWED: "store_viewed",
  
  // Product Events
  PRODUCT_ADDED: "product_added",
  PRODUCT_UPDATED: "product_updated",
  PRODUCT_VIEWED: "product_viewed",
  PRODUCT_ADDED_TO_CART: "product_added_to_cart",
  
  // Order Events
  ORDER_CREATED: "order_created",
  ORDER_PAID: "order_paid",
  ORDER_SHIPPED: "order_shipped",
  ORDER_DELIVERED: "order_delivered",
  
  // AI Events
  AI_STORE_CREATED: "ai_store_created",
  AI_PRODUCT_GENERATED: "ai_product_generated",
  AI_CONTENT_GENERATED: "ai_content_generated",
  AI_PRICE_SUGGESTED: "ai_price_suggested",
  
  // Marketing Events
  CAMPAIGN_CREATED: "campaign_created",
  CAMPAIGN_SENT: "campaign_sent",
  AD_GENERATED: "ad_generated",
  
  // User Events
  USER_SIGNED_UP: "user_signed_up",
  USER_SIGNED_IN: "user_signed_in",
  USER_UPGRADED: "user_upgraded",
};

// src/analytics/tracker.ts
import analytics from "@react-native-firebase/analytics";

export const trackEvent = async (
  eventName: string,
  params?: Record<string, any>
) => {
  try {
    await analytics().logEvent(eventName, params);
  } catch (error) {
    console.error("Analytics error:", error);
  }
};

// Usage
trackEvent(AnalyticsEvents.PRODUCT_ADDED_TO_CART, {
  product_id: product.id,
  product_name: product.name,
  price: product.price,
  store_id: store.id,
});
```

---

## 6. How to Start Building

### Development Setup

```
┌─────────────────────────────────────────────────────────────┐
│                DEVELOPMENT SETUP                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  IDE: VS Code (Free)                                         │
│  └── Download: https://code.visualstudio.com                 │
│                                                              │
│  VS Code Extensions (Install These):                         │
│  ├── ESLint (JavaScript linting)                             │
│  ├── Prettier (Code formatting)                              │
│  ├── GitLens (Git integration)                               │
│  ├── Thunder Client (API testing)                            │
│  ├── PostgreSQL (Database viewer)                            │
│  └── Docker (Container management)                           │
│                                                              │
│  Coding Agent: GitHub Copilot Free                           │
│  ├── 2,000 completions/month (free)                          │
│  ├── 50 chat messages/month (free)                           │
│  └── Install: VS Code Marketplace                            │
│                                                              │
│  Node.js: v20 LTS                                            │
│  └── Download: https://nodejs.org                            │
│                                                              │
│  Git: Latest version                                         │
│  └── Download: https://git-scm.com                           │
│                                                              │
│  Docker Desktop (Optional)                                   │
│  └── Download: https://docker.com                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Step-by-Step Setup

```bash
# ============================================
# STEP 1: Install Prerequisites
# ============================================

# Install Node.js (v20 LTS)
# Download from: https://nodejs.org

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x

# Install Git
# Download from: https://git-scm.com

# Verify installation
git --version

# ============================================
# STEP 2: Create Project Structure
# ============================================

# Create project folder
mkdir store-builder
cd store-builder

# Initialize Git
git init

# Create folder structure
mkdir -p backend frontend mobile shared

# ============================================
# STEP 3: Setup Backend (Node.js + NestJS)
# ============================================

cd backend

# Initialize NestJS project
npx @nestjs/cli new . --package-manager npm

# Install dependencies
npm install @nestjs/config @nestjs/jwt @nestjs/passport
npm install passport passport-jwt passport-local
npm install typeorm pg @nestjs/typeorm
npm install @sentry/node
npm install redis ioredis

# Start development server
npm run start:dev

# ============================================
# STEP 4: Setup Frontend (Next.js)
# ============================================

cd ../frontend

# Create Next.js app
npx create-next-app@latest . --typescript --tailwind --eslint

# Install dependencies
npm install @stripe/stripe-js axios react-query
npm install @sentry/nextjs

# Start development server
npm run dev

# ============================================
# STEP 5: Setup Mobile (React Native)
# ============================================

cd ../mobile

# Create Expo app
npx create-expo-app . --template blank-typescript

# Install dependencies
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install @react-native-firebase/app @react-native-firebase/analytics
npm install @sentry/react-native
npm install axios react-query

# Start Expo
npx expo start

# ============================================
# STEP 6: Setup Database
# ============================================

# Install PostgreSQL locally (for development)
# Download: https://www.postgresql.org/download/

# Create database
psql -U postgres
CREATE DATABASE storebuilder;
CREATE USER storeuser WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE storebuilder TO storeuser;
\q

# Run migrations
cd backend
npm run typeorm migration:run

# ============================================
# STEP 7: Setup Redis (for caching)
# ============================================

# Install Redis (for development)
# Windows: https://github.com/microsoftarchive/redis/releases
# Mac: brew install redis
# Linux: sudo apt-get install redis-server

# Start Redis
redis-server

# Test connection
redis-cli ping
# Should return: PONG

# ============================================
# STEP 8: Create Environment Files
# ============================================

# Backend .env
cat > backend/.env << EOF
# Database
DATABASE_URL=postgresql://storeuser:password@localhost:5432/storebuilder

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=15m

# Sentry
SENTRY_DSN=https://your-dsn@sentry.io/project-id

# AI APIs
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# GCP
GCP_PROJECT_ID=your-project-id
EOF

# Frontend .env.local
cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
EOF

# Mobile .env
cat > mobile/.env << EOF
API_URL=http://localhost:3001
SENTRY_DSN=https://your-dsn@sentry.io/project-id
EOF

# ============================================
# STEP 9: Start Development
# ============================================

# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Mobile
cd mobile
npx expo start

# ============================================
# STEP 10: Test Everything
# ============================================

# Test backend API
curl http://localhost:3001/health

# Test frontend
open http://localhost:3000

# Test mobile
# Scan QR code with Expo Go app
```

### Git Repository Setup

```bash
# ============================================
# GIT SETUP
# ============================================

# Create GitHub repository
# Go to: https://github.com/new
# Name: store-builder
# Initialize with README: No

# Connect local to GitHub
git remote add origin https://github.com/yourusername/store-builder.git

# Create .gitignore
cat > .gitignore << EOF
# Dependencies
node_modules/
.pnp
.pnp.js

# Build
dist/
build/
.next/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Coverage
coverage/

# Expo
.expo/
dist/
EOF

# Initial commit
git add .
git commit -m "Initial commit: Project setup"
git branch -M main
git push -u origin main
```

---

## 7. Cost in PKR

### Development Costs

```
┌─────────────────────────────────────────────────────────────┐
│                DEVELOPMENT COSTS (PKR)                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  TOOLS (One-time)                                            │
│  ├── VS Code                                                 │
│  │   └── Cost: Free (PKR 0)                                  │
│  ├── GitHub Copilot Free                                     │
│  │   └── Cost: Free (PKR 0)                                  │
│  ├── Node.js                                                 │
│  │   └── Cost: Free (PKR 0)                                  │
│  ├── PostgreSQL                                              │
│  │   └── Cost: Free (PKR 0)                                  │
│  └── Redis                                                   │
│      └── Cost: Free (PKR 0)                                  │
│                                                              │
│  TOTAL SETUP COST: PKR 0                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Monthly Infrastructure Costs (PKR)

```
┌─────────────────────────────────────────────────────────────┐
│                MONTHLY COSTS (PKR)                           │
│                Exchange Rate: 1 USD = 280 PKR               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PHASE 1: MVP (0-1K Users)                                   │
│  ├── Cloud Run: $50 = PKR 14,000                            │
│  ├── Cloud SQL: $15 = PKR 4,200                             │
│  ├── Redis: $20 = PKR 5,600                                 │
│  ├── Storage: $1 = PKR 280                                  │
│  ├── CDN: Free                                               │
│  ├── Error Tracking: Free                                    │
│  └── Analytics: Free                                         │
│  TOTAL: $86 = PKR 24,080/month                              │
│                                                              │
│  PHASE 2: GROWTH (1K-10K Users)                              │
│  ├── Cloud Run: $200 = PKR 56,000                           │
│  ├── Cloud SQL: $50 = PKR 14,000                            │
│  ├── Redis: $50 = PKR 14,000                                │
│  ├── Read Replica: $50 = PKR 14,000                         │
│  ├── Storage: $5 = PKR 1,400                                │
│  ├── CDN: Free                                               │
│  ├── Error Tracking: Free                                    │
│  └── Analytics: Free                                         │
│  TOTAL: $355 = PKR 99,400/month                             │
│                                                              │
│  PHASE 3: SCALE (10K-100K Users)                             │
│  ├── Cloud Run: $500 = PKR 140,000                          │
│  ├── Cloud SQL: $200 = PKR 56,000                           │
│  ├── Redis: $150 = PKR 42,000                               │
│  ├── Read Replicas: $150 = PKR 42,000                       │
│  ├── Storage: $50 = PKR 14,000                              │
│  ├── CDN: Free                                               │
│  ├── Error Tracking: Free                                    │
│  └── Analytics: Free                                         │
│  TOTAL: $1,050 = PKR 294,000/month                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Revenue Needed (PKR)

```
┌─────────────────────────────────────────────────────────────┐
│                REVENUE TARGETS (PKR)                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PRICING (PKR)                                               │
│  ├── Free Plan: PKR 0                                       │
│  ├── Starter Plan: PKR 2,800/month ($10)                    │
│  └── Business Plan: PKR 7,000/month ($25)                   │
│                                                              │
│  BREAK-EVEN ANALYSIS                                         │
│  ├── Phase 1 Cost: PKR 24,080/month                         │
│  ├── Merchants Needed: 10 Starter (PKR 28,000)              │
│  └── Break-even: 10 merchants                               │
│                                                              │
│  PROFITABLE (Phase 2)                                        │
│  ├── Cost: PKR 99,400/month                                 │
│  ├── Merchants Needed: 35 Starter (PKR 98,000)              │
│  └── Target: 35 merchants                                   │
│                                                              │
│  SCALING (Phase 3)                                           │
│  ├── Cost: PKR 294,000/month                                │
│  ├── Merchants Needed: 105 Starter (PKR 294,000)            │
│  └── Target: 105 merchants                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. CDN & Networking

### CDN Architecture (Cloudflare)

```
┌─────────────────────────────────────────────────────────────┐
│                CDN ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  CLOUDFLARE FREE TIER                                        │
│  ├── Bandwidth: 10TB/month (free)                            │
│  ├── DDoS Protection: Unlimited (free)                       │
│  ├── SSL/TLS: Automatic (free)                               │
│  ├── Global Network: 200+ PoPs                               │
│  └── Cost: Free                                              │
│                                                              │
│  WHAT TO CACHE:                                              │
│  ├── Product images → Cache 30 days                          │
│  ├── Store logos → Cache 7 days                              │
│  ├── Static pages → Cache 1 hour                             │
│  ├── CSS/JS files → Cache 7 days                             │
│  └── Fonts → Cache 30 days                                   │
│                                                              │
│  WHAT NOT TO CACHE:                                          │
│  ├── User sessions                                           │
│  ├── Cart data                                               │
│  ├── Order data                                              │
│  ├── Payment endpoints                                       │
│  └── API responses (except public data)                      │
│                                                              │
│  CLOUDFLARE SETUP:                                           │
│  1. Sign up: https://cloudflare.com                          │
│  2. Add your domain                                          │
│  3. Update nameservers at registrar                          │
│  4. Enable SSL/TLS (Full)                                    │
│  5. Enable caching (Standard)                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Network Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                NETWORK ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  MOBILE APP (Pakistan)                                       │
│    │                                                         │
│    ├── 4G/5G Connection                                      │
│    └── Latency: 20-50ms to ISP                               │
│    │                                                         │
│    ▼                                                         │
│  CLOUDFLARE EDGE (Pakistan/India)                            │
│    │                                                         │
│    ├── SSL Termination                                       │
│    ├── DDoS Protection                                       │
│    ├── Rate Limiting                                         │
│    ├── Caching (static assets)                               │
│    └── Latency: 5-15ms                                       │
│    │                                                         │
│    ▼                                                         │
│  GCP LOAD BALANCER (Asia-South1 - Mumbai)                    │
│    │                                                         │
│    ├── Health Checks                                         │
│    ├── Session Affinity                                      │
│    ├── Auto-scaling                                          │
│    └── Latency: 10-20ms                                      │
│    │                                                         │
│    ▼                                                         │
│  CLOUD RUN / GKE (Asia-South1)                               │
│    │                                                         │
│    ├── Backend API                                           │
│    ├── AI Service                                            │
│    ├── Microservices                                         │
│    └── Latency: 5-10ms                                       │
│    │                                                         │
│    ▼                                                         │
│  CLOUD SQL (Asia-South1)                                     │
│    │                                                         │
│    ├── PostgreSQL Primary (Write)                             │
│    ├── Read Replica (Read)                                   │
│    └── Latency: 2-5ms                                        │
│                                                              │
│  TOTAL LATENCY: 50-100ms (Pakistan to Mumbai)                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Communication Protocols & API Design

### API Design Principles

```
┌─────────────────────────────────────────────────────────────┐
│                API DESIGN PRINCIPLES                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  RESTful API Design                                          │
│  ├── Resource-based URLs                                     │
│  │   ├── GET /api/stores                                    │
│  │   ├── GET /api/stores/:id                                │
│  │   ├── POST /api/stores                                   │
│  │   ├── PUT /api/stores/:id                                │
│  │   └── DELETE /api/stores/:id                             │
│  │                                                           │
│  ├── HTTP Methods                                            │
│  │   ├── GET: Retrieve data                                 │
│  │   ├── POST: Create new resource                          │
│  │   ├── PUT: Update existing resource                      │
│  │   ├── PATCH: Partial update                              │
│  │   └── DELETE: Remove resource                            │
│  │                                                           │
│  ├── Status Codes                                            │
│  │   ├── 200: Success                                       │
│  │   ├── 201: Created                                       │
│  │   ├── 400: Bad Request                                   │
│  │   ├── 401: Unauthorized                                  │
│  │   ├── 403: Forbidden                                     │
│  │   ├── 404: Not Found                                     │
│  │   ├── 429: Too Many Requests                             │
│  │   └── 500: Server Error                                  │
│  │                                                           │
│  └── JSON Responses                                          │
│      ├── Consistent format                                   │
│      ├── Error objects                                       │
│      └── Metadata (pagination, request_id)                   │
│                                                              │
│  Communication Protocols                                     │
│  ├── HTTPS (TLS 1.3): All API calls                         │
│  ├── WebSocket: Real-time updates                            │
│  │   ├── Order status updates                                │
│  │   ├── Inventory changes                                   │
│  │   └── Notifications                                       │
│  ├── gRPC: Internal service communication                    │
│  │   ├── Service-to-service calls                            │
│  │   └── High-performance, low latency                       │
│  └── REST: External API                                      │
│      ├── Mobile app communication                            │
│      └── Third-party integrations                            │
│                                                              │
│  API Versioning                                              │
│  ├── URL versioning: /v1/stores, /v2/stores                 │
│  ├── Header versioning: Accept: application/vnd.api.v2+json │
│  └── Deprecation: 6 months notice before removal             │
│                                                              │
│  Rate Limiting                                               │
│  ├── Global: 1000 requests/minute per IP                     │
│  ├── Per user: 100 requests/minute                           │
│  ├── API endpoints: 50 requests/minute                       │
│  └── AI endpoints: 10 requests/minute                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### API Response Format

```typescript
// ============================================
// SUCCESS RESPONSE
// ============================================

// Single item
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Product Name",
    "price": 999.99,
    "createdAt": "2026-07-08T10:00:00Z"
  },
  "meta": {
    "requestId": "req_abc123"
  }
}

// List with pagination
{
  "success": true,
  "data": [...],
  "meta": {
    "requestId": "req_abc123",
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "hasNext": true,
      "cursor": "eyJpZCI6MTAwfQ=="
    }
  }
}

// ============================================
// ERROR RESPONSE
// ============================================

{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with ID 123 not found",
    "details": {
      "productId": "123"
    }
  },
  "meta": {
    "requestId": "req_abc123"
  }
}

// Validation error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "fields": [
        {
          "field": "name",
          "message": "Name is required"
        },
        {
          "field": "price",
          "message": "Price must be positive"
        }
      ]
    }
  },
  "meta": {
    "requestId": "req_abc123"
  }
}
```

### WebSocket Events

```typescript
// ============================================
// WEBSOCKET EVENTS
// ============================================

// Server → Client Events
export const ServerEvents = {
  // Order Events
  ORDER_CREATED: "order:created",
  ORDER_UPDATED: "order:updated",
  ORDER_SHIPPED: "order:shipped",
  ORDER_DELIVERED: "order:delivered",
  
  // Inventory Events
  INVENTORY_LOW: "inventory:low",
  INVENTORY_OUT: "inventory:out",
  
  // Notification Events
  NOTIFICATION_NEW: "notification:new",
  
  // Store Events
  STORE_UPDATED: "store:updated",
};

// Client → Server Events
export const ClientEvents = {
  // Subscribe to store updates
  SUBSCRIBE_STORE: "subscribe:store",
  UNSUBSCRIBE_STORE: "unsubscribe:store",
  
  // Subscribe to order updates
  SUBSCRIBE_ORDER: "subscribe:order",
  UNSUBSCRIBE_ORDER: "unsubscribe:order",
};

// ============================================
// WEBSOCKET IMPLEMENTATION
// ============================================

// Backend (NestJS)
@WebSocketGateway({ cors: true })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("subscribe:store")
  handleSubscribeStore(client: Socket, storeId: string) {
    client.join(`store:${storeId}`);
  }

  @SubscribeMessage("subscribe:order")
  handleSubscribeOrder(client: Socket, orderId: string) {
    client.join(`order:${orderId}`);
  }

  // Emit order update
  emitOrderUpdate(orderId: string, data: any) {
    this.server.to(`order:${orderId}`).emit("order:updated", data);
  }

  // Emit inventory alert
  emitInventoryAlert(storeId: string, data: any) {
    this.server.to(`store:${storeId}`).emit("inventory:low", data);
  }
}

// Frontend (React Native)
import { io } from "socket.io-client";

const socket = io(API_URL, {
  auth: {
    token: userToken,
  },
});

// Subscribe to store updates
socket.emit("subscribe:store", storeId);

// Listen for order updates
socket.on("order:updated", (data) => {
  // Update UI
  updateOrderStatus(data);
});

// Listen for inventory alerts
socket.on("inventory:low", (data) => {
  // Show notification
  showNotification(`Low stock: ${data.productName}`);
});
```

---

## Summary: Complete Setup Checklist

```
┌─────────────────────────────────────────────────────────────┐
│                COMPLETE SETUP CHECKLIST                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  DEVELOPMENT TOOLS (Free)                                    │
│  ├── [ ] VS Code installed                                   │
│  ├── [ ] Node.js v20 installed                               │
│  ├── [ ] Git installed                                       │
│  ├── [ ] VS Code extensions installed                        │
│  ├── [ ] GitHub Copilot Free enabled                         │
│  └── [ ] PostgreSQL installed (local)                        │
│                                                              │
│  PROJECT SETUP                                               │
│  ├── [ ] Backend (NestJS) created                            │
│  ├── [ ] Frontend (Next.js) created                          │
│  ├── [ ] Mobile (React Native/Expo) created                  │
│  ├── [ ] Database schema created                             │
│  ├── [ ] Git repository initialized                          │
│  └── [ ] Environment files created                           │
│                                                              │
│  CLOUD ACCOUNTS (Free tier)                                  │
│  ├── [ ] Google Cloud Platform ($300 free credit)            │
│  ├── [ ] Cloudflare (free CDN)                               │
│  ├── [ ] Sentry (free error tracking)                        │
│  ├── [ ] Firebase (free analytics)                           │
│  └── [ ] GitHub (free repository)                            │
│                                                              │
│  MONITORING SETUP                                            │
│  ├── [ ] Sentry error tracking configured                    │
│  ├── [ ] Firebase analytics configured                       │
│  ├── [ ] Cloud Monitoring dashboards created                 │
│  ├── [ ] Uptime checks configured                            │
│  └── [ ] Alert rules configured                              │
│                                                              │
│  COST SUMMARY                                                │
│  ├── Development: PKR 0/month                                │
│  ├── Infrastructure (MVP): PKR 24,080/month                  │
│  ├── Total to start: PKR 0                                  │
│  └── Break-even: 10 merchants at PKR 2,800/month            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

**Document End**

*This guide covers everything you need to know about building a production-ready AI-powered mobile-first store builder, from fundamental design to deployment, monitoring, and cost analysis in PKR.*
