# Screen: FAQ

## Stitch Source
- HTML: `stitch_faq.html`
- ID: faq

## File
- `src/app/(app)/settings/faq.tsx`

## What Was Built
- Search bar for filtering questions
- Accordion FAQ list (5 questions with expand/collapse)
- Each question has chevron-down that rotates on open
- Answer text shown below question when expanded
- "Still need help?" WhatsApp contact card at bottom

## Design Tokens
- Background: `#F9F9FC`
- Cards: `bg-white border border-[#E0E3DE]`
- Accordion border: `border-b border-[#E0E3DE]`
- Search: `bg-white rounded-xl border border-[#E0E3DE]`

## Interactivity
- Accordion open/close with state (openIndex)
- Search filters FAQ items by question/answer text
- Chevron rotates 180° when open

## Status
✅ Complete — matches Stitch design with accordion
