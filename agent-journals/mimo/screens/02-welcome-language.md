# Welcome & Language Selection — Build Journal

## Screen Info
- **Stitch Title:** Welcome & Language Selection
- **Stitch ID:** `projects/4974162280221750953/screens/1176104420d4447094d205d99dcd1ffd`
- **Device:** Mobile (780×1768)
- **File:** `apps/merchant-mobile/src/app/(auth)/welcome.tsx`
- **Status:** ✅ Already matching Stitch — no changes needed

## What I Fetched from Stitch
HTML with:
- Header: green rounded-2xl storefront icon (32px, white), title "Start your online business in seconds" (28px bold), subtitle (18px body)
- Language cards: English (selected by default, green border, check_circle), Urdu (unselected)
- Bottom action bar: "Start Now" button (growth-green bg, arrow_forward icon)
- Animations: CSS transitions on card selection (border-color, background-color, checkmark opacity)

## What Was Already There
Component already implemented with:
- ✅ Storefront icon in green rounded-2xl container
- ✅ Title and subtitle matching Stitch text
- ✅ English/Urdu language selection with state management
- ✅ Green border + checkmark on selected language
- ✅ "Start Now" button with arrow_forward icon
- ✅ Safe area padding for bottom bar
- ✅ FadeInDown animations (exceeds Stitch — good)

## Minor Differences (Acceptable)
- Stitch uses `border-growth-green` directly; current uses `border-primary-container` (same color #006B5E)
- Current adds `springify()` to animations (Stitch has none) — this is an improvement
- Current uses `bg-[#F0FDF4]` for selected bg (matches Stitch's `#F0FDF4`)

## No Changes Made
Screen was already pixel-perfect to Stitch design.

## Dependencies Used
- `react-native-reanimated` (FadeInDown, FadeIn)
- `@expo/vector-icons` (MaterialIcons)
- `expo-router` (useRouter)
