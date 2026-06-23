"use server";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";
import type { OrderStatus, PaymentStatus } from "@/lib/types/database";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) throw new Error(error.message);

  await supabase.from("order_status_history").insert({ order_id: orderId, status, changed_by: profile.id });

  // Email notification placeholder — wire up Resend/SMTP here when ready.
  // await sendOrderStatusEmail(orderId, status);

  await logActivity({
    actorId: profile.id,
    actorName: profile.full_name,
    action: "order.status_changed",
    entityType: "order",
    entityId: orderId,
    details: { status },
  });

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
}

export async function updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase.from("orders").update({ payment_status: paymentStatus }).eq("id", orderId);
  if (error) throw new Error(error.message);

  await logActivity({
    actorId: profile.id,
    actorName: profile.full_name,
    action: "order.payment_status_changed",
    entityType: "order",
    entityId: orderId,
    details: { paymentStatus },
  });

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
}

export async function addOrderNote(orderId: string, notes: string) {
  await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ notes }).eq("id", orderId);
  if (error) throw new Error(error.message);
  revalidatePath(`/orders/${orderId}`);
}
