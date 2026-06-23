"use server";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveSiteContent(section: string, key: string, value: unknown) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("site_content")
    .upsert({ section, key, value, updated_by: profile.id, updated_at: new Date().toISOString() }, { onConflict: "section,key" });

  if (error) throw new Error(error.message);
  revalidatePath("/content");
}
