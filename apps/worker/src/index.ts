import { Worker, Job } from 'bullmq';
import { db, aiJobs, products, eq } from '@shopo/database';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { GeminiEnrichmentService } from './gemini-service';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const redisUrl = process.env.UPSTASH_REDIS_URL || process.env.REDIS_URL;
if (!redisUrl) {
  console.error('Missing UPSTASH_REDIS_URL or REDIS_URL environment variable');
  process.exit(1);
}

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.error('Missing GEMINI_API_KEY environment variable');
  process.exit(1);
}

const geminiService = new GeminiEnrichmentService(geminiApiKey);

// Parse Upstash / Redis Connection URL
function parseRedisConnection(urlStr: string) {
  try {
    const parsed = new URL(urlStr);
    return {
      host: parsed.hostname,
      port: Number(parsed.port || 6379),
      username: parsed.username || undefined,
      password: parsed.password || undefined,
      tls: parsed.protocol === 'rediss:' ? { rejectUnauthorized: false } : undefined,
      maxRetriesPerRequest: null,
    };
  } catch (e) {
    console.error('Failed to parse REDIS_URL string, falling back to localhost defaults');
    return { host: '127.0.0.1', port: 6379, maxRetriesPerRequest: null };
  }
}

const connection = parseRedisConnection(redisUrl);

console.log('🚀 Starting Shopo AI Background Worker...');
console.log(`Connecting to Redis host: ${connection.host}:${connection.port}`);

const worker = new Worker(
  'ai-enrichment',
  async (job: Job) => {
    console.log(`\n📦 [Job ${job.id}] Received AI job:`, job.name, job.data);
    const jobId = job.data.jobId;

    if (!jobId) {
      console.warn(`Job ${job.id} missing jobId payload property`);
      return;
    }

    // Fetch the job from DB to ensure existence and tenant scoping
    const [dbJob] = await db.select().from(aiJobs).where(eq(aiJobs.id, jobId)).limit(1);

    if (!dbJob) {
      console.warn(`Job ${jobId} not found in database.`);
      return;
    }

    if (dbJob.status === 'completed') {
      console.log(`Job ${jobId} already marked as completed.`);
      return;
    }

    try {
      // Mark as processing
      await db.update(aiJobs).set({ status: 'processing' }).where(eq(aiJobs.id, jobId));

      if (dbJob.type === 'product_enrichment' || dbJob.type === 'product_vision_analysis' || job.name === 'enrich-product') {
        if (!dbJob.productId) {
          throw new Error('Product ID missing on AI job');
        }

        const [product] = await db.select().from(products).where(eq(products.id, dbJob.productId)).limit(1);
        if (!product) {
          throw new Error(`Product ${dbJob.productId} not found`);
        }

        console.log(`Analyzing product ${product.id} ("${product.title}")...`);

        // Execute Gemini 2.5 Flash Vision & Text enrichment
        const { output, tokensUsed, costUsd } = await geminiService.enrichProduct({
          title: product.title,
          description: product.description || undefined,
          price: product.price || undefined,
          images: product.images || [],
          category: product.category || undefined,
        });

        // Update product record with AI enriched data
        const productUpdates: Record<string, unknown> = {
          title: output.title || product.title,
          description: output.description || product.description,
          category: output.category || product.category,
          tags: output.tags || product.tags,
          isAiGenerated: true,
          aiJobId: jobId,
          updatedAt: new Date(),
        };

        if (output.titleUrdu) productUpdates.titleUrdu = output.titleUrdu;
        if (output.descriptionUrdu) productUpdates.descriptionUrdu = output.descriptionUrdu;
        if (output.suggestedPrice) productUpdates.suggestedPrice = output.suggestedPrice.toString();
        if (output.aiConfidence) productUpdates.aiConfidence = output.aiConfidence.toString();

        await db.update(products).set(productUpdates).where(eq(products.id, product.id));

        // Mark AI job as completed with usage tracking
        await db.update(aiJobs).set({
          status: 'completed',
          output: output as any,
          tokensUsed,
          estimatedCostUsd: costUsd.toString(),
          modelUsed: 'gemini-2.5-flash',
          completedAt: new Date(),
        }).where(eq(aiJobs.id, jobId));

        console.log(`✅ [Job ${jobId}] Successfully enriched product "${output.title}" (Cost: $${costUsd}, Tokens: ${tokensUsed})`);
      } else {
        console.warn(`Unsupported AI job type: ${dbJob.type}`);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ [Job ${jobId}] Error:`, errorMessage);

      const nextStatus = dbJob.retryCount + 1 >= dbJob.maxRetries ? 'failed' : 'queued';

      await db.update(aiJobs).set({
        status: nextStatus,
        retryCount: dbJob.retryCount + 1,
        error: errorMessage,
      }).where(eq(aiJobs.id, jobId));

      if (nextStatus === 'queued') {
        throw error; // Re-throw to allow BullMQ automatic retry mechanism
      }
    }
  },
  {
    connection,
    concurrency: 5,
  }
);

worker.on('active', (job) => {
  console.log(`▶️ Job ${job.id} active`);
});

worker.on('completed', (job) => {
  console.log(`🎉 Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`💥 Job ${job?.id} failed: ${err.message}`);
});

worker.on('error', (err) => {
  console.error('Worker error:', err.message);
});

// Graceful Shutdown Handler
const shutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Gracefully closing BullMQ AI worker...`);
  await worker.close();
  console.log('Worker closed cleanly.');
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
