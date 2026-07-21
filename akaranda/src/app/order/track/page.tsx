import Link from "next/link";
import { Package, MessageCircle } from "lucide-react";
import { orderService } from "@/lib/services/orderService";
import { getBusinessContact, getSettings } from "@/lib/data";
import { buildWhatsAppLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { formatNaira } from "@/lib/format";

export const dynamic = "force-dynamic";

const STEPS = ["pending", "paid", "processing", "ready_for_delivery", "shipped", "delivered"] as const;

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; phone?: string }>;
}) {
  const { order: orderNumber, phone } = await searchParams;
  const [businessContact, settings] = await Promise.all([getBusinessContact(), getSettings()]);
  const waNumber = businessContact.whatsapp_number || (settings.whatsapp as { number?: string } | undefined)?.number;
  const waHref = buildWhatsAppLink(waNumber, WHATSAPP_MESSAGES.order);

  let order = orderNumber ? await orderService.getOrderByNumber(orderNumber) : null;
  // Light privacy check: require the phone on file to match before showing details.
  if (order && phone && order.customer_phone && !order.customer_phone.replace(/\D/g, "").endsWith(phone.replace(/\D/g, "").slice(-6))) {
    order = null;
  }

  const currentStepIndex = order ? STEPS.indexOf(order.status as (typeof STEPS)[number]) : -1;

  return (
    <div className="min-h-screen bg-brand-cream px-4 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-light text-brand-brown mb-2 text-center">Track Your Order</h1>
        <p className="text-brand-muted text-sm text-center mb-8">Enter your order number and phone number to check its status.</p>

        <form className="bg-white border border-brand-sand p-6 space-y-4 mb-8">
          <div>
            <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Order Number</label>
            <input
              name="order"
              defaultValue={orderNumber}
              placeholder="AKR-..."
              className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Phone Number</label>
            <input
              name="phone"
              defaultValue={phone}
              placeholder="+234..."
              className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
            />
          </div>
          <button type="submit" className="btn-primary w-full">Track Order</button>
        </form>

        {orderNumber && !order && (
          <p className="text-center text-sm text-red-500 mb-8">
            We couldn&apos;t find a matching order. Double-check the order number and phone number, or contact support below.
          </p>
        )}

        {order && (
          <div className="bg-white border border-brand-sand p-6 space-y-6">
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Order Number</span>
              <span className="text-brand-brown font-medium">{order.order_number}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Payment Status</span>
              <span className="text-brand-accent font-medium capitalize">{order.payment_status}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Total</span>
              <span className="text-brand-primary font-medium">{formatNaira(order.total)}</span>
            </div>

            <div>
              <p className="text-xs tracking-widest uppercase text-brand-muted mb-3">Order Progress</p>
              <div className="space-y-2">
                {STEPS.map((step, i) => (
                  <div key={step} className="flex items-center gap-3 text-sm">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${i <= currentStepIndex ? "bg-brand-accent text-white" : "bg-brand-sand text-brand-muted"}`}>
                      {i <= currentStepIndex ? <Package size={12} /> : i + 1}
                    </div>
                    <span className={`capitalize ${i <= currentStepIndex ? "text-brand-brown font-medium" : "text-brand-muted"}`}>
                      {step.replace(/_/g, " ")}
                    </span>
                  </div>
                ))}
                {order.status === "cancelled" && (
                  <p className="text-red-500 text-sm mt-2">This order was cancelled.</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center space-y-3">
          <Link href="/shop" className="btn-secondary inline-block">Continue Shopping</Link>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1db954] text-white px-6 py-3 text-sm font-medium tracking-wide transition-colors"
          >
            <MessageCircle size={18} /> Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
