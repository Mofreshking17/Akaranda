import "server-only";
import type { PaymentGateway } from "./types";
import { paystackGateway } from "./paystack";

// Single swap point for the active gateway. To add Flutterwave/Stripe/Moniepoint,
// write a new class implementing PaymentGateway and change this one line —
// checkout, verification, and the webhook route never reference Paystack directly.
export const paymentGateway: PaymentGateway = paystackGateway;

export * from "./types";
