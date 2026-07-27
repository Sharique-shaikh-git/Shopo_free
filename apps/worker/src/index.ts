import { Worker, Job } from 'bullmq';
import { db, aiJobs, products, eq } from '@shopo/database';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const redisUrl = process.env.UPSTASH_REDIS_URL;
if (!redisUrl) {
  console.error('Missing UPSTASH_REDIS_URL');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Assuming Upstash Redis URL is formatted as redis://...
const connection = new URL(redisUrl);

console.log('Starting Shopo AI Worker...');

const productEnrichmentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Professional e-commerce title for the product" },
    description: { type: Type.STRING, description: "A highly compelling product description highlighting benefits" },
    suggestedPrice: { type: Type.NUMBER, description: "Suggested fair market price in PKR if current price is 0 or missing" },
    category: { type: Type.STRING, description: "Best fitting product category" },
    tags: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Array of SEO optimized keywords/tags" 
    },
  },
  required: ["title", "description", "category", "tags"]
};

const worker = new Worker(
  'ai-enrichment',
  async (job: Job) => {
    console.log(`Processing job ${job.id}`);
    const jobId = job.data.jobId;

    // Fetch the job from our DB to ensure it exists and needs processing
    const jobsRows = await db.select().from(aiJobs).where(eq(aiJobs.id, jobId)).limit(1);
    const dbJob = jobsRows[0];

    if (!dbJob || dbJob.status !== 'queued') {
      console.log(`Job ${jobId} not found or already processed.`);
      return;
    }

    try {
      // Mark as processing
      await db.update(aiJobs).set({ status: 'processing' }).where(eq(aiJobs.id, jobId));

      if (dbJob.type === 'product_enrichment') {
        const product = await db.select().from(products).where(eq(products.id, dbJob.productId!)).limit(1);
        if (!product[0]) throw new Error('Product not found');

        // Execute Gemini Prompt
        const prompt = `You are a professional e-commerce copywriter.
Please enrich this product based on the initial details provided by a Pakistani merchant.
Current title: ${product[0].title}
Current price: ${product[0].price}

Write a professional product title and a compelling description. Suggest a fair market price in PKR if the current one is zero.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: productEnrichmentSchema,
            }
        });

        const outputText = response.text || '{}';
        const parsedOutput = JSON.parse(outputText);

        // Update the product
        await db.update(products).set({
          title: parsedOutput.title || product[0].title,
          description: parsedOutput.description,
          category: parsedOutput.category,
          tags: parsedOutput.tags || [],
          suggestedPrice: parsedOutput.suggestedPrice?.toString(),
          isAiGenerated: true,
          aiJobId: jobId,
        }).where(eq(products.id, product[0].id));

        // Mark job as completed
        await db.update(aiJobs).set({
          status: 'completed',
          output: parsedOutput,
          completedAt: new Date(),
        }).where(eq(aiJobs.id, jobId));

        console.log(`Successfully enriched product ${product[0].id}`);
      }
    } catch (error: unknown) {
      console.error(`Error processing job ${jobId}:`, error);
      
      const nextStatus = dbJob.retryCount + 1 >= dbJob.maxRetries ? 'failed' : 'queued';
      
      await db.update(aiJobs).set({
        status: nextStatus,
        retryCount: dbJob.retryCount + 1,
        error: error instanceof Error ? error.message : String(error),
      }).where(eq(aiJobs.id, jobId));

      if (nextStatus === 'queued') {
         throw error; // Let BullMQ retry it
      }
    }
  },
  {
    connection: {
      host: connection.hostname,
      port: Number(connection.port || 6379),
      password: connection.password,
      tls: connection.protocol === 'rediss:' ? {} : undefined,
    },
    concurrency: 5,
  }
);

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error ${err.message}`);
});
