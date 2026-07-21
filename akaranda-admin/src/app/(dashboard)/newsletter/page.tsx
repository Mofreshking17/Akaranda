import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import SubscribersTable from "@/components/newsletter/SubscribersTable";
import ExportCsvButton from "@/components/newsletter/ExportCsvButton";

export default async function NewsletterPage() {
  await requireModule("newsletter");
  const supabase = await createClient();
  const { data: subscribers } = await supabase.from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false });

  return (
    <div>
      <Topbar title="Newsletter Management" />
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">{subscribers?.length ?? 0} active subscribers</p>
          <ExportCsvButton subscribers={subscribers ?? []} />
        </div>

        <div className="bg-card border border-border rounded-lg overflow-x-auto">
          <SubscribersTable subscribers={subscribers ?? []} />
        </div>

        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <h3 className="font-medium text-foreground mb-1">Campaigns</h3>
          <p className="text-sm text-muted-foreground">
            Campaign sending isn&apos;t wired to an email provider yet. Drafts are stored and ready for when you connect Resend or another ESP.
          </p>
        </div>
      </div>
    </div>
  );
}
