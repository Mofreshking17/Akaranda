import { redirect } from "next/navigation";
import { orderService } from "@/lib/services/orderService";

export const dynamic = "force-dynamic";

// Paystack redirects here after the customer completes (or abandons) checkout.
// This is the immediate-UX verification path; the webhook (api/paystack/webhook)
// is the authoritative one. Both call the same finalizeFromVerification, so
// whichever runs first wins and the other is a no-op.
export default async function CheckoutCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const { reference, trxref } = await searchParams;
  const ref = reference || trxref;

  if (!ref) redirect("/cart");

  const result = await orderService.verifyAndFinalize(ref);

  if (result.outcome === "success" || result.outcome === "already_processed") {
    redirect(`/order/success?order=${encodeURIComponent(result.orderNumber)}`);
  }
  if (result.outcome === "failed") {
    redirect(`/order/failed?order=${encodeURIComponent(result.orderNumber)}`);
  }
  redirect("/cart");
}
