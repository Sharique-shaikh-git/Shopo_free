# Definition of Done — Digital Dukaan

> A feature is DONE when ALL of these are checked:

## Code Quality
- [ ] TypeScript strict mode — no `any` types
- [ ] Zod validation for all inputs
- [ ] Structured error codes (not generic 500s)
- [ ] Correlation IDs in logs
- [ ] No commented-out code

## Security
- [ ] Passes the Security Checklist (`.agents/checklists/SECURITY.md`)
- [ ] Tenant isolation verified with 2+ test merchants

## Testing
- [ ] Unit tests for service functions (≥80% coverage)
- [ ] Integration test for the API endpoint
- [ ] Edge cases tested (empty state, invalid input, unauthorized)

## Documentation
- [ ] OpenAPI spec updated if new/changed endpoints
- [ ] Shared DTOs updated in `packages/shared/`
- [ ] ADR written if a significant architectural decision was made

## UI (if applicable)
- [ ] Loading state
- [ ] Error state
- [ ] Empty state
- [ ] Success state
- [ ] RTL layout verified
- [ ] Large tap targets on mobile
- [ ] No technical terms visible to merchants
