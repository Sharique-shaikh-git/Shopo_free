# AI Shop Builder - Product Design Specification

## 1. Complete Screen Map

### Merchant App (Internal)
1. **Screen 01 — Onboarding & Language Selection**: Initial entry point.
2. **Screen 02 — Store Creation**: Essential store setup (Name & Logo).
3. **Screen 03 — Product Photo Upload**: The primary action for adding inventory.
4. **Screen 04 — AI Enrichment Review**: Reviewing AI-generated titles/descriptions.
5. **Screen 05 — Store Launch & URL**: Finalizing and viewing the live store link.
6. **Screen 06 — Orders Dashboard**: Central hub for managing sales.
7. **Screen 07 — Order Status Update**: Detail view for managing specific orders.
8. **Screen 08 — Notifications Panel**: Real-time alerts for orders and system updates.
9. **Screen 09 — Marketing & Promotions**: One-tap sharing for WhatsApp/Facebook.
10. **Screen 10 — Sales Analytics**: Simple performance overview.
11. **Screen 11 — Profile & Settings**: Management of phone, language, and account.

### Customer Storefront (External)
12. **Screen 12 — Store Home**: Product catalog for buyers.
13. **Screen 13 — Product Detail**: In-depth view of a single item.
14. **Screen 14 — COD Checkout**: Simplified shipping and payment (Cash on Delivery).
15. **Screen 15 — Order Confirmation**: Success state and tracking info for customers.

---

## 2. Screen Specifications

### Screen 01 — Onboarding & Language Selection
- **Purpose**: Get the merchant started in their preferred language.
- **Primary CTA**: "Start Now" / "Shuru Karein".
- **Main Sections**:
  1. Welcome Greeting (Large, friendly typography).
  2. Language Selection (Large cards with flags/local scripts).
  3. Terms of Service (Minimal footer text).
- **Empty State**: N/A (Entry screen).
- **Error State**: Notification banner at the top if network fails.
- **User Flow**: Select Language → Tap "Start".

### Screen 02 — Store Creation
- **Purpose**: Establish the merchant's brand identity simply.
- **Primary CTA**: "Create My Shop".
- **Main Sections**:
  1. Shop Name (Single large text field).
  2. Shop Logo (Circle upload zone with camera icon).
- **Empty State**: Placeholder icon for the logo.
- **Error State**: Inline text validation ("Name is too short").
- **User Flow**: Enter Name → Upload Logo → Tap "Create".

### Screen 03 — Product Photo Upload
- **Purpose**: Quick entry for new inventory.
- **Primary CTA**: "Take a Photo" / "Upload from Gallery".
- **Main Sections**:
  1. Camera Viewfinder (Large center screen).
  2. Recent Photos Grid (For multi-select).
  3. Action Bar (Large bottom buttons).
- **Empty State**: Illustration of a product with "Show your products to the world".
- **Error State**: "Camera permission needed" modal with settings shortcut.
- **User Flow**: Tap Camera → Snap Photo → Auto-progress to Review.

### Screen 04 — AI Enrichment Review & Accept
- **Purpose**: Review and edit AI-generated product details.
- **Primary CTA**: "Confirm & Add Product".
- **Main Sections**:
  1. Product Image Preview (Large card).
  2. AI-Suggested Title (Editable text field).
  3. AI-Suggested Price (Numeric field).
  4. AI-Suggested Description (Multi-line text field).
- **Loading State**: Pulse animation on text fields with "AI is writing your description..." text.
- **Error State**: "AI failed to generate" with manual entry prompts.
- **User Flow**: Review Text → Edit if needed → Tap Confirm.

### Screen 05 — Store Launch & URL Display
- **Purpose**: Celebration and sharing the new store.
- **Primary CTA**: "Open My Shop".
- **Main Sections**:
  1. Success Graphic (Confetti/Checkmark).
  2. Store Link (Large, copyable URL box).
  3. Share to WhatsApp (Secondary prominent button).
- **Success State**: The entire screen is the success state.
- **User Flow**: Copy Link → Share to WhatsApp.

### Screen 06 — Orders Dashboard
- **Purpose**: Daily operations hub focused on "getting orders".
- **Primary CTA**: "View New Orders".
- **Main Sections**:
  1. New Orders List (Cards with customer name and total).
  2. "Order in Progress" Section.
  3. Quick Stats (Today's total sales).
- **Empty State**: Illustration with "No orders yet. Share your link to get sales!".
- **Error State**: Retry button for list loading.
- **User Flow**: Tap New Order → Progress to Order Detail.

### Screen 07 — Order Status Updates
- **Purpose**: Managing the lifecycle of a specific sale.
- **Primary CTA**: "Mark as Shipped" / "Complete Order".
- **Main Sections**:
  1. Order ID & Customer Phone (One-tap call button).
  2. Item List (Product thumb and quantity).
  3. Status Timeline (Stepped progress indicator).
- **Empty State**: N/A.
- **Error State**: Modal for "Status update failed".
- **User Flow**: Tap "Mark as Shipped" → Status updates to "On the way".

### Screen 08 — Notifications Panel
- **Purpose**: Central log of activity.
- **Primary CTA**: Tap notification to view detail.
- **Main Sections**:
  1. Chronological Notification List (Unread highlighted).
- **Empty State**: Bell icon with "No new alerts".
- **User Flow**: Receive Push → Open Panel → Tap Alert.

### Screen 09 — Promotions & Share Flow
- **Purpose**: Generate marketing content automatically.
- **Primary CTA**: "Share on WhatsApp".
- **Main Sections**:
  1. Social Media Card Preview (Product image + Price).
  2. Pre-written message (Copyable text).
  3. Platform Select (WhatsApp, Facebook, Instagram).
- **Loading State**: Spinner while generating the image card.
- **User Flow**: Select Platform → Auto-copy text → Open App.

### Screen 10 — Basic Analytics
- **Purpose**: Visualizing growth for non-technical users.
- **Primary CTA**: "View All Time".
- **Main Sections**:
  1. Large Number (Total Orders).
  2. Simple Bar Chart (Sales by day).
  3. Top Selling Products List.
- **Empty State**: "Sell your first product to see growth here".
- **User Flow**: Toggle Today/Week/Month.

### Screen 11 — Profile & Settings
- **Purpose**: Account and app management.
- **Primary CTA**: "Save Changes".
- **Main Sections**:
  1. Merchant Profile (Name, Phone).
  2. Language Toggle (English/Urdu/etc).
  3. Account Support (WhatsApp help link).
- **User Flow**: Tap Language → Select New → App reloads.

---

### Screen 12 — Storefront: Home Page
- **Purpose**: Customer browsing.
- **Primary CTA**: "Add to Cart" on product cards.
- **Main Sections**:
  1. Store Header (Logo + Name).
  2. Search Bar (Simple).
  3. Product Grid (2-column, large images).
- **Empty State**: "Store coming soon" or "No products found".

### Screen 13 — Storefront: Product Page
- **Purpose**: Closing the sale.
- **Primary CTA**: "Buy Now (Cash on Delivery)".
- **Main Sections**:
  1. Image Carousel.
  2. Product Name & Price.
  3. Description.
  4. Floating Action Bar (Sticky Buy button).

### Screen 14 — Storefront: COD Checkout
- **Purpose**: Frictionless address entry.
- **Primary CTA**: "Place Order".
- **Main Sections**:
  1. Shipping Form (Name, Phone, Address).
  2. Order Summary (Total including shipping).
  3. Payment Method (Locked to Cash on Delivery).
- **Error State**: Field validation highlighting (Red border, simple text).

### Screen 15 — Storefront: Order Confirmation
- **Purpose**: Reassurance for the buyer.
- **Primary CTA**: "Keep Shopping".
- **Main Sections**:
  1. Success Message ("Order Placed!").
  2. Tracking Number.
  3. WhatsApp Merchant (Button to message the seller directly).

---

## 3. Design System Structure

### Reusable Components
- **Buttons**: Full-width primary buttons with rounded corners; secondary outline buttons.
- **Cards**: Shadow-less cards with subtle borders to maximize screen real estate.
- **Forms**: Large input fields with floating labels; numeric-only keyboards for price/phone.
- **Product Grid**: Responsive 2-column grid for mobile; square image aspect ratio.
- **Order List Items**: High-contrast text for order value; color-coded status pills.
- **Status Pills**: Small badges for "Pending", "Shipped", "Cancelled".
- **Modals**: Bottom-sheet style modals for quick actions/confirmations.

### Navigation Approach: Bottom Tabs
- **Justification**:
  - **Thumb-reachability**: High-frequency actions (Orders, Upload, Home) are at the bottom for one-handed use.
  - **Visibility**: Merchants need to see their "Orders" count at all times (badge on tab).
  - **Low Cognitive Load**: No hidden menus; every primary section is one tap away.

### Spacing & Density
- **Approach**: High whitespace and low density. 
- **Rationale**: Given the target audience and multi-language support (Urdu/Sindhi/etc. can be vertically taller), a loose vertical rhythm prevents "cluttered" feeling and reduces accidental taps on small links. Tap targets are kept significantly larger than standard to accommodate varied dexterity.