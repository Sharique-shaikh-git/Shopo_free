# Deployment Notes — Email Subdomains + Social Preview + SEO Indexing

## 1) Email separation for deliverability (is it correct?)
**Yes—concept is correct:** use different sending hostnames for different email types to protect deliverability of your main domain.

### 1.1 Transactional emails (signup, billing, password reset)
**Recommended:** send from a dedicated **transactional** subdomain, for example:
- `mail.yourdomain.com` or `app-mail.yourdomain.com`

**Why:** transactional traffic can still get flagged if your system sends high volume, has bugs, or experiences bounce spikes. Separating isolates reputation impact.

**Also do:**
- SPF record for that sending hostname
- DKIM signing
- DMARC policy (at least monitoring; then enforce)

### 1.2 Support / human inbox
**Recommended:** keep support replies on a mailbox that users expect and that you monitor carefully.
- You *can* use the main domain for support, but ensure that support is not used for high-volume automation.

**Also do:**
- SPF/DKIM/DMARC must still be valid for the main domain
- Use a ticketing/helpdesk provider if possible (optional later)

### 1.3 Marketing newsletters / promos
**Recommended:** send marketing from a dedicated **marketing** subdomain, example:
- `news.yourdomain.com` or `marketing.yourdomain.com`

**Why:** newsletters have higher unsubscribe/bounce rates and therefore affect domain reputation.

> Note on the Instagram “use something like recent” tip: the meaningful production practice is **dedicated sending domain/subdomain**, not a literal word like “recent”.

---

## 2) Social media preview (is it correct?)
**Yes—add preview images so links look good on social media.**

Implement:
- Open Graph tags:
  - `og:title`
  - `og:description`
  - `og:image`
- Twitter card tags:
  - `twitter:card`
  - `twitter:image`

For product pages, use **dynamic OG images** (generated thumbnails) so each product link looks correct.

---

## 3) Subdomain hosting split (landing vs app)
**Yes—this is correct and common:**
- Marketing/landing on main domain:
  - `yourdomain.com`
- App + dashboard on subdomain:
  - `app.yourdomain.com`
- (Optional) Public storefront can be:
  - `shop.yourdomain.com` (if you use a shared storefront host)
  - or `storeSlug.yourdomain.com` / `slug.appdomain.pk` (Shopify-like model)

**Production caution (important):** cookie/auth domain design must be consistent. If merchants log in on `app.yourdomain.com`, configure session/cookies to work correctly and avoid cross-subdomain auth issues.

---

## 4) Onboarding checklist (is it correct?)
**Yes—this is product UX, and it reduces churn.**
Make sure:
- store creation guidance is in local language
- steps are short and visible
- “time-to-first-value” is minimized (publish + get first orders)

---

## 5) Analytics + cookie banner (is it correct?)
**Mostly correct:** analytics helps you see where users get stuck.

Production requirements:
- Add cookie/consent management (especially if you use GDPR/UK/EU-like policies or similar local requirements)
- Separate analytics:
  - essential (required)
  - optional marketing/behavioral
- Do not store sensitive customer data in analytics events

---

## 6) sitemap.xml + indexing (is it correct?)
**Yes—having `sitemap.xml` is correct**, but the step “Google Cloud Console” depends on your setup.

Recommended production flow:
1. Create `sitemap.xml` at the root of the public site.
2. Use **Google Search Console** to submit the sitemap.
3. Set an indexing strategy:
   - index only published stores/products
   - keep drafts and inactive items `noindex`

**Also do:**
- `robots.txt` aligned with your indexing policy
- `meta robots` for per-page control:
  - `noindex` for drafts/unpublished content

---

## 7) SEO indexing policy for multi-tenant stores (recommended default)
Because you’ll create many tenant storefronts, avoid indexing “too much” draft content.

Suggested rules:
- Store pages:
  - `published` => indexable
  - `draft`/`paused`/`deleted` => `noindex`
- Product pages:
  - `active` => indexable
  - `draft`/`archived` => `noindex`

---

## 8) Minimal required checklist (copy/paste)
### Email
- [ ] Transactional sending subdomain configured (`mail.`)
- [ ] SPF set for sending hostname
- [ ] DKIM enabled
- [ ] DMARC configured (monitor then enforce)
- [ ] Marketing sending subdomain configured (`news.` or `marketing.`)

### Social preview
- [ ] `og:image` works for:
  - [ ] landing page
  - [ ] store pages
  - [ ] product pages (dynamic image)

### Hosting / Subdomains
- [ ] cookie/auth works on `app.` and doesn’t break on storefront subdomains

### Analytics
- [ ] onboarding funnel events tracked
- [ ] cookie banner/consent flow added
- [ ] no sensitive data sent to analytics

### SEO
- [ ] sitemap.xml exists
- [ ] Search Console sitemap submitted
- [ ] robots + noindex rules for drafts/unpublished content
