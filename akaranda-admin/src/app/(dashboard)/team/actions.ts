"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireProfile } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";
import type { AdminRole } from "@/lib/types/database";

export async function inviteTeamMember(email: string, fullName: string, role: AdminRole) {
  const profile = await requireProfile();
  if (profile.role !== "super_admin") throw new Error("Only Super Admins can manage the team");

  const admin = createAdminClient();
  const { data: invited, error } = await admin.auth.admin.inviteUserByEmail(email);
  if (error) throw new Error(error.message);

  const supabase = await createClient();
  await supabase.from("profiles").insert({ id: invited.user.id, email, full_name: fullName, role });

  await logActivity({ actorId: profile.id, actorName: profile.full_name, action: "team.invited", entityType: "profile", entityId: invited.user.id, details: { email, role } });
  revalidatePath("/team");
}

export async function updateTeamMemberRole(profileId: string, role: AdminRole) {
  const profile = await requireProfile();
  if (profile.role !== "super_admin") throw new Error("Only Super Admins can manage the team");

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", profileId);
  if (error) throw new Error(error.message);

  await logActivity({ actorId: profile.id, actorName: profile.full_name, action: "team.role_changed", entityType: "profile", entityId: profileId, details: { role } });
  revalidatePath("/team");
}

export async function toggleTeamMemberActive(profileId: string, isActive: boolean) {
  const profile = await requireProfile();
  if (profile.role !== "super_admin") throw new Error("Only Super Admins can manage the team");

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ is_active: isActive }).eq("id", profileId);
  if (error) throw new Error(error.message);
  revalidatePath("/team");
}
