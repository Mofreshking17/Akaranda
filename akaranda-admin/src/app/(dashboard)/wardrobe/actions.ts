"use server";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";
import type { WardrobeStatus } from "@/lib/types/database";

export async function updateWardrobeStatus(requestId: string, status: WardrobeStatus) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("wardrobe_requests").update({ status }).eq("id", requestId);
  if (error) throw new Error(error.message);

  await logActivity({ actorId: profile.id, actorName: profile.full_name, action: "wardrobe.status_changed", entityType: "wardrobe_request", entityId: requestId, details: { status } });
  revalidatePath("/wardrobe");
  revalidatePath(`/wardrobe/${requestId}`);
}

export async function updateWardrobeNotes(requestId: string, adminNotes: string, internalNotes: string) {
  await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase
    .from("wardrobe_requests")
    .update({ admin_notes: adminNotes, internal_team_notes: internalNotes })
    .eq("id", requestId);
  if (error) throw new Error(error.message);
  revalidatePath(`/wardrobe/${requestId}`);
}
