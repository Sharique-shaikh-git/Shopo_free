# SHOPO — Global AI Store Builder (Project Brief)

> [!IMPORTANT]
> SHOPO is a **Global mobile-first AI store builder** competing with Shopify for sellers worldwide. Initial local testing utilizes Pakistan / COD as the pilot market, but all architecture, payments, multi-currency support (USD, EUR, GBP, PKR, AED, SAR), and AI theme engines are engineered **Global-First** from Day 1.

## What Are We Building?
A **Global mobile-first AI-powered store builder** for non-technical merchants worldwide who want a Shopify-grade online store created and customized entirely via mobile phone and AI.

**One-liner**: "Open the app → take photos → AI builds & customizes your global online store in 5 minutes."

## The Problem
- Traditional e-commerce platforms (Shopify, WooCommerce) require desktop computers, technical configuration, theme code editing (Liquid/HTML/CSS), and complex developer setups.
- Non-technical mobile-first sellers worldwide need an instant, AI-driven store builder that handles design, copy, pricing, multi-currency, and global payment gateways seamlessly from a smartphone.

## The Solution
- Merchant downloads the SHOPO mobile app.
- AI asks simple questions in natural language: "What's your shop name?" "What do you sell?"
- Merchant takes product photos -> AI auto-generates titles, descriptions, categories, SEO tags, and market prices.
- Merchant customizes their store look via **AI Theme Co-Pilot** and visual presets (zero code required).
- Store goes live on a global subdomain (`shopname.shopo.app`) or custom domain (`yourbrand.com`).
- Customers browse on mobile web and place orders via **Global Online Payment Gateways (Stripe, PayPal, Cards)** or **Cash on Delivery (COD)** depending on country.
- Merchant manages orders, analytics, and store customization from their mobile app.

## Starting Segment
- **Clothing sellers** (Phase 1 focus) — sizes, colors, variants
- UI/UX inspiration already created in Stitcher platform

## Tech Stack (Frozen — Updated 2026-07-26)
| Layer | Technology | Cost |
|-------|-----------|------|
| Mobile | React Native (Expo + EAS) | Free |
| Backend API | NestJS (TypeScript) | Free |
| Worker | NestJS + BullMQ | Free |
| Database | PostgreSQL (Supabase) | Free tier |
| Cache/Queue | Redis (Upstash) | Free tier |
| Storefront | Next.js 15 (Vercel) | Free tier |
| Auth | Supabase Auth (phone OTP) + JWT | Free tier |
| AI | Google Gemini 2.5 (free API) | Free |
| Storage | Supabase Storage | Free tier |
| Hosting (API) | Railway.app or Render.com | Free tier |
| CDN | Cloudflare | Free tier |
| iOS Builds | EAS Build (no Mac needed) | Free tier |

## Monorepo Structure
```
shopo/
├── apps/
│   ├── api/              # NestJS backend
│   ├── worker/           # AI enrichment workers
│   ├── storefront-web/   # Next.js customer storefront
│   └── merchant-mobile/  # React Native (Expo) merchant app
├── packages/
│   └── shared/           # DTOs, validation, types
├── infra/                # Deployment configs
├── .agents/              # AI agent context (memory layer)
├── obsidian-vault/       # Second brain — knowledge base
└── .github/workflows/    # CI/CD
```

## Memory Architecture (4 Layers)
1. **Antigravity IDE**: Built-in KI + `.agents/` context files + skills
2. **claude-mem**: Cross-session memory for ALL tools (IDE + CLI)
3. **Obsidian Vault**: Second brain — every decision, code link, lesson learned
4. **Project context files**: `PROJECT_BRIEF.md`, `TECH_STACK.md`, `DECISIONS.md`

## Core Entities
- **Merchant** → owns one or more Stores
- **Store** → has a slug/subdomain, contains Products
- **Product** → draft → active → archived lifecycle
- **Order** → new → packed → shipped → delivered (COD-first)
- **AiJob** → queued → running → completed/failed

## Key Architectural Rules
1. Multi-tenant: every query scoped by merchantId/storeId
2. AI is always async (queue + worker, never blocking)
3. COD is the default payment method
4. No technical terms exposed to merchants
5. Serverless-first (no Kubernetes early)
6. FREE tier everything for launch — upgrade when users come
7. Custom domain support (like Shopify) from Day 1 architecture
