"use server";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateCustomerNotes(customerId: string, notes: string) {
  await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("customers").update({ notes }).eq("id", customerId);
  if (error) throw new Error(error.message);
  revalidatePath(`/customers/${customerId}`);
}
