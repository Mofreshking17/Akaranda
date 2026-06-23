"use server";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

export async function deleteSubscriber(id: string) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity({ actorId: profile.id, actorName: profile.full_name, action: "newsletter.subscriber_deleted", entityType: "newsletter_subscriber", entityId: id });
  revalidatePath("/newsletter");
}

export async function createCampaignDraft(subject: string, bodyHtml: string) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_campaigns").insert({ subject, body_html: bodyHtml, status: "draft" });
  if (error) throw new Error(error.message);
  await logActivity({ actorId: profile.id, actorName: profile.full_name, action: "newsletter.campaign_drafted", details: { subject } });
  revalidatePath("/newsletter");
}
