# Authentication vs Authorization
## Digital Dukaan - Store Builder for Pakistan

**Date:** July 8, 2026

---

## 1. The Difference

```
┌─────────────────────────────────────────────────────────────┐
│                AUTHENTICATION vs AUTHORIZATION                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  AUTHENTICATION (AuthN) = WHO ARE YOU?                        │
│  ├── Sign in                                                 │
│  ├── Sign up                                                 │
│  ├── Password reset                                          │
│  ├── OTP verification                                        │
│  └── AI is GOOD at this ✅                                   │
│                                                              │
│  AUTHORIZATION (AuthZ) = WHAT CAN YOU DO?                    │
│  ├── Can you see this data?                                  │
│  ├── Can you edit this item?                                 │
│  ├── Can you delete this?                                    │
│  ├── Can you access this page?                               │
│  └── AI is BAD at this ❌                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Real-World Example

### The Problem

```
┌─────────────────────────────────────────────────────────────┐
│                THE DANGER                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  WITHOUT AUTHORIZATION:                                      │
│                                                              │
│  1. You access: /orders/42                                   │
│  2. You change URL to: /orders/43                            │
│  3. You see: Another person's entire order ❌                │
│                                                              │
│  WITH AUTHORIZATION:                                         │
│                                                              │
│  1. You access: /orders/42                                   │
│  2. You change URL to: /orders/43                            │
│  3. You see: "Access Denied" ✅                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Code Example: Wrong vs Right

```javascript
// ❌ WRONG - No Authorization (AI often generates this)
app.get('/orders/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order); // ANYONE can see ANY order!
});

// ✅ RIGHT - With Authorization
app.get('/orders/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  // Check if user owns this order
  if (order.shopId !== req.user.shopId) {
    return res.status(403).json({ 
      error: 'You do not have access to this data' 
    });
  }
  
  res.json(order);
});
```

---

## 3. Common AI Mistakes

| What AI Generates | What's Missing |
|-------------------|----------------|
| Sign-in/Sign-up | Ownership check |
| Password reset | User role verification |
| CRUD operations | Data isolation |
| API endpoints | Permission middleware |
| Dashboard | Access control |

### Why AI Forgets Authorization

1. **Training data bias** - Most examples focus on authentication
2. **Complexity** - Authorization is context-specific
3. **Business logic** - AI doesn't know your rules
4. **Assumptions** - AI assumes "if authenticated, then authorized"

---

## 4. Authorization Checklist

### For Every Feature

| Question | Why It Matters |
|----------|----------------|
| **Who can access this?** | Define user roles |
| **Who CANNOT access this?** | Block unauthorized users |
| **What data can they see?** | Data isolation |
| **What can they modify?** | Write permissions |
| **Can they access other users' data?** | Ownership check |

### Implementation Checklist

- [ ] Define user roles (merchant, customer, admin)
- [ ] Add ownership check to every query
- [ ] Test with different user accounts
- [ ] Test URL manipulation (change IDs)
- [ ] Test API endpoints with wrong tokens
- [ ] Add rate limiting
- [ ] Log unauthorized access attempts

---

## 5. Authorization Patterns

### Pattern 1: Ownership Check

```javascript
// Every query must check ownership
async function getProduct(productId, userId) {
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  // CRITICAL: Check ownership
  if (product.shopId !== userId) {
    throw new Error('Access denied');
  }
  
  return product;
}
```

### Pattern 2: Role-Based Access Control (RBAC)

```javascript
// Define roles and permissions
const ROLES = {
  merchant: ['read:own', 'write:own', 'delete:own'],
  staff: ['read:own', 'write:own'],
  customer: ['read:public', 'write:orders'],
  admin: ['read:all', 'write:all', 'delete:all']
};

// Middleware to check permissions
function requirePermission(permission) {
  return (req, res, next) => {
    const userRole = req.user.role;
    const permissions = ROLES[userRole];
    
    if (!permissions.includes(permission)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions' 
      });
    }
    
    next();
  };
}

// Usage
app.delete('/products/:id', 
  requirePermission('delete:own'),
  deleteProduct
);
```

### Pattern 3: Data Isolation

```javascript
// Shop-level data isolation
async function getOrders(shopId, filters = {}) {
  return Order.find({
    shopId: shopId,  // ALWAYS filter by shopId
    ...filters
  });
}

// NEVER do this (AI often generates this)
// await Order.find({})  // Returns ALL orders!
```

---

## 6. Security Testing

### Test Cases

| Test | Expected Result |
|------|-----------------|
| Access /orders/123 as User A | Show User A's order |
| Access /orders/123 as User B | "Access Denied" |
| Access /orders/456 (User B's) as User A | "Access Denied" |
| Access /admin as regular user | "Access Denied" |
| Modify order ID in URL | "Access Denied" |
| Use expired JWT | 401 Unauthorized |
| Use wrong role JWT | 403 Forbidden |

### Testing Script

```javascript
// tests/authorization.test.js

describe('Authorization Tests', () => {
  let merchantA, merchantB;
  
  beforeAll(async () => {
    merchantA = await createMerchant('Ali');
    merchantB = await createMerchant('Fatima');
  });
  
  test('Merchant A cannot see Merchant B orders', async () => {
    // Create order for Merchant B
    const order = await createOrder(merchantB.id);
    
    // Try to access as Merchant A
    const res = await request(app)
      .get(`/orders/${order.id}`)
      .set('Authorization', `Bearer ${merchantA.token}`);
    
    expect(res.status).toBe(403);
    expect(res.body.error).toContain('Access denied');
  });
  
  test('Merchant A can see their own orders', async () => {
    // Create order for Merchant A
    const order = await createOrder(merchantA.id);
    
    // Access as Merchant A
    const res = await request(app)
      .get(`/orders/${order.id}`)
      .set('Authorization', `Bearer ${merchantA.token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(order.id);
  });
});
```

---

## 7. Authorization Rules for Digital Dukaan

| Resource | Merchant | Staff | Customer | Admin |
|----------|----------|-------|----------|-------|
| **Own Products** | Full | Read/Write | Read | Full |
| **Other Products** | None | None | Read | Full |
| **Own Orders** | Full | Read/Write | Read | Full |
| **Other Orders** | None | None | None | Full |
| **Own Shop** | Full | Read | Read | Full |
| **Other Shops** | None | None | Read | Full |
| **Analytics** | Own | Own | None | All |
| **Settings** | Own | None | None | All |

---

## 8. Summary

| Rule | Implementation |
|------|----------------|
| **Always check ownership** | Every query filters by shopId |
| **Never trust client** | Validate permissions server-side |
| **Test with different users** | Verify data isolation |
| **Test URL manipulation** | Change IDs, expect denial |
| **Log access attempts** | Monitor suspicious activity |
| **AI forgets authorization** | Always review AI-generated code |

---

**Document Complete**
**All 13 Documents Created!**
