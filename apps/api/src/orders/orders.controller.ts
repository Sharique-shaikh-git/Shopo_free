import { Controller, Post, Body, BadRequestException, NotFoundException, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentMerchantId } from '../auth/current-merchant.decorator';
import { db, orders, orderItems, products, stores, eq, inArray, and } from '@shopo/database';
import { createOrderSchema, CreateOrderDto } from '@shopo/shared/src/schemas/order.schema';
import { ZodValidationPipe } from '../products/products.controller'; // Reuse pipe

@Controller('orders')
export class OrdersController {
  
  // Public Endpoint: Customers placing orders
  @Post()
  async createOrder(@Body(new ZodValidationPipe(createOrderSchema)) data: CreateOrderDto) {
    // 1. Validate Store
    const storeResults = await db.select().from(stores).where(eq(stores.id, data.storeId)).limit(1);
    const store = storeResults[0];
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // 2. Fetch all products being ordered to validate price and existence
    const productIds = data.items.map(i => i.productId);
    const dbProducts = await db.select().from(products).where(inArray(products.id, productIds));
    
    if (dbProducts.length !== productIds.length) {
      throw new BadRequestException('One or more products not found');
    }

    // Map for quick lookup
    const productMap = new Map(dbProducts.map(p => [p.id, p]));

    let subtotal = 0;
    const itemsToInsert = [];

    // Calculate totals
    for (const item of data.items) {
      const p = productMap.get(item.productId)!;
      const unitPrice = parseFloat(p.price);
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      itemsToInsert.push({
        productId: p.id,
        variantId: item.variantId,
        title: p.title,
        quantity: item.quantity,
        unitPrice: unitPrice.toString(),
        totalPrice: totalPrice.toString(),
        thumbnailUrl: p.thumbnailUrl,
      });
    }

    const deliveryFee = 0; // Configurable later
    const discount = 0;
    const total = subtotal + deliveryFee - discount;
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // 3. Insert Order and Items in Transaction (simulated sequentially if no tx available)
    const [insertedOrder] = await db.insert(orders).values({
      orderNumber,
      storeId: data.storeId,
      merchantId: store.merchantId, // Attach to merchant for tenant isolation
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      deliveryAddress: data.deliveryAddress,
      subtotal: subtotal.toString(),
      deliveryFee: deliveryFee.toString(),
      discount: discount.toString(),
      total: total.toString(),
      paymentMethod: data.paymentMethod,
      notes: data.notes,
    }).returning();

    // Insert Items
    await db.insert(orderItems).values(
      itemsToInsert.map(item => ({
        ...item,
        orderId: insertedOrder.id,
      }))
    );

    return insertedOrder;
  }

  // Protected Endpoint: Merchant viewing orders
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getMerchantOrders(@CurrentMerchantId() merchantId: string) {
    return db
      .select()
      .from(orders)
      .where(eq(orders.merchantId, merchantId));
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getMerchantOrder(
    @CurrentMerchantId() merchantId: string,
    @Param('id') id: string,
  ) {
    const results = await db
      .select()
      .from(orders)
      .where(and(eq(orders.merchantId, merchantId), eq(orders.id, id)))
      .limit(1);

    if (!results[0]) {
      throw new NotFoundException('Order not found');
    }

    return results[0];
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'))
  async updateOrderStatus(
    @CurrentMerchantId() merchantId: string,
    @Param('id') id: string,
    @Body() data: { status: string }
  ) {
    if (!data.status) {
      throw new BadRequestException('Status is required');
    }

    const [updatedOrder] = await db.update(orders)
      .set({ status: data.status as any })
      .where(and(eq(orders.merchantId, merchantId), eq(orders.id, id)))
      .returning();

    if (!updatedOrder) {
      throw new NotFoundException('Order not found');
    }

    return updatedOrder;
  }
}
