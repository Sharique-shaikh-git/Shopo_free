# Implementation — AI Shop Builder

## 1) Objective
Provide a step-by-step engineering plan to build a production-grade system for merchants and customers, with CI/CD, security, monitoring, and cost controls.

## 2) Repository structure (recommended)
- `/apps/merchant-mobile`
- `/apps/storefront-web`
- `/apps/api`
- `/apps/worker`
- `/packages/shared` (DTOs, validation schemas, OpenAPI types)
- `/infra/` (IaC: Terraform or Pulumi)
- `/.github/workflows/` (CI/CD)

## 3) Base development stack (example)
- API: NestJS (TypeScript) or Go (choose one)
- Worker: same language as API for shared types (TypeScript/Go)
- Auth: JWT + refresh tokens
- Storage: S3-compatible object store (or cloud equivalent)
- DB: managed PostgreSQL
- Cache/rate-limit: Redis/managed KV
- Queue: managed queue or Redis-backed queue

## 4) Environments
- `dev` (local + shared test)
- `staging` (real infra, limited traffic)
- `prod` (production)

Environment variables handled via secret manager (never in repo).

## 5) CI/CD pipeline (gates)
Stages:
1. Lint + typecheck + unit tests
2. Build docker images
3. Deploy to staging (canary/blue-green style)
4. Run smoke tests:
   - create store
   - upload product
   - enqueue AI job
   - confirm and publish
   - customer orders (COD)
5. If smoke tests pass:
   - promote release to prod (traffic switch)
6. Rollback on failed smoke or SLO regression

## 6) Feature flags
Use feature flags to control rollout:
- AI enrichment enabled/disabled (and limited quotas)
- Price suggestion enabled/disabled
- Promotions generation enabled/disabled
- Courier integrations (later)

## 7) Operational readiness checklist
- Centralized logging + metrics + traces
- Error reporting (Sentry or equivalent)
- Alerts:
  - API error rate
  - queue backlog / worker failure rate
  - AI job failure rate
- Runbooks:
  - incident response
  - rollback steps
  - how to replay failed AI jobs

## 8) How to “start building” (practical)
### Step A — choose tool chain
- Use an IDE locally: VS Code (recommended for team iteration)
- Use Cursor (optional) as an AI coding assistant inside VS Code

### Step B — start with backend contracts
- implement shared DTOs + API OpenAPI schema
- create minimal API endpoints with mocked AI outputs
- create queue + worker skeleton (mock outputs first)

### Step C — build storefront next
- implement storefront pages consuming API
- add caching headers and CDN-friendly responses

### Step D — merchant mobile last (after contracts)
- implement onboarding + product upload + orders screen
- ensure AI job status polling and “pending” UI works

### Step E — replace mocks with real AI + vision extraction
- enable AI enrichment behind feature flag
- turn on price suggestion after confidence evaluation
