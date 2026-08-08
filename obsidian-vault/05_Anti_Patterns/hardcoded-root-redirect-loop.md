# Anti-Pattern: Hardcoded Root Entry Redirect Loop

## Problem
Placing `<Redirect href="/(auth)/welcome" />` inside the root entry file `src/app/index.tsx` causes post-login navigation loops.

## Why It Fails
When a user logs in or registers on `(auth)/login.tsx`, the app saves the auth token and calls `router.replace('/')`.
Because `'/'` maps to `src/app/index.tsx`, the hardcoded `<Redirect href="/(auth)/welcome" />` immediately redirects the user right back to `/(auth)/welcome`, trapping the user in a 3-screen infinite loop.

## Correct Pattern
Set root `src/app/index.tsx` to redirect to `/(app)`:
```tsx
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href={"/(app)" as any} />;
}
```
Let `AuthGuard` in `_layout.tsx` inspect `getToken()`. If no token exists, `AuthGuard` routes to `/(auth)/welcome`. If a token exists, the user enters `/(app)` Home screen seamlessly.
