---
name: Kinetic Growth
colors:
  surface: '#f9f9fc'
  surface-dim: '#dadadc'
  surface-bright: '#f9f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f6'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e5'
  on-surface: '#1a1c1e'
  on-surface-variant: '#3e4946'
  inverse-surface: '#2f3133'
  inverse-on-surface: '#f0f0f3'
  outline: '#6e7976'
  outline-variant: '#bec9c5'
  surface-tint: '#006b5e'
  primary: '#005147'
  on-primary: '#ffffff'
  primary-container: '#006b5e'
  on-primary-container: '#95e8d8'
  inverse-primary: '#83d5c5'
  secondary: '#006d2f'
  on-secondary: '#ffffff'
  secondary-container: '#5dfd8a'
  on-secondary-container: '#007232'
  tertiary: '#003fa3'
  on-tertiary: '#ffffff'
  tertiary-container: '#0055d4'
  on-tertiary-container: '#ccd8ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9ff2e1'
  primary-fixed-dim: '#83d5c5'
  on-primary-fixed: '#00201b'
  on-primary-fixed-variant: '#005046'
  secondary-fixed: '#66ff8e'
  secondary-fixed-dim: '#3de273'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005322'
  tertiary-fixed: '#dae2ff'
  tertiary-fixed-dim: '#b2c5ff'
  on-tertiary-fixed: '#001848'
  on-tertiary-fixed-variant: '#003fa3'
  background: '#f9f9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e2e2e5'
  growth-green: '#006B5E'
  whatsapp-green: '#25D366'
  trust-blue: '#0055D4'
  surface-gray: '#F8F9FA'
  border-subtle: '#E1E3E5'
  error-red: '#BA1A1A'
  status-pending: '#FEF7FF'
  status-shipped: '#F0FDF4'
typography:
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-mobile: 1.25rem
  gutter-mobile: 1rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
  touch-target-min: 3rem
---

## Brand & Style
The design system is built on the pillars of **empowerment, reliability, and radical simplicity**. It targets non-technical merchants in Pakistan, transitioning them from traditional physical trade to a digital-first economy. The personality is "The Helpful Partner"—expert but approachable, high-tech but human.

The visual style is **Corporate / Modern** with a focus on high-legibility minimalism. It avoids visual clutter, favoring heavy whitespace and a clear "one-task-at-a-time" layout. The interface must feel "open" to reduce the cognitive load associated with new technology.

- **Trust:** Established through stable, grounded layouts and a professional color palette.
- **Growth:** Conveyed through upward-leaning UI patterns and success-state animations.
- **Accessibility:** Large tap targets and generous spacing ensure the UI is usable by people of all digital literacy levels.

## Colors
The palette is dominated by **Growth Green** (Primary), chosen to signal business success and reliability. **Trust Blue** serves as a secondary accent for informational and technical trust elements.

- **Primary (Growth Green):** Used for the main call-to-actions (CTAs) like "Create My Shop" or "Add Product."
- **Secondary (WhatsApp Green):** Specifically reserved for social sharing and communication actions, leveraging existing user familiarity.
- **Neutrals:** We use a high-contrast scale. Backgrounds are kept at a clean `#FFFFFF` or a very light `surface-gray` to ensure readability in the harsh outdoor lighting conditions common for local merchants.
- **Semantic Colors:** Red is reserved strictly for errors. Status colors (Pending, Shipped) use light background washes with high-contrast text for immediate recognition.

## Typography
This design system utilizes **Be Vietnam Pro** for its contemporary, friendly, and highly legible characteristics. Most importantly, it features an open counter-form and vertical metrics that gracefully accommodate regional scripts (Urdu/Sindhi) without feeling cramped.

- **Vertical Rhythm:** Line heights are slightly more generous than standard (1.5x for body text) to ensure that the descenders and ascenders of Nastaliq-inspired scripts do not overlap.
- **Scale:** The type scale is "generous." We prioritize larger font sizes to ensure that price points and order IDs are unmistakable.
- **Hierarchy:** Use `headline-lg` for onboarding and welcome states to create a friendly atmosphere. `label-lg` is used for floating input labels to maintain visibility during data entry.

## Layout & Spacing
This is a **mobile-first, thumb-driven** layout. The design follows a fluid grid that maximizes the screen width on mobile devices while maintaining comfortable safe zones.

- **Thumb Zone:** All primary actions (CTAs) are positioned in the bottom 30% of the screen.
- **Rhythm:** We use a strict 8px-based spacing system, but emphasize "Loose Verticality." By increasing the vertical gap between form fields (`stack-lg`), we reduce the likelihood of accidental taps.
- **Grids:** 
  - **Single Column:** For onboarding and form-heavy management screens.
  - **Two-Column:** Strictly for the customer-facing storefront product list to allow for quick scanning of inventory.
- **Touch Targets:** No interactive element should be smaller than `touch-target-min` (48px).

## Elevation & Depth
This design system adopts a **Flat & Layered** approach. We intentionally avoid complex shadows to keep the interface feeling fast and lightweight.

- **Tonal Layers:** Depth is communicated through color rather than shadow. Primary content sits on a pure white background, while secondary zones (like headers or footers) may sit on a light gray surface.
- **Shadow-less Cards:** Items are grouped using 1px subtle borders (`border-subtle`) instead of drop shadows. This creates a "blueprint" feel that is clean and professional.
- **Bottom Sheets:** For quick actions (like editing a price or selecting a category), we use modal bottom sheets that slide up. These should have a slight dimming overlay on the background to focus the user's attention.
- **AI Pulse:** During "AI Enrichment," use a subtle tonal pulse (shifting between surface-gray and white) rather than a traditional loading bar to signify growth and thought.

## Shapes
The shape language is **Rounded**, conveying friendliness and approachability.

- **Buttons:** Use high roundedness (0.5rem - 1rem) to make them appear tactile and "clickable."
- **Cards & Inputs:** Follow a consistent `rounded-lg` (1rem) corner radius.
- **Images:** Product images are strictly 1:1 square with a subtle `rounded-sm` (0.25rem) corner to maintain a modern look without losing screen real estate.
- **Icons:** Enclosed in circular containers when used for primary categories (e.g., the logo upload zone).

## Components

- **Buttons:** 
  - **Primary:** Growth Green background, white text. Large height (min 56px) for thumb-friendly interaction. 
  - **Secondary:** Outline-style with Trust Blue or WhatsApp Green, 2px border weight.
- **Cards:** 
  - Shadow-less. Use `#E1E3E5` 1px borders. Padding should be generous (`stack-md`).
- **Input Fields:** 
  - Use floating labels to ensure the user never loses context of what they are typing. 
  - Large internal padding. 
  - Focus state uses a 2px Primary color border.
- **Status Pills:** 
  - Small, rounded containers with a background tint and high-contrast text (e.g., Pending = Light Violet background + Dark Violet text).
- **Bottom Action Bar:** 
  - A fixed container at the bottom of the screen with a subtle top border. It houses the "Buy Now" or "Save Product" primary actions, ensuring they are always within reach of the thumb.
- **AI Progress:** 
  - A specialized text component that uses a "shimmer" or "pulse" effect on the font itself to indicate the AI is currently generating descriptions or titles.