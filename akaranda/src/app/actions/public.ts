"use server";

import { createAdminClient } from "@/lib/supabase/admin";

// ─── NEWSLETTER ────────────────────────────────────────────
export async function subscribeNewsletter(formData: FormData): Promise<{ ok: boolean; message: string }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({ email });

  if (error) {
    if (error.code === "23505") return { ok: true, message: "You're already subscribed — thank you!" };
    return { ok: false, message: "Something went wrong. Please try again." };
  }
  return { ok: true, message: "Thank you for subscribing!" };
}

// ─── WARDROBE REQUEST ──────────────────────────────────────
export interface WardrobeSubmission {
  type: "kiddies" | "chics";
  full_name: string;
  phone: string;
  email?: string;
  measurements: Record<string, string | number>;
  colour_preferences: string[];
  style_preferences?: string;
  occasion?: string;
  budget_range?: string;
}

export async function submitWardrobeRequest(payload: WardrobeSubmission): Promise<{ ok: boolean; message: string }> {
  if (!payload.full_name || !payload.phone) {
    return { ok: false, message: "Name and phone are required." };
  }

  const supabase = createAdminClient();

  // Upsert a lightweight customer record for the CRM
  let customerId: string | null = null;
  if (payload.email || payload.phone) {
    const { data: customer } = await supabase
      .from("customers")
      .upsert(
        { full_name: payload.full_name, email: payload.email || null, phone: payload.phone },
        { onConflict: "email", ignoreDuplicates: false }
      )
      .select("id")
      .maybeSingle();
    customerId = customer?.id ?? null;
  }

  const { error } = await supabase.from("wardrobe_requests").insert({
    type: payload.type,
    customer_id: customerId,
    full_name: payload.full_name,
    phone: payload.phone,
    email: payload.email || null,
    measurements: payload.measurements,
    colour_preferences: payload.colour_preferences,
    style_preferences: payload.style_preferences || null,
    occasion: payload.occasion || null,
    budget_range: payload.budget_range || null,
    status: "new_request",
  });

  if (error) return { ok: false, message: "Could not submit your request. Please try again." };
  return { ok: true, message: "Request received! We'll contact you within 24 hours." };
}

// ─── ORDER (cart checkout) ─────────────────────────────────
export interface OrderItemInput {
  product_id: string | null;
  product_name: string;
  selected_size: string | null;
  quantity: number;
  unit_price: number;
}

export interface OrderSubmission {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address?: string;
  items: OrderItemInput[];
  subtotal: number;
  delivery_fee: number;
  total: number;
}

export async function createOrder(payload: OrderSubmission): Promise<{ ok: boolean; orderNumber?: string; message: string }> {
  if (!payload.customer_name || !payload.customer_phone || payload.items.length === 0) {
    return { ok: false, message: "Missing customer details or empty cart." };
  }

  const supabase = createAdminClient();
  const orderNumber = `AKR-${Date.now().toString(36).toUpperCase()}`;

  // Link/create customer
  let customerId: string | null = null;
  const { data: customer } = await supabase
    .from("customers")
    .upsert(
      {
        full_name: payload.customer_name,
        email: payload.customer_email || null,
        phone: payload.customer_phone,
        address: payload.delivery_address || null,
      },
      { onConflict: "email", ignoreDuplicates: false }
    )
    .select("id")
    .maybeSingle();
  customerId = customer?.id ?? null;

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_id: customerId,
      customer_name: payload.customer_name,
      customer_phone: payload.customer_phone,
      customer_email: payload.customer_email || null,
      delivery_address: payload.delivery_address || null,
      subtotal: payload.subtotal,
      delivery_fee: payload.delivery_fee,
      total: payload.total,
      status: "pending",
      payment_status: "unpaid",
    })
    .select("id")
    .single();

  if (orderErr || !order) return { ok: false, message: "Could not place order. Please try again." };

  const { error: itemsErr } = await supabase.from("order_items").insert(
    payload.items.map((it) => ({
      order_id: order.id,
      product_id: it.product_id,
      product_name: it.product_name,
      selected_size: it.selected_size,
      quantity: it.quantity,
      unit_price: it.unit_price,
      line_total: it.unit_price * it.quantity,
    }))
  );

  if (itemsErr) return { ok: false, message: "Order saved but items failed. Contact support." };

  return { ok: true, orderNumber, message: "Order placed successfully!" };
}
