# UI/UX Design Document
## AI-Powered Mobile-First Store Builder for Pakistan

**Document Version:** 1.0  
**Date:** July 8, 2026  
**Status:** Complete  
**Author:** Sharique Shaikh (SS Services)

---

## 1. Design Vision

**"Simple as WhatsApp, Beautiful as Instagram, Professional as Shopify"**

---

## 2. Design Principles

| Principle | Description |
|-----------|-------------|
| **Mobile-First** | Designed for phones, not desktops |
| **Simplicity** | Maximum 3 taps for any action |
| **Visual-First** | Product photos dominate |
| **Trust-Building** | Professional appearance |
| **Cultural-Fit** | Urdu language, Pakistani context |

---

## 3. Color System

### Primary Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary Green** | #00A651 | Primary buttons, links, active states |
| **Primary Dark** | #007A3D | Hover states, emphasis |
| **Primary Light** | #E8F5E9 | Backgrounds, highlights |

### Secondary Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Gold** | #FFD700 | Premium badges, highlights |
| **Coral** | #FF6B6B | Sale badges, urgency |
| **Blue** | #4A90E2 | Info, links, secondary actions |

### Neutral Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **White** | #FFFFFF | Backgrounds |
| **Light Gray** | #F5F5F5 | Secondary backgrounds |
| **Medium Gray** | #E0E0E0 | Borders |
| **Dark Gray** | #333333 | Primary text |
| **Black** | #1A1A1A | Headings |

### Semantic Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Success** | #4CAF50 | Order confirmed, payment success |
| **Warning** | #FF9800 | Low stock, pending |
| **Error** | #F44336 | Errors, delete actions |
| **Info** | #2196F3 | Information, help |

---

## 4. Typography

### Font Stack

**Urdu Fonts:**
- Primary: Jameel Noori Nastaleeq (headlines, body)
- Secondary: Noto Sans Urdu (UI elements, buttons)

**English Fonts:**
- Primary: Inter (UI elements, buttons)
- Secondary: Poppins (headlines, branding)

**Monospace:**
- JetBrains Mono (prices, numbers)

### Type Scale

| Element | Size (px) | Weight | Font |
|---------|-----------|--------|------|
| **H1** | 32 | Bold | Poppins/Jameel Noori |
| **H2** | 24 | SemiBold | Poppins/Jameel Noori |
| **H3** | 20 | SemiBold | Inter/Jameel Noori |
| **Body** | 16 | Regular | Inter/Jameel Noori |
| **Small** | 14 | Regular | Inter/Noto Sans Urdu |
| **Price** | 18 | Bold | JetBrains Mono |

### Typography Rules

- **Urdu Text:** Right-to-Left, right-aligned, 16px minimum
- **English Text:** Left-to-Right, left-aligned, 14px minimum
- **Mixed Text:** Urdu takes priority, clear separation

---

## 5. Component Library

### Buttons

**Primary Button:**
- Background: #00A651 (Green)
- Text: #FFFFFF (White)
- Border Radius: 12px
- Padding: 16px 24px

**Secondary Button:**
- Background: #FFFFFF (White)
- Text: #00A651 (Green)
- Border: 2px solid #00A651
- Border Radius: 12px

**Danger Button:**
- Background: #F44336 (Red)
- Text: #FFFFFF (White)
- Border Radius: 12px

**Icon Button:**
- Background: #00A651 (Green)
- Size: 48x48px
- Border Radius: 24px (circle)

### Input Fields

**Text Input:**
- Background: #FFFFFF
- Border: 2px solid #E0E0E0
- Border Radius: 12px
- Padding: 16px
- Focus Border: #00A651

**Search Input:**
- Background: #F5F5F5
- Border: None
- Border Radius: 24px (pill)
- Padding: 12px 16px

### Cards

**Product Card:**
- Background: #FFFFFF
- Border Radius: 16px
- Shadow: 0 2px 8px rgba(0,0,0,0.1)
- Image Aspect Ratio: 1:1

**Order Card:**
- Background: #FFFFFF
- Border Radius: 16px
- Border Left: 4px solid #00A651

**Stat Card:**
- Background: Linear Gradient (#00A651 → #007A3D)
- Text: #FFFFFF
- Border Radius: 16px

### Bottom Navigation

- Height: 64px
- Icon: 24x24px
- Label: 12px font
- Active: #00A651 (Green)
- Inactive: #999999 (Gray)

---

## 6. App Screens

### Screen Map

```
ONBOARDING
├── Splash Screen
├── Welcome Screen
├── Language Selection
├── Phone Verification
└── Shop Setup (AI-Guided)

HOME
├── Dashboard
├── Quick Actions
├── Recent Orders
├── Sales Chart
└── AI Insights

STORE
├── Product List
├── Add Product (AI-Assisted)
├── Product Details
├── Categories
└── Inventory

ORDERS
├── Order List
├── Order Details
├── Update Status
└── Customer Info

ANALYTICS
├── Sales Overview
├── Top Products
├── Customer Insights
└── Revenue Chart

SETTINGS
├── Profile
├── Shop Settings
├── Payment Methods
├── Notifications
└── Help & Support
```

### Screen Wireframes

#### Splash Screen

```
┌─────────────────────────────────────┐
│                                     │
│         ┌─────────────┐             │
│         │   [Logo]    │             │
│         └─────────────┘             │
│                                     │
│         Digital Dukaan              │
│         ڈیجیٹل دکان                 │
│                                     │
│         Loading...                  │
│         ●●●○○                       │
│                                     │
└─────────────────────────────────────┘

Background: Gradient (#00A651 → #007A3D)
```

#### Welcome Screen

```
┌─────────────────────────────────────┐
│         ┌─────────────┐             │
│         │   [Image]   │             │
│         │  Shopkeeper │             │
│         │  with phone │             │
│         └─────────────┘             │
│                                     │
│     Assalam-o-Alaikum! 👋           │
│                                     │
│     Start selling online            │
│     in 5 minutes                    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Get Started             │   │
│  └─────────────────────────────┘   │
│                                     │
│     Already have account?           │
│     Login                          │
└─────────────────────────────────────┘
```

#### Language Selection

```
┌─────────────────────────────────────┐
│     Choose Your Language            │
│     اپنی زبان منتخب کریں            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🇵🇰  اردو (Urdu)            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🇵🇰  سندھی (Sindhi)         │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🇬🇧  English                │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Continue                │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### Shop Setup (AI-Guided)

```
┌─────────────────────────────────────┐
│  Step 1 of 3                        │
│  ●●○○○                              │
│                                     │
│  What's your shop name?             │
│  آپ کی دکان کا نام کیا ہے؟          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🎤  Tap to speak           │   │
│  └─────────────────────────────┘   │
│                                     │
│  OR type it:                        │
│  ┌─────────────────────────────┐   │
│  │  Shop Name                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Continue                │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### Dashboard (Home)

```
┌─────────────────────────────────────┐
│  ☰  Digital Dukaan      🔔  👤      │
│  ─────────────────────────────────  │
│                                     │
│  Assalam-o-Alaikum, Ali! 👋         │
│                                     │
│  ┌─────────┐  ┌─────────┐          │
│  │ 📦 12   │  │ 💰 45K  │          │
│  │ Orders  │  │ Sales   │          │
│  │ ↑ 8%    │  │ ↑ 12%   │          │
│  └─────────┘  └─────────┘          │
│                                     │
│  Quick Actions                      │
│  ┌─────┐ ┌─────┐ ┌─────┐           │
│  │  📷  │ │  📦  │ │  📢  │           │
│  │ Add  │ │ New  │ │ Share│           │
│  └─────┘ └─────┘ └─────┘           │
│                                     │
│  Recent Orders                      │
│  ┌─────────────────────────────┐   │
│  │ Order #1234  │  PKR 2,500   │   │
│  │ Ahmed K.     │  🚚 On the way│   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────┬─────┬─────┬─────┬─────┐   │
│  │  🏠  │  🛍️  │  📦  │  📊  │  ⚙️  │   │
│  │ Home │Store│Order│Stats│More │   │
│  └─────┴─────┴─────┴─────┴─────┘   │
└─────────────────────────────────────┘
```

#### Product List (Store)

```
┌─────────────────────────────────────┐
│  ←  My Products           + Add     │
│  ─────────────────────────────────  │
│                                     │
│  🔍 Search products...              │
│                                     │
│  [All] [Clothing] [Cosmetics] [More]│
│                                     │
│  ┌───────────┐  ┌───────────┐       │
│  │ [Image]   │  │ [Image]   │       │
│  │ Blue Shirt│  │ Lipstick  │       │
│  │ PKR 1,299 │  │ PKR 899   │       │
│  │ 📦 15     │  │ 📦 8      │       │
│  └───────────┘  └───────────┘       │
│                                     │
│  ┌─────┬─────┬─────┬─────┬─────┐   │
│  │  🏠  │  🛍️  │  📦  │  📊  │  ⚙️  │   │
│  │ Home │Store│Order│Stats│More │   │
│  └─────┴─────┴─────┴─────┴─────┘   │
└─────────────────────────────────────┘
```

#### Add Product (AI-Assisted)

```
┌─────────────────────────────────────┐
│  ←  Add Product                     │
│  ─────────────────────────────────  │
│                                     │
│  Take a photo of your product       │
│  اپنے پروڈکٹ کی تصویر لیں           │
│                                     │
│  ┌─────────────────────────────┐   │
│  │         📷                  │   │
│  │    Tap to take photo        │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────┐ ┌─────────────┐   │
│  │ 🖼️ Gallery  │ │ 🎤 Voice    │   │
│  └─────────────┘ └─────────────┘   │
│                                     │
│  AI will automatically generate:    │
│  ✓ Product title                    │
│  ✓ Description                      │
│  ✓ Category                         │
│  ✓ Suggested price                  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Continue                │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### Order Details

```
┌─────────────────────────────────────┐
│  ←  Order #12345                    │
│  ─────────────────────────────────  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Status: 🚚 On the way      │   │
│  └─────────────────────────────┘   │
│                                     │
│  Customer                           │
│  ┌─────────────────────────────┐   │
│  │ 👤 Ahmed Khan               │   │
│  │ 📱 +92 321 1234567          │   │
│  │ 📍 Karachi, Sindh           │   │
│  └─────────────────────────────┘   │
│                                     │
│  Items                              │
│  ┌─────────────────────────────┐   │
│  │ [Image] Blue Shirt  x2      │   │
│  │         PKR 2,598           │   │
│  └─────────────────────────────┘   │
│                                     │
│  Total: PKR 2,798                   │
│  💳 Cash on Delivery                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Mark as Delivered       │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │     📱 WhatsApp Customer    │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### Analytics

```
┌─────────────────────────────────────┐
│  ←  Analytics                       │
│  ─────────────────────────────────  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  📈 [Line Chart]            │   │
│  │  This Week: PKR 45,000      │   │
│  │  ↑ 12% from last week       │   │
│  └─────────────────────────────┘   │
│                                     │
│  Top Products                       │
│  ┌─────────────────────────────┐   │
│  │ 1. Blue Shirt    │ 24 sold  │   │
│  │ 2. Lipstick      │ 18 sold  │   │
│  │ 3. Sneakers      │ 12 sold  │   │
│  └─────────────────────────────┘   │
│                                     │
│  Customer Insights                  │
│  ┌─────────────────────────────┐   │
│  │ Total Customers: 156        │   │
│  │ New This Week: 12           │   │
│  │ Repeat Customers: 45%       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────┬─────┬─────┬─────┬─────┐   │
│  │  🏠  │  🛍️  │  📦  │  📊  │  ⚙️  │   │
│  │ Home │Store│Order│Stats│More │   │
│  └─────┴─────┴─────┴─────┴─────┘   │
└─────────────────────────────────────┘
```

---

## 7. User Flows

### Flow 1: First-Time User (Onboarding)

```
START
  │
  ▼
Splash Screen (2 sec)
  │
  ▼
Welcome Screen → Tap "Get Started"
  │
  ▼
Language Selection → Select Urdu/English
  │
  ▼
Phone Verification → Enter number, receive SMS
  │
  ▼
Shop Setup (3 steps)
  ├── 1. Shop name (voice or type)
  ├── 2. What do you sell?
  └── 3. Upload logo (optional)
  │
  ▼
AI Builds Your Shop (30 sec)
  │
  ▼
Dashboard → Welcome message
  │
  ▼
Add First Product → Guided creation
  │
  ▼
Shop Live! 🎉 → Share via WhatsApp
```

### Flow 2: Add Product (AI-Assisted)

```
START
  │
  ▼
Store Screen → Tap "+ Add"
  │
  ▼
Choose Method
  ├── 📷 Camera
  ├── 🖼️ Gallery
  └── 🎤 Voice
  │
  ▼
AI Analyzes Photo (5-10 sec)
  │
  ▼
AI Suggests Details
  ├── Title
  ├── Description
  ├── Category
  └── Price
  │
  ▼
User Reviews & Edits
  │
  ▼
Tap "Publish"
  │
  ▼
Product Published! 🎉
```

### Flow 3: Process Order

```
START
  │
  ▼
Notification 🔔 "New order from Ahmed!"
  │
  ▼
Order Details → Review items, customer info
  │
  ▼
Accept Order → Tap "Accept Order"
  │
  ▼
Prepare Order → Pack the order
  │
  ▼
Update Status → Tap "Out for Delivery"
  │
  ▼
WhatsApp Customer → "Your order is on the way!"
  │
  ▼
Delivered ✅ → Tap "Mark as Delivered"
  │
  ▼
Request Review → "How was your experience?"
```

---

## 8. Navigation Design

### Bottom Navigation

```
┌─────┬─────┬─────┬─────┬─────┐
│  🏠  │  🛍️  │  📦  │  📊  │  ⚙️  │
│ Home │Store│Order│Stats│More │
└─────┴─────┴─────┴─────┴─────┘
```

| Tab | Icon | Screen |
|-----|------|--------|
| **Home** | 🏠 | Dashboard |
| **Store** | 🛍️ | Product List |
| **Orders** | 📦 | Order List |
| **Stats** | 📊 | Analytics |
| **More** | ⚙️ | Settings |

### Navigation Rules

1. **Maximum 5 tabs** in bottom navigation
2. **Active tab** highlighted in green
3. **Badge** on Orders tab for new orders
4. **Consistent** across all screens

---

## 9. Mobile-First Design Rules

### Touch Targets

| Element | Minimum Size |
|---------|--------------|
| **Buttons** | 48x48px |
| **Icons** | 24x24px |
| **List Items** | 48px height |
| **Tap Area** | 44x44px minimum |

### Spacing

| Context | Space |
|---------|-------|
| **Between elements** | 16px |
| **Between sections** | 24px |
| **Screen padding** | 16px |
| **Card padding** | 16px |

### Layout

| Rule | Description |
|------|-------------|
| **Single Column** | One column on mobile |
| **Full Width** | Elements span full width |
| **Sticky Headers** | Keep navigation accessible |
| **Bottom Actions** | Primary actions at bottom |

### Gestures

| Gesture | Usage |
|---------|-------|
| **Tap** | Select, activate |
| **Swipe** | Navigate, dismiss |
| **Long Press** | Edit, delete |
| **Pull Down** | Refresh |
| **Pinch** | Zoom images |

---

## 10. Accessibility

### Requirements

| Requirement | Standard |
|-------------|----------|
| **Color Contrast** | 4.5:1 minimum |
| **Touch Targets** | 44x44px minimum |
| **Font Size** | 16px minimum |
| **Screen Reader** | Support TalkBack/VoiceOver |
| **Language** | Full Urdu support |

### Accessibility Features

1. **Voice Input** - For users who can't type
2. **Large Text** - Adjustable font size
3. **High Contrast** - For visually impaired
4. **Screen Reader** - Full support
5. **Simple Language** - No technical jargon

---

## 11. Design Tokens

### Spacing Tokens

```javascript
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px'
};
```

### Border Radius Tokens

```javascript
const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px'
};
```

### Shadow Tokens

```javascript
const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 2px 4px rgba(0,0,0,0.1)',
  lg: '0 4px 8px rgba(0,0,0,0.1)',
  xl: '0 8px 16px rgba(0,0,0,0.1)'
};
```

### Animation Tokens

```javascript
const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out'
  }
};
```

---

## Summary

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Green Primary** | Pakistan flag, trust, growth |
| **Voice-First** | Users prefer speaking over typing |
| **Photo-First** | Products are visual |
| **3-Tap Rule** | Maximum simplicity |
| **Urdu-First** | Target market language |
| **WhatsApp Integration** | Primary communication channel |

### Design Checklist

- [ ] Color system defined
- [ ] Typography system defined
- [ ] Component library created
- [ ] All screens wireframed
- [ ] User flows documented
- [ ] Mobile-first rules applied
- [ ] Accessibility requirements met
- [ ] Design tokens defined

---

**Document Complete**  
**Next Document:** 04_User_Stories_Requirements.md
