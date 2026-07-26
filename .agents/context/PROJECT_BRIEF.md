# SHOPO (Working Title) — Project Brief (Read First, Every Session)

> [!NOTE]
> App name is **SHOPO** (working title — not finalized yet). Previously called "Digital Dukaan."

## What Are We Building?
A **mobile-first AI-powered store builder** for non-technical merchants in Pakistan.

**One-liner**: "Open the app → take photos → start receiving orders."

## The Problem
- Pakistani shopkeepers sell on WhatsApp/Facebook → endless chat, negotiation, wasted time
- Shopify/existing platforms are expensive (USD pricing) and too technical
- Merchants don't know DNS, hosting, SSL — they just want orders

## The Solution
- Merchant downloads mobile app
- AI asks simple questions: "What's your shop name?" "What do you sell?"
- Merchant takes a photo of their product
- AI auto-generates: title, description, category, tags, suggested price
- Store goes live on a free subdomain (e.g., `shopname.shopo.pk`)
- Customers browse on mobile web and place COD orders
- Merchant manages orders from the app
- Merchants can also attach their OWN custom domain (like Shopify does)

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
