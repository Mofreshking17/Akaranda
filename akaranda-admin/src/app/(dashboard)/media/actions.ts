"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireProfile } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET || "akaranda-media";

export async function deleteMediaFile(id: string, storagePath: string) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const admin = createAdminClient();

  await admin.storage.from(BUCKET).remove([storagePath]);
  const { error } = await supabase.from("media_files").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logActivity({ actorId: profile.id, actorName: profile.full_name, action: "media.deleted", entityType: "media_file", entityId: id });
  revalidatePath("/media");
}
