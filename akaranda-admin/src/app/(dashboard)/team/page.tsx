import { requireProfile } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import InviteMemberForm from "@/components/team/InviteMemberForm";
import TeamTable from "@/components/team/TeamTable";

export default async function TeamPage() {
  const profile = await requireProfile();
  if (profile.role !== "super_admin") redirect("/dashboard");

  const supabase = await createClient();
  const { data: members } = await supabase.from("profiles").select("*").order("created_at");

  return (
    <div>
      <Topbar title="Team Management" />
      <div className="p-6 space-y-6">
        <InviteMemberForm />
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <TeamTable members={members ?? []} currentUserId={profile.id} />
        </div>
      </div>
    </div>
  );
}
