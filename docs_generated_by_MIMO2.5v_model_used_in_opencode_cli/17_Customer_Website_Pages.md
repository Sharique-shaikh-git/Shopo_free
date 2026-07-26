# Document 17: Customer Website Pages
## Digital Dukaan - Customer-Facing Website

**Date:** July 8, 2026  
**Purpose:** Website pages customers see when visiting merchant's store  
**Technology:** Next.js (React framework for websites)  
**Note:** This is a WEBSITE, not a mobile app - customers don't download anything

---

## OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                HOW IT WORKS                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  MERCHANT:                                                   │
│  ├── Uses MOBILE APP to manage store                         │
│  ├── Adds products, manages orders                           │
│  └── Shares store link with customers                        │
│                                                              │
│  CUSTOMER:                                                   │
│  ├── Clicks link from WhatsApp/SMS                           │
│  ├── Opens in WEB BROWSER (Chrome/Safari)                    │
│  ├── Browses store like a website                            │
│  ├── No app download required                                │
│  └── Premium Shopify-like experience                         │
│                                                              │
│  URL FORMAT:                                                 │
│  ├── ali.digitaldukaan.pk (subdomain)                        │
│  └── Or digitaldukaan.pk/ali (path-based)                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. HOME PAGE (Storefront)

**URL:** `ali.digitaldukaan.pk`

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Logo] Shop Name              [Search] [Cart] [WhatsApp]│ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ HERO BANNER                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │         [Large Banner Image]                            │ │
│ │         Shop Name + Tagline                             │ │
│ │         "50+ Products Available"                        │ │
│ │         [Shop Now Button]                               │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ TRUST BADGES                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ✓ Verified   ✓ Fast Delivery   ✓ Secure Payment        │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ CATEGORIES                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [All] [Clothing] [Cosmetics] [Electronics] [More →]    │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ FEATURED PRODUCTS                                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │ │
│ │ │ Product │ │ Product │ │ Product │ │ Product │       │ │
│ │ │  Image  │ │  Image  │ │  Image  │ │  Image  │       │ │
│ │ │         │ │         │ │         │ │         │       │ │
│ │ │ Title   │ │ Title   │ │ Title   │ │ Title   │       │ │
│ │ │ Rs.500  │ │ Rs.1200 │ │ Rs.800  │ │ Rs.1500 │       │ │
│ │ │ ★★★★★   │ │ ★★★★☆   │ │ ★★★★★   │ │ ★★★★☆   │       │ │
│ │ │[Add Cart]│ │[Add Cart]│ │[Add Cart]│ │[Add Cart]│       │ │
│ │ └─────────┘ └─────────┘ └─────────┘ └─────────┘       │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ ALL PRODUCTS (Grid View)                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Product Grid - 2 columns on mobile, 4 on desktop        │ │
│ │ Each card: Image + Title + Price + Rating + Add Cart    │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                     │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Shop Name                                               │ │
│ │ 📍 Address  |  📞 Phone  |  ✉️ Email                    │ │
│ │ [Facebook] [Instagram] [WhatsApp]                       │ │
│ │ © 2026 Shop Name. Powered by Digital Dukaan             │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Desktop View
- Full-width banner
- 4-column product grid
- Sidebar for categories
- Sticky header with search

### Mobile View
- Compact header
- 2-column product grid
- Bottom navigation bar
- Swipeable banner

---

## 2. PRODUCT LISTING PAGE

**URL:** `ali.digitaldukaan.pk/products`

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (same as home)                                       │
├─────────────────────────────────────────────────────────────┤
│ BREADCRUMBS                                                 │
│ Home > All Products                                         │
├─────────────────────────────────────────────────────────────┤
│ FILTERS & SORTING                                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Sort: [Newest ▼]  Filter: [Price] [Category] [Rating]  │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ PRODUCT GRID                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ "Showing 24 products"                                   │ │
│ │                                                         │ │
│ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │ │
│ │ │ Product │ │ Product │ │ Product │ │ Product │       │ │
│ │ │  Image  │ │  Image  │ │  Image  │ │  Image  │       │ │
│ │ │ Title   │ │ Title   │ │ Title   │ │ Title   │       │ │
│ │ │ Price   │ │ Price   │ │ Price   │ │ Price   │       │ │
│ │ └─────────┘ └─────────┘ └─────────┘ └─────────┘       │ │
│ │                                                         │ │
│ │ [Load More] or Pagination [1] [2] [3] ...              │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                     │
└─────────────────────────────────────────────────────────────┘
```

### Filter Options
- **Price Range:** Min-Max PKR slider
- **Category:** Checkboxes (Clothing, Cosmetics, etc.)
- **Rating:** 4★ & above, 3★ & above
- **Availability:** In Stock only
- **Sort By:** Newest, Price Low-High, Price High-Low, Popular

---

## 3. PRODUCT DETAIL PAGE

**URL:** `ali.digitaldukaan.pk/product/[id]`

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (same as home)                                       │
├─────────────────────────────────────────────────────────────┤
│ BREADCRUMBS                                                 │
│ Home > Category > Product Name                              │
├─────────────────────────────────────────────────────────────┤
│ PRODUCT INFO                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ┌───────────────┐  ┌───────────────────────────────┐   │ │
│ │ │               │  │ Product Title                  │   │ │
│ │ │   [Main       │  │                               │   │ │
│ │ │    Image]     │  │ ★★★★☆ (120 reviews)          │   │ │
│ │ │               │  │                               │   │ │
│ │ │ [Thumbnail    │  │ Rs. 1,500                     │   │ │
│ │ │  Gallery]     │  │ Rs. 2,000 (25% OFF)           │   │ │
│ │ │               │  │                               │   │ │
│ │ └───────────────┘  │ ✓ In Stock                    │   │ │
│ │                     │ ✓ Free delivery over Rs.2000  │   │ │
│ │                     │                               │   │ │
│ │                     │ Description:                  │   │ │
│ │                     │ High quality product...       │   │ │
│ │                     │                               │   │ │
│ │                     │ Quantity: [-] 1 [+]           │   │ │
│ │                     │                               │   │ │
│ │                     │ [Add to Cart] [Buy Now]       │   │ │
│ │                     │ [💬 WhatsApp Merchant]        │   │ │
│ │                     └───────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ PRODUCT DETAILS TABS                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Description] [Specifications] [Reviews]                │ │
│ │                                                         │ │
│ │ Tab Content:                                            │ │
│ │ - Description: Full product description                 │ │
│ │ - Specifications: Size, Material, Weight, etc.          │ │
│ │ - Reviews: Customer reviews with ratings                │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ RELATED PRODUCTS                                           │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ "You May Also Like"                                     │ │
│ │ [Product] [Product] [Product] [Product]                │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                     │
└─────────────────────────────────────────────────────────────┘
```

### Image Gallery
- Main image with zoom on hover
- Thumbnail carousel below
- Swipe on mobile
- Multiple angles support

### Add to Cart Flow
1. Select options (size/color if applicable)
2. Set quantity
3. Click "Add to Cart"
4. Mini-cart popup appears
5. Continue shopping or checkout

---

## 4. SHOPPING CART PAGE

**URL:** `ali.digitaldukaan.pk/cart`

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (same as home)                                       │
├─────────────────────────────────────────────────────────────┤
│ BREADCRUMBS                                                 │
│ Home > Shopping Cart                                        │
├─────────────────────────────────────────────────────────────┤
│ CART CONTENTS                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ "Shopping Cart (3 items)"                                │ │
│ │                                                         │ │
│ │ ┌─────┐ ┌─────────────┐ ┌─────┐ ┌──────┐ ┌───────┐   │ │
│ │ │     │ │ Product     │ │ - 2 +│ │ Rs.  │ │ [X]   │   │ │
│ │ │ Img │ │ Title       │ │     │ │1500  │ │       │   │ │
│ │ │     │ │ Size: Large │ │     │ │      │ │       │   │ │
│ │ └─────┘ └─────────────┘ └─────┘ └──────┘ └───────┘   │ │
│ │                                                         │ │
│ │ ┌─────┐ ┌─────────────┐ ┌─────┐ ┌──────┐ ┌───────┐   │ │
│ │ │     │ │ Product     │ │ - 1 +│ │ Rs.  │ │ [X]   │   │ │
│ │ │ Img │ │ Title       │ │     │ │800   │ │       │   │ │
│ │ └─────┘ └─────────────┘ └─────┘ └──────┘ └───────┘   │ │
│ │                                                         │ │
│ │ [Continue Shopping]                                     │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ ORDER SUMMARY (Desktop: Right Sidebar)                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Order Summary                                           │ │
│ │ ─────────────────                                       │ │
│ │ Subtotal:          Rs. 2,300                           │ │
│ │ Delivery:          Rs. 100                             │ │
│ │ Discount:          -Rs. 0                              │ │
│ │ ─────────────────                                       │ │
│ │ Total:             Rs. 2,400                           │ │
│ │                                                         │ │
│ │ [Promo Code Input] [Apply]                              │ │
│ │                                                         │ │
│ │ [Proceed to Checkout]                                   │ │
│ │                                                         │ │
│ │ 🔒 Secure Checkout                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                     │
└─────────────────────────────────────────────────────────────┘
```

### Cart Features
- Update quantity inline
- Remove items with confirmation
- Promo code application
- Save for later (optional)
- Estimated delivery date
- Stock availability warning

---

## 5. CHECKOUT PAGE

**URL:** `ali.digitaldukaan.pk/checkout`

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (simplified)                                         │
│ [Logo] Secure Checkout 🔒                                   │
├─────────────────────────────────────────────────────────────┤
│ CHECKOUT STEPS                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ① Address  →  ② Delivery  →  ③ Payment  →  ④ Review   │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ STEP 1: DELIVERY ADDRESS                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Delivery Address                                        │ │
│ │                                                         │ │
│ │ Full Name*       [________________]                     │ │
│ │ Phone Number*    [________________]                     │ │
│ │ Email (optional) [________________]                     │ │
│ │ Full Address*    [________________]                     │ │
│ │ City*            [________________]                     │ │
│ │ Province*        [________________ ▼]                   │ │
│ │ Postal Code      [________________]                     │ │
│ │ Landmark         [________________]                     │ │
│ │                                                         │ │
│ │ [Save this address for next time]                       │ │
│ │                                                         │ │
│ │ [Continue to Delivery →]                                │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ STEP 2: DELIVERY OPTIONS                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Delivery Method                                         │ │
│ │                                                         │ │
│ │ ○ Standard Delivery (2-3 days)      Free               │ │
│ │ ○ Express Delivery (1 day)          Rs. 200            │ │
│ │                                                         │ │
│ │ [← Back]  [Continue to Payment →]                       │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ STEP 3: PAYMENT METHOD                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Payment Method                                          │ │
│ │                                                         │ │
│ │ 🇵🇰 PAKISTAN CUSTOMERS:                                │ │
│ │ ○ Cash on Delivery (COD)                                │ │
│ │ ○ JazzCash                                               │ │
│ │ ○ EasyPaisa                                              │ │
│ │                                                         │ │
│ │ 🌍 INTERNATIONAL CUSTOMERS:                             │ │
│ │ ○ Stripe (Credit/Debit Card)                            │ │
│ │ ○ PayPal                                                 │ │
│ │                                                         │ │
│ │ [← Back]  [Review Order →]                              │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ STEP 4: REVIEW ORDER                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Review Your Order                                        │ │
│ │                                                         │ │
│ │ 📍 Delivery Address:                                    │ │
│ │    Ali Khan, 0321-1234567                               │ │
│ │    House 123, Street 4, Lahore                          │ │
│ │    [Change]                                              │ │
│ │                                                         │ │
│ │ 🚚 Delivery: Standard (2-3 days) - Free                 │ │
│ │    [Change]                                              │ │
│ │                                                         │ │
│ │ 💳 Payment: Cash on Delivery                            │ │
│ │    [Change]                                              │ │
│ │                                                         │ │
│ │ 📦 Items:                                               │ │
│ │    • Product 1 × 2 = Rs. 3,000                         │ │
│ │    • Product 2 × 1 = Rs. 800                           │ │
│ │                                                         │ │
│ │ ─────────────────────────────────────────               │ │
│ │ Subtotal:           Rs. 3,800                          │ │
│ │ Delivery:           Free                               │ │
│ │ Total:              Rs. 3,800                          │ │
│ │                                                         │ │
│ │ [← Back]  [Place Order →]                               │ │
│ │                                                         │ │
│ │ 🔒 Your payment is secure                               │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ TRUST SECTION                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔒 Secure Payment  |  ✓ Verified Merchant  |  ✓ Refund │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Payment Flow by Region

```
┌─────────────────────────────────────────────────────────────┐
│ PAKISTAN CUSTOMERS                                          │
├─────────────────────────────────────────────────────────────┤
│ 1. Cash on Delivery (COD)                                   │
│    - Pay when delivered                                     │
│    - No online payment needed                               │
│    - Most common in Pakistan                                │
│                                                             │
│ 2. JazzCash                                                 │
│    - Enter JazzCash number                                  │
│    - Receive OTP                                            │
│    - Confirm payment                                        │
│                                                             │
│ 3. EasyPaisa                                                │
│    - Enter EasyPaisa number                                 │
│    - Receive OTP                                            │
│    - Confirm payment                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ USA/UK CUSTOMERS                                            │
├─────────────────────────────────────────────────────────────┤
│ 1. Stripe (Credit/Debit Card)                               │
│    - Enter card details                                     │
│    - Stripe processes payment                               │
│    - Secure & instant                                       │
│                                                             │
│ 2. PayPal                                                   │
│    - Login to PayPal                                        │
│    - Confirm payment                                        │
│    - Buyer protection included                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. ORDER CONFIRMATION PAGE

**URL:** `ali.digitaldukaan.pk/order/[id]/confirmation`

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (simplified)                                         │
├─────────────────────────────────────────────────────────────┤
│ SUCCESS MESSAGE                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │                    ✓                                    │ │
│ │              Order Placed!                              │ │
│ │                                                         │ │
│ │         Order #DD-2026-12345                            │ │
│ │                                                         │ │
│ │   "Thank you, Ali! Your order has been received."       │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ ORDER DETAILS                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Order Details                                           │ │
│ │                                                         │ │
│ │ 📦 Items Ordered:                                       │ │
│ │    • Product 1 × 2 = Rs. 3,000                         │ │
│ │    • Product 2 × 1 = Rs. 800                           │ │
│ │                                                         │ │
│ │ 📍 Delivery Address:                                    │ │
│ │    Ali Khan                                              │ │
│ │    House 123, Street 4, Lahore                          │ │
│ │    Phone: 0321-1234567                                  │ │
│ │                                                         │ │
│ │ 🚚 Delivery: Standard (2-3 days)                        │ │
│ │                                                         │ │
│ │ 💳 Payment: Cash on Delivery                            │ │
│ │                                                         │ │
│ │ 💰 Total: Rs. 3,800                                    │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ WHAT'S NEXT                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ What Happens Next?                                      │ │
│ │                                                         │ │
│ │ 1. ✓ Order Received - You'll get WhatsApp confirmation │ │
│ │ 2. ⏳ Order Processing - Merchant prepares your order   │ │
│ │ 3. 🚚 Shipped - You'll receive tracking info           │ │
│ │ 4. 📦 Delivered - Receive your order                   │ │
│ │                                                         │ │
│ │ 📱 Track your order anytime                             │ │
│ │                                                         │ │
│ │ [Track Order]  [Continue Shopping]                      │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ SHARE                                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Share your experience                                   │ │
│ │ [WhatsApp] [Facebook] [Instagram]                       │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. ORDER TRACKING PAGE

**URL:** `ali.digitaldukaan.pk/order/[id]/track`

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (same as home)                                       │
├─────────────────────────────────────────────────────────────┤
│ ORDER HEADER                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Order #DD-2026-12345                                    │ │
│ │ Placed on July 8, 2026                                  │ │
│ │                                                         │ │
│ │ Status: 🚚 Out for Delivery                             │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ TRACKING TIMELINE                                           │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │  ✓ Order Placed                                         │ │
│ │    July 8, 2026 at 2:30 PM                              │ │
│ │    |                                                    │ │
│ │    ✓ Order Confirmed                                    │ │
│ │    July 8, 2026 at 2:45 PM                              │ │
│ │    |                                                    │ │
│ │    ✓ Shipped                                            │ │
│ │    July 9, 2026 at 10:00 AM                             │ │
│ │    |                                                    │ │
│ │    🚚 Out for Delivery                                  │ │
│ │    July 10, 2026 at 8:00 AM                             │ │
│ │    |                                                    │ │
│ │    ⏳ Delivered                                          │ │
│ │    Expected: July 10, 2026 by 5:00 PM                   │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ DELIVERY INFO                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Delivery Information                                    │ │
│ │                                                         │ │
│ │ 📍 Address: House 123, Street 4, Lahore                 │ │
│ │ 📞 Phone: 0321-1234567                                 │ │
│ │ 🚚 Delivery Partner: Rider Name                         │ │
│ │ 📱 Contact Rider: [Call] [WhatsApp]                     │ │
│ │                                                         │ │
│ │ Estimated Delivery: Today by 5:00 PM                    │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ ORDER ITEMS                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Items in this order                                     │ │
│ │                                                         │ │
│ │ ┌─────┐ ┌────────────┐ ┌──────┐                       │ │
│ │ │     │ │ Product 1  │ │ Rs.  │                       │ │
│ │ │ Img │ │ Title      │ │1500  │                       │ │
│ │ │     │ │ Qty: 2     │ │      │                       │ │
│ │ └─────┘ └────────────┘ └──────┘                       │ │
│ │                                                         │ │
│ │ ┌─────┐ ┌────────────┐ ┌──────┐                       │ │
│ │ │     │ │ Product 2  │ │ Rs.  │                       │ │
│ │ │ Img │ │ Title      │ │800   │                       │ │
│ │ │     │ │ Qty: 1     │ │      │                       │ │
│ │ └─────┘ └────────────┘ └──────┘                       │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ HELP                                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Need Help?                                              │ │
│ │                                                         │ │
│ │ [💬 Contact Merchant]  [📞 Call Support]                │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. ABOUT US PAGE

**URL:** `ali.digitaldukaan.pk/about`

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (same as home)                                       │
├─────────────────────────────────────────────────────────────┤
│ HERO SECTION                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │         About [Shop Name]                               │ │
│ │                                                         │ │
│ │    "We are a family business selling quality            │ │
│ │     clothing since 2020"                                 │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ OUR STORY                                                   │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Our Story                                               │ │
│ │                                                         │ │
│ │ [Image]                                                 │ │
│ │                                                         │ │
│ │ We started this shop in 2020 with a simple goal:        │ │
│ │ provide quality products at affordable prices.          │ │
│ │                                                         │ │
│ │ Our family has been in the clothing business for        │ │
│ │ over 10 years, and now we're taking it online           │ │
│ │ thanks to Digital Dukaan.                               │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ WHY CHOOSE US                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Why Choose Us?                                          │ │
│ │                                                         │ │
│ │ ✓ Quality Products    ✓ Fast Delivery                  │ │
│ │ ✓ Affordable Prices   ✓ Secure Payments                │ │
│ │ ✓ Easy Returns        ✓ 24/7 Support                   │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ CONTACT INFO                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Contact Us                                              │ │
│ │                                                         │ │
│ │ 📍 Address: House 123, Street 4, Lahore                 │ │
│ │ 📞 Phone: 0321-1234567                                 │ │
│ │ ✉️ Email: info@ali.digitaldukaan.pk                    │ │
│ │                                                         │ │
│ │ [WhatsApp Us]  [Call Us]                                │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ SOCIAL LINKS                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Follow Us                                               │ │
│ │ [Facebook] [Instagram] [TikTok]                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. CONTACT PAGE

**URL:** `ali.digitaldukaan.pk/contact`

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (same as home)                                       │
├─────────────────────────────────────────────────────────────┤
│ PAGE TITLE                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Contact Us                                              │ │
│ │ "We'd love to hear from you"                            │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ CONTACT OPTIONS                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │ │
│ │ │ 💬          │ │ 📞          │ │ ✉️          │       │ │
│ │ │ WhatsApp    │ │ Phone       │ │ Email       │       │ │
│ │ │ Chat Now    │ │ Call Now    │ │ Send Email  │       │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘       │ │
│ │                                                         │ │
│ │ Response time: Usually replies in 5 minutes             │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ CONTACT FORM                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Send us a Message                                       │ │
│ │                                                         │ │
│ │ Your Name*      [________________]                      │ │
│ │ Phone Number*   [________________]                      │ │
│ │ Email           [________________]                      │ │
│ │                                                         │ │
│ │ Subject*                                               │ │
│ │ [General Inquiry ▼]                                     │ │
│ │                                                         │ │
│ │ Message*                                                │ │
│ │ [____________________________________________]          │ │
│ │ [____________________________________________]          │ │
│ │                                                         │ │
│ │ [Send Message]                                          │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ QUICK QUESTIONS                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Common Questions                                        │ │
│ │                                                         │ │
│ │ "Is this item available?"         [Send on WhatsApp]    │ │
│ │ "What is the delivery time?"      [Send on WhatsApp]    │ │
│ │ "Can I get a discount?"           [Send on WhatsApp]    │ │
│ │ "What is your return policy?"     [Send on WhatsApp]    │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ MAP (Optional)                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │              [Google Map]                               │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. MOBILE RESPONSIVE DESIGN

### Breakpoints

```css
/* Mobile First Approach */

/* Small phones */
@media (max-width: 320px) {
  /* Compact layout */
}

/* Standard phones */
@media (max-width: 480px) {
  /* Default mobile */
}

/* Large phones */
@media (max-width: 640px) {
  /* Slightly larger */
}

/* Tablets */
@media (min-width: 768px) {
  /* Tablet layout */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Desktop layout */
}

/* Large desktop */
@media (min-width: 1280px) {
  /* Wide layout */
}
```

### Mobile vs Desktop Comparison

```
┌─────────────────────────────────────────────────────────────┐
│ MOBILE VIEW                                                 │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────┐                        │
│ │ ☰  Shop Name    🔍 🛒 💬       │                        │
│ ├─────────────────────────────────┤                        │
│ │                                 │                        │
│ │     [Banner - Full Width]       │                        │
│ │                                 │                        │
│ ├─────────────────────────────────┤                        │
│ │ [All][Cat1][Cat2][Cat3] →      │                        │
│ ├─────────────────────────────────┤                        │
│ │ ┌──────────┐ ┌──────────┐      │                        │
│ │ │ Product  │ │ Product  │      │                        │
│ │ │  1       │ │  2       │      │                        │
│ │ └──────────┘ └──────────┘      │                        │
│ │ ┌──────────┐ ┌──────────┐      │                        │
│ │ │ Product  │ │ Product  │      │                        │
│ │ │  3       │ │  4       │      │                        │
│ │ └──────────┘ └──────────┘      │                        │
│ ├─────────────────────────────────┤                        │
│ │ 🏠  📦  💳  👤                  │                        │
│ └─────────────────────────────────┘                        │
│  Bottom Navigation                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ DESKTOP VIEW                                                │
├─────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Logo  Home  Products  About  Contact   🔍 🛒 👤 💬   │  │
│ ├───────────────────────────────────────────────────────┤  │
│ │                                                       │  │
│ │              [Banner - Full Width]                    │  │
│ │                                                       │  │
│ ├───────────────────────────────────────────────────────┤  │
│ │                                                       │  │
│ │ ┌──────┐ ┌──────────────────────────────────────┐   │  │
│ │ │      │ │                                       │   │  │
│ │ │ Side │ │     Product Grid (4 columns)          │   │  │
│ │ │ bar  │ │                                       │   │  │
│ │ │      │ │ ┌────┐ ┌────┐ ┌────┐ ┌────┐          │   │  │
│ │ │ Cat1 │ │ │ P1 │ │ P2 │ │ P3 │ │ P4 │          │   │  │
│ │ │ Cat2 │ │ └────┘ └────┘ └────┘ └────┘          │   │  │
│ │ │ Cat3 │ │ ┌────┐ ┌────┐ ┌────┐ ┌────┐          │   │  │
│ │ │      │ │ │ P5 │ │ P6 │ │ P7 │ │ P8 │          │   │  │
│ │ └──────┘ │ └────┘ └────┘ └────┘ └────┘          │   │  │
│ │          │                                       │   │  │
│ │          └──────────────────────────────────────┘   │  │
│ └───────────────────────────────────────────────────────┘  │
│ Footer                                                      │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Features
- **Bottom Navigation:** Home, Products, Cart, Account
- **Hamburger Menu:** Hidden navigation
- **Swipeable Banners:** Touch gestures
- **Sticky Add to Cart:** Fixed at bottom on product page
- **Pull to Refresh:** On product lists
- **Tap to Call:** Phone numbers clickable

### Desktop Features
- **Sticky Header:** Always visible
- **Sidebar Navigation:** Categories
- **Hover Effects:** Product cards
- **Mega Menu:** Category dropdowns
- **Quick View:** Product preview modal
- **Multi-column Layout:** More products visible

---

## NEXT.JS TECHNOLOGY STACK

### Why Next.js?

```
┌─────────────────────────────────────────────────────────────┐
│ NEXT.JS BENEFITS                                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ 1. FAST                                                     │
│    ├── Server-side rendering (SSR)                           │
│    ├── Static generation (SSG)                               │
│    └── Automatic code splitting                              │
│                                                              │
│ 2. SEO FRIENDLY                                              │
│    ├── Server-rendered pages                                 │
│    ├── Meta tags support                                     │
│    └── Sitemap generation                                    │
│                                                              │
│ 3. EASY DEPLOYMENT                                          │
│    ├── Vercel (free tier available)                          │
│    ├── One-click deploy                                      │
│    └── Custom domain support                                 │
│                                                              │
│ 4. REACT BASED                                               │
│    ├── Same code as mobile app                               │
│    ├── Reusable components                                   │
│    └── Easy to learn                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Project Structure

```
customer-website/
├── app/
│   ├── [shop]/
│   │   ├── page.tsx              # Home page
│   │   ├── products/
│   │   │   └── page.tsx          # Product listing
│   │   ├── product/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Product detail
│   │   ├── cart/
│   │   │   └── page.tsx          # Shopping cart
│   │   ├── checkout/
│   │   │   └── page.tsx          # Checkout
│   │   ├── order/
│   │   │   └── [id]/
│   │   │       ├── confirmation/
│   │   │       │   └── page.tsx  # Order confirmation
│   │   │       └── track/
│   │   │           └── page.tsx  # Order tracking
│   │   ├── about/
│   │   │   └── page.tsx          # About us
│   │   └── contact/
│   │       └── page.tsx          # Contact
│   └── layout.tsx                # Root layout
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── CartItem.tsx
│   ├── CheckoutForm.tsx
│   └── OrderTimeline.tsx
├── lib/
│   ├── api.ts                    # API calls
│   ├── utils.ts                  # Helpers
│   └── constants.ts              # Config
└── styles/
    └── globals.css               # Styles
```

---

## API ENDPOINTS (Same as Mobile App)

The customer website uses the **same API** as the mobile app:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/shops/:shopId` | GET | Get shop info |
| `GET /api/shops/:shopId/products` | GET | List products |
| `GET /api/products/:id` | GET | Get product detail |
| `POST /api/orders` | POST | Create order |
| `GET /api/orders/:id` | GET | Get order status |
| `POST /api/contact` | POST | Send message |

---

## SUMMARY

| Page | URL | Purpose |
|------|-----|---------|
| Home | `shop.domain.pk` | Storefront |
| Products | `/products` | Product listing |
| Product Detail | `/product/[id]` | Single product |
| Cart | `/cart` | Shopping cart |
| Checkout | `/checkout` | Place order |
| Confirmation | `/order/[id]/confirmation` | Order success |
| Tracking | `/order/[id]/track` | Track order |
| About | `/about` | Shop info |
| Contact | `/contact` | Contact form |

---

**Document Complete - 10 Customer Website Pages**
