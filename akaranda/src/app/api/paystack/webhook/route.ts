import { NextResponse } from "next/server";
import { paymentGateway } from "@/lib/payments";
import { orderService } from "@/lib/services/orderService";

// Paystack webhook — the authoritative confirmation path, since it fires even
// if the customer closes the tab before the callback redirect completes.
// Signature verification uses the raw request body, so this must read
// request.text() rather than request.json() (which would re-serialize and
// break the HMAC comparison).
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!paymentGateway.verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const reference = event.data?.reference;
  if (!reference) {
    return NextResponse.json({ received: true });
  }

  // Only act on events that indicate a charge attempt reached a final state.
  // We re-verify against Paystack's API rather than trusting the webhook body
  // directly — belt-and-braces against a forged or stale payload.
  if (event.event === "charge.success" || event.event === "charge.failed") {
    try {
      await orderService.verifyAndFinalize(reference);
    } catch (e) {
      console.error("[paystack webhook] finalize failed:", e instanceof Error ? e.message : e);
      // Still 200 — Paystack retries on non-2xx, and finalization is idempotent,
      // so a transient DB error here will self-heal on the next retry or the
      // customer's own callback-page verification.
    }
  }

  return NextResponse.json({ received: true });
}
