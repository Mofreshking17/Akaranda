import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, MessageCircle } from "lucide-react";
import { orderService } from "@/lib/services/orderService";
import { getBusinessContact, getSettings } from "@/lib/data";
import { buildWhatsAppLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import RetryPaymentButton from "@/components/checkout/RetryPaymentButton";

export const dynamic = "force-dynamic";

export default async function OrderFailedPage({
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
  const waHref = buildWhatsAppLink(waNumber, `${WHATSAPP_MESSAGES.order} ${orderNumber} — my payment did not go through.`);

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-6">
        <AlertTriangle size={32} />
      </div>
      <h1 className="text-3xl font-light text-brand-brown mb-3">Payment Not Completed</h1>
      <p className="text-brand-muted max-w-md mb-8">
        Your order <span className="font-medium text-brand-brown">{order.order_number}</span> is saved as pending payment.
        No charge was made. You can retry payment below whenever you&apos;re ready.
      </p>

      <div className="w-full max-w-sm space-y-3">
        <RetryPaymentButton orderNumber={order.order_number} />
        <Link href="/cart" className="btn-secondary w-full text-center block">Back to Cart</Link>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1db954] text-white px-6 py-3 text-sm font-medium tracking-wide transition-colors"
        >
          <MessageCircle size={18} /> Get Help on WhatsApp
        </a>
      </div>
    </div>
  );
}
