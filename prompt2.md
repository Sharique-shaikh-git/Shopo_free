# Complete Prompt for Coding Agent — Phase 3: Full Stitch Implementation + 5 Fixes

## Context
You are working on the Shopo merchant mobile app at `D:/project/new app/apps/merchant-mobile/`. Previous phases fixed the API error, created design tokens, redesigned 15 screens, and fixed CI.

**Now we need the COMPLETE app built from Stitch designs — every screen, every animation, every motion, every transition.**

## Critical Rule
**YOU MUST USE STITCH MCP TO PULL EVERY SINGLE SCREEN DESIGN BEFORE WRITING ANY CODE.**

Do NOT write a single line of UI code until you have:
1. Listed all Stitch projects/screens via MCP
2. Exported EVERY screen as JSON/PNG
3. Extracted exact specs for each screen

## Stitch MCP Tools to Use

Use these Stitch MCP tools in order:

### 1. `list_projects`
List all Stitch projects to find "AI Merchant Hub" or similar.

### 2. `list_screens` (for each project)
List all screens in the project. This will show you every screen that needs to be built.

### 3. `fetch_screen_code` (for each screen)
Fetch the exact design code for each screen. This gives you the pixel-perfect layout, colors, typography, spacing, animations, and motions.

**Workflow:**
```
list_projects → list_screens → fetch_screen_code (for each screen) → build screen
```

**When new screens are added in Stitch:**
When the user says "sync new screens", run `list_screens` again to find new screens, then `fetch_screen_code` for each new screen, and build them.

## 5 Critical Fixes to Apply

### Fix 1: Add Eye Icon Toggle for Password on Login Screen

**File:** `apps/merchant-mobile/src/app/(auth)/login.tsx`

Add a toggle button inside the password input to show/hide the password:

```tsx
import { Feather } from '@expo/vector-icons';

// Add state
const [showPassword, setShowPassword] = useState(false);

// In the password input section:
<View className="relative">
  <TextInput
    value={password}
    onChangeText={setPassword}
    placeholder="••••••"
    secureTextEntry={!showPassword}
    className="bg-background border border-border rounded-xl px-4 py-4 text-base pr-12"
    placeholderTextColor="#9ca3af"
  />
  <TouchableOpacity
    onPress={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2"
  >
    <Feather
      name={showPassword ? "eye-off" : "eye"}
      size={20}
      color="#6e7976"
    />
  </TouchableOpacity>
</View>
```

### Fix 2: Fix Tab Bar Showing "settings/index" → Should Show "Settings"

**File:** `apps/merchant-mobile/src/app/(app)/_layout.tsx`

The tab bar is showing the route path instead of the display name. Fix the tab configuration:

```tsx
<Tabs.Screen
  name="settings/index"  // This causes the issue
  options={{
    title: 'Settings',  // This should override
    tabBarLabel: 'Settings',  // Add this explicitly
    tabBarIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} />,
  }}
/>
```

Also check all other tab screens to ensure `tabBarLabel` is set explicitly.

### Fix 3: Fetch storeId from /stores API on Mount, Don't Hardcode

**File:** `apps/merchant-mobile/src/app/(app)/products/create.tsx`

Instead of hardcoding `storeId`, fetch it from the API when the component mounts:

```tsx
import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';

// Add state
const [storeId, setStoreId] = useState<string | null>(null);
const [loadingStore, setLoadingStore] = useState(true);

// Fetch store on mount
useEffect(() => {
  async function loadStore() {
    try {
      const stores = await apiFetch('/stores');
      if (stores && stores.length > 0) {
        setStoreId(stores[0].id);
      }
    } catch (err) {
      console.error('Failed to load store:', err);
    } finally {
      setLoadingStore(false);
    }
  }
  loadStore();
}, []);

// In handleCreate, use the fetched storeId:
const handleCreate = async () => {
  if (!storeId) {
    Alert.alert('Error', 'No store found. Please create a store first.');
    return;
  }
  // ... rest of the function using storeId
};

// Disable the button while loading:
<Button 
  title={loadingStore ? "Loading..." : (loading ? "Saving..." : "Save Product")} 
  onPress={handleCreate} 
  disabled={loadingStore || loading}
/>
```

### Fix 4: Use Stitch MCP Tools Correctly

Always use these Stitch MCP tools in this order:
1. `list_projects` — Find the project
2. `list_screens` — List all screens
3. `fetch_screen_code` — Get exact design code for each screen

**Never guess a design. Always pull from Stitch first.**

### Fix 5: Sync New Screens from Stitch

When the user says **"sync new screens"**, you must:
1. Run `list_screens` to find any new screens added in Stitch
2. Run `fetch_screen_code` for each new screen
3. Build each new screen following the same pixel-perfect approach
4. Add navigation entries for new screens in the appropriate layouts

## Step 1: Discover All Stitch Screens

Use Stitch MCP to:
1. `list_projects` → find "AI Merchant Hub" or similar
2. `list_screens` → list all screens
3. `fetch_screen_code` → get design for each screen

**Expected screens (30+):**

### Auth Flow (3-4 screens)
- [ ] Splash/Onboarding screen
- [ ] Login screen (phone + password) — WITH eye toggle
- [ ] Sign Up screen (name, phone, password)
- [ ] Language selection screen (Urdu, Sindhi, English, etc.)

### Merchant Onboarding (4-5 screens)
- [ ] Business type selection (shop, home business, reseller, etc.)
- [ ] Shop name + logo upload
- [ ] Shop theme/color selection
- [ ] First product upload tutorial
- [ ] Store published confirmation

### Dashboard (2-3 screens)
- [ ] Main dashboard (stats cards, quick actions, recent orders)
- [ ] Sales analytics (daily/weekly/monthly charts)
- [ ] Notifications center

### Products (6-8 screens)
- [ ] Product list (with search, filter, sort)
- [ ] Product create (image upload, AI auto-fill) — WITH storeId fetch
- [ ] Product edit
- [ ] Product detail view
- [ ] Product categories management
- [ ] Bulk product upload
- [ ] Inventory management
- [ ] Low stock alerts

### Orders (4-5 screens)
- [ ] Order list (with status filters: new, packed, shipped, delivered, cancelled)
- [ ] Order detail (customer info, items, timeline)
- [ ] Order status update
- [ ] Order history
- [ ] Returns/refunds

### Customers (2-3 screens)
- [ ] Customer list
- [ ] Customer detail (order history, contact info)
- [ ] Customer messages

### Marketing & Promotions (4-5 screens)
- [ ] Promotions dashboard
- [ ] Create WhatsApp promotion
- [ ] Create Facebook/Instagram post
- [ ] Create discount/coupon campaign
- [ ] Share store link

### Settings (4-5 screens)
- [ ] Main settings
- [ ] Store profile (name, logo, description, contact)
- [ ] Payment methods (COD, bank transfer, wallet)
- [ ] Delivery settings (areas, fees, courier partners)
- [ ] Language & region
- [ ] Account & security (password, phone change)
- [ ] Subscription/plan management
- [ ] Help & support

### Other (2-3 screens)
- [ ] Storefront preview (how customers see your store)
- [ ] QR code / store link sharing
- [ ] About / app info

## Step 2: Extract Exact Specs from Each Screen

For EVERY screen, extract:
- **Layout**: exact positions, alignment, padding, margins
- **Colors**: exact hex codes for every element
- **Typography**: font family, size, weight, line height, letter spacing
- **Spacing**: exact gap, padding, margin values
- **Components**: button styles, input styles, card styles, list styles
- **Icons**: icon names, sizes, colors
- **Images**: image sizes, aspect ratios, border radius
- **Animations**: entrance animations, transitions, micro-interactions
  - Fade in/out duration
  - Slide direction and distance
  - Scale animations
  - Button press effects
  - Loading states and skeleton screens
  - Page transition animations
  - Tab bar transition animations
- **Motion**: 
  - Gesture responses (swipe, tap, long press)
  - Drag and drop (if any)
  - Pull to refresh
  - Infinite scroll behavior
  - Modal/drawer open/close animations

## Step 3: Create Animation/Motion System

Create `apps/merchant-mobile/src/theme/animations.ts`:

```ts
export const animations = {
  // Durations (in ms)
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    extraSlow: 800,
  },
  
  // Easing functions
  easing: {
    easeInOut: [0.4, 0, 0.2, 1],
    easeOut: [0, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1],
    spring: { damping: 15, stiffness: 150 },
  },
  
  // Page transitions
  pageTransition: {
    enter: { opacity: 1, translateX: 0 },
    exit: { opacity: 0, translateX: 50 },
  },
  
  // Fade in
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  
  // Scale in (for modals/cards)
  scaleIn: {
    from: { opacity: 0, scale: 0.95 },
    to: { opacity: 1, scale: 1 },
  },
  
  // Slide up (for bottom sheets)
  slideUp: {
    from: { translateY: 100 },
    to: { translateY: 0 },
  },
  
  // Button press
  buttonPress: {
    scale: 0.97,
    opacity: 0.9,
  },
  
  // Skeleton shimmer
  skeleton: {
    shimmerDuration: 1500,
    shimmerColors: ['#e1e3e5', '#f0f0f5', '#e1e3e5'],
  },
};
```

## Step 4: Build Every Screen

For EACH screen file in `apps/merchant-mobile/src/app/`:

1. **Read the Stitch design** for that screen via `fetch_screen_code`
2. **Write the complete component** matching the design pixel-perfect
3. **Add all animations** from the Stitch design:
   - Page entrance animations
   - Element stagger animations
   - Button press effects
   - Loading/skeleton states
   - Pull to refresh
   - Modal/bottom sheet animations
4. **Add all interactions**:
   - Swipe to delete/archive
   - Long press for context menu
   - Tap feedback
   - Scroll behavior

### Animation Implementation Pattern

Use `react-native-reanimated` for animations:

```tsx
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  Easing,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  Stagger,
  Sequenced,
} from 'react-native-reanimated';

// Example: Staggered list entrance
<Animated.View entering={Stagger.delay(100).springify()}>
  {items.map((item, index) => (
    <Animated.View
      key={item.id}
      entering={FadeIn.delay(index * 80).springify()}
      exiting={FadeOut}
    >
      <ItemComponent />
    </Animated.View>
  ))}
</Animated.View>

// Example: Button press animation
const scale = useSharedValue(1);
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

const onPressIn = () => {
  scale.value = withSpring(0.97, { damping: 15, stiffness: 150 });
};
const onPressOut = () => {
  scale.value = withSpring(1);
};
```

## Step 5: Update All Components

For each component in `apps/merchant-mobile/src/components/`:
- `Button.tsx` — Add press animation, loading state, disabled state
- `OrderCard.tsx` — Add swipe actions, entrance animation
- `ProductCard.tsx` — Add image loading skeleton, press animation
- `Input.tsx` — Add focus animation, error state shake, eye toggle for password
- `Modal.tsx` — Add scale in/out, backdrop fade
- `BottomSheet.tsx` — Add slide up/down with gesture
- `Skeleton.tsx` — Add shimmer animation
- `EmptyState.tsx` — Add fade in with illustration
- `ErrorState.tsx` — Add shake animation
- `Toast.tsx` — Add slide in from top, auto dismiss

## Step 6: Update Navigation Animations

Update `apps/merchant-mobile/src/app/_layout.tsx` and all nested layouts:

```tsx
// Screen transition animations
const ScreenTransition = {
  gestureEnabled: true,
  animation: 'slide_from_right',
  transitionSpec: {
    open: { animation: 'spring', config: { damping: 20, stiffness: 100 } },
    close: { animation: 'timing', config: { duration: 200 } },
  },
};

// Tab bar animations
const TabBarAnimation = {
  tabBarHideOnKeyboard: true,
  tabBarAnimation: 'shift',
  tabBarSpring: { damping: 20, stiffness: 150 },
};
```

## Step 7: Test Everything

After building ALL screens, test:

### Visual Testing
- [ ] Every screen matches Stitch design pixel-perfect
- [ ] Colors match exact hex codes from Stitch
- [ ] Typography matches exact sizes and weights
- [ ] Spacing matches exact values
- [ ] Icons match exact names and sizes
- [ ] Images have correct aspect ratios and border radius
- [ ] Password eye toggle works on login
- [ ] Tab bar shows "Settings" not "settings/index"

### Animation Testing
- [ ] Page transitions work smoothly
- [ ] Element entrance animations play correctly
- [ ] Button press animations work
- [ ] Loading skeletons display correctly
- [ ] Pull to refresh works
- [ ] Swipe gestures work
- [ ] Modal/bottom sheet animations work
- [ ] Tab bar transitions work
- [ ] No animation jank or stutter

### Functional Testing
- [ ] Login flow works end-to-end
- [ ] Product creation works (storeId fetched from API, not hardcoded)
- [ ] Order list loads and filters work
- [ ] Settings screens navigate correctly
- [ ] All buttons navigate to correct screens
- [ ] All forms validate correctly
- [ ] Error states display correctly
- [ ] Empty states display correctly

### Edge Case Testing
- [ ] Very long product names
- [ ] Very long descriptions
- [ ] Special characters in Urdu/Sindhi
- [ ] RTL layout for Urdu
- [ ] Low network connectivity
- [ ] No network connectivity
- [ ] Empty product list
- [ ] Empty order list
- [ ] Image upload failure
- [ ] API failure
- [ ] No store found (handle gracefully)

## Files to Create/Update

### New files to create:
- `apps/merchant-mobile/src/theme/animations.ts` — Animation system
- `apps/merchant-mobile/src/components/Skeleton.tsx` — Skeleton loading
- `apps/merchant-mobile/src/components/EmptyState.tsx` — Empty state
- `apps/merchant-mobile/src/components/ErrorState.tsx` — Error state
- `apps/merchant-mobile/src/components/Toast.tsx` — Toast notifications
- `apps/merchant-mobile/src/components/BottomSheet.tsx` — Bottom sheet
- `apps/merchant-mobile/src/components/Modal.tsx` — Modal overlay
- `apps/merchant-mobile/src/hooks/useAnimations.ts` — Animation hooks
- `apps/merchant-mobile/src/hooks/useStitchDesign.ts` — Stitch design hook

### Existing files to update (all screens):
- `apps/merchant-mobile/src/app/(auth)/login.tsx` — Add eye toggle + animations
- `apps/merchant-mobile/src/app/(auth)/_layout.tsx` — Add transitions
- `apps/merchant-mobile/src/app/(app)/dashboard.tsx` — Add animations
- `apps/merchant-mobile/src/app/(app)/_layout.tsx` — Fix tab labels + add animations
- `apps/merchant-mobile/src/app/(app)/products/index.tsx` — Add animations
- `apps/merchant-mobile/src/app/(app)/products/create.tsx` — Fetch storeId + animations
- `apps/merchant-mobile/src/app/(app)/products/[id].tsx` — Add animations
- `apps/merchant-mobile/src/app/(app)/products/_layout.tsx` — Add transitions
- `apps/merchant-mobile/src/app/(app)/orders/index.tsx` — Add animations
- `apps/merchant-mobile/src/app/(app)/orders/[id].tsx` — Add animations
- `apps/merchant-mobile/src/app/(app)/orders/_layout.tsx` — Add transitions
- `apps/merchant-mobile/src/app/(app)/settings/index.tsx` — Add animations
- `apps/merchant-mobile/src/components/Button.tsx` — Add press animation
- `apps/merchant-mobile/src/components/OrderCard.tsx` — Add swipe + animation
- `apps/merchant-mobile/src/components/ProductCard.tsx` — Add press + skeleton

## Acceptance Criteria

- [ ] ALL 30+ screens from Stitch are implemented
- [ ] Every screen matches Stitch design pixel-perfect
- [ ] Password eye toggle works on login screen
- [ ] Tab bar shows "Settings" not "settings/index"
- [ ] storeId is fetched from /stores API, not hardcoded
- [ ] Stitch MCP tools used correctly (list_projects, list_screens, fetch_screen_code)
- [ ] "sync new screens" command rebuilds from Stitch
- [ ] All animations and motions from Stitch are implemented
- [ ] All transitions work smoothly
- [ ] All buttons, inputs, cards are properly aligned
- [ ] All settings screens are complete
- [ ] No missing screens
- [ ] App builds without errors
- [ ] All flows work end-to-end

## Important Notes

1. **DO NOT skip any screen** — every Stitch screen must be implemented
2. **DO NOT guess designs** — always pull from Stitch MCP first
3. **Animations are NOT optional** — every animation in Stitch must be implemented
4. **Test after EVERY screen** — don't wait until all screens are done
5. **Commit after each complete screen** with clear commit message
6. **If a screen doesn't exist in Stitch**, ask before creating it
7. **When user says "sync new screens"**, run list_screens and fetch_screen_code for new screens
