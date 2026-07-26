# Authorization vs Authentication — Multi-tenant Safety Doc

## 1. Why this matters
**Authentication** = “Who are you?” (login/sign-in).
**Authorization** = “What are you allowed to do once you are logged in?”

For a multi-tenant store app, authorization is the biggest security risk:
- You must ensure a merchant **cannot view or edit other merchants’ data**.
- A customer **must not access order data** they didn’t create (if any public/semipublic order URLs exist).

This doc converts your tip into implementable rules.

---

## 2. Definitions (use these in reviews)
### 2.1 Authentication
- JWT/session identifies the user (merchant account).
- If authentication fails → deny with `401 UNAUTHORIZED`.

### 2.2 Authorization
- Tenant scoping rules decide whether the authenticated user can access a specific resource.
- If authorization fails → deny with `403 FORBIDDEN`.
- Never reveal “resource exists” details that leak cross-tenant IDs.

---

## 3. Concrete authorization examples (the “order 42 → order 43” test)
If a merchant opens:
`/merchant/orders/{orderId}`

and changes `{orderId}` from 42 to 43:
- The app must check:
  - order belongs to the same `storeId` and `merchantId`
- If not allowed:
  - show a **generic** “You do not have access” page/message
  - return `403` (or `404` if you choose “hide existence” strategy)

**Must NOT happen:** merchant sees another merchant’s entire order.

---

## 4. Multi-tenant authorization model for this project
Use these invariants everywhere:

### Invariant A — Tenant identity mapping
- Auth identity (JWT) → `merchantId`
- Public storefront identity (storeSlug/subdomain) → `storeId` → `merchantId`

### Invariant B — Every data query must be scoped
- For merchant-only endpoints, queries must include:
  - `WHERE merchant_id = JWT.merchantId`
- For store-scoped endpoints:
  - `WHERE store_id = requestedStoreId AND merchant_id = JWT.merchantId`

### Invariant C — No “ID-only” access
- Never fetch by `orderId` (or `productId`) alone.
- Always fetch with tenant constraints (e.g., `WHERE order_id = :id AND store_id = :storeId AND merchant_id = :merchantId`).

---

## 5. Authorization checklist for every feature
Before shipping a feature, confirm these 5 questions:

1. **Who should access it?**
   - merchant only?
   - customer only?
   - public storefront only?
2. **What tenant identifiers are required?**
   - `storeId`, `merchantId`, or `storeSlug`
3. **Can the user guess/modify IDs in the URL?**
   - if yes, verify tenant scoping checks exist
4. **What is the response mode on denial?**
   - `403` with “no access”, or `404` to hide existence
5. **What about background jobs/AI workers?**
   - worker must re-validate the job owner (`merchantId/storeId`) before writing results

---

## 6. Common authorization pitfalls (to avoid)
- **JWT works but tenant scoping missing**  
  Example: API checks user is logged in, but not whether they own the store/order.
- **Worker writes to wrong tenant**  
  Example: AI job input references productId but worker doesn’t verify store ownership.
- **Caching leaks data**  
  Example: cache key not including `storeId`, so storefront sees another store’s data.
- **“Public” endpoints accidentally allow admin data**  
  Example: internal JSON endpoints reachable by guessable URLs.

---

## 7. Recommended enforcement approach
### 7.1 Central middleware + domain checks
- Authorization middleware determines:
  - merchantId from JWT
  - storeId from storeSlug (if provided)
- Domain services verify ownership for each action.

### 7.2 Database-level support (defense in depth)
- Prefer queries that always include tenant constraints.
- Optionally use Row Level Security (RLS) if your DB/platform supports it reliably.

---

## 8. Error codes & user messaging
- Authentication failure → `401`
- Authorization failure → `403` (or `404` to hide existence)
- Frontend should display:
  - “You do not have access to this data”
- Avoid printing IDs/tenant info in error responses.

---

## 9. Security testing plan (authorization-specific)
Even before full app testing, run these “authorization attack tests”:
1. **IDOR test**: modify resource IDs and confirm `403/404`.
2. **Store slug test**: use another storeSlug/subdomain and confirm isolation.
3. **Worker job test**: enqueue an AI job referencing another tenant’s productId; ensure worker blocks writing.
4. **Cache key test**: verify cache includes `storeId` and cannot cross serve.

---

## 10. One-line rule
**Authentication proves identity; authorization proves ownership. In a multi-tenant commerce app, every query and every job must be scoped by `merchantId/storeId`.**
