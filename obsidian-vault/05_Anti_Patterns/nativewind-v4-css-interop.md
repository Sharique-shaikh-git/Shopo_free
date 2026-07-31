# Anti-Pattern: NativeWind v4 with Expo Router

## The Problem
When using `nativewind@4` alongside `expo-router`, you may encounter the following error across the entire application:
`Couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?`

This happens despite the fact that `expo-router` automatically handles the `NavigationContainer`.

## Root Cause
NativeWind v4 uses `react-native-css-interop`. This module intercepts and wraps standard React components to inject Tailwind styles natively. Unfortunately, doing so can mess with React's Context stringification, causing `expo-router`'s underlying React Navigation contexts to become orphaned or unrecognizable by child routes and standard components.

## The Fix
Downgrade to **NativeWind v2**.
NativeWind v2 relies solely on a standard Babel plugin (`nativewind/babel`) rather than mutating React elements via `cssInterop` at runtime.

### Downgrade Steps:
1. `pnpm remove nativewind react-native-css-interop`
2. `pnpm add nativewind@2.0.11 tailwindcss@3.3.2`
3. Remove `react-native-css-interop` imports from code (like `cssInterop(SafeAreaView, ...)`).
4. Remove `jsxImportSource: "nativewind"` from the `babel.config.js` presets.
5. Add `nativewind/babel` to plugins/presets in `babel.config.js`.
6. Restart Expo with `--clear` cache flag.

## Why we record this
So we don't accidentally upgrade to v4 in the future until they officially fix the context-wrapping issue with `expo-router`.
