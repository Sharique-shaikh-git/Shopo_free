'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { placeOrder } from '@/lib/api';

const PROVINCES = [
  { value: 'sindh', label: 'Sindh' },
  { value: 'punjab', label: 'Punjab' },
  { value: 'kpk', label: 'KPK' },
  { value: 'balochistan', label: 'Balochistan' },
  { value: 'islamabad', label: 'Islamabad' },
  { value: 'gilgit_baltistan', label: 'Gilgit-Baltistan' },
  { value: 'ajk', label: 'Azad Kashmir' },
] as const;

interface CheckoutFormProps {
  storeId: string;
}

export function CheckoutForm({ storeId }: CheckoutFormProps) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: 'punjab',
    postalCode: '',
    notes: '',
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const order = await placeOrder({
        storeId,
        customerName: form.fullName,
        customerPhone: form.phone,
        deliveryAddress: {
          fullName: form.fullName,
          phone: form.phone,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2 || undefined,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode || undefined,
        },
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        paymentMethod: 'cod',
        notes: form.notes || undefined,
      });

      clearCart();
      router.push(`/order/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground">Contact</h3>
        <input
          type="text"
          required
          minLength={2}
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => updateField('fullName', e.target.value)}
          className={inputClass}
        />
        <input
          type="tel"
          required
          minLength={10}
          maxLength={15}
          placeholder="Phone (e.g. 03001234567)"
          value={form.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground">Delivery Address</h3>
        <input
          type="text"
          required
          minLength={5}
          placeholder="Address Line 1"
          value={form.addressLine1}
          onChange={(e) => updateField('addressLine1', e.target.value)}
          className={inputClass}
        />
        <input
          type="text"
          placeholder="Address Line 2 (optional)"
          value={form.addressLine2}
          onChange={(e) => updateField('addressLine2', e.target.value)}
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            required
            minLength={2}
            placeholder="City"
            value={form.city}
            onChange={(e) => updateField('city', e.target.value)}
            className={inputClass}
          />
          <select
            value={form.province}
            onChange={(e) => updateField('province', e.target.value)}
            className={inputClass}
          >
            {PROVINCES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="Postal Code (optional)"
          value={form.postalCode}
          onChange={(e) => updateField('postalCode', e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground">Payment</h3>
        <div className="flex items-center gap-3 rounded-xl border-2 border-primary bg-primary/5 px-4 py-3">
          <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary">
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Cash on Delivery (COD)</p>
            <p className="text-xs text-muted-foreground">Pay when you receive your order</p>
          </div>
        </div>
      </div>

      <textarea
        placeholder="Order notes (optional)"
        rows={2}
        value={form.notes}
        onChange={(e) => updateField('notes', e.target.value)}
        className={inputClass}
      />

      <button
        type="submit"
        disabled={loading || items.length === 0}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Placing Order...
          </>
        ) : (
          'Place Order — Cash on Delivery'
        )}
      </button>
    </form>
  );
}
