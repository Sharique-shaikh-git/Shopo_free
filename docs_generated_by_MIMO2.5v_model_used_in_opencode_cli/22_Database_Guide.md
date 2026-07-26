# Document 22: Database Guide
## Digital Dukaan - Complete PostgreSQL Guide

**Date:** July 8, 2026  
**Status:** AUTHORITATIVE - Use this for all database decisions  
**Purpose:** Complete schema, RLS, partitioning, lifecycle, migrations

---

## 1. DATABASE CHOICE

```
┌─────────────────────────────────────────────────────────────┐
│                WHY POSTGRESQL                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  REASONS:                                                    │
│  ├── ACID compliance (data never corrupted)                  │
│  ├── JSONB support (flexible data)                           │
│  ├── Full-text search (no Elasticsearch needed)              │
│  ├── Row-Level Security (multi-tenant isolation)             │
│  ├── Partitioning (scale to billions of rows)                │
│  ├── Mature, battle-tested                                   │
│  └── Free tier available on GCP Cloud SQL                    │
│                                                              │
│  MANAGED SERVICE:                                            │
│  └── GCP Cloud SQL (PostgreSQL 15)                           │
│      ├── Automated backups                                   │
│      ├── High availability                                   │
│      ├── Auto-scaling storage                                │
│      └── Monitoring & alerts                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. COMPLETE SCHEMA

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
  plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'business')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_merchants_phone ON merchants(phone);

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
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deleted')),
  plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'business')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_stores_merchant_id ON stores(merchant_id);

-- ============================================
-- PRODUCTS TABLE (Partitioned by store_id)
-- ============================================
CREATE TABLE products (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL,
  title VARCHAR(300),
  description TEXT,
  price DECIMAL(10,2),
  compare_at_price DECIMAL(10,2),
  sku VARCHAR(100),
  stock_quantity INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  ai_generated BOOLEAN DEFAULT FALSE,
  category VARCHAR(100),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id, store_id)
) PARTITION BY HASH (store_id);

-- Create 4 partitions (start here, add more later)
CREATE TABLE products_p0 PARTITION OF products FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE products_p1 PARTITION OF products FOR VALUES WITH (MODULUS 4, REMAINDER 1);
CREATE TABLE products_p2 PARTITION OF products FOR VALUES WITH (MODULUS 4, REMAINDER 2);
CREATE TABLE products_p3 PARTITION OF products FOR VALUES WITH (MODULUS 4, REMAINDER 3);

-- Indexes on partitioned table (must include partition key)
CREATE INDEX idx_products_store_id_status ON products(store_id, status);
CREATE INDEX idx_products_store_id_created ON products(store_id, created_at DESC);
CREATE INDEX idx_products_search ON products USING gin(
  to_tsvector('english', title || ' ' || COALESCE(description, ''))
);

-- ============================================
-- PRODUCT IMAGES TABLE
-- ============================================
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  store_id UUID NOT NULL,  -- Denormalized for partition pruning
  url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(300),
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_store_id ON product_images(store_id);

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL,
  name VARCHAR(100) NOT NULL,
  parent_id UUID REFERENCES categories(id),
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_categories_store_id ON categories(store_id);

-- ============================================
-- ORDERS TABLE (Partitioned by created_at)
-- ============================================
CREATE TABLE orders (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL,
  customer_id UUID,
  order_number SERIAL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'packed', 'shipped', 'delivered', 'cancelled')),
  subtotal DECIMAL(10,2),
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2),
  payment_method VARCHAR(50) DEFAULT 'cod' CHECK (payment_method IN ('cod', 'jazzcash', 'easypaisa', 'stripe', 'paypal')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  shipping_address JSONB,
  billing_address JSONB,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id, store_id, created_at)
) PARTITION BY RANGE (created_at);

-- Create monthly partitions (example for 2026)
CREATE TABLE orders_2026_01 PARTITION OF orders FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE orders_2026_02 PARTITION OF orders FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE orders_2026_03 PARTITION OF orders FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
CREATE TABLE orders_2026_04 PARTITION OF orders FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
CREATE TABLE orders_2026_05 PARTITION OF orders FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
CREATE TABLE orders_2026_06 PARTITION OF orders FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
CREATE TABLE orders_2026_07 PARTITION OF orders FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
CREATE TABLE orders_2026_08 PARTITION OF orders FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
CREATE TABLE orders_2026_09 PARTITION OF orders FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
CREATE TABLE orders_2026_10 PARTITION OF orders FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
CREATE TABLE orders_2026_11 PARTITION OF orders FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
CREATE TABLE orders_2026_12 PARTITION OF orders FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');

-- Indexes on partitioned table
CREATE INDEX idx_orders_store_id_status ON orders(store_id, status);
CREATE INDEX idx_orders_store_id_created ON orders(store_id, created_at DESC);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  store_id UUID NOT NULL,  -- Denormalized for tenant scoping
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_store_id ON order_items(store_id);

-- ============================================
-- CUSTOMERS TABLE
-- ============================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL,
  name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(200),
  address JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_customers_store_id ON customers(store_id);
CREATE INDEX idx_customers_phone ON customers(store_id, phone);

-- ============================================
-- AI JOBS TABLE
-- ============================================
CREATE TABLE ai_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL,
  merchant_id UUID NOT NULL,
  product_id UUID,
  job_type VARCHAR(50) NOT NULL,
  input_refs JSONB,
  output JSONB,
  state VARCHAR(20) DEFAULT 'queued' CHECK (state IN ('queued', 'running', 'completed', 'failed', 'rejected')),
  error_code VARCHAR(100),
  error_message TEXT,
  dedupe_key VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_ai_jobs_store_id_state ON ai_jobs(store_id, state);
CREATE INDEX idx_ai_jobs_merchant_id ON ai_jobs(merchant_id);
CREATE INDEX idx_ai_jobs_dedupe_key ON ai_jobs(dedupe_key);
CREATE INDEX idx_ai_jobs_created_at ON ai_jobs(created_at DESC);

-- ============================================
-- AI USAGE TABLE (Cost tracking)
-- ============================================
CREATE TABLE ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL,
  store_id UUID NOT NULL,
  feature VARCHAR(50),
  model_used VARCHAR(50),
  tokens_input INTEGER,
  tokens_output INTEGER,
  cost_usd DECIMAL(10,6),
  cached BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_usage_merchant_id ON ai_usage(merchant_id);
CREATE INDEX idx_ai_usage_store_id ON ai_usage(store_id);
CREATE INDEX idx_ai_usage_created_at ON ai_usage(created_at DESC);

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
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_merchant_id ON audit_logs(merchant_id);
CREATE INDEX idx_audit_logs_store_id ON audit_logs(store_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================
-- CUSTOM DOMAINS TABLE
-- ============================================
CREATE TABLE custom_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  domain VARCHAR(200) UNIQUE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(100) DEFAULT gen_random_uuid()::text,
  ssl_status VARCHAR(20) DEFAULT 'pending' CHECK (ssl_status IN ('pending', 'active', 'expired')),
  created_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP
);

CREATE INDEX idx_custom_domains_domain ON custom_domains(domain);
CREATE INDEX idx_custom_domains_store_id ON custom_domains(store_id);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id),
  plan VARCHAR(20) NOT NULL CHECK (plan IN ('starter', 'business')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  payment_provider VARCHAR(20) CHECK (payment_provider IN ('google_play', 'apple_iap')),
  external_subscription_id VARCHAR(200),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_merchant_id ON subscriptions(merchant_id);
```

---

## 3. ROW-LEVEL SECURITY (RLS)

### Enable RLS

```sql
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
```

### RLS Policies

```sql
-- ============================================
-- STORES
-- ============================================
CREATE POLICY stores_merchant_isolation ON stores
  FOR ALL
  USING (merchant_id = current_setting('app.merchant_id')::UUID);

-- ============================================
-- PRODUCTS
-- ============================================
-- Merchant access
CREATE POLICY products_merchant_isolation ON products
  FOR ALL
  USING (store_id IN (
    SELECT id FROM stores WHERE merchant_id = current_setting('app.merchant_id')::UUID
  ));

-- Customer read access (storefront)
CREATE POLICY products_customer_read ON products
  FOR SELECT
  USING (
    store_id = current_setting('app.store_id')::UUID
    AND status = 'active'
  );

-- ============================================
-- PRODUCT IMAGES
-- ============================================
CREATE POLICY product_images_merchant_isolation ON product_images
  FOR ALL
  USING (store_id IN (
    SELECT id FROM stores WHERE merchant_id = current_setting('app.merchant_id')::UUID
  ));

CREATE POLICY product_images_customer_read ON product_images
  FOR SELECT
  USING (store_id = current_setting('app.store_id')::UUID);

-- ============================================
-- CATEGORIES
-- ============================================
CREATE POLICY categories_merchant_isolation ON categories
  FOR ALL
  USING (store_id IN (
    SELECT id FROM stores WHERE merchant_id = current_setting('app.merchant_id')::UUID
  ));

CREATE POLICY categories_customer_read ON categories
  FOR SELECT
  USING (store_id = current_setting('app.store_id')::UUID);

-- ============================================
-- ORDERS
-- ============================================
CREATE POLICY orders_merchant_isolation ON orders
  FOR ALL
  USING (store_id IN (
    SELECT id FROM stores WHERE merchant_id = current_setting('app.merchant_id')::UUID
  ));

CREATE POLICY orders_customer_read ON orders
  FOR SELECT
  USING (store_id = current_setting('app.store_id')::UUID);

-- ============================================
-- ORDER ITEMS
-- ============================================
CREATE POLICY order_items_merchant_isolation ON order_items
  FOR ALL
  USING (store_id IN (
    SELECT id FROM stores WHERE merchant_id = current_setting('app.merchant_id')::UUID
  ));

CREATE POLICY order_items_customer_read ON order_items
  FOR SELECT
  USING (store_id = current_setting('app.store_id')::UUID);

-- ============================================
-- CUSTOMERS
-- ============================================
CREATE POLICY customers_merchant_isolation ON customers
  FOR ALL
  USING (store_id IN (
    SELECT id FROM stores WHERE merchant_id = current_setting('app.merchant_id')::UUID
  ));

-- ============================================
-- AI JOBS
-- ============================================
CREATE POLICY ai_jobs_merchant_isolation ON ai_jobs
  FOR ALL
  USING (merchant_id = current_setting('app.merchant_id')::UUID);

-- ============================================
-- AI USAGE
-- ============================================
CREATE POLICY ai_usage_merchant_isolation ON ai_usage
  FOR ALL
  USING (merchant_id = current_setting('app.merchant_id')::UUID);

-- ============================================
-- AUDIT LOGS
-- ============================================
CREATE POLICY audit_logs_merchant_isolation ON audit_logs
  FOR ALL
  USING (merchant_id = current_setting('app.merchant_id')::UUID);
```

### Set Tenant Context (Middleware)

```typescript
async function setTenantContext(merchantId?: string, storeId?: string): Promise<void> {
  if (merchantId) {
    await db.query(`SET LOCAL app.merchant_id = '${merchantId}'`);
  }
  if (storeId) {
    await db.query(`SET LOCAL app.store_id = '${storeId}'`);
  }
}
```

---

## 4. PARTITIONING

### Products (Hash by store_id)

```sql
-- Start with 4 partitions
-- When to add more: when avg products per partition > 1 million
CREATE TABLE products (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL,
  -- ... other columns
  PRIMARY KEY (id, store_id)
) PARTITION BY HASH (store_id);

-- Add more partitions when needed
CREATE TABLE products_p4 PARTITION OF products FOR VALUES WITH (MODULUS 8, REMAINDER 4);
CREATE TABLE products_p5 PARTITION OF products FOR VALUES WITH (MODULUS 8, REMAINDER 5);
CREATE TABLE products_p6 PARTITION OF products FOR VALUES WITH (MODULUS 8, REMAINDER 6);
CREATE TABLE products_p7 PARTITION OF products FOR VALUES WITH (MODULUS 8, REMAINDER 7);
```

### Orders (Range by created_at, monthly)

```sql
-- Create monthly partitions
-- Create new partition each month (automate with cron job)
CREATE TABLE orders_2026_01 PARTITION OF orders FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE orders_2026_02 PARTITION OF orders FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
-- ... etc

-- Automate: Create next month's partition on 25th of each month
CREATE OR REPLACE FUNCTION create_next_month_partition()
RETURNS void AS $$
DECLARE
  next_month DATE;
  partition_name TEXT;
BEGIN
  next_month := DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month');
  partition_name := 'orders_' || TO_CHAR(next_month, 'YYYY_MM');
  
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS %I PARTITION OF orders FOR VALUES FROM (%L) TO (%L)',
    partition_name,
    next_month,
    next_month + INTERVAL '1 month'
  );
END;
$$ LANGUAGE plpgsql;

-- Run on 25th of each month
SELECT cron.schedule('create-partition', '0 0 25 * *', 'SELECT create_next_month_partition()');
```

---

## 5. MIGRATIONS

### Migration Structure

```
migrations/
├── 001_initial_schema.sql
├── 002_add_ai_tables.sql
├── 003_add_custom_domains.sql
└── 004_add_rls_policies.sql
```

### Migration Script

```typescript
// migrations/run.ts
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigrations() {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get list of applied migrations
    const { rows } = await client.query(
      'SELECT name FROM migrations ORDER BY name'
    );
    const applied = new Set(rows.map(r => r.name));
    
    // Get migration files
    const migrationsDir = join(__dirname, 'sql');
    const files = readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    // Apply pending migrations
    for (const file of files) {
      if (!applied.has(file)) {
        console.log(`Applying migration: ${file}`);
        const sql = readFileSync(join(migrationsDir, file), 'utf8');
        await client.query(sql);
        await client.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [file]
        );
      }
    }
    
    await client.query('COMMIT');
    console.log('All migrations applied successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

---

## 6. BACKUP & RECOVERY

### Backup Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                BACKUP STRATEGY                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  AUTOMATED BACKUPS (GCP Cloud SQL):                         │
│  ├── Daily backups (retained 7 days)                        │
│  ├── Point-in-time recovery (PITR)                          │
│  └── Cross-region replication (production)                  │
│                                                              │
│  MANUAL BACKUPS:                                             │
│  ├── Before major migrations                                │
│  ├── Weekly full export                                     │
│  └── Store in GCP Cloud Storage (coldline)                  │
│                                                              │
│  RESTORE PROCEDURE:                                          │
│  1. Stop application traffic                                │
│  2. Restore from backup (GCP Console or gcloud)             │
│  3. Verify data integrity                                   │
│  4. Re-enable traffic                                       │
│                                                              │
│  RTO: 1 hour (Recovery Time Objective)                      │
│  RPO: 5 minutes (Recovery Point Objective - PITR)           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Export Command

```bash
# Full export
gcloud sql export sql digitaldukaan-db \
  gs://digitaldukaan-backups/full-$(date +%Y%m%d).sql.gz

# Point-in-time restore
gcloud sql instances restore-pitr digitaldukaan-db \
  --restore-time=2026-07-08T12:00:00Z
```

---

## 7. SCALING

### When to Scale

| Metric | Action |
|--------|--------|
| Products per partition > 1M | Add more hash partitions |
| Orders per month > 10M | Add more monthly partitions |
| Read latency > 100ms | Add read replica |
| Write latency > 50ms | Upgrade Cloud SQL tier |
| Connection count > 100 | Add PgBouncer |

### Read Replicas

```sql
-- Create read replica (GCP Console)
-- Use for:
-- - Storefront read queries
-- - Analytics queries
-- - Report generation

-- In application:
const readDb = Pool({ host: 'replica-ip', ... });
const writeDb = Pool({ host: 'primary-ip', ... });

// Read operations use readDb
// Write operations use writeDb
```

### Connection Pooling (PgBouncer)

```yaml
# pgbouncer.ini
[databases]
digitaldukaan = host=127.0.0.1 port=5432 dbname=digitaldukaan

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
default_pool_size = 20
max_client_conn = 100
```

---

## 8. MONITORING

### Key Metrics

```sql
-- Slow queries
SELECT query, mean_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Table sizes
SELECT relname, pg_size_pretty(pg_total_relation_size(relid))
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;

-- Index usage
SELECT indexrelname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Connection count
SELECT count(*) FROM pg_stat_activity;
```

### GCP Monitoring

```
Dashboard Metrics:
- Cloud SQL: CPU utilization, memory, connections
- Cloud Run: Request count, latency, error rate
- Redis: Memory usage, hit rate, evictions
- Cloud Storage: Request count, bandwidth
```

---

## 9. PRODUCTION CHECKLIST

```
Database setup checklist:

- [ ] Cloud SQL instance created (asia-south1)
- [ ] PostgreSQL 15 enabled
- [ ] Automated backups enabled (daily)
- [ ] PITR enabled (5-minute retention)
- [ ] SSL connections required
- [ ] IP whitelist configured
- [ ] All tables created with correct schema
- [ ] All indexes created
- [ ] Partitions created (products: 4, orders: monthly)
- [ ] RLS enabled on all tenant tables
- [ ] RLS policies created
- [ ] Migration system set up
- [ ] Backup export scheduled
- [ ] Monitoring alerts configured
- [ ] Connection pooling configured (PgBouncer)
- [ ] Read replica created (if needed)
```

---

**END OF DATABASE GUIDE DOCUMENT**
