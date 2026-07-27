import { Controller, Get, Post, Body, Patch, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { db, stores, eq, and } from '@shopo/database';
import { CurrentMerchantId } from '../auth/current-merchant.decorator';
import { ZodValidationPipe } from '../products/products.controller';
import { createStoreSchema, CreateStoreDto, updateStoreSchema, UpdateStoreDto } from '@shopo/shared/src/schemas/store.schema';

@Controller('stores')
@UseGuards(AuthGuard('jwt'))
export class StoresController {
  
  @Get()
  async getStores(@CurrentMerchantId() merchantId: string) {
    return db.select().from(stores).where(eq(stores.merchantId, merchantId));
  }

  @Post()
  async createStore(
    @CurrentMerchantId() merchantId: string,
    @Body(new ZodValidationPipe(createStoreSchema)) data: CreateStoreDto,
  ) {
    const [inserted] = await db.insert(stores).values({
      ...data,
      merchantId,
    }).returning();
    return inserted;
  }

  @Patch(':id')
  async updateStore(
    @CurrentMerchantId() merchantId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStoreSchema)) data: UpdateStoreDto,
  ) {
    const [updated] = await db.update(stores)
      .set(data)
      .where(and(eq(stores.merchantId, merchantId), eq(stores.id, id)))
      .returning();
      
    if (!updated) {
      throw new NotFoundException('Store not found');
    }
    return updated;
  }
}
