import { fetchOrder } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package } from 'lucide-react';

interface OrderConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { id } = await params;

  let order;
  try {
    order = await fetchOrder(id);
  } catch {
    notFound();
  }

  const total = parseFloat(order.total);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {/* Success header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10">
          <CheckCircle className="h-12 w-12 text-secondary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Order Placed Successfully!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Thank you, {order.customerName}. Your order has been received.
        </p>
      </div>

      {/* Order details card */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Order Number
            </p>
            <p className="mt-1 text-lg font-bold text-primary">
              {order.orderNumber}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold capitalize text-foreground">
              {order.status}
            </span>
          </div>
        </div>

        {/* Items */}
        {order.items && order.items.length > 0 && (
          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm">
                      📦
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity} × Rs{' '}
                    {parseFloat(item.unitPrice).toLocaleString()}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-foreground">
                  Rs {parseFloat(item.totalPrice).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="mt-4 flex justify-between border-t border-border pt-4">
          <span className="text-base font-bold text-foreground">Total</span>
          <span className="text-xl font-extrabold text-primary">
            Rs {total.toLocaleString()}
          </span>
        </div>

        {/* Payment info */}
        <div className="mt-4 rounded-xl bg-muted px-4 py-3">
          <p className="text-sm font-semibold text-foreground">
            💵 Cash on Delivery
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Please keep Rs {total.toLocaleString()} ready when the rider arrives.
          </p>
        </div>
      </div>

      {/* Delivery info */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Delivery Details
        </h2>
        <div className="mt-3 space-y-1 text-sm text-foreground">
          <p className="font-semibold">{order.customerName}</p>
          <p>{order.customerPhone}</p>
          {order.deliveryAddress && (
            <>
              <p>{order.deliveryAddress.addressLine1}</p>
              {order.deliveryAddress.addressLine2 && (
                <p>{order.deliveryAddress.addressLine2}</p>
              )}
              <p>
                {order.deliveryAddress.city}, {order.deliveryAddress.province}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Continue shopping */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
