# Merchant Dashboard (with Motion) — Build Journal

## Screen Info
- **Stitch Title:** Merchant Dashboard with Motion
- **Stitch ID:** `projects/4974162280221750953/screens/a1fb4d9f614b4bafb2902b9c679a1029`
- **Device:** Mobile (780×1768)
- **Files:** 
  - `apps/merchant-mobile/src/app/(app)/dashboard.tsx` (rewritten)
  - `apps/merchant-mobile/src/app/(app)/_layout.tsx` (updated)
- **Status:** ✅ Rewritten to match Stitch with motion

## What I Fetched from Stitch
HTML with:
- Header: "Assalam-o-Alaikum," greeting, "Kinetic Growth" store name (growth-green), notification bell with red dot
- Stats cards: horizontal scrollable, snap-x, 3 cards (Total Sales PKR, Orders, Products) with count-up animation
- AI Insight card: gradient bg (#005147→#006B5E→#008775), animated gradient shift (5s), "AI Store Insight" with pulse, "Share Link" button
- Quick Actions: 2x2 grid (Add Product, View Orders, Share Shop, Analytics)
- Recent Orders: customer avatar (initials), name, amount, status badge (Pending=light purple, Shipped=green, Delivered=gray)
- Bottom Nav: 5 tabs (Home[FILL], Store, Orders, Analytics, Settings)
- Animations: fade-slide-up with stagger delays, draw-in for icons, hover-scale, count-up JS

## What I Changed
### dashboard.tsx — Complete rewrite
- ✅ Header: greeting + store name (growth-green) + notification bell with red dot
- ✅ Stats cards: horizontal scroll, snap-to-interval, 3 cards
- ✅ Count-up animation: numbers animate from 0 to target value
- ✅ AI Insight card: LinearGradient with animated gradient colors, pulse animation on title
- ✅ Quick Actions: 2x2 grid with proper icons (MaterialIcons)
- ✅ Recent Orders: customer initials avatar, status badges with correct colors per status
- ✅ All FadeInDown stagger animations matching Stitch delays

### _layout.tsx — Updated tab bar
- ✅ Changed from 4 tabs to 5 tabs (Home, Store, Orders, Analytics, Settings)
- ✅ Changed icons from Feather to MaterialIcons (matching Stitch)
- ✅ Changed tab names: "My Shop" → "Home", added "Store" and "Analytics"
- ✅ Updated tab bar styling with shadow, proper height
- ✅ Hidden products and customers from tab bar (accessible via navigation)

## Design Tokens Used
- `bg-surface` → #f9f9fc
- `bg-surface-container-low` → #f3f3f6
- `bg-surface-container-lowest` → #ffffff
- `bg-surface-container-high` → #e8e8ea
- `border-border-subtle` → #E1E3E5
- `text-on-surface` → #1a1c1e
- `text-on-surface-variant` → #3e4946
- `text-growth-green` → #006B5E
- `bg-primary-container/20` → 20% opacity of #006b5e
- `bg-tertiary-container/20` → 20% opacity of #0055d4
- `bg-secondary-container/30` → 30% opacity of #5dfd8a
- `bg-error-red` → #BA1A1A
- `bg-status-shipped` → #F0FDF4

## Animation Mapping (Stitch → Reanimated)
| Stitch CSS | Reanimated |
|---|---|
| `fade-slide-up 0.6s` stagger 100-500ms | `FadeInDown.duration(600).delay(N).springify()` |
| `draw-icon 0.8s` | (implicit in FadeInDown) |
| `ai-pulse 2s infinite` | `withRepeat(withSequence(withTiming(1), withTiming(0.7)))` |
| `gradientShift 5s ease infinite` | `withRepeat(withTiming(1, {duration:5000}))` |
| `count-up` JS | `setInterval` with increment |

## Issues / Notes
- Count-up animation only runs once on load (not on every focus)
- Gradient animation is a static LinearGradient (can't animate gradient stops natively in RN)
- The Stitch design has a desktop nav bar (hidden on mobile) — not implemented
- Status badge colors: Stitch uses `bg-[#FEF7FF]` for pending, `bg-status-shipped` for shipped — mapped correctly
- "See All" button doesn't navigate yet — needs router to orders list

## Dependencies Used
- `react-native-reanimated` (FadeInDown, FadeIn, withRepeat, withTiming, withSequence)
- `@expo/vector-icons` (MaterialIcons)
- `expo-linear-gradient` (LinearGradient)
- `expo-router` (Tabs)
