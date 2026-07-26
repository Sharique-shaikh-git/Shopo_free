# Model Assignment Guide — Digital Dukaan

## Your Available Models

### Tier 1: Premium (Use Sparingly — Complex Tasks Only)
| Model | Where | Best For |
|-------|-------|----------|
| **Claude Opus 4.6** | Antigravity IDE | Architecture decisions, security reviews, complex debugging, API contract design, code review |
| **Sonnet 4.6** | Antigravity IDE | Domain logic implementation, worker pipelines, integration tests, medium-complexity features |

### Tier 2: Workhorse (Use for 80% of Coding)
| Model | Where | Best For |
|-------|-------|----------|
| **Gemini 3.5 Flash High** | Antigravity IDE | UI screens, CRUD scaffolding, component library, styling, unit tests, config files |
| **Gemini 3.6 Flash Medium** | Antigravity IDE | Boilerplate code, simple features, documentation, refactoring |
| **Gemini 3.1 Pro High** | Antigravity IDE | When Flash isn't reasoning well enough but Opus is overkill |

### Tier 3: Free (Use for Non-Critical Tasks)
| Model | Where | Best For |
|-------|-------|----------|
| **MIMO 2.5v** | OpenCode CLI | Documentation, research, simple utilities, test data generation, Obsidian updates |
| **Kimi K2.6** | Blackbox (VS Code) | Quick documentation, brainstorming, code explanation, simple scripts |

## Task-to-Model Mapping

### Phase 1: Backend Foundation
| Task | Model | Why |
|------|-------|-----|
| OpenAPI spec & shared DTOs | **Opus** | Contract design has cascading consequences |
| NestJS project scaffolding | **Gemini Flash** | Routine setup |
| Auth middleware + JWT | **Opus** | Security-critical |
| Tenant isolation middleware | **Opus** | Security-critical |
| Store/Product/Order CRUD | **Gemini Flash** | Straightforward CRUD |
| Database schema & migrations | **Opus** (design) → **Flash** (SQL) | Design matters, SQL is routine |
| Rate limiting setup | **Gemini Flash** | Config-based |

### Phase 2: AI Worker Pipeline
| Task | Model | Why |
|------|-------|-----|
| Pipeline architecture | **Opus** | Complex async orchestration |
| BullMQ queue setup | **Sonnet** | Medium complexity |
| Vision/text workers | **Sonnet** | AI integration logic |
| Dedup + quota logic | **Opus** | Business-critical logic |
| Cost tracking | **Gemini Flash** | Simple DB writes |

### Phase 3: Customer Storefront
| Task | Model | Why |
|------|-------|-----|
| Next.js project setup | **Gemini Flash** | Routine |
| Store/product pages | **Gemini Flash** | UI work |
| Checkout flow | **Sonnet** | Business logic + validation |
| Caching + CDN | **Sonnet** | Performance-critical |
| SEO + RTL | **Gemini Flash** | Config + CSS |

### Phase 4: Merchant Mobile App
| Task | Model | Why |
|------|-------|-----|
| Component library | **Gemini Flash** | UI component work |
| Navigation setup | **Gemini Flash** | Standard React Navigation |
| Onboarding flow | **Sonnet** | Complex multi-step UX |
| AI enrichment review UI | **Sonnet** | Complex interactive UI |
| Orders dashboard | **Gemini Flash** | Standard list/detail |
| Voice input integration | **Opus** | Complex platform-specific |

## Anti-Hallucination Protocol
1. Every model reads `.agents/context/PROJECT_BRIEF.md` first
2. Models NEVER change frozen tech stack decisions
3. Models check `DECISIONS.md` before proposing alternatives
4. Each model's output is verified against the security checklist
5. When switching models mid-feature, provide explicit context handoff
