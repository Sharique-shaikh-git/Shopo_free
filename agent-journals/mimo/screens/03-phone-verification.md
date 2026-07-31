# Phone Verification — Build Journal

## Screen Info
- **Stitch Title:** Phone Verification
- **Stitch ID:** `projects/4974162280221750953/screens/92466d8748e3459882e0bf78f37625a6`
- **Device:** Mobile (780×1768)
- **File:** `apps/merchant-mobile/src/app/(auth)/phone.tsx` (NEW)
- **Status:** ✅ Created matching Stitch design

## What I Fetched from Stitch
HTML with:
- Header: back arrow button (left-aligned, w-10 h-10 rounded-full)
- Branding: phone_android icon (40px) in primary-fixed bg (#9ff2e1), 16×16 rounded-2xl
- Title: "Enter your phone number" (28px bold, tracking-tight)
- Subtitle: "We will send a 4-digit code to verify your account." (16px body)
- Phone input: Pakistan flag placeholder + "+92" prefix, "300 1234567" placeholder, 10-digit max
- Info notice: blue info icon, "By continuing, you agree to receive an automated SMS code..."
- Button: "Send Code" with chevron_right, opacity-60 when < 10 digits, loading spinner on submit
- Background: blur ornaments (primary/5 and trust-blue/5)
- Max-width container: 480px

## What I Built
New file `phone.tsx` with:
- ✅ Back arrow header (MaterialIcons arrow-back)
- ✅ phone_android icon in primary-fixed rounded-2xl container
- ✅ Title and subtitle matching Stitch text
- ✅ Phone input with PK flag placeholder, +92 prefix, 10-digit limit
- ✅ Info notice with info icon in blue
- ✅ "Send Code" button with chevron_right, disabled state when < 10 digits
- ✅ Loading spinner on submit
- ✅ Background blur ornaments (opacity 30%)
- ✅ FadeInDown animations (Stitch has none — enhancement)

## Flow Change
Updated `welcome.tsx` to navigate to `/(auth)/phone` instead of `/(auth)/onboarding`.

This means the auth flow is now:
1. Welcome & Language Selection → Phone Verification → (OTP entry — future) → Onboarding → Dashboard

## Design Tokens Used
- `bg-surface-container-lowest` → #ffffff
- `bg-surface-gray` → #F8F9FA
- `text-on-surface` → #1a1c1e
- `text-on-surface-variant` → #3e4946
- `text-outline` → #6e7976
- `border-outline-variant` → #bec9c5
- `border-border-subtle` → #E1E3E5
- `bg-primary-fixed` → #9ff2e1
- `text-primary` → #005147
- `bg-primary-container` → #006b5e
- `text-trust-blue` → #0055D4

## Issues / Notes
- Pakistan flag is a placeholder "PK" text — would need actual flag image asset
- OTP entry screen doesn't exist yet — `handleSendCode` is a placeholder
- API endpoint for sending OTP needs to be implemented on backend
- The Stitch design has `input-focus-ring` CSS for focus state — React Native doesn't have this natively, could use state-based border color change

## Dependencies Used
- `react-native-reanimated` (FadeInDown, FadeIn)
- `@expo/vector-icons` (MaterialIcons)
- `expo-router` (useRouter)
