import { z } from 'zod';
import { ORDER_STATUSES } from '../constants/order-status';

/**
 * Order — a customer's purchase from a store.
 *
 * Connected to: [[03_Features/cod-ordering]]
 * COD-first: Cash on Delivery is the default (80-91% of Pakistan)
 * Status flow: pending → confirmed → packed → shipped → delivered
 */

// ── Order Item ──────────────────────────────────────────
export const orderItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  title: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive(),
  thumbnailUrl: z.string().url().optional(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

// ── Delivery Address ────────────────────────────────────
export const deliveryAddressSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  addressLine1: z.string().min(5).max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(2).max(100),
  province: z.enum([
    'sindh', 'punjab', 'kpk', 'balochistan',
    'islamabad', 'gilgit_baltistan', 'ajk',
  ]),
  postalCode: z.string().max(10).optional(),
});

export type DeliveryAddress = z.infer<typeof deliveryAddressSchema>;

// ── Order ───────────────────────────────────────────────
export const orderSchema = z.object({
  id: z.string().uuid(),
  orderNumber: z.string(), // Human-readable: ORD-00001
  storeId: z.string().uuid(),
  merchantId: z.string().uuid(),

  // ── Customer info ─────────────────────────────────────
  customerName: z.string().min(2).max(100),
  customerPhone: z.string().min(10).max(15),
  deliveryAddress: deliveryAddressSchema,

  // ── Items ─────────────────────────────────────────────
  items: z.array(orderItemSchema).min(1),

  // ── Totals ────────────────────────────────────────────
  subtotal: z.number().positive(),
  deliveryFee: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  total: z.number().positive(),
  currency: z.literal('PKR').default('PKR'),

  // ── Payment ───────────────────────────────────────────
  paymentMethod: z.enum(['cod', 'bank_transfer', 'easypaisa', 'jazzcash']).default('cod'),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).default('pending'),

  // ── Status ────────────────────────────────────────────
  status: z.enum(ORDER_STATUSES).default('pending'),
  notes: z.string().max(500).optional(),
  merchantNotes: z.string().max(500).optional(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Order = z.infer<typeof orderSchema>;

// ── Create DTO (customer placing an order) ──────────────
export const createOrderSchema = z.object({
  storeId: z.string().uuid(),
  customerName: z.string().min(2).max(100),
  customerPhone: z.string().min(10).max(15),
  deliveryAddress: deliveryAddressSchema,
  items: z.array(z.object({
    productId: z.string().uuid(),
    variantId: z.string().uuid().optional(),
    quantity: z.number().int().positive(),
  })).min(1),
  paymentMethod: z.enum(['cod', 'bank_transfer', 'easypaisa', 'jazzcash']).default('cod'),
  notes: z.string().max(500).optional(),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;

// ── Update Status DTO (merchant fulfilling) ─────────────
export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  merchantNotes: z.string().max(500).optional(),
});

export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;
