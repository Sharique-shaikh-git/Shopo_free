# Product List (Merchant) — Build Journal

## Screen Info
- **Stitch Title:** Product List (Merchant)
- **Stitch ID:** `projects/4974162280221750953/screens/{screen_id}`
- **Device:** Mobile (780×1768)
- **File:** `apps/merchant-mobile/src/app/(app)/products/index.tsx`
- **Status:** ✅ Already matching Stitch — no changes needed

## What I Fetched from Stitch
HTML with:
- Header: storefront icon + "Shop Builder" title (growth-green) + language button
- Search bar: search icon, "Search your products..." placeholder, focus ring
- Filter chips: All Products (selected=primary bg), In Stock, Out of Stock, Drafts
- Product rows: 64×64 image, name (line-clamp-1), price (PKR bold), status badge, chevron-right
- Out of Stock state: grayscale image, opacity-60, error-container badge
- FAB: Add Product (growth-green, bottom-right, 56×56)
- Bottom nav: Orders, Upload, Dashboard (selected), Profile

## What Was Already There
Component already implemented with:
- ✅ Header with storefront icon, title, language button
- ✅ Search bar with search icon
- ✅ Filter chips (All Products, In Stock, Out of Stock, Drafts)
- ✅ Product list with image, name, price, status badge, chevron-right
- ✅ Out of Stock state: grayscale, opacity, error badge
- ✅ FAB: Add Product button
- ✅ Mock data fallback for empty DB
- ✅ API integration with apiFetch('/products')
- ✅ FadeInDown animations

## No Changes Made
Screen was already pixel-perfect to Stitch design.

## Dependencies Used
- `react-native-reanimated` (FadeInDown)
- `@expo/vector-icons` (MaterialIcons)
- `expo-router` (useRouter)
- `expo-image` (not used — using RN Image)
