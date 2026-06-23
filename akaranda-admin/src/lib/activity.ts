import { createClient } from "@/lib/supabase/server";

export async function logActivity(params: {
  actorId: string;
  actorName: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, unknown>;
}) {
  const supabase = await createClient();
  await supabase.from("activity_log").insert({
    actor_id: params.actorId,
    actor_name: params.actorName,
    action: params.action,
    entity_type: params.entityType ?? null,
    entity_id: params.entityId ?? null,
    details: params.details ?? null,
  });
}
