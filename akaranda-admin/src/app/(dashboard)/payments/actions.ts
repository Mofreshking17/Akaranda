"use server";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { verifyPaystackTransaction } from "@/lib/paystack";
import { revalidatePath } from "next/cache";

export async function verifyPaymentAgain(paymentId: string) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: payment, error: fetchErr } = await supabase.from("payments").select("*").eq("id", paymentId).single();
  if (fetchErr || !payment) throw new Error("Payment not found");

  const verified = await verifyPaystackTransaction(payment.reference);
  const status = verified.status === "success" ? "paid" : verified.status === "pending" ? "pending" : "failed";

  const { error } = await supabase
    .from("payments")
    .update({
      status,
      transaction_id: verified.transactionId,
      payment_method: verified.channel,
      authorization: verified.authorization,
      gateway_response: verified.gatewayResponse,
      paid_at: verified.paidAt,
    })
    .eq("id", paymentId);
  if (error) throw new Error(error.message);

  if (status === "paid") {
    await supabase.from("orders").update({ payment_status: "paid", status: "paid" }).eq("id", payment.order_id);
  }

  await logActivity({
    actorId: profile.id,
    actorName: profile.full_name,
    action: "payment.reverified",
    entityType: "payment",
    entityId: paymentId,
    details: { reference: payment.reference, status },
  });

  revalidatePath("/payments");
  return { status };
}

export async function issueRefund(paymentId: string, reason: string) {
  const profile = await requireProfile();
  if (profile.role !== "super_admin" && profile.role !== "admin") throw new Error("Not authorized to issue refunds");

  const supabase = await createClient();
  const { data: payment, error: fetchErr } = await supabase.from("payments").select("order_id, status").eq("id", paymentId).single();
  if (fetchErr || !payment) throw new Error("Payment not found");
  if (payment.status !== "paid") throw new Error("Only paid transactions can be refunded");

  // Manual refund record — actual funds movement happens on the Paystack
  // dashboard (or via their Refund API in a future enhancement); this marks
  // the record so admin reporting and the customer's order status reflect it.
  const { error } = await supabase
    .from("payments")
    .update({ status: "refunded", refunded_at: new Date().toISOString(), refund_reason: reason })
    .eq("id", paymentId);
  if (error) throw new Error(error.message);

  await supabase.from("orders").update({ payment_status: "refunded" }).eq("id", payment.order_id);

  await logActivity({
    actorId: profile.id,
    actorName: profile.full_name,
    action: "payment.refunded",
    entityType: "payment",
    entityId: paymentId,
    details: { reason },
  });

  revalidatePath("/payments");
}
