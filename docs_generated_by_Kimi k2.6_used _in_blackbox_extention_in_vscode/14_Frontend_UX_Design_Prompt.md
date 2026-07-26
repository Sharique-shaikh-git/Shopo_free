# Front-end UI/UX Design Inspiration Prompt (Production-Grade)

## Goal
Generate **UI/UX screen design inspiration** for our **mobile-first AI Shop Builder** app and storefront, focusing on:
- simple, aesthetic, clean layouts
- easy to understand flows
- high usability for non-technical merchants
- production-level design consistency

**Constraints (important):**
- **Do NOT include color palettes, themes, or specific brand colors**.
- Output should be **screen-by-screen layout inspiration**, not code.
- Keep typography guidance generic (no font names).

## Best tool to use (recommendation)
Use **Figma** (best) + optionally **Stitcher/visual inspiration tools**:
- **Figma**: best for producing structured design outputs and reusable UI patterns.
- **Stitcher**: can generate layouts/inspiration quickly, useful for ideation.
- **Claude/Codex design prompt**: good for narrative/UX structure, less consistent than Figma for UI patterns.

**Production workflow suggestion:**
1) Generate inspiration with Stitcher or Claude.
2) Convert into consistent component patterns in Figma.
3) Iterate after we finalize requirements.

---

## Prompt A — “Design Inspiration Generator” (use in Stitcher / Claude / similar)
Copy-paste this prompt:

**PROMPT A (Screen Inspiration):**
You are a senior mobile-first product designer. Create UI/UX inspiration for a production app called “AI Shop Builder” used by **non-technical merchants in Pakistan**.

Design principles:
- simple and intuitive
- minimal cognitive load
- large tap targets
- clear hierarchy
- “merchant wants orders” mindset, not “website builder” mindset
- include states: loading, empty, error, success (describe layout for each)
- no technical terms shown to merchants
- write labels in plain everyday language (English is fine)
- multi-language support should be considered in layout (right-to-left safe, long text safe)

Hard constraints:
- **Do not provide any color palette or theme suggestions**
- **Do not provide specific brand assets**
- **Do not write CSS or code**
- Provide only layout/UX descriptions and component structure.

Deliverables:
1) Propose a **complete screen map** for the production app (merchant app + customer storefront).
2) For each screen: list
   - screen purpose
   - primary CTA(s)
   - main sections (with hierarchy order)
   - empty state design
   - error state design
   - typical user flow (1–2 steps)
3) Provide a **design system structure** at high level:
   - reusable components list (buttons, cards, forms, product grid, order list, status pills, modals)
   - navigation approach (bottom tabs vs drawer) with justification
   - spacing and density approach (no numbers required)

Include screens for these features:
- onboarding + language selection
- store creation (shop name + logo)
- product photo upload
- AI product enrichment review & accept/edit
- publish store + store URL display
- orders dashboard + order status updates
- notifications panel (new orders, status updates)
- promotions/share flow (generate WhatsApp/Facebook content)
- basic analytics (simple charts)
- profile/settings (language, phone, account)

Also include storefront customer UX:
- store home page (product grid)
- product page
- COD checkout page
- order confirmation page

Format requirement:
- Use a numbered list per screen with clear headings like:
  “Screen 01 — Onboarding Language Selection”
- Use bullet points for components and states.

Output must be cohesive and consistent across screens.

---

## Screen Map Proposal — How many screens?
For a production app (not MVP), a realistic baseline is:

### Merchant app (recommended starting set): ~18–24 screens
Including:
1. Language selection
2. Onboarding checklist
3. Sign in / Sign up
4. Store create: shop name
5. Store create: logo upload/generate
6. Store create: delivery areas
7. Store create: first product photo upload
8. AI enrichment review
9. AI suggested price confirmation
10. Product edit screen (manual fixes)
11. Product gallery + manage products
12. Publish store screen
13. Store URL screen + share actions
14. Orders list
15. Order details
16. Fulfillment status update
17. Promotions generator
18. Promotion preview + share
19. Basic analytics dashboard
20. Notifications list
21. Settings (language, account)
22. Support / Contact

### Customer storefront: ~6–10 pages
1. Store home
2. Categories page
3. Product detail
4. Product gallery
5. Checkout (COD)
6. Order confirmation
7. Optional: order tracking page

This gives you “productive” UX without becoming confusing.

---

## Prompt B — “Figma Component & Layout Spec” (use in Figma)
Copy-paste this prompt into an AI inside Figma (or use in Claude with “Figma structured output”):

**PROMPT B (Figma Layout Spec):**
Create a production-grade **screen-by-screen layout spec** for the “AI Shop Builder” mobile app and storefront. Use reusable components:
- primary button
- secondary button
- card
- input field
- multiline text area
- product image tile
- order list item
- status pill
- modal / bottom sheet layout
- toast notification
- empty state panel

Constraints:
- no colors
- no fonts
- no code
- describe layout structure and spacing rules conceptually

For each screen:
- define component tree (top to bottom)
- define CTA placement
- define interaction states: default/loading/error/empty/success
- define accessibility notes (tap target, readable text sizing conceptually)
- include RTL safety notes where relevant

---

## What we do next (after design inspiration)
1) We compare Stitcher/Claude/Figma output quality.
2) Choose the best base structure (navigation + component layout).
3) Confirm screen list final number (so we can start building templates for AI-generated stores later).
4) We create 1–2 consistent “UI template styles” (without hardcoding themes yet).
