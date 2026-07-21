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

// Order creation now goes through the Paystack checkout flow —
// see src/lib/services/orderService.ts and src/app/actions/checkout.ts.
