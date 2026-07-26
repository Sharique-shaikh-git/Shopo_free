    # Feature Doc — Product Enrichment (AI)

## 1. Purpose
Convert merchant-uploaded product media (photo and optional voice/text) into a complete product draft that can be reviewed and published.

## 2. Inputs
Merchant provides (any combination):
- `imageUrl` (required for MVP photo-based flow)
- optional `voiceText` (or typed text)
- `localeCode` (Urdu/Sindhi/Balochi/English)
- optional `categoryHint` (if user selects category)

## 3. Outputs (AI-generated draft fields)
AI returns a structured draft candidate:
- `title` (string)
- `description` (string)
- `category` (string)
- `tags` (string[])
- `attributes` (json key/value; category-dependent)
- `suggestedPriceRange` (low/high, PKR)
- `confidence` (0..1)
- provenance metadata:
  - `aiModelVersion`
  - `generatedAt`
  - `dedupeKey` used

## 4. Confidence + merchant review UX
- Always show AI fields as “AI suggestion”
- Merchant actions:
  - Accept all
  - Edit any field
  - Reject and retry AI
- If confidence is low:
  - fill only high-confidence fields
  - leave uncertain fields empty or “needs review”

## 5. DedupeKey rules (cost control)
Compute `dedupeKey` from:
- perceptual hash of image (or normalized image hash)
- localeCode
- categoryHint (optional)
- jobType = `product_enrichment`

Reuse previous successful output for the same dedupeKey.

## 6. Backend workflow
1. Merchant uploads photo via presigned URL
2. Merchant creates draft product
3. API enqueues `product_enrichment` job with dedupeKey + input refs
4. Worker runs:
   - Vision extraction (OCR/label/brand/category)
   - Text generation (title/description/tags)
   - Price suggestion (range)
   - Write back to product draft

## 7. Failure handling
- Vision failure:
  - mark job failed with error code `AI_VISION_FAILED`
  - allow merchant “Retry with another photo”
- Text failure:
  - allow retry automatically 1 time (bounded)
- Price suggestion unavailable:
  - still generate listing fields, leave price suggestion blank

## 8. Security
- Enforce store ownership for every job enqueue/write-back
- Validate uploaded media size/type
- Never pass raw merchant secrets to AI; only pass image URL and minimal text

## 9. Analytics
Track:
- enrichment_job_enqueued
- enrichment_job_completed
- enrichment_job_failed
- enrichment_fields_accepted (per field type)
