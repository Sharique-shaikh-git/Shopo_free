# Order Tracking (with Live Motion) — Build Journal

## Screen Info
- **Stitch Title:** Order Tracking with Live Motion
- **Stitch ID:** `projects/4974162280221750953/screens/0041005eaf834f89ac2872ef013312f7`
- **Device:** Mobile
- **File:** `apps/merchant-mobile/src/app/(app)/orders/[id].tsx` (REWRITTEN)
- **Status:** ✅ Rewritten with tracking features

## What I Fetched from Stitch
HTML with:
- Header: storefront icon + "Shop Builder" + language button
- Order Identity: Order #SB-8291, "Tracking your package", "In Transit" badge, estimated delivery
- Map Placeholder: delivery route with pulsing location icon
- Bento Grid: Arrival Time (~45 mins), Carrier (Swift Logistics)
- Vertical Stepper: Order Timeline (4 steps with pulse animation on active)
- Order Details: collapsible section with items, total
- Bottom Action Bar: Call Merchant, Support

## What I Changed
- ✅ Complete rewrite of orders/[id].tsx (was just a basic order detail)
- ✅ Added order tracking header with order number and status badge
- ✅ Map placeholder with pulsing location animation
- ✅ Bento grid cards (Arrival Time, Carrier)
- ✅ Vertical stepper timeline with active/completed/inactive states
- ✅ Pulse animation on active step
- ✅ Order details section with items list
- ✅ Bottom action bar: Call Merchant (opens phone), Support button
- ✅ API integration with apiFetch

## Dependencies Used
- `react-native-reanimated` (FadeInDown, FadeIn, withRepeat, withTiming)
- `@expo/vector-icons` (MaterialIcons)
- `expo-router` (useLocalSearchParams)
- React Native `Linking` API
