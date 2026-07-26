# Security & Compliance
## Digital Dukaan - Store Builder for Pakistan

**Date:** July 8, 2026

---

## 1. Security Layers

| Layer | Protection |
|-------|------------|
| **Network** | HTTPS (TLS 1.3), Cloudflare DDoS, WAF, Rate limiting |
| **Authentication** | Phone OTP, JWT (15-min expiry), Refresh tokens |
| **Authorization** | RBAC, Shop isolation, Permission-based endpoints |
| **Data** | AES-256 at rest, TLS in transit, Encrypted backups |
| **Application** | Input validation, SQL injection prevention, XSS/CSRF protection |

---

## 2. Authentication Flow

| Step | Action | Security |
|------|--------|----------|
| 1 | Enter phone | Validate format |
| 2 | Send OTP | 6-digit, 5-min expiry |
| 3 | Enter OTP | Max 3 attempts, then lock |
| 4 | Verify OTP | Server-side validation |
| 5 | Issue JWT | 15-min expiry |
| 6 | Store token | Secure Keychain/Keystore |
| 7 | Refresh token | 7-day expiry, rotation |

---

## 3. Data Encryption

| Data | At Rest | In Transit |
|------|---------|------------|
| User Data | AES-256 | TLS 1.3 |
| Payment Data | AES-256 | TLS 1.3 |
| Product Images | AES-256 | TLS 1.3 |
| Database | AES-256 | TLS 1.3 |
| Backups | AES-256 | TLS 1.3 |

---

## 4. Payment Security

| Requirement | Implementation |
|-------------|----------------|
| No card data stored | Use payment gateway tokens |
| Secure transmission | TLS 1.3 for all payment APIs |
| Access control | Limited access to payment data |
| Monitoring | Log all payment transactions |
| Testing | Regular security audits |

---

## 5. Privacy Policy Summary

**What We Collect:**
- Phone number (login)
- Name (personalization)
- Shop information (service)
- Products (your store)
- Orders (transactions)

**Your Rights:**
- View your data
- Export your data (CSV)
- Delete your data
- Stop marketing messages

**Contact:** privacy@digitaldukaan.pk

---

## 6. PTA Compliance

| Requirement | Implementation |
|-------------|----------------|
| Data Localization | GCP asia-south1 (Karachi) |
| Content Filtering | Block prohibited content |
| User Verification | Phone number verification |
| Reporting | Monthly compliance reports |

---

## 7. Security Testing

| Test Type | Frequency | Tool |
|-----------|-----------|------|
| Vulnerability Scan | Weekly | Nessus |
| Penetration Test | Quarterly | Manual |
| Code Review | Per PR | SonarQube |
| Dependency Scan | Daily | Snyk |

---

## 8. Incident Response

| Level | Description | Response Time |
|-------|-------------|---------------|
| P0 - Critical | Data breach, system down | 1 hour |
| P1 - High | Major feature broken | 4 hours |
| P2 - Medium | Minor issue | 24 hours |
| P3 - Low | Cosmetic | 1 week |

---

**Document Complete**
**Next Document:** 09_Operations_Support.md
