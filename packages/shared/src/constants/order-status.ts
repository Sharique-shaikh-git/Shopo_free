/**
 * Order status flow — state machine for order lifecycle.
 *
 * pending → confirmed → packed → shipped → delivered
 *                                        → returned
 * pending → cancelled
 *
 * Connected to: [[03_Features/cod-ordering]]
 */
export const ORDER_STATUSES = [
  'pending',     // Customer placed order, waiting for merchant
  'confirmed',   // Merchant accepted the order
  'packed',      // Merchant packed the order
  'shipped',     // Handed to delivery rider
  'delivered',   // Customer received and paid (COD)
  'cancelled',   // Cancelled by merchant or customer
  'returned',    // Customer returned the order
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/**
 * Valid transitions — prevents invalid status jumps.
 */
export const VALID_ORDER_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['packed', 'cancelled'],
  packed:    ['shipped', 'cancelled'],
  shipped:   ['delivered', 'returned'],
  delivered: [],
  cancelled: [],
  returned:  [],
};
