import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { db, orders, products, orderItems, eq, sql, and, gte } from '@shopo/database';
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

  @Get('analytics')
  async getAnalytics(@CurrentMerchantId() merchantId: string) {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const scope = and(eq(orders.merchantId, merchantId), gte(orders.createdAt, since));

    // Sales grouped by day (last 30 days)
    const salesByDay = await db
      .select({
        day: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM-DD')`,
        sales: sql<number>`coalesce(sum(${orders.total}), 0)`,
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .where(scope)
      .groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${orders.createdAt}, 'YYYY-MM-DD')`);

    // Orders grouped by status
    const ordersByStatus = await db
      .select({
        status: orders.status,
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .where(eq(orders.merchantId, merchantId))
      .groupBy(orders.status);

    // Top-selling products by quantity sold
    const topProducts = await db
      .select({
        title: orderItems.title,
        quantity: sql<number>`coalesce(sum(${orderItems.quantity}), 0)`,
        revenue: sql<number>`coalesce(sum(${orderItems.totalPrice}), 0)`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(eq(orders.merchantId, merchantId))
      .groupBy(orderItems.title)
      .orderBy(sql`coalesce(sum(${orderItems.quantity}), 0) desc`)
      .limit(5);

    const totalRevenue = salesByDay.reduce((sum, d) => sum + Number(d.sales || 0), 0);
    const totalOrders = Number(
      ordersByStatus.reduce((sum, s) => sum + Number(s.count || 0), 0),
    );

    return {
      salesByDay: salesByDay.map((d) => ({ day: d.day, sales: Number(d.sales), orders: Number(d.count) })),
      ordersByStatus: ordersByStatus.reduce((acc: Record<string, number>, s) => {
        acc[s.status || 'unknown'] = Number(s.count);
        return acc;
      }, {}),
      topProducts: topProducts.map((p) => ({
        title: p.title,
        quantity: Number(p.quantity),
        revenue: Number(p.revenue),
      })),
      totalRevenue,
      totalOrders,
      periodDays: 30,
    };
  }
}
