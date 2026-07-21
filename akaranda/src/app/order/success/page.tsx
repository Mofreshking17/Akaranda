import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MessageCircle, Package } from "lucide-react";
import { orderService } from "@/lib/services/orderService";
import { getBusinessContact, getSettings } from "@/lib/data";
import { buildWhatsAppLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { formatNaira } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  if (!orderNumber) notFound();

  const [order, businessContact, settings] = await Promise.all([
    orderService.getOrderByNumber(orderNumber),
    getBusinessContact(),
    getSettings(),
  ]);
  if (!order) notFound();

  const waNumber = businessContact.whatsapp_number || (settings.whatsapp as { number?: string } | undefined)?.number;
  const waHref = buildWhatsAppLink(waNumber, `${WHATSAPP_MESSAGES.order} ${orderNumber}.`);
  const standardDays = (settings.delivery_pricing as { standard_days?: number } | undefined)?.standard_days ?? 7;

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-accent text-white flex items-center justify-center mb-6">
        <Check size={32} />
      </div>
      <h1 className="text-3xl md:text-4xl font-light text-brand-brown mb-3">Thank You For Shopping With AKARANDA Fashion</h1>
      <p className="text-brand-muted max-w-md mb-8">Your order has been received successfully and payment is confirmed.</p>

      <div className="bg-white border border-brand-sand p-6 w-full max-w-sm space-y-3 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-brand-muted">Order Number</span>
          <span className="text-brand-brown font-medium">{order.order_number}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-muted">Payment Status</span>
          <span className="text-brand-accent font-medium capitalize">{order.payment_status}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-muted">Total Paid</span>
          <span className="text-brand-primary font-medium">{formatNaira(order.total)}</span>
        </div>
        <div className="flex justify-between text-sm items-center">
          <span className="text-brand-muted">Expected Delivery</span>
          <span className="text-brand-brown font-medium flex items-center gap-1.5"><Package size={14} /> {standardDays} days</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mb-8">
        <Link href="/shop" className="btn-secondary flex-1 text-center">Continue Shopping</Link>
        <Link href={`/order/track?order=${encodeURIComponent(order.order_number)}`} className="btn-primary flex-1 text-center">Track Order</Link>
      </div>

      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1db954] text-white px-6 py-3 text-sm font-medium tracking-wide transition-colors"
      >
        <MessageCircle size={18} /> Contact Support on WhatsApp
      </a>
    </div>
  );
}
