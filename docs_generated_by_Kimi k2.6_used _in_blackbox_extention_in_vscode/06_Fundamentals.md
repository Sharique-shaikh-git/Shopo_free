# Fundamentals — AI Shop Builder

## 1) Mobile-first product principles
- Every primary action must fit thumb reach.
- Avoid multi-step forms; prefer “photo → confirm” flows.
- Design for low-end Android devices and slow mobile networks.

## 2) Storefront UX principles (for non-technical buyers)
- Show price, delivery method (COD), and basic trust signals immediately.
- Keep layout consistent: product image → name → description → price → order button.
- Never require buyers to read instructions; reduce cognitive load.

## 3) Merchant UX principles (for non-technical merchants)
- Hide technical words (domain, DNS, SSL, hosting, SEO, templates).
- Use plain language labels: “My Products”, “My Orders”, “Promote”.
- AI suggestions must be clearly labeled as “AI suggestion” with one-tap approve/edit.

## 4) State management principles
- Product draft vs active vs archived.
- Order lifecycle with strict state transitions.
- UI must handle “AI pending” states gracefully (progress indicator + retry).

## 5) Cost control fundamentals (AI + API spend)
- Async AI enrichment only; never block checkout.
- Cache AI outputs using dedupe keys.
- Strict quotas per merchant plan.
- Use shorter prompts and constrained structured outputs (JSON schema).

## 6) Multi-tenancy fundamentals
- Always derive `merchantId`/`storeId` from authenticated context.
- Never accept “merchantId” from the client except during initial auth linking.
- Validate ownership on every write and verify store status on every read.

## 7) Scalability fundamentals for early stage
- Start with managed services and horizontal scaling of stateless containers.
- No sharding before performance evidence.
- Use read caching + CDN for the storefront.
- Partition later when data volume demands it.

## 8) Observability fundamentals
- Correlation IDs across API ↔ queue ↔ worker.
- Centralized logging; metrics dashboards for errors and latency.
- Error reporting with actionable identifiers for support.

## 9) Security fundamentals
- Input validation everywhere.
- Rate limits for uploads, auth attempts, and job enqueues.
- Signed URLs for uploads (no direct public write).
- WAF + request size limits for abuse prevention.
