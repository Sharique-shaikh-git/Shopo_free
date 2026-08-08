# SHOPO — Architecture Decision Records

## ADR-001: React Native + Expo + EAS
**Date**: 2026-07-25 | **Updated**: 2026-07-26
**Status**: Accepted
**Decision**: Use React Native with Expo managed workflow and EAS Build for iOS (no Mac needed).
**Rationale**: Faster engineering speed, larger developer pool. Expo simplifies native module management. EAS Build enables iOS builds from Windows — critical since we don't have a Mac.

## ADR-002: NestJS over Express
**Date**: 2026-07-25
**Status**: Accepted
**Decision**: Use NestJS (TypeScript) instead of plain Express.
**Rationale**: Better structure for a production app, built-in DI, decorators for auth/validation, shared types with frontend.

## ADR-003: Serverless-First (No Kubernetes Early)
**Date**: 2026-07-25
**Status**: Accepted
**Decision**: Deploy on free-tier serverless platforms. No Kubernetes until scale demands it.
**Rationale**: Free-tier first (Railway/Render for API, Vercel for storefront). K8s adds cost and complexity.

## ADR-004: Lean Database Schema (No Premature Partitioning)
**Date**: 2026-07-25
**Status**: Accepted
**Decision**: Start with a simple PostgreSQL schema on Supabase free tier. No partitioning until load testing proves it's needed.
**Rationale**: At 500-1000 stores, indexes and query scoping are sufficient.

## ADR-005: Supabase Auth over Firebase Auth
**Date**: 2026-07-26
**Status**: Accepted (Updated from Firebase)
**Decision**: Use Supabase Auth for phone OTP verification. Since we're already using Supabase for PostgreSQL, using their Auth keeps everything in one platform.
**Rationale**: Supabase provides phone OTP, email auth, social login all in one. No need for a separate Firebase project. Reduces service sprawl. Same free tier generosity. Our JWT layer still adds merchantId/storeId claims for tenant scoping.

## ADR-006: Drizzle ORM over Prisma/TypeORM
**Date**: 2026-07-25
**Status**: Accepted
**Decision**: Use Drizzle ORM for database access.
**Rationale**: TypeScript-first with zero runtime overhead, SQL-like syntax for explicit tenant scoping.

## ADR-007: pnpm + Turborepo Monorepo
**Date**: 2026-07-25
**Status**: Accepted
**Decision**: Use pnpm workspaces with Turborepo.
**Rationale**: Fast, disk-efficient, intelligent caching.

## ADR-008: Google Gemini 2.5 Flash as Primary AI
**Date**: 2026-07-26
**Status**: Accepted
**Decision**: Use Google Gemini 2.5 Flash (free API tier) for all AI features: product vision analysis, text generation, price suggestion.
**Rationale**: Free API tier available now. Good vision capabilities for product photo analysis. Supports multi-language output (Urdu, English). Upgrade path to Gemini Pro or OpenAI when budget allows.

## ADR-009: Free-Tier Cloud Stack
**Date**: 2026-07-26
**Status**: Accepted
**Decision**: Use all-free-tier infrastructure for launch: Supabase (DB+Auth+Storage), Upstash (Redis), Vercel (storefront), Railway (API).
**Rationale**: Startup with no funding currently. Build and validate with real users on free tiers. Upgrade to paid tiers when revenue/users justify it. All chosen services have clear upgrade paths without requiring migration.

## ADR-010: claude-mem for Cross-Session Memory
**Date**: 2026-07-26
**Status**: Accepted
**Decision**: Use [claude-mem](https://github.com/thedotmack/claude-mem) as the single memory repository for cross-session context across ALL tools.
**Rationale**: Works with Antigravity IDE (via AGENTS.md), OpenCode CLI, Blackbox, and future tools. Captures session actions, compresses with AI, injects into future sessions. Combined with Antigravity's built-in KI system and our `.agents/` context files, this creates a robust 3-layer memory system.

## ADR-011: Obsidian as Second Brain
**Date**: 2026-07-26
**Status**: Accepted
**Decision**: Maintain an Obsidian vault as a "second brain" — documenting every code decision, linking related code snippets visually, and recording lessons learned.
**Rationale**: User's explicit requirement. Obsidian's visual linking (graph view) shows which code connects to which. Every mistake and lesson is recorded so future projects don't repeat errors. Also serves as a knowledge base for the AI agents to read checklists/patterns.

## ADR-012: App Name "SHOPO" (Working Title)
**Date**: 2026-07-26
**Status**: Tentative
**Decision**: Use "SHOPO" as the working title. Name is NOT finalized.
**Rationale**: Simple, memorable, works across languages. Final name decision deferred.

## ADR-013: NativeWind v2 over v4
**Date**: 2026-07-30
**Status**: Accepted
**Decision**: Downgrade the Mobile App to NativeWind v2 instead of using v4 (react-native-css-interop).
**Rationale**: NativeWind v4's `cssInterop` wraps all React components and modifies standard React Context stringification. This causes a fundamental breaking bug with Expo Router and React Navigation (`Couldn't find a navigation context`). NativeWind v2 uses a safe Babel plugin approach that avoids mutating core React components.

## ADR-014: Stack-wrapping-Tabs Navigation Layout (Expo Router)
**Date**: 2026-08-06
**Status**: Accepted
**Decision**: Configure Expo Router layout tree as a `<Stack>` Navigator wrapping a `<Tabs>` Navigator (`(app)/(tabs)`).
**Rationale**: Placing sub-screens in a hidden tab inside `<Tabs>` breaks React Navigation stack history, causing `router.back()` to jump to the Home tab. Moving `<Tabs>` under `(app)/(tabs)` and placing sub-screens on the `(app)` Stack allows sub-screens to stack over tabs and pop back dynamically to their exact originating screen.

## ADR-015: Dynamic Auth Guard with Root Redirect to /(app)
**Date**: 2026-08-06
**Status**: Accepted
**Decision**: Set root entry route `src/app/index.tsx` to redirect to `/(app)` and re-evaluate `AuthGuard` on segment changes.
**Rationale**: Having a hardcoded `<Redirect href="/(auth)/welcome" />` in root `index.tsx` created an infinite loop after login. Routing `index.tsx` to `/(app)` allows `AuthGuard` to verify auth token dynamically and enter the app upon successful login.
