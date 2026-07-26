# Mobile Codebase Choice + “Stitch Method” + Obsidian (Reusable Workflow)

## 1) Which mobile codebase should we use? (Android + iOS, one codebase)
You want one codebase for both **Android + iOS**, with **Android as the main focus** in Pakistan, while the app later runs globally (and payment methods differ by region).

### Recommendation (most cost-aware default)
**Pick React Native** unless you have a strong Flutter team already.

**Why React Native for your case**
- Faster engineering speed (more devs, more libraries)
- Easier iteration while you refine the UX for non-technical merchants
- Ecosystem maturity for mobile integrations (auth, push, analytics, payments via providers)
- You can still make iOS and Android consistent using the same component system

### When Flutter is the better choice
Choose **Flutter** if you care most about consistent UI rendering and you have Flutter expertise.

### Decision rule (simple)
- If you want **faster shipping + easier hiring** → React Native
- If you want **maximum UI consistency** and you already know Flutter deeply → Flutter

### What must be aligned no matter what
- One shared design system approach (components + spacing rules)
- One shared backend API contract (store/product/order schemas)
- One shared “tenant safety” layer (authorization checks everywhere)

---

## 2) What is the “Stitch method”?
You asked: “I don’t understand the stitch method.”

In this project, “stitching” means:

> **Convert design inspiration into a reusable component system**, then build all screens by composing those components—so the app looks consistent and agents can generate screens reliably.

### Why stitching matters for AI coding agents
AI agents struggle when every screen is designed as a one-off. They do much better when you give them:
- a consistent component library (buttons/cards/list items/etc.)
- consistent layout rules (how headers, CTAs, forms, and lists are arranged)
- consistent states (loading/error/empty/success)

### Stitch workflow (practical steps)
1. **Choose your base navigation patterns**
   - e.g., Bottom Tabs for merchant home sections
   - stack navigation for details screens
2. **Create the reusable component library**
   - Primary/secondary button variants
   - Input field + textarea
   - Product card + product list item
   - Order list item + status pill
   - Modal/bottom-sheet patterns
   - Empty state panel + retry button
   - Toast/snackbar notification patterns
3. **Define layout “rules” instead of colors**
   - spacing rhythm (conceptual)
   - hierarchy order (header → content → CTA)
   - tap-target behavior (always large and easy)
4. **Build each screen as a composition**
   - every screen uses the same components and states

Result: when AI agents add new features, they don’t invent a new UI every time.

---

## 3) How to connect your Sketch screens to the app (important)
You exported screens and got HTML-like output. That usually means your export isn’t being used as a structured design system.

### Best workflow
1. Treat your exported screens as **reference images** (visual inspiration).
2. Convert the inspiration into a **component system** using the stitch workflow above.
3. Use the component system as the foundation for implementation.
4. Agents will follow your component library rather than trying to “translate HTML”.

If you later move to Figma, you can import Sketch → Figma to make it even more structured.

---

## 4) Obsidian (your correct knowledge base) — reusable process
You clarified you meant **Obsidian** (not “oxygen”). Here is the process:

- **Obsidian** = your raw knowledge place (notes, research, messy thinking)
- **Agents use Obsidian** by reading checklists/templates/rules before implementing

### What agents should read in Obsidian
- Security checklist for every feature (especially tenant authorization)
- Tenant scoping rules (merchantId/storeId)
- API error code rules (401 vs 403 vs 404 strategy)
- AI job pipeline rules (queue, retries, dedupe, caching)
- Observability rules (logs/metrics/traces expectations)
- Definition of Done templates (production readiness)

### Agent usage rule
Before implementing any feature, the coding agent must:
1) read the relevant **Obsidian** checklist  
2) follow it  
3) update the relevant **Obsidian** doc if the feature teaches a new rule  

---

## 5) Recommended dev “agent + workflow” (simple and reliable)
### Development roles (don’t let models conflict)
- **Claude (primary)**: architecture decisions, API contracts, security/tenant safety reviews
- **Codex (secondary)**: repetitive scaffolding (CRUD, wiring, boilerplate, UI assembly)
- **Cursor (IDE)**: single coding workspace so changes are consistent

### File ownership rule
To avoid merge conflicts:
- Claude modifies: domain logic, API contracts, security middleware, data model rules
- Codex modifies: screen wiring, UI components, straightforward CRUD wiring
- Human merges and runs CI

(If both edit the same file at once, you’ll get conflicts and regressions.)

---

## 6) Add iOS + Android now, deploy worldwide later (payments + region settings)
Even if you start in Pakistan, you must architect for global differences:
- PK: **COD + local methods**
- US/UK/Europe: **cashless only** (card / mobile wallet)

### Region logic rule
At checkout:
- use region rules to show only allowed payment methods
- store merchant configuration per region

### Payment integration rule
- use a payment provider SDK (no manual card handling)
- rely on webhooks to confirm payment state

---

## 7) What to do next (for your project)
1. Decide: React Native (recommended) or Flutter (if you already know it well)
2. Convert your Sketch/Figma screen inspiration into:
   - a reusable component library (“stitch”)
   - screen map built from those components
3. Add/extend Obsidian checklists:
   - UI consistency checklist
   - authorization checklist (tenant safety)
   - AI job pipeline checklist
