# SHOPO — Tech Stack (Frozen Decisions)

> [!CAUTION]
> These decisions are LOCKED. Do not propose changes without explicit user approval.

## Decision Date: 2026-07-26 (Updated with user-confirmed choices)

### Mobile App
- **Framework**: React Native (Expo managed workflow)
- **iOS Builds**: EAS Build (no Mac required)
- **State Management**: Zustand (lightweight, TypeScript-friendly)
- **Navigation**: React Navigation v7
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors

### Backend API
- **Framework**: NestJS v11 (TypeScript, strict mode)
- **Validation**: Zod (shared with frontend via `packages/shared`)
- **ORM**: Drizzle ORM (TypeScript-first, performant)
- **Auth**: Supabase Auth (phone OTP) + custom JWT for API
- **Rate Limiting**: @nestjs/throttler
- **API Docs**: OpenAPI/Swagger auto-generated

### Worker Service
- **Queue**: BullMQ (Upstash Redis-backed)
- **Processing**: NestJS microservice with BullMQ adapter
- **Image Processing**: Sharp
- **AI SDK**: Google Generative AI SDK (@google/generative-ai)

### Database
- **Primary**: PostgreSQL 15 (Supabase — free tier)
- **Cache**: Redis (Upstash — free tier, serverless)
- **Migrations**: Drizzle Kit
- **Connection Pooling**: Supabase connection pooler (PgBouncer built-in)

### Customer Storefront
- **Framework**: Next.js 15 (App Router)
- **Hosting**: Vercel (free tier)
- **Styling**: Tailwind CSS
- **Caching**: ISR + CDN cache headers
- **Image Optimization**: Next.js Image component + CDN

### AI Services
- **Vision/Product Analysis**: Google Gemini 2.5 Flash (free API tier)
- **Text Generation**: Google Gemini 2.5 Flash (free API tier)
- **Price Suggestion**: Gemini + curated data sources
- **Upgrade Path**: Switch to Gemini Pro or OpenAI when budget allows

### Infrastructure (ALL FREE TIER)
- **API Hosting**: Railway.app (free tier — 500 hours/month) or Render.com
- **Storefront Hosting**: Vercel (free tier for Next.js)
- **Database**: Supabase (free tier — 500MB, 50K rows)
- **Cache/Queue**: Upstash Redis (free tier — 10K commands/day)
- **File Storage**: Supabase Storage (free tier — 1GB)
- **CDN**: Cloudflare (free tier)
- **CI/CD**: GitHub Actions (free for public repos)
- **Error Tracking**: Sentry (free tier — 5K events/month)
- **Domain**: Custom domain support (merchant can attach own domain)

### Development Tools
- **Primary IDE**: Antigravity IDE
- **Secondary**: VS Code (Blackbox + Kimi K2.6), OpenCode CLI (MIMO 2.5v)
- **Package Manager**: pnpm (monorepo workspaces)
- **Monorepo Tool**: Turborepo
- **Linting**: ESLint + Prettier
- **Testing**: Vitest (unit) + Supertest (API) + Detox (mobile E2E)
- **Git Hooks**: Husky + lint-staged
- **Memory**: claude-mem (cross-session context)
- **Knowledge Base**: Obsidian (second brain)

### Languages
- **App UI**: Urdu, Sindhi, Balochi, Pashto, Punjabi, English
- **i18n**: react-i18next (mobile) + next-intl (storefront)
- **RTL**: First-class support for Urdu, Sindhi, Pashto
