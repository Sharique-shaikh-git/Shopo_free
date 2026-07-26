# AI Pipeline Checklist — Digital Dukaan

> Follow these rules when implementing or modifying AI-related functionality.

## Before Enqueuing a Job
- [ ] Check merchant's plan quota (free/starter/business limits)
- [ ] Compute `dedupeKey` from normalized inputs (image hash + locale + category)
- [ ] If a completed job exists with the same `dedupeKey`, reuse cached output
- [ ] Validate image format and size before enqueuing

## Job Processing
- [ ] AI calls are ASYNC only — never in the request path
- [ ] Each job has a unique `jobId` for tracking
- [ ] Worker sets job state: `queued → running → completed/failed`
- [ ] Retry failed jobs up to 3 times with exponential backoff
- [ ] After max retries, move to dead-letter queue
- [ ] Log token usage for cost tracking in `ai_usage` table

## AI Output Handling
- [ ] Validate AI output structure before writing to database
- [ ] Sanitize generated text (no HTML injection, no profanity)
- [ ] Price suggestions clearly labeled as "Suggested" — not guaranteed
- [ ] Confidence score included with AI outputs
- [ ] Merchant can always override any AI-generated field

## Cost Control
- [ ] Per-merchant daily limits on AI jobs (enforced by plan tier)
- [ ] Cache identical inputs → reuse outputs
- [ ] Use cheaper models for simple tasks (categorization)
- [ ] Use expensive models only for complex tasks (full product enrichment)
- [ ] Monitor total AI spend per day/week/month
- [ ] Alert if spending exceeds threshold
