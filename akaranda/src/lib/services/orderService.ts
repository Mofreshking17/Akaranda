import "server-only";
import { randomBytes } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { paymentGateway } from "@/lib/payments";
import type { VerifyPaymentResult } from "@/lib/payments/types";
import { inventoryService } from "./inventoryService";
import { notificationService } from "./notificationService";

export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

export interface CheckoutItem {
  product_id: string | null;
  product_name: string;
  selected_size: string | null;
  selected_colour?: string | null;
  quantity: number;
  unit_price: number;
}

export interface CheckoutInput {
  customer: CheckoutCustomer;
  items: CheckoutItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  callbackUrl: string;
}

export type CheckoutResult =
  | { ok: true; orderNumber: string; authorizationUrl: string }
  | { ok: false; message: string; shortfalls?: { product_name: string; available: number }[] };

export type FinalizeResult =
  | { outcome: "success"; orderNumber: string }
  | { outcome: "already_processed"; orderNumber: string }
  | { outcome: "failed"; orderNumber: string }
  | { outcome: "not_found" };

function generateOrderNumber(): string {
  return `AKR-${Date.now().toString(36).toUpperCase()}${randomBytes(2).toString("hex").toUpperCase()}`;
}

function generatePaymentReference(orderNumber: string): string {
  return `${orderNumber}-${randomBytes(4).toString("hex")}`;
}

async function logAudit(action: string, entityId: string, details: Record<string, unknown>) {
  const supabase = createAdminClient();
  await supabase.from("activity_log").insert({
    actor_name: "Storefront (customer)",
    action,
    entity_type: "order",
    entity_id: entityId,
    details,
  });
}

export const orderService = {
  /** Creates the order + customer + a fresh payment attempt, then returns the Paystack authorization URL. */
  async initiateCheckout(input: CheckoutInput): Promise<CheckoutResult> {
    if (!input.customer.name || !input.customer.phone || !input.customer.email || input.items.length === 0) {
      return { ok: false, message: "Missing required customer details or empty cart." };
    }

    const shortfalls = await inventoryService.validateStock(
      input.items.map((i) => ({ product_id: i.product_id, product_name: i.product_name, quantity: i.quantity }))
    );
    if (shortfalls.length > 0) {
      return {
        ok: false,
        message: "Some items no longer have enough stock.",
        shortfalls: shortfalls.map((s) => ({ product_name: s.product_name, available: s.available })),
      };
    }

    const supabase = createAdminClient();
    const orderNumber = generateOrderNumber();

    const { data: customer } = await supabase
      .from("customers")
      .upsert(
        {
          full_name: input.customer.name,
          email: input.customer.email,
          phone: input.customer.phone,
          address: input.customer.address || null,
          city: input.customer.city || null,
          state: input.customer.state || null,
        },
        { onConflict: "email", ignoreDuplicates: false }
      )
      .select("id")
      .maybeSingle();
    const customerId = customer?.id ?? null;

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_id: customerId,
        customer_name: input.customer.name,
        customer_phone: input.customer.phone,
        customer_email: input.customer.email,
        delivery_address: `${input.customer.address}, ${input.customer.city}, ${input.customer.state}`.trim(),
        subtotal: input.subtotal,
        delivery_fee: input.shippingFee,
        discount: input.discount,
        total: input.total,
        status: "pending",
        payment_status: "unpaid",
        payment_method: "paystack",
      })
      .select("id")
      .single();

    if (orderErr || !order) return { ok: false, message: "Could not create order. Please try again." };

    const { error: itemsErr } = await supabase.from("order_items").insert(
      input.items.map((it) => ({
        order_id: order.id,
        product_id: it.product_id,
        product_name: it.product_name,
        selected_size: it.selected_size,
        selected_colour: it.selected_colour ?? null,
        quantity: it.quantity,
        unit_price: it.unit_price,
        line_total: it.unit_price * it.quantity,
      }))
    );
    if (itemsErr) return { ok: false, message: "Order created but items failed. Contact support." };

    const reference = generatePaymentReference(orderNumber);

    const { error: paymentErr } = await supabase.from("payments").insert({
      order_id: order.id,
      customer_id: customerId,
      gateway: "paystack",
      reference,
      amount: input.total,
      currency: "NGN",
      status: "pending",
    });
    if (paymentErr) return { ok: false, message: "Could not start payment. Please try again." };

    await supabase.from("orders").update({ paystack_reference: reference }).eq("id", order.id);

    try {
      const init = await paymentGateway.initialize({
        email: input.customer.email,
        amount: input.total,
        reference,
        callbackUrl: input.callbackUrl,
        metadata: { order_id: order.id, order_number: orderNumber },
      });

      await logAudit("order.checkout_initiated", order.id, { orderNumber, reference, total: input.total });
      await notificationService.notifyAdminNewOrder({
        orderNumber,
        customerName: input.customer.name,
        customerEmail: input.customer.email,
        total: input.total,
      });

      return { ok: true, orderNumber, authorizationUrl: init.authorizationUrl };
    } catch (e) {
      return { ok: false, message: e instanceof Error ? e.message : "Could not reach the payment gateway." };
    }
  },

  /** Creates a fresh payment attempt (new reference) for an existing unpaid order — "retry payment". */
  async retryPayment(orderNumber: string, callbackUrl: string): Promise<CheckoutResult> {
    const supabase = createAdminClient();
    const { data: order } = await supabase.from("orders").select("id, total, customer_email, payment_status").eq("order_number", orderNumber).maybeSingle();
    if (!order) return { ok: false, message: "Order not found." };
    if (order.payment_status === "paid") return { ok: false, message: "This order has already been paid for." };

    const reference = generatePaymentReference(orderNumber);
    const { error: paymentErr } = await supabase.from("payments").insert({
      order_id: order.id,
      gateway: "paystack",
      reference,
      amount: order.total,
      currency: "NGN",
      status: "pending",
    });
    if (paymentErr) return { ok: false, message: "Could not start a new payment attempt." };

    await supabase.from("orders").update({ paystack_reference: reference }).eq("id", order.id);

    try {
      const init = await paymentGateway.initialize({
        email: order.customer_email ?? "",
        amount: order.total,
        reference,
        callbackUrl,
        metadata: { order_id: order.id, order_number: orderNumber },
      });
      return { ok: true, orderNumber, authorizationUrl: init.authorizationUrl };
    } catch (e) {
      return { ok: false, message: e instanceof Error ? e.message : "Could not reach the payment gateway." };
    }
  },

  /**
   * The single source of truth for turning a gateway result into order/payment
   * state. Called from BOTH the callback page (immediate UX) and the webhook
   * (authoritative, fires even if the customer closes the tab) — idempotent
   * via the payment row's current status, so double-processing is a no-op.
   */
  async finalizeFromVerification(reference: string, verified: VerifyPaymentResult): Promise<FinalizeResult> {
    const supabase = createAdminClient();
    const { data: payment } = await supabase
      .from("payments")
      .select("id, order_id, status")
      .eq("reference", reference)
      .maybeSingle();

    if (!payment) return { outcome: "not_found" };

    const { data: order } = await supabase.from("orders").select("id, order_number, total, customer_name, customer_email").eq("id", payment.order_id).single();
    if (!order) return { outcome: "not_found" };

    if (payment.status === "paid") {
      // Already finalized by the other path (webhook vs callback race) — idempotent no-op.
      return { outcome: "already_processed", orderNumber: order.order_number };
    }

    if (verified.status !== "success") {
      await supabase
        .from("payments")
        .update({
          status: "failed",
          transaction_id: verified.transactionId,
          gateway_response: verified.gatewayResponse,
          payment_method: verified.channel,
        })
        .eq("id", payment.id);
      await logAudit("payment.failed", order.id, { reference, status: verified.status, gatewayResponse: verified.gatewayResponse });
      return { outcome: "failed", orderNumber: order.order_number };
    }

    // Verified success — finalize payment, order, inventory, and notifications.
    await supabase
      .from("payments")
      .update({
        status: "paid",
        transaction_id: verified.transactionId,
        payment_method: verified.channel,
        authorization: verified.authorization,
        gateway_response: verified.gatewayResponse,
        paid_at: verified.paidAt ?? new Date().toISOString(),
      })
      .eq("id", payment.id);

    await supabase
      .from("orders")
      .update({ payment_status: "paid", status: "paid", payment_method: verified.channel ?? "paystack" })
      .eq("id", order.id);

    await supabase.from("order_status_history").insert({ order_id: order.id, status: "paid" });

    const oversold = await inventoryService.decrementForOrder(order.id);
    if (oversold.length > 0) {
      await logAudit("order.oversold", order.id, { orderNumber: order.order_number, oversold });
    }

    await logAudit("payment.succeeded", order.id, { reference, amount: verified.amount, transactionId: verified.transactionId });

    await notificationService.sendOrderConfirmation({
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      total: order.total,
    });
    await notificationService.sendPaymentReceipt({
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      total: order.total,
      amount: verified.amount,
      reference,
    });
    await notificationService.notifyAdminPaymentReceived({
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      total: order.total,
      amount: verified.amount,
      reference,
    });

    return { outcome: "success", orderNumber: order.order_number };
  },

  /** Runs gateway verification then finalizes — the one function both the callback page and webhook call. */
  async verifyAndFinalize(reference: string): Promise<FinalizeResult> {
    const verified = await paymentGateway.verify(reference);
    return this.finalizeFromVerification(reference, verified);
  },

  async getOrderByNumber(orderNumber: string) {
    const supabase = createAdminClient();
    const { data: order } = await supabase.from("orders").select("*").eq("order_number", orderNumber).maybeSingle();
    return order;
  },
};
