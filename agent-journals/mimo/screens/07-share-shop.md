# Share Shop — Build Journal

## Screen Info
- **Stitch Title:** Share Shop
- **Stitch ID:** `projects/4974162280221750953/screens/b302c5e410d34706b0dc19f1d2a48d8d`
- **Device:** Mobile
- **File:** `apps/merchant-mobile/src/app/(app)/store/share.tsx` (NEW)
- **Status:** ✅ Created matching Stitch design

## What I Fetched from Stitch
HTML with:
- Header: back arrow, "Share Shop" title (growth-green)
- Shop Preview Card: storefront icon, shop name, "24 Products • 4.9 Rating" with star icon
- Shop Link Box: URL text (readonly), copy button (growth-green)
- Share Buttons Row: WhatsApp (green), Facebook (blue), Instagram (gradient), More (gray)
- QR Code Section: QR code image, "Scan to visit my shop" text
- Bottom Action: "More Sharing Options" button (trust-blue border)

## What I Built
New file `store/share.tsx` with:
- ✅ Header with back arrow and centered title
- ✅ Shop Preview Card with store name, product count, rating
- ✅ Shop Link Box with copy functionality (uses Share API)
- ✅ Share buttons row (WhatsApp, Facebook, Instagram, More)
- ✅ QR Code placeholder (MaterialIcons qr-code)
- ✅ Bottom "More Sharing Options" button
- ✅ API integration to load store data
- ✅ FadeInDown animations

## Issues / Notes
- QR code is a placeholder icon — would need actual QR generation library
- Share buttons don't deep-link to specific apps — they use RN Share API
- Instagram share doesn't have a direct share API on mobile
- Shop URL uses `digitaldukaan.pk` domain — needs backend config

## Dependencies Used
- `react-native-reanimated` (FadeInDown, FadeIn)
- `@expo/vector-icons` (MaterialIcons)
- `expo-router` (useRouter)
- React Native `Share` API
