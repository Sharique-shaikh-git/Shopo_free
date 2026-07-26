# Development Workflow, Blue-Green Deployment & Git Branching Strategy

## Table of Contents
1. [Environment Strategy](#1-environment-strategy)
2. [Code Flow](#2-code-flow)
3. [Git Branching Strategy](#3-git-branching-strategy)
4. [Git Commands](#4-git-commands)
5. [Blue-Green Deployment](#5-blue-green-deployment)
6. [Automated Blue-Green Pipeline](#6-automated-blue-green-pipeline)
7. [Complete Development Workflow](#7-complete-development-workflow)
8. [GitHub Actions Workflow](#8-github-actions-workflow)
9. [Feature Flags](#9-feature-flags)

---

## 1. Environment Strategy

### Environment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                ENVIRONMENT ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  DEVELOPMENT (Local)                                         │
│  ├── Docker Compose (all services)                           │
│  ├── PostgreSQL (local)                                      │
│  ├── Redis (local)                                           │
│  ├── Mock AI responses                                       │
│  └── Cost: Free                                              │
│                                                              │
│  STAGING (Cloud - Pre-production)                            │
│  ├── Cloud Run (1 instance)                                  │
│  ├── Cloud SQL (shared, separate database)                   │
│  ├── Memorystore (shared Redis)                              │
│  ├── Real AI APIs (test mode)                                │
│  └── Cost: ~$100/month                                       │
│                                                              │
│  PRODUCTION (Cloud - Live)                                   │
│  ├── Cloud Run (auto-scaling)                                │
│  ├── Cloud SQL (dedicated, Multi-AZ)                         │
│  ├── Memorystore (dedicated)                                 │
│  ├── Real AI APIs (production mode)                          │
│  └── Cost: $200-500/month (0-10K users)                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Code Flow

```
┌─────────────────────────────────────────────────────────────┐
│                CODE FLOW                                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Developer writes code                                       │
│    │                                                         │
│    ▼                                                         │
│  Push to feature branch                                      │
│    │                                                         │
│    ▼                                                         │
│  CI runs tests (GitHub Actions)                              │
│    │                                                         │
│    ├── ❌ Tests fail → Fix code, push again                   │
│    │                                                         │
│    └── ✅ Tests pass → Create PR                              │
│                       │                                      │
│                       ▼                                      │
│              Code review (team reviews)                      │
│                       │                                      │
│                       ▼                                      │
│              Merge to main branch                            │
│                       │                                      │
│                       ▼                                      │
│              Auto-deploy to STAGING                          │
│                       │                                      │
│                       ▼                                      │
│              Run smoke tests                                 │
│                       │                                      │
│                       ▼                                      │
│              Blue-green deploy to PRODUCTION                 │
│                       │                                      │
│                       ▼                                      │
│              Monitor for errors                              │
│                       │                                      │
│                       ▼                                      │
│              ✅ Success or ❌ Rollback                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Git Branching Strategy

### Recommended: GitHub Flow (Simple & Effective)

```
┌─────────────────────────────────────────────────────────────┐
│                GIT BRANCHING STRATEGY                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  BRANCHES:                                                   │
│  ├── main (production code - always deployable)              │
│  ├── develop (integration - next release)                    │
│  ├── feature/* (new features)                                │
│  ├── fix/* (bug fixes)                                       │
│  └── hotfix/* (emergency production fixes)                   │
│                                                              │
│  FLOW:                                                       │
│  1. Create feature branch from develop                       │
│  2. Work on feature                                          │
│  3. Create PR → Review → Merge to develop                    │
│  4. When ready: merge develop → main                         │
│  5. Auto-deploy main to production                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Branch Structure

```
main (production)
  │
  ├── v1.0.0 (tag)
  ├── v1.1.0 (tag)
  │
  └── develop (integration)
       │
       ├── feature/user-auth
       ├── feature/product-management
       ├── feature/ai-store-builder
       ├── fix/cart-bug
       └── hotfix/payment-error
```

---

## 4. Git Commands

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/store-builder.git
cd store-builder

# Create develop branch (first time only)
git checkout -b develop
git push -u origin develop
```

### Feature Development

```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/user-auth

# Work on feature
# ... make changes ...
git add .
git commit -m "feat: add phone OTP authentication"

# Push feature branch
git push -u origin feature/user-auth

# Create PR on GitHub
# ... code review ...

# Merge to develop
git checkout develop
git pull origin develop
git merge --no-ff feature/user-auth
git push origin develop

# Delete feature branch
git branch -d feature/user-auth
git push origin --delete feature/user-auth
```

### Release

```bash
# When develop is ready for production
git checkout develop
git pull origin develop
git checkout -b release/v1.1.0

# Bump version, update changelog
# ... make release changes ...
git add .
git commit -m "chore: bump version to 1.1.0"

# Merge to main and tag
git checkout main
git merge --no-ff release/v1.1.0
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin main --tags

# Merge back to develop
git checkout develop
git merge --no-ff release/v1.1.0
git push origin develop

# Delete release branch
git branch -d release/v1.1.0
```

### Hotfix (Emergency Production Fix)

```bash
# Create hotfix from main
git checkout main
git pull origin
git checkout -b hotfix/payment-error

# Fix the bug
git add .
git commit -m "fix: payment gateway timeout"

# Merge to main and tag
git checkout main
git merge --no-ff hotfix/payment-error
git tag -a v1.1.1 -m "Hotfix v1.1.1"
git push origin main --tags

# Merge to develop
git checkout develop
git merge --no-ff hotfix/payment-error
git push origin develop

# Delete hotfix branch
git branch -d hotfix/payment-error
```

---

## 5. Blue-Green Deployment

### What is Blue-Green?

```
┌─────────────────────────────────────────────────────────────┐
│                BLUE-GREEN DEPLOYMENT                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  CONCEPT:                                                    │
│  ├── Blue = Current production version                       │
│  ├── Green = New version being deployed                      │
│  ├── Switch traffic instantly when ready                     │
│  └── Rollback instantly if something goes wrong              │
│                                                              │
│  FLOW:                                                       │
│  1. Deploy new version (Green) with no traffic               │
│  2. Test Green version thoroughly                            │
│  3. Switch 100% traffic to Green                             │
│  4. Keep Blue running for quick rollback                     │
│  5. If problem: switch back to Blue instantly                │
│                                                              │
│  BENEFITS:                                                   │
│  ├── Zero downtime                                           │
│  ├── Instant rollback (< 5 seconds)                          │
│  ├── Test in production-like environment                     │
│  └── No mixed-version window                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Blue-Green on Cloud Run

```bash
# ============================================
# BLUE-GREEN DEPLOYMENT ON CLOUD RUN
# ============================================

# STEP 1: Deploy Green (new version) with NO traffic
gcloud run deploy api-service \
  --image=gcr.io/your-project/api:v2.0.0 \
  --region=asia-south1 \
  --platform=managed \
  --no-traffic \
  --tag=green \
  --min-instances=0

# Green is now running but receives NO user traffic
# Green URL: https://green---api-service-xxxxx.a.run.app

# STEP 2: Test Green version
# Run health check
curl https://green---api-service-xxxxx.a.run.app/health

# Run smoke tests
npm run test:smoke -- --url=https://green---api-service-xxxxx.a.run.app

# Run integration tests
npm run test:integration -- --url=https://green---api-service-xxxxx.a.run.app

# STEP 3: Switch traffic to Green (when tests pass)
gcloud run services update-traffic api-service \
  --region=asia-south1 \
  --to-tags=green=100

# All traffic now goes to Green
# Blue is still running but receives 0% traffic

# STEP 4: Monitor for errors
# Watch Sentry for new errors
# Watch Cloud Monitoring for latency spikes

# STEP 5: Rollback if needed (instant!)
# Get previous (Blue) revision
BLUE_REVISION=$(gcloud run revisions list \
  --service=api-service \
  --region=asia-south1 \
  --format='value(name)' \
  --limit=2 | tail -1)

# Switch back to Blue
gcloud run services update-traffic api-service \
  --region=asia-south1 \
  --to-revisions=$BLUE_REVISION=100

# Rollback complete in < 5 seconds!
```

---

## 6. Automated Blue-Green Pipeline

### Cloud Build Configuration

```yaml
# cloudbuild-blue-green.yaml
steps:
  # Build new image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/api:$SHORT_SHA', '.']
    id: 'build'

  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/api:$SHORT_SHA']
    id: 'push'

  # Deploy Green (no traffic)
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'api-service'
      - '--image=gcr.io/$PROJECT_ID/api:$SHORT_SHA'
      - '--region=$_REGION'
      - '--platform=managed'
      - '--no-traffic'
      - '--tag=green'
    id: 'deploy-green'

  # Verify Green
  - name: 'gcr.io/cloud-builders/gcloud'
    entrypoint: 'bash'
    args:
      - '-c'
      - |
        GREEN_URL=$(gcloud run services describe api-service \
          --region=$_REGION \
          --flatten='status.traffic[]' \
          --filter='status.traffic.tag=green' \
          --format='value(status.traffic.url)')

        # Health check
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$GREEN_URL/health")
        if [ "$HTTP_CODE" != "200" ]; then
          echo "Health check failed: $HTTP_CODE"
          exit 1
        fi

        echo "Green verification passed"
    id: 'verify-green'

  # Switch traffic to Green
  - name: 'gcr.io/cloud-builders/gcloud'
    entrypoint: 'bash'
    args:
      - '-c'
      - |
        gcloud run services update-traffic api-service \
          --region=$_REGION \
          --to-tags=green=100
        echo "Traffic switched to Green"
    id: 'switch-traffic'

  # Monitor (wait 5 minutes, check error rate)
  - name: 'gcr.io/cloud-builders/gcloud'
    entrypoint: 'bash'
    args:
      - '-c'
      - |
        echo "Monitoring for 5 minutes..."
        sleep 300

        # Check Sentry for new errors
        # Check Cloud Monitoring for error rate
        # If error rate > 5%, trigger rollback

        echo "Monitoring complete - no issues"
    id: 'monitor'

  # Cleanup old revisions (keep last 3)
  - name: 'gcr.io/cloud-builders/gcloud'
    entrypoint: 'bash'
    args:
      - '-c'
      - |
        OLD_REVISIONS=$(gcloud run revisions list \
          --service=api-service \
          --region=$_REGION \
          --format='value(name)' \
          --sort-by=~creationTimestamp | tail -n +4)

        for rev in $OLD_REVISIONS; do
          echo "Deleting old revision: $rev"
          gcloud run revisions delete $rev --region=$_REGION --quiet || true
        done
    id: 'cleanup'

options:
  logging: CLOUD_LOGGING_ONLY

substitutions:
  _REGION: asia-south1
```

---

## 7. Complete Development Workflow

### Daily Development Flow

```
┌─────────────────────────────────────────────────────────────┐
│                DAILY DEVELOPMENT FLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  MORNING:                                                    │
│  1. Pull latest changes                                      │
│     git checkout develop                                     │
│     git pull origin develop                                  │
│                                                              │
│  2. Create feature branch                                    │
│     git checkout -b feature/add-product                      │
│                                                              │
│  3. Start local development                                  │
│     docker-compose up -d                                     │
│                                                              │
│  WORK:                                                       │
│  4. Write code                                               │
│  5. Write tests                                              │
│  6. Run tests locally                                        │
│     npm run test                                             │
│                                                              │
│  BEFORE PUSH:                                                │
│  7. Commit changes                                           │
│     git add .                                                │
│     git commit -m "feat: add product creation"               │
│                                                              │
│  8. Push to GitHub                                           │
│     git push -u origin feature/add-product                   │
│                                                              │
│  9. Create PR on GitHub                                      │
│  10. Wait for CI to pass                                     │
│  11. Request code review                                     │
│                                                              │
│  AFTER REVIEW:                                               │
│  12. Merge to develop                                        │
│  13. Delete feature branch                                   │
│  14. Pull latest develop                                     │
│                                                              │
│  DEPLOYMENT:                                                 │
│  15. Auto-deploy to STAGING                                  │
│  16. Test in staging                                         │
│  17. Blue-green deploy to PRODUCTION                         │
│  18. Monitor for errors                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Cloud Run (Staging)
        uses: google-github-actions/deploy-cloudrun@v2
        with:
          service: api-staging
          region: asia-south1
          image: gcr.io/${{ secrets.GCP_PROJECT_ID }}/api:${{ github.sha }}

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy Green (no traffic)
        run: |
          gcloud run deploy api-service \
            --image=gcr.io/${{ secrets.GCP_PROJECT_ID }}/api:${{ github.sha }} \
            --region=asia-south1 \
            --no-traffic \
            --tag=green
      
      - name: Verify Green
        run: |
          GREEN_URL=$(gcloud run services describe api-service \
            --region=asia-south1 \
            --flatten='status.traffic[]' \
            --filter='status.traffic.tag=green' \
            --format='value(status.traffic.url)')
          
          curl -f $GREEN_URL/health || exit 1
      
      - name: Switch traffic to Green
        run: |
          gcloud run services update-traffic api-service \
            --region=asia-south1 \
            --to-tags=green=100
      
      - name: Monitor for 5 minutes
        run: sleep 300
```

---

## 9. Feature Flags

### What are Feature Flags?

```
┌─────────────────────────────────────────────────────────────┐
│                FEATURE FLAGS                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  WHAT:                                                       │
│  ├── Code that's deployed but hidden from users              │
│  ├── Toggle features on/off without redeploying              │
│  ├── Roll out features to % of users                         │
│  └── Quick kill switch for problematic features              │
│                                                              │
│  WHY:                                                        │
│  ├── Deploy code before it's ready                           │
│  ├── Test in production safely                               │
│  ├── A/B test features                                       │
│  └── Instant rollback (just turn off flag)                   │
│                                                              │
│  EXAMPLE:                                                    │
│  ├── "ai-store-builder" → 10% of users                       │
│  ├── "new-checkout-flow" → Internal testing only             │
│  ├── "premium-analytics" → Business plan users only          │
│  └── "dark-mode" → All users                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Feature Flag Implementation

```typescript
// src/feature-flags.ts

export const featureFlags = {
  // New features (hidden until ready)
  AI_STORE_BUILDER: "ai-store-builder",
  NEW_CHECKOUT_FLOW: "new-checkout-flow",
  DARK_MODE: "dark-mode",
  
  // Premium features
  PREMIUM_ANALYTICS: "premium-analytics",
  CUSTOM_DOMAIN: "custom-domain",
  
  // Rollout percentages
  AI_FEATURES_ROLLOUT: "ai-features-rollout",
};

export const isFeatureEnabled = async (
  feature: string,
  userId: string,
  options?: { percentage?: number }
): Promise<boolean> => {
  // Check feature flag service (LaunchDarkly, Unleash, etc.)
  const flag = await getFeatureFlag(feature);
  
  if (!flag.enabled) return false;
  
  // Check rollout percentage
  if (options?.percentage) {
    const hash = await hashString(userId);
    const bucket = hash % 100;
    return bucket < options.percentage;
  }
  
  // Check user segment
  if (flag.segments) {
    const user = await getUser(userId);
    return flag.segments.includes(user.segment);
  }
  
  return true;
};

// Usage in code
const ProductScreen = () => {
  const [showNewCheckout, setShowNewCheckout] = useState(false);
  
  useEffect(() => {
    isFeatureEnabled(featureFlags.NEW_CHECKOUT_FLOW, user.id)
      .then(setShowNewCheckout);
  }, []);
  
  return showNewCheckout ? (
    <NewCheckoutScreen />
  ) : (
    <OldCheckoutScreen />
  );
};
```

---

## Summary

| Topic | Recommendation |
|-------|----------------|
| **Environment Strategy** | Development → Staging → Production |
| **Git Branching** | GitHub Flow (simple, effective) |
| **Deployment Strategy** | Blue-Green on Cloud Run |
| **Feature Management** | Feature flags for safe rollouts |
| **Rollback** | Instant (< 5 seconds) with blue-green |

### Complete Setup

```
DEVELOPMENT:
├── Git branching: GitHub Flow
├── Local: Docker Compose
├── CI: GitHub Actions
└── Testing: Jest + Integration tests

STAGING:
├── Auto-deploy from develop branch
├── Cloud Run (1 instance)
├── Cloud SQL (separate database)
└── Test real features before production

PRODUCTION:
├── Blue-green deployment from main
├── Cloud Run (auto-scaling)
├── Cloud SQL (Multi-AZ)
├── Monitor with Sentry + Firebase
└── Instant rollback if needed
```

### Key Commands

```bash
# Start feature
git checkout develop && git pull
git checkout -b feature/my-feature

# Work locally
docker-compose up -d

# Push and create PR
git push -u origin feature/my-feature

# After review, merge to develop
git checkout develop
git merge --no-ff feature/my-feature
git push origin develop

# When ready for production
# Create PR: develop → main
# Blue-green deploy happens automatically
```

---

**File Created:** July 8, 2026  
**Purpose:** Complete guide for development workflow, blue-green deployment, and Git branching strategy  
**For:** Store Builder Project - Pakistan
