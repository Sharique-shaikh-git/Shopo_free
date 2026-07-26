# Security Checklist — Digital Dukaan

> Every feature implementation MUST pass this checklist before being considered done.

## Authentication
- [ ] Endpoint requires authentication (unless explicitly public)
- [ ] JWT token is validated on every request
- [ ] Token expiry is enforced
- [ ] Refresh token rotation is implemented
- [ ] Failed auth attempts are rate-limited

## Authorization (Tenant Isolation)
- [ ] `merchantId` is derived from JWT — NEVER from client request body/params
- [ ] Every database query is scoped by `merchantId` AND/OR `storeId`
- [ ] `storeId` ownership is verified (store belongs to the merchant in JWT)
- [ ] No data leakage between tenants possible (test with 2+ test merchants)
- [ ] Storefront reads use `storeSlug → storeId` resolution, never expose merchantId

## Input Validation
- [ ] All request bodies validated with Zod schemas
- [ ] File uploads: size limits enforced, content-type validated
- [ ] SQL injection: using parameterized queries (Drizzle handles this)
- [ ] No raw user input passed to AI prompts without sanitization

## Rate Limiting
- [ ] Auth endpoints: strict per-IP limits
- [ ] AI job endpoints: per-merchant daily quota
- [ ] Upload endpoints: per-merchant file size + count limits
- [ ] Storefront: per-IP rate limits

## AI Safety
- [ ] Structured prompts only (no user-controlled prompt injection vectors)
- [ ] No secrets passed to AI APIs
- [ ] AI output sanitized before storing in database
- [ ] Content moderation flag for generated content (future)

## Transport & Secrets
- [ ] TLS everywhere (enforced by Cloud Run)
- [ ] No secrets in code, env files, or git history
- [ ] All secrets in GCP Secret Manager
- [ ] Presigned URLs have short expiry for file uploads
