# User Stories & Requirements
## AI-Powered Mobile-First Store Builder for Pakistan

**Document Version:** 1.0  
**Date:** July 8, 2026  
**Status:** Complete  

---

## 1. User Roles

| Role | Description |
|------|-------------|
| **Merchant** | Shopkeeper who sells products |
| **Customer** | Buyer who purchases from merchants |
| **Admin** | Platform administrator |

---

## 2. Merchant User Stories

### Onboarding Stories

| ID | Story | Priority |
|----|-------|----------|
| M-01 | As a merchant, I want to sign up with my phone number so I don't need email | HIGH |
| M-02 | As a merchant, I want to choose my language (Urdu/English) so I can use the app comfortably | HIGH |
| M-03 | As a merchant, I want AI to ask me simple questions to set up my shop so I don't need technical knowledge | HIGH |
| M-04 | As a merchant, I want to use voice input to answer questions so I don't have to type | HIGH |
| M-05 | As a merchant, I want my shop to be created automatically so I don't build it manually | HIGH |

### Product Management Stories

| ID | Story | Priority |
|----|-------|----------|
| M-06 | As a merchant, I want to add products by taking a photo so it's fast and easy | HIGH |
| M-07 | As a merchant, I want AI to generate product title and description from the photo | HIGH |
| M-08 | As a merchant, I want AI to suggest a price for my product | MEDIUM |
| M-09 | As a merchant, I want to edit AI suggestions before publishing | HIGH |
| M-10 | As a merchant, I want to organize products into categories | MEDIUM |
| M-11 | As a merchant, I want to track inventory/stock for each product | MEDIUM |
| M-12 | As a merchant, I want to add product variants (size, color) | LOW |

### Order Management Stories

| ID | Story | Priority |
|----|-------|----------|
| M-13 | As a merchant, I want to receive notifications for new orders | HIGH |
| M-14 | As a merchant, I want to see order details (customer, items, total) | HIGH |
| M-15 | As a merchant, I want to accept or reject orders | HIGH |
| M-16 | As a merchant, I want to update order status (preparing, shipped, delivered) | HIGH |
| M-17 | As a merchant, I want to contact customer via WhatsApp from the app | HIGH |
| M-18 | As a merchant, I want to see order history | MEDIUM |

### Analytics Stories

| ID | Story | Priority |
|----|-------|----------|
| M-19 | As a merchant, I want to see total sales for today/week/month | MEDIUM |
| M-20 | As a merchant, I want to see my best-selling products | MEDIUM |
| M-21 | As a merchant, I want to see customer count and repeat rate | LOW |
| M-22 | As a merchant, I want AI to give me business insights and suggestions | LOW |

### Marketing Stories

| ID | Story | Priority |
|----|-------|----------|
| M-23 | As a merchant, I want to share my shop link on WhatsApp | HIGH |
| M-24 | As a merchant, I want to create promotional posts for Facebook/Instagram | MEDIUM |
| M-25 | As a merchant, I want to create discount codes and sales | MEDIUM |
| M-26 | As a merchant, I want to send promotional messages to customers | LOW |

---

## 3. Customer User Stories

### Shopping Stories

| ID | Story | Priority |
|----|-------|----------|
| C-01 | As a customer, I want to browse products from a shop | HIGH |
| C-02 | As a customer, I want to search for products | HIGH |
| C-03 | As a customer, I want to see product details (photo, price, description) | HIGH |
| C-04 | As a customer, I want to add products to cart | HIGH |
| C-05 | As a customer, I want to checkout and pay (COD, JazzCash, EasyPaisa) | HIGH |
| C-06 | As a customer, I want to see order confirmation | HIGH |
| C-07 | As a customer, I want to track my order status | MEDIUM |
| C-08 | As a customer, I want to contact merchant via WhatsApp | HIGH |

### Account Stories

| ID | Story | Priority |
|----|-------|----------|
| C-09 | As a customer, I want to save my delivery address | MEDIUM |
| C-10 | As a customer, I want to see my order history | MEDIUM |
| C-11 | As a customer, I want to leave a review for products | LOW |

---

## 4. Admin User Stories

| ID | Story | Priority |
|----|-------|----------|
| A-01 | As admin, I want to see all merchants on the platform | MEDIUM |
| A-02 | As admin, I want to see platform analytics (users, revenue) | MEDIUM |
| A-03 | As admin, I want to manage merchant subscriptions | MEDIUM |
| A-04 | As admin, I want to handle support tickets | HIGH |
| A-05 | As admin, I want to manage payment settlements | HIGH |

---

## 5. Acceptance Criteria

### M-01: Sign up with phone number

```
GIVEN: User opens the app
WHEN: User taps "Get Started"
THEN: User sees phone number input
AND: User enters phone number
AND: User receives SMS code
AND: User enters code
THEN: User is signed in
```

### M-06: Add product by photo

```
GIVEN: Merchant is on Store screen
WHEN: Merchant taps "+ Add"
AND: Merchant selects "Camera"
AND: Merchant takes photo
THEN: AI analyzes photo within 10 seconds
AND: AI suggests title, description, category, price
AND: Merchant can edit any field
AND: Merchant taps "Publish"
THEN: Product is added to store
```

### M-13: Receive order notifications

```
GIVEN: Merchant has the app installed
WHEN: Customer places an order
THEN: Merchant receives push notification
AND: Notification shows "New order from [Customer Name]"
AND: Notification shows order total
AND: Merchant taps notification to see order details
```

### C-05: Checkout and pay

```
GIVEN: Customer has items in cart
WHEN: Customer taps "Checkout"
THEN: Customer sees delivery address form
AND: Customer enters address
AND: Customer selects payment method
THEN: Customer sees order summary
AND: Customer taps "Place Order"
THEN: Order is confirmed
AND: Merchant is notified
```

---

## 6. Priority Matrix

### MVP Features (Phase 1 - Month 1-2)

| Feature | Stories | Effort |
|---------|---------|--------|
| Phone signup | M-01 | 2 days |
| Language selection | M-02 | 1 day |
| AI shop setup | M-03, M-04, M-05 | 5 days |
| Add product (photo + AI) | M-06, M-07, M-09 | 5 days |
| Product list | M-10 | 2 days |
| Order notifications | M-13 | 2 days |
| Order management | M-14, M-15, M-16 | 3 days |
| WhatsApp contact | M-17, C-08 | 2 days |
| Share shop link | M-23 | 2 days |
| Customer browsing | C-01, C-02, C-03 | 3 days |
| Customer checkout | C-04, C-05, C-06 | 4 days |
| **TOTAL** | | **31 days** |

### Phase 2 Features (Month 3-4)

| Feature | Stories | Effort |
|---------|---------|--------|
| Inventory tracking | M-11 | 3 days |
| Sales analytics | M-19, M-20 | 3 days |
| Order history | M-18, C-10 | 2 days |
| Order tracking | C-07 | 2 days |
| Product variants | M-12 | 3 days |
| Promotional posts | M-24 | 3 days |
| Discount codes | M-25 | 3 days |
| **TOTAL** | | **19 days** |

### Phase 3 Features (Month 5-6)

| Feature | Stories | Effort |
|---------|---------|--------|
| Customer analytics | M-21, C-09 | 3 days |
| AI insights | M-22 | 4 days |
| Promotional messages | M-26 | 3 days |
| Customer reviews | C-11 | 3 days |
| Admin dashboard | A-01, A-02 | 5 days |
| **TOTAL** | | **18 days** |

---

## 7. Feature Roadmap

```
PHASE 1 (MVP) - Month 1-2
├── Authentication (phone signup)
├── Onboarding (AI-guided setup)
├── Product management (photo + AI)
├── Order management
├── Basic customer browsing
├── Checkout (COD)
└── WhatsApp integration

PHASE 2 - Month 3-4
├── Inventory tracking
├── Analytics (sales, products)
├── Order tracking
├── Product variants
├── Marketing tools (posts, discounts)
└── Payment integration (JazzCash, EasyPaisa)

PHASE 3 - Month 5-6
├── Advanced analytics
├── AI insights
├── Customer management (CRM)
├── Promotional campaigns
├── Customer reviews
└── Admin dashboard

PHASE 4 - Month 7+
├── Multi-language (Sindhi, Punjabi)
├── Delivery integration
├── Custom domain
├── API access
├── Marketplace features
└── International expansion
```

---

## 8. Non-Functional Requirements

### Performance

| Metric | Target |
|--------|--------|
| **App Launch** | < 3 seconds |
| **Screen Load** | < 1 second |
| **AI Processing** | < 10 seconds |
| **Image Upload** | < 5 seconds |

### Reliability

| Metric | Target |
|--------|--------|
| **Uptime** | 99.9% |
| **Data Backup** | Daily |
| **Error Rate** | < 1% |

### Security

| Requirement | Implementation |
|-------------|----------------|
| **Authentication** | Phone OTP + JWT |
| **Data Encryption** | AES-256 at rest, TLS in transit |
| **Payment Security** | PCI DSS compliant |
| **Privacy** | GDPR-like compliance |

### Scalability

| Metric | Target |
|--------|--------|
| **Concurrent Users** | 10,000+ |
| **Products per Merchant** | Unlimited |
| **Orders per Month** | Unlimited |

---

## Summary

| Category | Count |
|----------|-------|
| **Merchant Stories** | 26 |
| **Customer Stories** | 11 |
| **Admin Stories** | 5 |
| **Total Stories** | 42 |
| **MVP Stories** | 15 |
| **MVP Effort** | 31 days |

---

**Document Complete**  
**Next Document:** 05_Technical_Specifications.md
