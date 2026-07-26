# Feature Doc — Orders (COD-first)

## 1. Purpose
Provide a reliable merchant order fulfillment workflow for Cash on Delivery, with strict state transitions and clear customer visibility.

## 2. User Roles
- Merchant: sees new orders, updates status (packed/shipped/delivered), can cancel if allowed.
- Customer: places COD order; can view order status (optional).

## 3. Order lifecycle (state machine)
- `new` → `packed` → `shipped` → `delivered`
- Cancellations:
  - Allowed only in `new` (and optionally `packed` with policy)
- Invalid transitions must return `ORDER_INVALID_STATE`.

## 4. Merchant API endpoints (logical)
- `GET /v1/merchant/orders?status&cursor`
- `POST /v1/orders/{orderId}/status` (or `PATCH`)
  - payload: `{ newStatus }`
- `GET /v1/orders/{orderId}` (merchant view)

## 5. Storefront/customer endpoints (logical)
- `POST /v1/stores/{storeSlug}/checkout` (creates COD order)
- `GET /{storeSlug}/order/{orderCode}` (optional public tracking page)

## 6. Data captured at order time (snapshot)
To keep accuracy:
- Store product title/price into `order_items.title_snapshot` and `unit_price`.

## 7. Notifications
- API emits event: `ORDER_STATUS_CHANGED`
- Worker/notification service sends:
  - Email/SMS optional
  - WhatsApp optional (later)
- Ensure idempotency: no duplicate notifications on retries.

## 8. Failure handling
- If courier integration fails (later), keep status as `packed` and show “Courier booking pending”.
- If merchant updates status concurrently, last write must still respect state machine rules.

## 9. Analytics events
- `order_created`
- `order_status_changed`
- `order_canceled`
- Track by `storeId`, `merchantId`, and `orderStatus`.
