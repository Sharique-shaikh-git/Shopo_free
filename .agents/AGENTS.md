# SHOPO (AI Shop Builder) — Agent Rules

## Project Identity
- **Name**: SHOPO (working title — not finalized)
- **Tagline**: "Create your online shop in 5 minutes. No website knowledge required."
- **Target**: Non-technical Pakistani merchants (shopkeepers, home businesses, WhatsApp/Instagram sellers)
- **Core philosophy**: The merchant never hears the word "website." They "run their business."

## Critical Rules (ALL agents MUST follow)

### 1. Session Continuity
- At the START of every session, read `.agents/context/PROJECT_BRIEF.md`
- Check the current `task.md` for where we left off
- Read relevant context files before writing any code
- NEVER reinvent architecture decisions that are already frozen in `TECH_STACK.md`

### 2. Tech Stack (Frozen)
- See `.agents/context/TECH_STACK.md` for the locked-in technology choices
- Do NOT propose changing the tech stack without explicit user approval
- All new code must use TypeScript (strict mode)

### 3. Security (Non-Negotiable)
- EVERY database query MUST be scoped by `merchantId` and/or `storeId`
- NEVER trust client-provided `merchantId` — always derive from JWT
- All API endpoints require authentication except: storefront public pages, health checks
- Rate limit ALL endpoints (per merchant, per IP)
- No secrets in code — use environment variables / secret manager
- See `.agents/checklists/SECURITY.md` for the full checklist

### 4. Code Quality
- Use Zod for all input validation
- Use structured error codes (never expose stack traces)
- Add correlation IDs to all requests and logs
- Write tests for all service functions
- All API responses follow the shared DTO contracts in `packages/shared/`

### 5. UI/UX Rules (Merchant App)
- **Forbidden words** in UI: Hosting, DNS, SSL, CDN, Database, HTML, Domain configuration, Deployment, Collections, Inventory, SEO, Theme, Pages, Navigation, Domains, Apps, Liquid, Templates
- **Use instead**: My Products, My Orders, My Shop, My Customers, Delivery, Payments, Promotions
- Large tap targets for mobile
- RTL support for Urdu/Sindhi/Pashto
- Voice input support where applicable

### 6. AI Pipeline Rules
- AI calls are ALWAYS async (never block the main request)
- Deduplicate identical inputs before calling AI APIs
- Enforce per-merchant quotas before enqueuing jobs
- Cache AI outputs with dedupeKey
- Track AI usage costs in the `ai_usage` table
- Use Google Gemini 2.5 Flash (free tier) as primary AI

### 7. Naming Conventions
- Files: `kebab-case.ts`
- Classes/Types: `PascalCase`
- Functions/variables: `camelCase`
- Database tables: `snake_case`
- API routes: `/v1/resource-name`
- Environment variables: `SCREAMING_SNAKE_CASE`

### 8. Git Conventions
- Branch naming: `feature/short-description`, `fix/short-description`
- Commit messages: `type(scope): description` (conventional commits)
- No direct pushes to `main` — always PR

### 9. Obsidian Second Brain
- After EVERY significant code change, update the relevant Obsidian note
- Use `[[wikilinks]]` to connect related concepts visually
- Document the WHY, not just the WHAT
- Record all mistakes in `obsidian-vault/05_Anti_Patterns/`
- Record all lessons in `obsidian-vault/06_Lessons_Learned/`

### 10. Free Tier Awareness
- All infrastructure runs on free tiers
- Be mindful of rate limits and quotas
- Supabase: 500MB DB, 1GB storage, 50K auth users
- Upstash: 10K commands/day
- Gemini: free API has rate limits
- Design for these constraints from Day 1
