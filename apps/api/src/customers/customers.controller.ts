import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { db, orders, sql, desc, and, eq } from '@shopo/database';
import { CurrentMerchantId } from '../auth/current-merchant.decorator';

@Controller('customers')
@UseGuards(AuthGuard('jwt'))
export class CustomerController {
  /**
   * GET /customers
   * Aggregate customers derived from orders for this merchant.
   */
  @Get()
  async listCustomers(@CurrentMerchantId() merchantId: string) {
    const rows = await db
      .select({
        customerPhone: orders.customerPhone,
        customerName: sql<string>`max(${orders.customerName})`,
        orderCount: sql<number>`count(${orders.id})`,
        totalSpent: sql<number>`coalesce(sum(${orders.total}), 0)`,
        lastOrderAt: sql<string>`max(${orders.createdAt})`,
      })
      .from(orders)
      .where(eq(orders.merchantId, merchantId))
      .groupBy(orders.customerPhone)
      .orderBy(sql`max(${orders.createdAt}) desc`);

    return rows.map((r) => ({
      phone: r.customerPhone,
      name: r.customerName || 'Customer',
      orderCount: Number(r.orderCount),
      totalSpent: Number(r.totalSpent),
      lastOrderAt: r.lastOrderAt,
    }));
  }

  /**
   * GET /customers/:phone
   * Customer detail + the orders placed by that phone under this merchant.
   */
  @Get(':phone')
  async getCustomer(
    @CurrentMerchantId() merchantId: string,
    @Param('phone') phone: string,
  ) {
    if (!phone) {
      throw new BadRequestException('Phone is required');
    }

    const rows = await db
      .select()
      .from(orders)
      .where(and(eq(orders.merchantId, merchantId), eq(orders.customerPhone, phone)))
      .orderBy(desc(orders.createdAt));

    if (rows.length === 0) {
      return {
        phone,
        name: 'Customer',
        orderCount: 0,
        totalSpent: 0,
        lastOrderAt: null,
        orders: [],
      };
    }

    const totalSpent = rows.reduce((sum, o) => sum + Number(o.total || 0), 0);
    return {
      phone,
      name: rows[0].customerName || 'Customer',
      orderCount: rows.length,
      totalSpent,
      lastOrderAt: rows[0].createdAt,
      orders: rows.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        total: Number(o.total),
        status: o.status,
        createdAt: o.createdAt,
      })),
    };
  }
}
