import "server-only";

// Admin only ever re-verifies existing transactions (the "Verify Again" action) —
// initialization happens on the storefront. Kept minimal and separate from
// akaranda/src/lib/payments since these are two independently deployed apps.

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    status: string;
    reference: string;
    id: number;
    amount: number;
    currency: string;
    paid_at: string | null;
    channel: string | null;
    gateway_response: string | null;
    authorization: Record<string, unknown> | null;
  };
}

export interface PaystackVerifyResult {
  status: "success" | "failed" | "abandoned" | "pending";
  reference: string;
  transactionId: string | null;
  amount: number;
  currency: string;
  paidAt: string | null;
  channel: string | null;
  gatewayResponse: string | null;
  authorization: Record<string, unknown> | null;
}

export async function verifyPaystackTransaction(reference: string): Promise<PaystackVerifyResult> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) throw new Error("PAYSTACK_SECRET_KEY is not set");

  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
    cache: "no-store",
  });
  const json = (await res.json()) as PaystackVerifyResponse;
  if (!res.ok || !json.data) throw new Error(json.message || "Failed to verify transaction");

  const d = json.data;
  const status = d.status === "success" ? "success" : d.status === "failed" ? "failed" : d.status === "abandoned" ? "abandoned" : "pending";

  return {
    status,
    reference: d.reference,
    transactionId: d.id != null ? String(d.id) : null,
    amount: d.amount / 100,
    currency: d.currency,
    paidAt: d.paid_at,
    channel: d.channel,
    gatewayResponse: d.gateway_response,
    authorization: d.authorization,
  };
}
