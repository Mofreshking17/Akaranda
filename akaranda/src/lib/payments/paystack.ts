import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type {
  InitializePaymentParams,
  InitializePaymentResult,
  NormalizedPaymentStatus,
  PaymentGateway,
  VerifyPaymentResult,
} from "./types";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

function normalizeStatus(paystackStatus: string): NormalizedPaymentStatus {
  switch (paystackStatus) {
    case "success":
      return "success";
    case "failed":
      return "failed";
    case "abandoned":
      return "abandoned";
    default:
      return "pending";
  }
}

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data?: { authorization_url: string; access_code: string; reference: string };
}

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

class PaystackGateway implements PaymentGateway {
  readonly name = "paystack";

  async initialize(params: InitializePaymentParams): Promise<InitializePaymentResult> {
    const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: params.email,
        amount: Math.round(params.amount * 100), // Naira -> kobo
        currency: params.currency ?? "NGN",
        reference: params.reference,
        callback_url: params.callbackUrl,
        metadata: params.metadata ?? {},
      }),
      cache: "no-store",
    });

    const json = (await res.json()) as PaystackInitializeResponse;
    if (!res.ok || !json.status || !json.data) {
      throw new Error(json.message || "Failed to initialize Paystack transaction");
    }

    return {
      authorizationUrl: json.data.authorization_url,
      accessCode: json.data.access_code,
      reference: json.data.reference,
    };
  }

  async verify(reference: string): Promise<VerifyPaymentResult> {
    const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${secretKey()}` },
      cache: "no-store",
    });

    const json = (await res.json()) as PaystackVerifyResponse;
    if (!res.ok || !json.data) {
      throw new Error(json.message || "Failed to verify Paystack transaction");
    }

    const d = json.data;
    return {
      status: normalizeStatus(d.status),
      reference: d.reference,
      transactionId: d.id != null ? String(d.id) : null,
      amount: d.amount / 100, // kobo -> Naira
      currency: d.currency,
      paidAt: d.paid_at,
      channel: d.channel,
      gatewayResponse: d.gateway_response,
      authorization: d.authorization,
      raw: json,
    };
  }

  verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
    if (!signatureHeader) return false;
    const expected = createHmac("sha512", secretKey()).update(rawBody).digest("hex");
    // Lengths must match before timingSafeEqual, else it throws.
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(signatureHeader, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  }
}

export const paystackGateway = new PaystackGateway();
