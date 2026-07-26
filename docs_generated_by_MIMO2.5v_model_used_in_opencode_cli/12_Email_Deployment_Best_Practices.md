# Email & Deployment Best Practices
## Digital Dukaan - Store Builder for Pakistan

**Date:** July 8, 2026

---

## 1. Email Strategy (3 Types)

### Overview

```
┌─────────────────────────────────────────────────────────────┐
│                EMAIL STRATEGY                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  EMAIL 1: AUTOMATED (Subdomain)                              │
│  ├── Domain: mail.digitaldukaan.pk                           │
│  ├── Purpose: Signups, billing, password resets              │
│  ├── Protection: Subdomain隔离 (spam flags don't affect main) │
│  └── Tool: Resend or SendGrid                                │
│                                                              │
│  EMAIL 2: HUMAN (Main Domain)                                │
│  ├── Domain: support@digitaldukaan.pk                        │
│  ├── Purpose: Support, contact, personal                     │
│  ├── Protection: Never send automated emails                 │
│  └── Tool: Google Workspace or Zoho Mail                     │
│                                                              │
│  EMAIL 3: MARKETING (Subdomain)                              │
│  ├── Domain: newsletter.digitaldukaan.pk                     │
│  ├── Purpose: Newsletters, campaigns                         │
│  ├── Protection: Subdomain隔离 (spam flags don't affect main) │
│  └── Tool: Mailchimp or ConvertKit                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Email Setup Details

| Email Type | Address | Domain | Provider | Purpose |
|------------|---------|--------|----------|---------|
| **Automated** | noreply@mail.digitaldukaan.pk | mail. | Resend | OTP, receipts, alerts |
| **Human** | support@digitaldukaan.pk | main | Google Workspace | Customer support |
| **Human** | hello@digitaldukaan.pk | main | Google Workspace | General inquiries |
| **Marketing** | newsletter@newsletter.digitaldukaan.pk | newsletter. | Mailchimp | Campaigns, newsletters |

### Why Subdomains for Automated & Marketing

```
┌─────────────────────────────────────────────────────────────┐
│                WHY SUBDOMAINS?                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PROBLEM:                                                    │
│  ├── If automated emails get flagged for spam                │
│  ├── Your main domain reputation is damaged                  │
│  └── All emails from your domain go to spam                  │
│                                                              │
│  SOLUTION:                                                   │
│  ├── Use subdomain for automated emails                      │
│  ├── Use subdomain for marketing emails                      │
│  ├── Main domain stays clean                                 │
│  └── Spam flags only affect subdomain                        │
│                                                              │
│  RESULT:                                                     │
│  ├── support@digitaldukaan.pk = Always delivered             │
│  ├── mail.digitaldukaan.pk = If flagged, only subdomain      │
│  └── newsletter.digitaldukaan.pk = If flagged, only sub      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Open Graph Preview Images

### What is Open Graph?

Open Graph meta tags make your links look good on social media (Facebook, Twitter, WhatsApp).

### Implementation

```html
<!-- Add to your index.html head -->
<meta property="og:title" content="Digital Dukaan - اپنی دکان آنلائن بنائیں">
<meta property="og:description" content="5 منٹ میں اپنی آنلائن دکان بنائیں۔ کوئی ٹیکنیکل نالج نہیں چاہیے۔">
<meta property="og:image" content="https://digitaldukaan.pk/og-image.png">
<meta property="og:url" content="https://digitaldukaan.pk">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Digital Dukaan">
<meta name="twitter:description" content="5 منٹ میں اپنی آنلائن دکان بنائیں">
<meta name="twitter:image" content="https://digitaldukaan.pk/og-image.png">
```

### OG Image Requirements

| Property | Requirement |
|----------|-------------|
| **Size** | 1200x630 pixels |
| **Format** | PNG or JPG |
| **Max Size** | 1MB |
| **Text** | Large, readable |
| **Logo** | Include brand logo |

### Preview Tool

Test your preview at: https://www.opengraph.xyz/

---

## 3. Subdomain vs Main Domain Hosting

### Recommended Setup

```
┌─────────────────────────────────────────────────────────────┐
│                HOSTING STRUCTURE                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  MAIN DOMAIN: digitaldukaan.pk                               │
│  ├── Content: Landing page, marketing pages                 │
│  ├── Purpose: SEO, marketing, brand                         │
│  └── Hosting: Vercel or Netlify (static)                     │
│                                                              │
│  APP SUBDOMAIN: app.digitaldukaan.pk                         │
│  ├── Content: The actual application                        │
│  ├── Purpose: User login, dashboard                          │
│  └── Hosting: Cloud Run (backend)                            │
│                                                              │
│  STORE SUBDOMAINS: *.digitaldukaan.pk                        │
│  ├── Content: User stores                                   │
│  ├── Purpose: Customer-facing storefronts                    │
│  └── Hosting: Cloud Run (same backend)                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Why This Structure?

| Reason | Benefit |
|--------|---------|
| **Separation** | Landing page and app are separate |
| **SEO** | Main domain ranks for marketing |
| **Security** | App is isolated on subdomain |
| **Performance** | Static landing = fast, App = dynamic |
| **Maintenance** | Update independently |

---

## 4. Onboarding Checklist

### Design Principles

| Principle | Description |
|-----------|-------------|
| **Progressive** | Show steps one at a time |
| **Visual** | Use icons and progress bars |
| **Optional** | Allow skipping |
| **Rewarding** | Celebrate completion |

### Checklist Implementation

```javascript
// src/components/OnboardingChecklist.jsx

const CHECKLIST_ITEMS = [
  { id: 'shop', label: 'دکان بنائیں', icon: '🏪', completed: false },
  { id: 'product', label: 'پہلا پروڈکٹ شامل کریں', icon: '📦', completed: false },
  { id: 'price', label: 'قیمت مقرر کریں', icon: '💰', completed: false },
  { id: 'share', label: 'واٹس ایپ پر شیئر کریں', icon: '📱', completed: false },
  { id: 'order', label: 'پہلا آرڈر وصول کریں', icon: '🛒', completed: false },
];

function OnboardingChecklist({ completionRate }) {
  return (
    <div className="checklist">
      <div className="progress">
        <div className="progress-bar" style={{ width: `${completionRate}%` }} />
      </div>
      <p>{completionRate}% مکمل</p>
      
      {CHECKLIST_ITEMS.map(item => (
        <div key={item.id} className={`item ${item.completed ? 'done' : ''}`}>
          <span className="icon">{item.icon}</span>
          <span className="label">{item.label}</span>
          {item.completed && <span className="check">✓</span>}
        </div>
      ))}
    </div>
  );
}
```

---

## 5. Product Analytics (PostHog)

### Why PostHog?

| Feature | Benefit |
|---------|---------|
| **Open Source** | Free tier available |
| **Self-Hostable** | Control your data |
| **Privacy-First** | GDPR compliant |
| **Cookie Banner** | Built-in support |

### Implementation

```javascript
// src/lib/analytics.js
import posthog from 'posthog-js';

// Initialize PostHog
posthog.init('YOUR_API_KEY', {
  api_host: 'https://app.posthog.com',
  capture_pageview: false, // Manual pageview tracking
  persistence: 'localStorage',
});

// Track events
export function trackEvent(name, properties = {}) {
  posthog.capture(name, properties);
}

// Track pageviews
export function trackPageview(url) {
  posthog.capture('$pageview', { $current_url: url });
}

// Identify user
export function identifyUser(userId, properties = {}) {
  posthog.identify(userId, properties);
}

// Examples:
trackEvent('product_added', { category: 'clothing', price: 1299 });
trackEvent('order_completed', { total: 4500, items: 3 });
identifyUser('user-123', { name: 'Ali', plan: 'pro' });
```

### Cookie Banner Implementation

```javascript
// src/components/CookieBanner.jsx
import { useState, useEffect } from 'react';

function CookieBanner() {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setShow(true);
  }, []);
  
  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
    // Enable analytics
  };
  
  const reject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShow(false);
    // Disable analytics
  };
  
  if (!show) return null;
  
  return (
    <div className="cookie-banner">
      <p>ہم بہترین تجربے کے لیے کوکیز استعمال کرتے ہیں۔</p>
      <button onClick={accept}>قبول ہے</button>
      <button onClick={reject}>رد کریں</button>
    </div>
  );
}
```

---

## 6. Sitemap.xml

### Create Sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <!-- Main Pages -->
  <url>
    <loc>https://digitaldukaan.pk</loc>
    <lastmod>2026-07-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <url>
    <loc>https://digitaldukaan.pk/features</loc>
    <lastmod>2026-07-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://digitaldukaan.pk/pricing</loc>
    <lastmod>2026-07-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://digitaldukaan.pk/about</loc>
    <lastmod>2026-07-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <url>
    <loc>https://digitaldukaan.pk/contact</loc>
    <lastmod>2026-07-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <!-- Blog (if exists) -->
  <url>
    <loc>https://digitaldukaan.pk/blog</loc>
    <lastmod>2026-07-08</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  
</urlset>
```

### Place in Root Folder

```
digitaldukaan.pk/
├── index.html
├── sitemap.xml        ← Add here
├── robots.txt
└── ...
```

---

## 7. Google Search Console Setup

### Steps

1. **Go to:** https://search.google.com/search-console
2. **Add Property:** Enter `digitaldukaan.pk`
3. **Verify Ownership:**
   - Add DNS TXT record, OR
   - Add HTML meta tag to index.html
4. **Submit Sitemap:**
   - Go to Sitemaps section
   - Enter: `https://digitaldukaan.pk/sitemap.xml`
   - Click Submit
5. **Request Indexing:**
   - Go to URL Inspection
   - Enter each public page URL
   - Click "Request Indexing"

### Verification Code

```html
<!-- Add to index.html head -->
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

---

## Summary

| Tip | Implementation | Priority |
|-----|----------------|----------|
| **Email Strategy** | 3 types (automated, human, marketing) | HIGH |
| **Open Graph** | Meta tags + OG image | HIGH |
| **Subdomain Hosting** | App on app., landing on main | HIGH |
| **Onboarding Checklist** | Progressive, visual checklist | HIGH |
| **Product Analytics** | PostHog + cookie banner | MEDIUM |
| **Sitemap.xml** | XML file in root | HIGH |
| **Google Search Console** | Verify + submit sitemap | HIGH |

---

**Document Complete**
**All 12 Documents Created!**
