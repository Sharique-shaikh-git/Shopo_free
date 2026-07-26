---
name: digital-dukaan
description: AI Shop Builder project context and development rules. Load this skill at the start of every session when working on the Digital Dukaan / AI Shop Builder project located in d:\project\new app\.
---

# Digital Dukaan — Custom Antigravity Skill

## When to Activate
Activate when working on ANY file inside `d:\project\new app\` or when the user mentions:
- Digital Dukaan
- AI Shop Builder
- Merchant app
- Storefront
- Product enrichment
- COD ordering

## Start of Session Protocol
1. Read `.agents/AGENTS.md` for project rules
2. Read `.agents/context/PROJECT_BRIEF.md` for project overview
3. Read `.agents/context/TECH_STACK.md` for technology decisions
4. Check the current task progress artifact for where we left off
5. Only THEN begin working on the task

## Key Architecture Facts (Quick Reference)
- **Monorepo**: pnpm + Turborepo with 4 apps + 1 shared package
- **Backend**: NestJS (TypeScript, strict mode) with Drizzle ORM
- **Auth**: Firebase Auth (phone OTP) → custom JWT with merchantId/storeId
- **DB**: PostgreSQL — every query scoped by merchantId/storeId
- **AI**: Async only — BullMQ queue → worker → result
- **Mobile**: React Native (Expo)
- **Storefront**: Next.js 15 (App Router)
- **Deploy**: Cloud Run (serverless)

## File Ownership (Multi-Model Safety)
When multiple models work on this project:
- **Complex logic** (auth, security, AI pipeline, architecture): Claude Opus / Sonnet
- **Routine code** (CRUD, UI screens, styling, tests): Gemini Flash
- **Free tasks** (docs, research, data): MIMO 2.5v / Kimi K2.6
- **NEVER** have two models edit the same file simultaneously

## Before Modifying ANY File
1. Check `.agents/checklists/SECURITY.md` if touching auth/data access
2. Check `.agents/checklists/AI_PIPELINE.md` if touching AI features
3. Ensure changes follow `.agents/checklists/DEFINITION_OF_DONE.md`
