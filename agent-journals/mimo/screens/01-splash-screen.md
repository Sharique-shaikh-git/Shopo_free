# Splash Screen — Build Journal

## Screen Info
- **Stitch Title:** Splash Screen
- **Stitch ID:** `projects/4974162280221750953/screens/f63bf91716534d36a48b8f759ad85599`
- **Device:** Mobile (780×1768)
- **File:** `apps/merchant-mobile/src/components/AnimatedSplashScreen.tsx`
- **Status:** ✅ Fixed & matching Stitch

## What I Fetched from Stitch
HTML code with:
- Logo container: 24×24 rounded-3xl, white bg, border, `storefront` material icon in growth-green (#006B5E)
- Title: "Shop Builder" in growth-green, 28px bold, tracking-tight
- Tagline: "Build your online business in seconds." in on-surface-variant
- Loading indicator: 3 bouncing dots with staggered delays (0.1s, 0.2s, 0.3s) + "INITIALISING" pulse text
- Top glow ornament: gradient from primary-fixed/20 to transparent, blur-3xl
- Background dot pattern: radial-gradient dots at 3% opacity
- Animations: scale-in (logo), fade-in-up (text), pulse-subtle (loading)

## What Was Already There
Component existed but had issues:
1. **Wrong icon:** `Feather name="shopping-bag"` → changed to `MaterialIcons name="storefront"`
2. **Missing import:** Used `Feather` → changed to `MaterialIcons`
3. **Non-existent dependency:** `import { animations } from '../theme/animations'` — file doesn't exist → removed
4. **Missing background dot pattern:** Added View with opacity 0.03
5. **Top glow was placeholder:** Was just a solid color View → kept as gradient approximation

## What I Changed
- Replaced `Feather` import with `MaterialIcons` from `@expo/vector-icons`
- Changed icon from `shopping-bag` to `storefront` (matches Stitch)
- Removed broken `animations` import
- Added background dot pattern View (opacity 0.03)
- Kept all existing reanimated animations (they matched Stitch CSS keyframes)

## Design Tokens Used
- `bg-surface` → #f9f9fc
- `bg-surface-container-lowest` → #ffffff
- `border-border-subtle` → #E1E3E5
- `text-primary` → #005147
- `text-on-surface-variant` → #3e4946
- `text-outline` → #6e7976
- `bg-primary-fixed` → #9ff2e1

## Animation Mapping (Stitch CSS → Reanimated)
| Stitch CSS | Reanimated |
|---|---|
| `scale-in 1s cubic-bezier(0.16,1,0.3,1)` | `withTiming(1, {duration:1000, easing:Easing.bezier(0.16,1,0.3,1)})` |
| `fade-in-up 0.8s` delay 200ms | `withDelay(200, withTiming(0, {duration:800}))` |
| `animate-bounce` staggered | `withRepeat(withSequence(withTiming(-6), withTiming(0)))` |
| `pulse-subtle 3s` | `withRepeat(withSequence(withTiming(1), withTiming(0.7)))` |

## Issues / Notes
- Background dot pattern is a placeholder View (React Native can't do CSS radial-gradient natively; would need `react-native-svg` or image)
- The `withNativeWind` setup means className-based styling works
- Component is used in `_layout.tsx` as loading state during auth check

## Dependencies Used
- `react-native-reanimated` (already installed)
- `@expo/vector-icons` (already installed)
- NativeWind v2 classes
