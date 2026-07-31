# Screen: Payment Methods

## Stitch Source
- HTML: `stitch_payment_methods.html`
- ID: payment_methods

## File
- `src/app/(app)/settings/payments.tsx`

## What Was Built
- Shop Builder header with storefront icon and globe button
- "Payment Methods" headline with description
- AI Tip banner (sparkles icon, green text)
- JazzCash card:
  - Toggle switch (on by default)
  - Account number input field
  - Info text about payments
- EasyPaisa card:
  - Toggle switch (off by default)
  - Account number input field
  - Card opacity 50% when disabled
- Cash on Delivery card:
  - Dashed border, gray styling
  - Checkmark indicating enabled
- Fixed bottom "Save Payment Settings" button

## Design Tokens
- Primary: `#005147`
- AI Tip: `bg-[#CCE8E415] border border-[#CCE8E420]`
- JazzCash: `#FFD700` (gold) icon bg
- EasyPaisa: `#006B5E` icon bg
- COD: `bg-[#F2F0F4] border-dashed border-[#79747E]`
- Toggle on: `#006B5E`, off: `#79747E`

## Interactivity
- JazzCash toggle shows/hides account field
- EasyPaisa toggle shows/hides account field + opacity change
- Both toggles are independent switches

## Status
✅ Complete — matches Stitch design with working toggles
