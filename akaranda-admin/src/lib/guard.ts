import { requireProfile } from "@/lib/auth";
import { canAccess, type Module } from "@/lib/permissions";
import type { Profile } from "@/lib/types/database";
import { redirect } from "next/navigation";

export async function requireModule(module: Module): Promise<Profile> {
  const profile = await requireProfile();
  if (!canAccess(profile.role, module)) redirect("/dashboard");
  return profile;
}
