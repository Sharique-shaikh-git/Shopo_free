# SHOPO — COMPLETE HANDOFF TO OPUS 4.8

## What You're Building
AI-powered store builder for Pakistani merchants. Mobile-first. "Open the app → take photos → start receiving orders."

## Project Location
```
D:\project\new app
```
Branch: `main` | Repo: `https://github.com/Sharique-shaikh-git/Shopo_free`

---

## EXISTING CODEBASE STATUS

### What Works (Don't Rebuild)
| Component | Location | Status |
|-----------|----------|--------|
| NestJS API (21 endpoints) | `apps/api/src/` | **Working** — deployed at `https://shopoapi-production.up.railway.app` |
| Database schema (5 tables) | `packages/database/src/schema.ts` | **Done** — merchants, stores, products, orders, ai_jobs |
| AI Worker (BullMQ + Gemini) | `apps/worker/src/` | **Done** — async product enrichment |
| Customer Storefront | `apps/storefront-web/` | **Built** — Next.js 16, NOT deployed |
| Shared DTOs + Zod schemas | `packages/shared/src/` | **Done** |
| CI pipeline | `.github/workflows/ci.yml` | **Done** — build + typecheck |

### What's Broken (Fix First)
1. **Auth flow is dead** — `phone.tsx` has `setTimeout` with `// TODO: Call API to send OTP`. No actual OTP. User goes welcome → phone → dead end. Never reaches login.
2. **Fake data everywhere** — 15 files have hardcoded `mockProducts`, `mockOrders`, fallback data. Remove ALL of it.
3. **UI alignment** — Elements not properly aligned, scrolling awkward
4. **Screens not matching Stitch** — Built screens exist but don't match the Stitch designs pixel-perfect

### Fake Data Files to Clean (Remove ALL mock/fallback data)
| File | What to Remove |
|------|----------------|
| `products/index.tsx` | `mockProducts` array (lines 32-56) |
| `orders/index.tsx` | `mockOrders` + hardcoded stats (lines 27-73) |
| `orders/advanced-filters.tsx` | `mockOrders` array (lines 32-59) |
| `products/category.tsx` | `mockProducts` (lines 27-58) — no API call at all |
| `products/edit.tsx` | Hardcoded product form (lines 7, 12-18) |
| `products/[id].tsx` | Fallback product data (lines 25-26, 38-43) |
| `orders/confirmation.tsx` | `ORDER_ITEMS` hardcoded (lines 7-10) |
| `orders/checkout.tsx` | `CART_ITEMS` hardcoded (lines 6-8) |
| `orders/[id].tsx` | Fallback order data (lines 42-53) |
| `products/enrichment.tsx` | Fake AI description via setTimeout (lines 10-18) |
| `phone.tsx` | setTimeout OTP mock (lines 12-19) |
| `index.tsx` (dashboard) | Fallback store name + hardcoded AI insight (lines 116, 248) |

---

## STITCH DESIGN SYSTEM (Build ALL Screens From This)

### How to Fetch Stitch Screens
```
Project ID: 4974162280221750953
API Key: YOUR_STITCH_API_KEY
Auth Header: X-Goog-Api-Key (NOT Authorization: Bearer)
```

**Fetch screen list:**
```bash
curl -s "https://stitch.googleapis.com/v1/projects/4974162280221750953/screens" -H "X-Goog-Api-Key: YOUR_STITCH_API_KEY"
```

**Fetch individual screen HTML:**
```bash
curl -s "https://stitch.googleapis.com/v1/projects/4974162280221750953/screens/{SCREEN_ID}:toHTML" -H "X-Goog-Api-Key: YOUR_STITCH_API_KEY"
```

### 46 Merchant-Facing Screens to Build/Rebuild
| # | Screen | Stitch ID | Current File | Status |
|---|--------|-----------|--------------|--------|
| 1 | Splash Screen | `f63bf917...` | `components/AnimatedSplashScreen.tsx` | Needs rebuild |
| 2 | Welcome & Language | `11761044...` | `(auth)/welcome.tsx` | Needs rebuild |
| 3 | Phone Verification | `92466d87...` | `(auth)/phone.tsx` | **BROKEN** — no OTP |
| 4 | Onboarding | `6bb02603...` | `(auth)/onboarding.tsx` | Needs rebuild |
| 5 | Merchant Dashboard | `a913d1f3...` | `(app)/index.tsx` | Needs rebuild |
| 6 | Store Creation | `aec5350c...` | `store/create.tsx` | Needs rebuild |
| 7 | Share Shop | `b302c5e4...` | `store/share.tsx` | Needs rebuild |
| 8 | Product List | `179281b9...` | `products/index.tsx` | Needs rebuild |
| 9 | Product Detail | `2052c80d...` | `products/[id].tsx` | Needs rebuild |
| 10 | Product Photo Upload | `92fd15bd...` | `products/upload.tsx` | Needs rebuild |
| 11 | Edit Product | `f647c329...` | `products/edit.tsx` | Needs rebuild |
| 12 | Product by Category | `92ee1e76...` | `products/category.tsx` | Needs rebuild |
| 13 | AI Enrichment Review | `93422256...` | `products/enrichment.tsx` | Needs rebuild |
| 14 | Orders Dashboard | `2156ee58...` | `orders/index.tsx` | Needs rebuild |
| 15 | Orders Advanced Filters | `97a33d5f...` | `orders/advanced-filters.tsx` | Needs rebuild |
| 16 | Order Detail & Status | `39c6be24...` | `orders/[id].tsx` | Needs rebuild |
| 17 | Order Confirmation | `2d57b3fc...` | `orders/confirmation.tsx` | Needs rebuild |
| 18 | COD Checkout | `a4a2f500...` | `orders/checkout.tsx` | Needs rebuild |
| 19 | Store Launch Animation | `cb39803f...` | `store/launch.tsx` | Needs rebuild |
| 20 | Store Launch URL | `ddf4719e...` | `store/live.tsx` | Needs rebuild |
| 21 | Store Categories | `ae2f49e8...` | `store/categories.tsx` | Needs rebuild |
| 22 | Sales Analytics | `de7930b1...` | `analytics.tsx` | Needs rebuild |
| 23 | Customer List | `a027678e...` | `customers/index.tsx` | Needs rebuild |
| 24 | Customer Profile | `de39b760...` | `customers/profile.tsx` | Needs rebuild |
| 25 | Customer Detail | `de39b760...` | `customers/[id].tsx` | Needs rebuild |
| 26 | Settings Main | `fb4f42ab...` | `settings/index.tsx` | Needs rebuild |
| 27 | Account Settings | `596cdd2c...` | `settings/account.tsx` | Needs rebuild |
| 28 | Profile & Settings | `1ee2613b...` | `settings/profile-settings.tsx` | Needs rebuild |
| 29 | Notifications Panel | `0b3b9ef9...` | `settings/notifications.tsx` | Needs rebuild |
| 30 | Privacy Settings | `2f03fe04...` | `settings/privacy-settings.tsx` | Needs rebuild |
| 31 | Dark Mode | `d04eee0a...` | `settings/dark-mode.tsx` | Needs rebuild |
| 32 | Language Selection | `5d4f9e34...` | `settings/language.tsx` | Needs rebuild |
| 33 | Shop Configuration | `d71668aa...` | `settings/shop-config.tsx` | Needs rebuild |
| 34 | Payment Methods | `7debe405...` | `settings/payments.tsx` | Needs rebuild |
| 35 | Help Center | `1bf8786f...` | `settings/help.tsx` | Needs rebuild |
| 36 | Help Articles | `968494a9...` | `settings/help-articles.tsx` | Needs rebuild |
| 37 | Contact Support | `5c2c4f18...` | `settings/contact.tsx` | Needs rebuild |
| 38 | FAQ | `b8dfb897...` | `settings/faq.tsx` | Needs rebuild |
| 39 | About Us | `1637c5c8...` | `settings/about.tsx` | Needs rebuild |
| 40 | What's New | `a765fa45...` | `settings/whats-new.tsx` | Needs rebuild |
| 41 | Report a Problem | `5560ec59...` | `settings/report.tsx` | Needs rebuild |
| 42 | Terms of Service | `858e2d62...` | `settings/terms.tsx` | Needs rebuild |
| 43 | Privacy Policy | `4271ad67...` | `settings/privacy.tsx` | Needs rebuild |
| 44 | App Version Info | `c070713a...` | `settings/app-version.tsx` | Needs rebuild |

### Missing Screens (Not Yet Built)
| # | Screen | Stitch ID | Create File |
|---|--------|-----------|-------------|
| 45 | Notifications Inbox | `0b3b9ef9...` | `settings/notifications-inbox.tsx` (list, not just toggles) |
| 46 | Delete Account Confirmation | `37281d1c...` | `settings/delete-account.tsx` |

---

## STEP-BY-STEP PLAN FOR OPUS 4.8

### PHASE 1: Fix Auth (Do This First)
**Estimated time: 30 minutes**

1. Read `apps/merchant-mobile/src/app/(auth)/login.tsx` — it has working API calls
2. Fix `apps/merchant-mobile/src/app/(auth)/phone.tsx` — replace setTimeout with actual API call to send OTP (or use Clerk)
3. Fix `apps/merchant-mobile/src/app/_layout.tsx` — ensure AuthGuard routes correctly:
   - No token → `/(auth)/welcome`
   - Has token → `/(app)`
4. Test: Can register → login → see dashboard

**OR (if using Clerk):**
1. Install `@clerk/clerk-expo`
2. Wrap app in `<ClerkProvider>`
3. Replace login.tsx with Clerk's `<SignIn />` component
4. Update API to verify Clerk JWTs

### PHASE 2: Remove ALL Fake Data
**Estimated time: 20 minutes**

Go to each file listed in "Fake Data Files to Clean" above and:
- Delete `mockProducts`, `mockOrders`, `mockOrders` arrays
- Delete hardcoded fallback data
- Delete setTimeout mock AI descriptions
- Replace with empty state: "No products yet. Add your first product!"
- Ensure every screen calls the real API

### PHASE 3: Rebuild Screens from Stitch (One by One)
**Estimated time: 4-6 hours**

For EACH screen:
1. Fetch the Stitch HTML: `curl -s ".../{SCREEN_ID}:toHTML" -H "X-Goog-Api-Key: YOUR_STITCH_API_KEY"`
2. Read the current screen file
3. Rewrite the screen matching Stitch design exactly:
   - Same layout, spacing, colors
   - Same typography (Be Vietnam Pro font)
   - Same icons (MaterialIcons)
   - Same animations (react-native-reanimated FadeInDown.duration(600).springify())
4. Wire to real API (no mock data)
5. Test on device

**Build order (dependency-first):**
1. Splash Screen → Welcome → Phone Verification → Onboarding → Login
2. Dashboard → Products List → Product Detail → Product Create/Edit
3. Orders Dashboard → Order Detail → Order Confirmation
4. Store Creation → Store Share → Store Launch
5. Settings (all sub-screens)
6. Analytics → Customers
7. Missing screens (Notifications Inbox, Delete Account)

### PHASE 4: Add Clerk Auth + Subscriptions
**Estimated time: 1-2 hours**

1. Create Clerk account at clerk.com
2. Create new application (phone number auth)
3. Install `@clerk/clerk-expo` in merchant-mobile
4. Add `<ClerkProvider publishableKey="pk_test_...">` to _layout.tsx
5. Replace auth flow with Clerk's `<SignedIn>` / `<SignedOut>`
6. Create subscription plans in Clerk Dashboard
7. Add paywall screens in mobile app
8. Update API to verify Clerk JWTs

### PHASE 5: Deploy Everything
**Estimated time: 1 hour**

1. **API + Worker**: Already on Railway. Set env vars in Railway dashboard.
2. **Storefront**: Add `vercel.json`, deploy to Vercel
3. **Mobile**: Run `eas build --platform android` for APK/AAB
4. **Database**: Ensure Supabase production project has correct schema

### PHASE 6: End-to-End Test
**Estimated time: 30 minutes**

1. Register new merchant (phone + OTP)
2. Create store
3. Add product (with AI enrichment)
4. Get order (from storefront)
5. Update order status
6. Check analytics

---

## DOCUMENTATION TO READ

### Must-Read Before Starting
| File | What's In It |
|------|--------------|
| `.agents/context/PROJECT_BRIEF.md` | Full project overview |
| `.agents/context/TECH_STACK.md` | Frozen tech decisions |
| `.agents/context/DECISIONS.md` | 13 Architecture Decision Records |
| `.agents/checklists/SECURITY.md` | Security rules |
| `docs_generated_by_MIMO2.5v.../03_UI_UX_Design_Document.md` | Design tokens |
| `docs_generated_by_MIMO2.5v.../16_Stitcher_Prompts_Missing_Screens.md` | Screen prompts |

### Reference Docs (Read When Needed)
- `docs_generated_by_MIMO2.5v.../` — 30 planning docs
- `docs_generated_by_Kimi k2.6.../` — 14 architecture docs
- `obsidian-vault/` — 11 knowledge base files
- `agent-journals/mimo/` — 37 screen build journals

---

## KEY TECHNICAL DETAILS

### App Navigation Structure
```
app/
  (auth)/          # Public screens: welcome, phone, login, onboarding
  (app)/           # Protected screens:
    index.tsx      # Dashboard (home tab)
    products/      # Products tab
    orders/        # Orders tab
    more.tsx       # More tab (links to analytics, settings, customers, store)
    (stack)/       # Stack screens (not tabs):
      analytics.tsx
      customers/
      settings/
      store/
```

### Design Tokens
- Primary: `#006B5E` (growth-green/teal)
- Trust Blue: `#0055D4`
- WhatsApp: `#25D366`
- Error: `#BA1A1A`
- Surface: `#F4F7F6`
- Font: Be Vietnam Pro
- Animation: `FadeInDown.duration(600).springify()`, stagger 100ms
- Border radius: 12px cards, 20px containers

### API Base URL
```typescript
const API_BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:3001/v1'  // Android emulator
  : 'http://localhost:3001/v1'; // iOS/web
```

### Environment Variables
```
EXPO_PUBLIC_API_URL=https://shopoapi-production.up.railway.app
```

---

## RULES FOR OPUS 4.8

1. **Don't waste tokens** — read files only when needed, don't re-read what's in this handoff
2. **Don't create documentation** — just build code
3. **Don't add fake data** — use empty states or real API calls
4. **Don't explain every line** — just write clean code
5. **Don't add unnecessary comments** — code should be self-documenting
6. **Fetch from Stitch FIRST** before building any screen
7. **One screen at a time** — complete it, verify it, move on
8. **Test after every phase** — don't build 20 screens and then test
9. **Use the existing API** — it's already deployed and working
10. **Follow the existing code style** — NativeWind, MaterialIcons, reanimated

**Goal: Working app with real auth, real data, pixel-perfect Stitch designs, deployed to production. Complete as fast as possible.**
