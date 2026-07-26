# AI Shop Builder — Project PID (Docs Seed)

## 1. Vision
Mobile-first AI-powered commerce system for Pakistan-first non-technical merchants. Merchant can create a storefront and start receiving orders (COD-first) by uploading products (photos/voice/text) while AI generates product/store content.

## 2. Problem
- WhatsApp/Facebook selling causes long chat, negotiation, and delays.
- Traditional e-commerce platforms feel expensive and technical (domain/hosting/SEO/settings).
- Merchants don’t want technical terminology; they want orders and a simple process.

## 3. Solution
- Merchant app: onboarding + AI-assisted product creation + publish/store link generation.
- Customer storefront: mobile web pages for browsing and ordering.
- Fulfillment workflow: merchant receives orders and marks shipped/delivered.
- Marketing: assisted promotions/ads content generation and sharing.

## 4. Primary Differentiators
- “Website” complexity removed from merchant UI (plain language).
- Mobile-first merchant UX.
- AI product enrichment with price suggestion.
- COD-first ordering + simple fulfillment flow.
- Multi-language (Urdu/Sindhi/Balochi/English).

## 5. MVP Scope (production-ready direction)
- Merchant onboarding
- Upload product photo → AI generates listing fields
- Publish store to free subdomain
- Customer browsing and COD checkout
- Merchant order dashboard: fulfill orders
- Basic analytics + operational monitoring

## 6. Non-Goals (initially)
- Complex payments (beyond COD, later optional wallet/bank transfer)
- Fully automated courier integrations everywhere (start with notifications/booking where available)
- Advanced inventory/ERP complexity

## 7. Core Entities (high-level)
- Merchant, Store, Product, Order, AIJob, Promotion

## 8. Product Success Metrics
- Merchant activation: % who publish first store
- AI acceptance: % products accepted without rework
- Time-to-first-order
- Conversion: product view → order
- Support tickets: should decrease vs WhatsApp-only workflow
