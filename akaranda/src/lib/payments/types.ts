// Gateway-agnostic payment contract. Adding Flutterwave/Stripe/Moniepoint later
// means writing one new file that implements this interface — nothing in the
// checkout flow, order service, or webhook route needs to change.

export interface InitializePaymentParams {
  email: string;
  /** Major currency unit (e.g. Naira), never the gateway's minor unit. */
  amount: number;
  currency?: string;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

export interface InitializePaymentResult {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export type NormalizedPaymentStatus = "success" | "failed" | "abandoned" | "pending";

export interface VerifyPaymentResult {
  status: NormalizedPaymentStatus;
  reference: string;
  transactionId: string | null;
  /** Major currency unit. */
  amount: number;
  currency: string;
  paidAt: string | null;
  channel: string | null;
  gatewayResponse: string | null;
  authorization: Record<string, unknown> | null;
  raw: unknown;
}

export interface PaymentGateway {
  readonly name: string;
  initialize(params: InitializePaymentParams): Promise<InitializePaymentResult>;
  verify(reference: string): Promise<VerifyPaymentResult>;
  /** HMAC/signature check for inbound webhooks. Must never trust the payload without this. */
  verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean;
}
