ye# Feature Doc — Storefront (Customer Mobile Web)

## 1. Purpose
Deliver a fast, mobile-first storefront that lets customers browse products and place **COD orders** with minimal friction.

## 2. Inputs/State
- Store identified by `storeSlug`/subdomain (e.g., `shopname.appdomain.pk`)
- Products visible only if `status=active`
- Store theme applied for branding (colors/logo)

## 3. Primary Pages / Routes
- `GET /` — store home (banner + product grid)
- `GET /category/:category` — optional category listing
- `GET /product/:productSlug` — product detail page
- `POST /checkout` — order creation (COD)
- Optional later: `GET /order/:orderId` — customer tracking page

## 4. UX Requirements (mobile-first)
- CTA hierarchy:
  - product cards: “Order” (primary)
  - product page: “Place COD order” (primary)
- Product page layout:
  - image(s), title, description, price
  - delivery info: “Cash on Delivery”
  - stock note if available (“Low stock”)
- No technical jargon for buyers.

## 5. Checkout Flow (COD-first)
1. Customer taps “Place order”
2. Checkout form collects:
   - full name
   - phone number
   - address line
   - city
   - delivery notes (optional)
3. Submit checkout:
   - API validates product is active
   - computes totals
   - creates order `status=new`
4. Storefront shows:
   - order confirmation + order code/reference
   - “Merchant will process shortly”

## 6. API Endpoints (logical)
- `GET /v1/stores/{storeSlug}` (store home data)
- `GET /v1/stores/{storeSlug}/products?category=&cursor=`
- `GET /v1/stores/{storeSlug}/products/{productSlug}`
- `POST /v1/stores/{storeSlug}/orders` (creates COD order)

## 7. Caching & Performance
- Use CDN caching for:
  - store home pages
  - product listing pages
  - product detail pages
- Invalidation:
  - when merchant publishes/unpublishes product
- Keep HTML minimal; optimize images (thumbnails + responsive sizes).

## 8. Analytics (customer-side)
Track:
- store_view
- product_view
- checkout_started
- order_created
- order_failed (with safe error classification)

## 9. Error Handling
- If product inactive: show “This product is unavailable.”
- If checkout fails: show “Try again” and optionally retry once.

## 10. Security
- Public read endpoints must not leak merchant data beyond storefront needs.
- Prevent storefront from enumerating products outside active store context.
