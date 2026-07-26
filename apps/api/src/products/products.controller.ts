import { Controller, Get, Post, Body, Param, UseGuards, Put, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentMerchantId } from '../auth/current-merchant.decorator';
import { db, products, aiJobs, eq, and } from '@shopo/database';
import { createProductSchema, CreateProductDto, updateProductSchema, UpdateProductDto } from '@shopo/shared/src/schemas/product.schema';
import { Queue } from 'bullmq';
import * as crypto from 'crypto';

// Setup BullMQ Queue for API
const redisUrl = process.env.UPSTASH_REDIS_URL || 'redis://localhost:6379';
const connectionUrl = new URL(redisUrl);
const aiQueue = new Queue('ai-enrichment', { 
  connection: {
    host: connectionUrl.hostname,
    port: Number(connectionUrl.port || 6379),
    password: connectionUrl.password,
    tls: connectionUrl.protocol === 'rediss:' ? {} : undefined,
  }
});

// A simple inline zod validation pipe
import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;
    const parsed = this.schema.safeParse(value);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.format());
    }
    return parsed.data;
  }
}

@Controller('products')
@UseGuards(AuthGuard('jwt')) // Enforces authentication
export class ProductsController {

  @Get()
  async getProducts(@CurrentMerchantId() merchantId: string) {
    // Tenant isolation: Always query by merchantId
    return db
      .select()
      .from(products)
      .where(eq(products.merchantId, merchantId));
  }

  @Get(':id')
  async getProduct(@CurrentMerchantId() merchantId: string, @Param('id') id: string) {
    const results = await db
      .select()
      .from(products)
      .where(and(eq(products.merchantId, merchantId), eq(products.id, id)))
      .limit(1);

    if (!results.length) {
      throw new NotFoundException('Product not found');
    }
    return results[0];
  }

  // Zod Validation using the shared schema!
  @Post()
  async createProduct(
    @CurrentMerchantId() merchantId: string,
    @Body(new ZodValidationPipe(createProductSchema)) data: CreateProductDto,
  ) {
    const [inserted] = await db.insert(products).values({
      ...data,
      merchantId, // Force tenant isolation overrides
      title: data.title || 'Draft Product', // Handle missing title since DB requires it
      price: data.price ? data.price.toString() : '0', // Ensure numeric string
      status: 'draft',
      // Drizzle handles defaults for tags/variants via schema definition
    }).returning();

    // Generate Dedupe Key and hash for AI job
    const inputHash = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
    const dedupeKey = `enrichment_${inserted.id}_${inputHash}`;

    const [jobRecord] = await db.insert(aiJobs).values({
      merchantId,
      storeId: data.storeId,
      productId: inserted.id,
      type: 'product_enrichment',
      input: data as any,
      inputHash,
      dedupeKey,
    }).returning();

    await aiQueue.add('enrich-product', { jobId: jobRecord.id }, {
      jobId: dedupeKey // BullMQ deduplication
    });

    return inserted;
  }

  @Put(':id')
  async updateProduct(
    @CurrentMerchantId() merchantId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProductSchema)) data: UpdateProductDto,
  ) {
    // Make sure we only update our own product
    const valuesToUpdate: any = { ...data };
    if (data.price !== undefined) valuesToUpdate.price = data.price.toString();

    const [updated] = await db.update(products)
      .set(valuesToUpdate)
      .where(and(eq(products.merchantId, merchantId), eq(products.id, id)))
      .returning();

    if (!updated) {
      throw new NotFoundException('Product not found');
    }
    return updated;
  }

  @Delete(':id')
  async deleteProduct(
    @CurrentMerchantId() merchantId: string,
    @Param('id') id: string,
  ) {
    const [deleted] = await db.delete(products)
      .where(and(eq(products.merchantId, merchantId), eq(products.id, id)))
      .returning();
      
    if (!deleted) {
      throw new NotFoundException('Product not found');
    }
    return { deleted: true, id };
  }
}
