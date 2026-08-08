# Anti-Pattern: Hidden Stack inside Tabs Navigator

## Problem
In Expo Router / React Navigation, registering a `(stack)` directory as a hidden tab screen (`<Tabs.Screen name="(stack)" options={{ href: null }} />`) inside a `<Tabs>` layout breaks stack history.

## Why It Fails
When navigating from a tab (e.g. `more` Settings) to a stack screen (e.g. `settings/notifications`), React Navigation switches the active **tab** from `more` to `(stack)`.
When the user taps Back (`router.back()`), `(stack)` has no previous screen in its own stack history. React Navigation pops **Tab Navigator History** instead of a screen stack, which defaults to returning to the `firstRoute` (**Home** tab).

## Correct Pattern
Wrap `<Tabs>` inside a `<Stack>` Navigator:
- `src/app/(app)/_layout.tsx` -> `<Stack screenOptions={{ headerShown: false }} />`
- `src/app/(app)/(tabs)/_layout.tsx` -> `<Tabs>` (Home, Products, Orders, Settings)
- Sub-screens live on the `(app)` Stack Navigator above tabs.

Tapping Back pops the stack naturally and returns dynamically to whichever screen or tab the user came from.
