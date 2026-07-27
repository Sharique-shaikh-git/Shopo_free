import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { db, orders, products, eq, sql } from '@shopo/database';
import { CurrentMerchantId } from '../auth/current-merchant.decorator';

@Controller('merchant')
@UseGuards(AuthGuard('jwt'))
export class MerchantController {
  
  @Get('stats')
  async getDashboardStats(@CurrentMerchantId() merchantId: string) {
    const productsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.merchantId, merchantId));

    const ordersCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.merchantId, merchantId));

    const totalSales = await db
      .select({ sum: sql<number>`sum(${orders.total})` })
      .from(orders)
      .where(eq(orders.merchantId, merchantId));

    return {
      totalProducts: Number(productsCount[0]?.count) || 0,
      totalOrders: Number(ordersCount[0]?.count) || 0,
      totalSales: Number(totalSales[0]?.sum) || 0,
    };
  }
}
