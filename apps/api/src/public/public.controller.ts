import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { db, stores, products, orders, orderItems, eq, and, inArray } from '@shopo/database';
import { createOrderSchema, CreateOrderDto } from '@shopo/shared';
import { ZodValidationPipe } from '../products/products.controller';

/**
 * Public endpoints — NO authentication required.
 * These serve the customer-facing storefront.
 */
@Controller('public')
export class PublicController {

  /**
   * GET /v1/public/stores/:slug
   * Fetch a published store by its slug (e.g. "ali" from ali.shopo.pk)
   */
  @Get('stores/:slug')
  async getStoreBySlug(@Param('slug') slug: string) {
    const results = await db
      .select()
      .from(stores)
      .where(and(eq(stores.slug, slug), eq(stores.isPublished, true)))
      .limit(1);

    if (!results.length) {
      throw new NotFoundException('Store not found');
    }

    return results[0];
  }

  /**
   * GET /v1/public/stores/:storeId/products
   * Fetch all published products for a store
   */
  @Get('stores/:storeId/products')
  async getStoreProducts(@Param('storeId') storeId: string) {
    return db
      .select()
      .from(products)
      .where(and(eq(products.storeId, storeId), eq(products.status, 'active')));
  }

  /**
   * GET /v1/public/products/:id
   * Fetch a single product by ID (must be published)
   */
  @Get('products/:id')
  async getProduct(@Param('id') id: string) {
    const results = await db
      .select()
      .from(products)
      .where(and(eq(products.id, id), eq(products.status, 'active')))
      .limit(1);

    if (!results.length) {
      throw new NotFoundException('Product not found');
    }

    return results[0];
  }

  /**
   * POST /v1/public/orders
   * Place a new order (customer checkout)
   */
  @Post('orders')
  @SkipThrottle()
  async placeOrder(
    @Body(new ZodValidationPipe(createOrderSchema)) data: CreateOrderDto,
  ) {
    // 1. Validate Store exists and is published
    const storeResults = await db
      .select()
      .from(stores)
      .where(and(eq(stores.id, data.storeId), eq(stores.isPublished, true)))
      .limit(1);

    const store = storeResults[0];
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // 2. Fetch and validate all ordered products
    const productIds = data.items.map((i) => i.productId);
    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    if (dbProducts.length !== productIds.length) {
      throw new BadRequestException('One or more products not found');
    }

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // 3. Calculate totals from server-side prices (never trust client prices)
    let subtotal = 0;
    const itemsToInsert = [];

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

    const deliveryFee = 0;
    const discount = 0;
    const total = subtotal + deliveryFee - discount;
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // 4. Insert order
    const [insertedOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        storeId: data.storeId,
        merchantId: store.merchantId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        deliveryAddress: data.deliveryAddress,
        subtotal: subtotal.toString(),
        deliveryFee: deliveryFee.toString(),
        discount: discount.toString(),
        total: total.toString(),
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      })
      .returning();

    // 5. Insert order items
    await db.insert(orderItems).values(
      itemsToInsert.map((item) => ({
        ...item,
        orderId: insertedOrder.id,
      })),
    );

    return insertedOrder;
  }

  /**
   * GET /v1/public/orders/:id
   * Fetch order by ID (for confirmation page)
   */
  @Get('orders/:id')
  async getOrder(@Param('id') id: string) {
    const orderResults = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (!orderResults.length) {
      throw new NotFoundException('Order not found');
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));

    return { ...orderResults[0], items };
  }
}
