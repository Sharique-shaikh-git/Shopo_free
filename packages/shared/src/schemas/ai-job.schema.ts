import { z } from 'zod';

/**
 * AiJob — tracks async AI enrichment tasks.
 *
 * Connected to: [[09_AI_Pipeline/gemini-integration]], [[04_Code_Patterns/async-ai-job]]
 * Flow: queued → running → completed/failed
 * Dedup: identical inputs reuse cached outputs via dedupeKey
 */
export const aiJobSchema = z.object({
  id: z.string().uuid(),
  merchantId: z.string().uuid(),
  storeId: z.string().uuid(),
  productId: z.string().uuid().optional(),

  // ── Job type ──────────────────────────────────────────
  type: z.enum([
    'product_enrichment',    // Full: vision + text + category + price
    'image_analysis',         // Vision only
    'text_generation',        // Title/description generation
    'price_suggestion',       // Price analysis
    'translation',            // Translate to Urdu/other
  ]),

  // ── Status ────────────────────────────────────────────
  status: z.enum(['queued', 'running', 'completed', 'failed']).default('queued'),
  retryCount: z.number().int().min(0).default(0),
  maxRetries: z.number().int().default(3),
  error: z.string().optional(),

  // ── Deduplication ─────────────────────────────────────
  dedupeKey: z.string().max(255),
  inputHash: z.string().max(64),

  // ── Input/Output ──────────────────────────────────────
  input: z.record(z.unknown()), // Flexible JSON input
  output: z.record(z.unknown()).optional(), // AI results

  // ── Cost tracking ─────────────────────────────────────
  tokensUsed: z.number().int().min(0).default(0),
  estimatedCostUsd: z.number().min(0).default(0),
  modelUsed: z.string().max(100).default('gemini-2.5-flash'),

  createdAt: z.coerce.date(),
  completedAt: z.coerce.date().optional(),
});

export type AiJob = z.infer<typeof aiJobSchema>;

// ── Enqueue DTO ─────────────────────────────────────────
export const enqueueAiJobSchema = z.object({
  storeId: z.string().uuid(),
  productId: z.string().uuid().optional(),
  type: aiJobSchema.shape.type,
  input: z.record(z.unknown()),
});

export type EnqueueAiJobDto = z.infer<typeof enqueueAiJobSchema>;
