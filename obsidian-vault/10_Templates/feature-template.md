# Feature Template

## Feature: {{feature-name}}

### Purpose
(Why does this feature exist? What problem does it solve for the merchant?)

### User Story
> As a **merchant**, I want to **{{action}}** so that **{{benefit}}**.

### Related Architecture
- [[02_Architecture/{{related-arch}}]]

### API Endpoints Used
- [[07_API_Contracts/{{endpoint}}]]

### Database Tables Touched
- [[08_Database/{{table}}]]

### Code Locations
- Backend: `apps/api/src/modules/{{module}}/`
- Mobile: `apps/merchant-mobile/src/screens/{{screen}}/`
- Storefront: `apps/storefront-web/src/app/{{page}}/`

### State Machine (if applicable)
```
state1 → state2 → state3
```

### Security Checklist
- [ ] Tenant isolation verified
- [ ] Input validation (Zod)
- [ ] Rate limiting applied

### AI Involvement
- [ ] Uses AI pipeline? (link to [[09_AI_Pipeline/{{pipeline}}]])
- [ ] Cost tracking in ai_usage table

### Screenshots / Design
- Link to Stitcher designs: (URL)

### Lessons from Building This
- (gotchas, unexpected issues)

### Tags
#feature #{{category}}
