# Technical Specifications
## AI-Powered Mobile-First Store Builder for Pakistan

**Document Version:** 1.0  
**Date:** July 8, 2026  
**Status:** Complete  

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                SYSTEM ARCHITECTURE                           │
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
│  │  (Database)  │  │   (Cache)    │  │   Storage    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Mobile** | React Native | Cross-platform (Android/iOS) |
| **Backend** | Node.js + Express | API server |
| **Database** | PostgreSQL | Primary database |
| **Cache** | Redis | Sessions, caching |
| **AI** | OpenAI / Claude API | Product analysis, content generation |
| **Storage** | Google Cloud Storage | Images, files |
| **Payments** | JazzCash, EasyPaisa, COD | Local payment methods |
| **Messaging** | WhatsApp (Baileys) | Customer communication |
| **Auth** | Firebase Auth | Phone OTP verification |
| **Hosting** | Google Cloud Run | Serverless deployment |

---

## 3. Database Schema

### Core Tables

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100),
    language VARCHAR(10) DEFAULT 'ur',
    role VARCHAR(20) DEFAULT 'merchant',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Shops table
CREATE TABLE shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    banner_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active',
    plan VARCHAR(20) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES shops(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id UUID,
    image_url VARCHAR(500),
    stock INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES shops(id),
    name VARCHAR(100) NOT NULL,
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES shops(id),
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    customer_address TEXT,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(20),
    payment_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES shops(id),
    name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐
│    users     │       │    shops     │
├──────────────┤       ├──────────────┤
│ id (PK)      │◄──────│ owner_id (FK)│
│ phone        │       │ id (PK)      │
│ name         │       │ name         │
│ language     │       │ logo_url     │
└──────────────┘       └──────┬───────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
       ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
       │  products    │ │   orders     │ │  customers   │
       ├──────────────┤ ├──────────────┤ ├──────────────┤
       │ id (PK)      │ │ id (PK)      │ │ id (PK)      │
       │ shop_id (FK) │ │ shop_id (FK) │ │ shop_id (FK) │
       │ title        │ │ customer_*   │ │ name         │
       │ price        │ │ total        │ │ phone        │
       │ stock        │ │ status       │ └──────────────┘
       └──────┬───────┘ └──────┬───────┘
              │                │
              │                ▼
              │       ┌──────────────┐
              │       │ order_items  │
              │       ├──────────────┤
              └──────►│ order_id (FK)│
                      │ product_id   │
                      │ quantity     │
                      └──────────────┘
```

---

## 4. API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/send-otp` | Send OTP to phone |
| POST | `/api/auth/verify-otp` | Verify OTP and get token |
| GET | `/api/auth/me` | Get current user |

### Shops

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shops` | Get merchant's shop |
| POST | `/api/shops` | Create shop |
| PUT | `/api/shops/:id` | Update shop |
| GET | `/api/shops/:id/public` | Get public shop data |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get products (with filters) |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| POST | `/api/products/analyze` | AI analyze product photo |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get orders (with filters) |
| GET | `/api/orders/:id` | Get order details |
| PUT | `/api/orders/:id/status` | Update order status |
| POST | `/api/orders` | Create order (customer) |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/sales` | Get sales data |
| GET | `/api/analytics/products` | Get product analytics |
| GET | `/api/analytics/customers` | Get customer analytics |

---

## 5. Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                AUTHENTICATION FLOW                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. USER ENTERS PHONE NUMBER                                │
│     │                                                        │
│     ▼                                                        │
│  2. BACKEND SENDS OTP VIA SMS                                │
│     │   POST /api/auth/send-otp                              │
│     │   { phone: "+923211234567" }                           │
│     │                                                        │
│     ▼                                                        │
│  3. USER ENTERS OTP                                          │
│     │                                                        │
│     ▼                                                        │
│  4. BACKEND VERIFIES OTP                                     │
│     │   POST /api/auth/verify-otp                            │
│     │   { phone: "+923211234567", otp: "123456" }            │
│     │                                                        │
│     ▼                                                        │
│  5. BACKEND RETURNS JWT TOKEN                                │
│     │   { token: "eyJhbGciOiJIUzI1...", user: {...} }        │
│     │                                                        │
│     ▼                                                        │
│  6. MOBILE APP STORES TOKEN                                  │
│     │   Secure Storage (Keychain/Keystore)                   │
│     │                                                        │
│     ▼                                                        │
│  7. SUBSEQUENT REQUESTS USE TOKEN                            │
│     │   Header: Authorization: Bearer <token>                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### JWT Token Structure

```json
{
  "userId": "uuid",
  "phone": "+923211234567",
  "role": "merchant",
  "iat": 1720473600,
  "exp": 1723065600
}
```

---

## 6. Payment Integration

### Supported Methods

| Method | Type | Integration |
|--------|------|-------------|
| **Cash on Delivery** | Manual | Merchant marks as paid |
| **JazzCash** | Wallet | JazzCash API |
| **EasyPaisa** | Wallet | EasyPaisa API |
| **Bank Transfer** | Manual | Merchant verifies |

### Payment Flow (JazzCash/EasyPaisa)

```
┌─────────────────────────────────────────────────────────────┐
│                PAYMENT FLOW                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. CUSTOMER SELECTS PAYMENT METHOD                          │
│     │                                                        │
│     ▼                                                        │
│  2. BACKEND CREATES PAYMENT REQUEST                          │
│     │   POST /api/payments/create                            │
│     │   { orderId, amount, method: "jazzcash" }              │
│     │                                                        │
│     ▼                                                        │
│  3. REDIRECT TO JAZZCASH/EASYPAISA                           │
│     │   Customer enters phone number                         │
│     │   Customer enters PIN                                  │
│     │                                                        │
│     ▼                                                        │
│  4. PAYMENT GATEWAY PROCESSES                                │
│     │   Sends webhook to our backend                         │
│     │                                                        │
│     ▼                                                        │
│  5. BACKEND UPDATES ORDER STATUS                             │
│     │   payment_status: "paid"                               │
│     │   status: "confirmed"                                  │
│     │                                                        │
│     ▼                                                        │
│  6. MERCHANT NOTIFIED                                        │
│     │   Push notification: "Payment received!"               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. WhatsApp Integration

### Using Baileys Library

```javascript
// WhatsApp connection
const { makeWASocket } = require('@whiskeysockets/baileys');

const sock = makeWASocket({
    auth: {
        creds: authCreds,
        keys: makeCacheableSignalKeyStore(keys, logger)
    }
});

// Send order confirmation to customer
async function sendOrderConfirmation(order, customerPhone) {
    const message = `🛒 *Order Confirmed!*\n\n` +
        `Order #${order.id}\n` +
        `Total: PKR ${order.total}\n` +
        `Status: ${order.status}\n\n` +
        `Thank you for your order!`;
    
    await sock.sendMessage(`${customerPhone}@s.whatsapp.net`, {
        text: message
    });
}

// Send delivery update
async function sendDeliveryUpdate(order, customerPhone) {
    const message = `🚚 *Delivery Update*\n\n` +
        `Order #${order.id}\n` +
        `Status: ${order.status}\n` +
        `Your order is on the way!`;
    
    await sock.sendMessage(`${customerPhone}@s.whatsapp.net`, {
        text: message
    });
}
```

### WhatsApp Features

| Feature | Implementation |
|---------|----------------|
| **Order Notifications** | Send order confirmation |
| **Delivery Updates** | Send status changes |
| **Customer Support** | Link to WhatsApp chat |
| **Shop Sharing** | Share shop link |

---

## 8. AI Integration

### Product Analysis Flow

```
┌─────────────────────────────────────────────────────────────┐
│                AI PRODUCT ANALYSIS                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. MERCHANT TAKES PHOTO                                    │
│     │                                                        │
│     ▼                                                        │
│  2. PHOTO UPLOADED TO CLOUD STORAGE                          │
│     │                                                        │
│     ▼                                                        │
│  3. AI SERVICE PROCESSES IMAGE                               │
│     │   - Send to OpenAI Vision API                          │
│     │   - Analyze product                                    │
│     │   - Generate details                                   │
│     │                                                        │
│     ▼                                                        │
│  4. AI RETURNS:                                              │
│     │   {                                                    │
│     │     "title": "Blue Cotton Shirt",                      │
│     │     "description": "Premium cotton shirt...",          │
│     │     "category": "Clothing",                            │
│     │     "suggestedPrice": 1299,                            │
│     │     "features": ["Cotton", "Blue", "Casual"]           │
│     │   }                                                    │
│     │                                                        │
│     ▼                                                        │
│  5. MERCHANT REVIEWS & EDITS                                 │
│     │                                                        │
│     ▼                                                        │
│  6. PRODUCT PUBLISHED                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### AI Service Code

```javascript
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function analyzeProduct(imageUrl) {
    const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `Analyze this product image and provide:
                        1. Product title (in English and Urdu)
                        2. Description (in English and Urdu)
                        3. Category
                        4. Suggested price in PKR
                        5. Key features
                        
                        Format as JSON.`
                    },
                    {
                        type: "image_url",
                        image_url: { url: imageUrl }
                    }
                ]
            }
        ]
    });
    
    return JSON.parse(response.choices[0].message.content);
}
```

---

## 9. Deployment Configuration

### Cloud Run Deployment

```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/api:$SHORT_SHA', '.']
  
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/api:$SHORT_SHA']
  
  - name: 'gcr.io/google-cloud-sdk/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'api-service'
      - '--image=gcr.io/$PROJECT_ID/api:$SHORT_SHA'
      - '--region=asia-south1'
      - '--platform=managed'
      - '--allow-unauthenticated'

images:
  - 'gcr.io/$PROJECT_ID/api:$SHORT_SHA'
```

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Redis
REDIS_URL=redis://host:6379

# AI
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Storage
GCS_BUCKET=your-bucket-name

# Auth
JWT_SECRET=your-secret-key

# Payments
JAZZCASH_MERCHANT_ID=...
EASYPAISA_STORE_ID=...
```

---

## 10. Project Structure

```
store-builder/
├── mobile/                    # React Native app
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── screens/           # App screens
│   │   ├── navigation/        # Navigation config
│   │   ├── services/          # API calls
│   │   ├── store/             # State management
│   │   └── utils/             # Helpers
│   └── package.json
│
├── backend/                   # Node.js API
│   ├── src/
│   │   ├── routes/            # API routes
│   │   ├── controllers/       # Business logic
│   │   ├── models/            # Database models
│   │   ├── services/          # External services
│   │   ├── middleware/        # Auth, validation
│   │   └── utils/             # Helpers
│   └── package.json
│
├── ai/                        # AI service
│   ├── src/
│   │   ├── analysis/          # Product analysis
│   │   ├── generation/        # Content generation
│   │   └── pricing/           # Price suggestions
│   └── package.json
│
└── docker-compose.yml         # Local development
```

---

## Summary

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Mobile** | React Native | Cross-platform app |
| **Backend** | Node.js + Express | API server |
| **Database** | PostgreSQL | Data storage |
| **Cache** | Redis | Performance |
| **AI** | OpenAI/Anthropic | Product analysis |
| **Payments** | JazzCash/EasyPaisa | Local payments |
| **WhatsApp** | Baileys | Communication |
| **Hosting** | Cloud Run | Deployment |

---

**Document Complete**  
**Next Document:** 06_Go_to_Market_Strategy.md
