# Domain Strategy
## Digital Dukaan - Store Builder for Pakistan

**Date:** July 8, 2026

---

## 1. How Shopify Does It

```
┌─────────────────────────────────────────────────────────────┐
│                SHOPIFY DOMAIN MODEL                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SHOPIFY OWNS ONE DOMAIN:                                    │
│  └── myshopify.com                                           │
│                                                              │
│  EVERY STORE GETS FREE SUBDOMAIN:                            │
│  ├── mystore.myshopify.com                                   │
│  ├── clothing.myshopify.com                                  │
│  └── unlimited stores...                                     │
│                                                              │
│  CUSTOM DOMAIN (Optional upgrade):                           │
│  ├── User buys: mystore.com                                  │
│  ├── User connects it to Shopify                             │
│  └── User pays domain registrar                              │
│                                                              │
│  COST TO SHOPIFY: $0 per subdomain                           │
│  UNLIMITED STORES: Yes                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Our Domain Model

### What We Buy

| Item | Cost | Purpose |
|------|------|---------|
| **digitaldukaan.pk** | ~2,000 PKR/year | Our main domain |
| **Subdomains** | FREE | Unlimited stores |

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                OUR DOMAIN MODEL                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  WE BUY ONE DOMAIN:                                          │
│  └── digitaldukaan.pk (2,000 PKR/year)                       │
│                                                              │
│  FREE SUBDOMAINS (Automatic, unlimited):                     │
│  ├── ali.digitaldukaan.pk                                    │
│  ├── fatima-clothing.digitaldukaan.pk                        │
│  ├── ahmed-grocery.digitaldukaan.pk                          │
│  └── unlimited stores...                                     │
│                                                              │
│  CUSTOM DOMAIN (Optional, user buys):                        │
│  ├── User buys: ali-clothing.pk                              │
│  ├── User connects to our platform                           │
│  ├── We handle DNS configuration                             │
│  └── User pays domain registrar directly                     │
│                                                              │
│  TOTAL COST: 2,000 PKR/year (one domain only)                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Two Options for Users

### Option 1: Free Subdomain (Recommended for MVP)

| Feature | Details |
|---------|---------|
| **URL** | mystore.digitaldukaan.pk |
| **Cost** | FREE |
| **Setup** | Automatic |
| **SSL** | Included (HTTPS) |
| **Best for** | Starting out, testing |

### Option 2: Custom Domain (Premium Feature)

| Feature | Details |
|---------|---------|
| **URL** | mystore.pk or mystore.com |
| **Cost** | User buys domain (~2,000 PKR/year) |
| **Setup** | User connects via DNS settings |
| **SSL** | Included (HTTPS) |
| **Best for** | Established businesses |

---

## 4. Technical Implementation

### Subdomain Creation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                SUBDOMAIN CREATION                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  WHEN USER CREATES STORE:                                    │
│                                                              │
│  1. User enters shop name: "Ali Clothing"                    │
│                                                              │
│  2. System generates slug: "ali-clothing"                    │
│                                                              │
│  3. System creates subdomain:                                │
│     ali-clothing.digitaldukaan.pk                            │
│                                                              │
│  4. DNS record created automatically:                        │
│     Type: CNAME                                              │
│     Name: ali-clothing                                       │
│     Value: our-app.cloudrun.app                              │
│                                                              │
│  5. Store is live at:                                        │
│     https://ali-clothing.digitaldukaan.pk                    │
│                                                              │
│  TOTAL COST: $0 (free with our domain)                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### DNS Configuration

```bash
# Example DNS records for digitaldukaan.pk

# Main domain
digitaldukaan.pk.          A       3600    34.102.136.180
digitaldukaan.pk.          MX      3600    mail.digitaldukaan.pk

# Subdomains (auto-created)
ali.digitaldukaan.pk.      CNAME   3600    our-app.cloudrun.app
fatima.digitaldukaan.pk.   CNAME   3600    our-app.cloudrun.app
ahmed.digitaldukaan.pk.    CNAME   3600    our-app.cloudrun.app

# SSL (automatic via Let's Encrypt)
_letsencrypt.digitaldukaan.pk. TXT 3600    "letsencrypt-validation"
```

---

## 5. Custom Domain Connection

### User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                CUSTOM DOMAIN SETUP                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. USER BUYS DOMAIN                                         │
│     ├── From: Namecheap, GoDaddy, PakistanDomains.pk         │
│     ├── Cost: ~2,000 PKR/year (.pk)                          │
│     └── Cost: ~3,000 PKR/year (.com)                         │
│                                                              │
│  2. USER GOES TO OUR APP                                     │
│     ├── Settings → Custom Domain                             │
│     ├── Enters: mystore.pk                                   │
│     └── Clicks "Connect"                                     │
│                                                              │
│  3. WE SHOW DNS INSTRUCTIONS                                 │
│     ├── Add CNAME record:                                    │
│     │   Type: CNAME                                          │
│     │   Name: @                                              │
│     │   Value: cname.digitaldukaan.pk                        │
│     │   TTL: 3600                                            │
│     └── Wait 24-48 hours                                     │
│                                                              │
│  4. USER UPDATES DNS AT REGISTRAR                            │
│     ├── Goes to Namecheap/GoDaddy                            │
│     ├── Adds the DNS records                                 │
│     └── Waits for propagation                                │
│                                                              │
│  5. WE AUTO-VERIFY                                           │
│     ├── Check DNS propagation                                │
│     ├── Issue SSL certificate                                │
│     └── Store is live at mystore.pk                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### DNS Instructions Shown to User

```
┌─────────────────────────────────────────────────────────────┐
│                DNS SETUP INSTRUCTIONS                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  To connect your domain, add these DNS records:              │
│                                                              │
│  RECORD 1:                                                   │
│  ├── Type: CNAME                                             │
│  ├── Name: @ (or www)                                        │
│  ├── Value: cname.digitaldukaan.pk                           │
│  └── TTL: 3600                                               │
│                                                              │
│  RECORD 2 (if needed):                                       │
│  ├── Type: A                                                 │
│  ├── Name: @                                                 │
│  ├── Value: 34.102.136.180                                   │
│  └── TTL: 3600                                               │
│                                                              │
│  After adding records, wait 24-48 hours.                     │
│  We'll automatically verify and activate your domain.        │
│                                                              │
│  Need help? WhatsApp us at +92 311 392 5853                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Revenue Opportunity

| Feature | Price | Notes |
|---------|-------|-------|
| **Free subdomain** | FREE | Included in all plans |
| **Custom domain setup** | FREE | We help configure |
| **Domain purchase** | FREE | User buys directly |
| **Premium DNS features** | 500 PKR/year | Optional upgrade |
| **Domain privacy** | 300 PKR/year | Optional upgrade |

---

## 7. Domain Options for Users

### Pakistani Domains (.pk)

| Registrar | Price | Features |
|-----------|-------|----------|
| **PakistanDomains.pk** | 1,500 PKR/year | Local support |
| **HostAgain.pk** | 1,800 PKR/year | Good support |
| **NetSol.pk** | 2,000 PKR/year | Established |

### International Domains (.com)

| Registrar | Price | Features |
|-----------|-------|----------|
| **Namecheap** | $10/year (~2,800 PKR) | Cheap, reliable |
| **GoDaddy** | $12/year (~3,300 PKR) | Popular |
| **Cloudflare** | $8/year (~2,200 PKR) | Cheapest |

### Recommended for Users

| User Type | Recommended Domain | Cost |
|-----------|-------------------|------|
| **Starting out** | Free subdomain | FREE |
| **Local business** | .pk domain | 1,500-2,000 PKR/year |
| **International** | .com domain | 2,200-3,300 PKR/year |

---

## 8. Implementation Code

### Subdomain Creation

```javascript
// src/services/domain.js

const DNS = require('dns');
const { promisify } = require('util');

const resolve = promisify(DNS.resolve);

async function createSubdomain(slug, shopId) {
  // 1. Validate slug (alphanumeric, hyphens only)
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error('Invalid slug');
  }
  
  // 2. Check if slug is available
  try {
    await resolve(`${slug}.digitaldukaan.pk`);
    throw new Error('Slug already taken');
  } catch (err) {
    if (err.code !== 'ENODATA') throw err;
    // Slug is available
  }
  
  // 3. Create DNS record (via Cloud DNS API)
  await createDNSRecord(slug, shopId);
  
  // 4. Issue SSL certificate (via Let's Encrypt)
  await issueSSLCertificate(`${slug}.digitaldukaan.pk`);
  
  return {
    subdomain: `${slug}.digitaldukaan.pk`,
    url: `https://${slug}.digitaldukaan.pk`
  };
}

async function createDNSRecord(slug, shopId) {
  // Google Cloud DNS API call
  const dns = require('@google-cloud/dns');
  const dnsClient = new dns();
  
  const zone = dnsClient.zone('digitaldukaan-pk');
  
  const record = zone.record('cname', {
    name: `${slug}.digitaldukaan.pk.`,
    data: 'our-app.cloudrun.app.',
    ttl: 3600
  });
  
  await zone.addRecords([record]);
}
```

### Custom Domain Verification

```javascript
// src/services/customDomain.js

async function verifyCustomDomain(domain, shopId) {
  // 1. Check DNS records
  try {
    const cname = await resolve(domain, 'CNAME');
    if (cname[0] !== 'cname.digitaldukaan.pk.') {
      return { valid: false, error: 'CNAME record incorrect' };
    }
  } catch (err) {
    return { valid: false, error: 'DNS not configured' };
  }
  
  // 2. Check SSL certificate
  const sslValid = await checkSSLCertificate(domain);
  if (!sslValid) {
    return { valid: false, error: 'SSL not ready' };
  }
  
  // 3. Update shop record
  await updateShopDomain(shopId, domain);
  
  return { valid: true, domain };
}
```

---

## 9. Summary

| Decision | Recommendation |
|----------|----------------|
| **Do we need to buy many domains?** | NO - Only 1 domain (digitaldukaan.pk) |
| **How to create subdomains?** | Automatic, unlimited, free |
| **How does Shopify do it?** | Same approach - one domain, unlimited subdomains |
| **Should users buy custom domains?** | YES - Optional upgrade |
| **Should we buy domains for users?** | NO - They buy, we help connect |
| **Total cost for us?** | 2,000 PKR/year (one domain) |

---

**Document Complete**
**All 11 Documents Created!**
