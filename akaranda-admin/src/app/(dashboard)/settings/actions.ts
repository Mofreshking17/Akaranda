"use server";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveSetting(key: string, value: unknown) {
  const profile = await requireProfile();
  if (profile.role !== "super_admin") throw new Error("Only Super Admins can change settings");

  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .upsert({ key, value, updated_by: profile.id, updated_at: new Date().toISOString() }, { onConflict: "key" });

  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}
