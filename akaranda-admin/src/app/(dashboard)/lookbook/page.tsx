import Link from "next/link";
import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import LookbookCard from "@/components/lookbook/LookbookCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function LookbookPage() {
  await requireModule("lookbook");
  const supabase = await createClient();
  const { data: collections } = await supabase.from("lookbook_collections").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <Topbar title="Lookbook Management" />
      <div className="p-6 space-y-4">
        <div className="flex justify-end">
          <Link href="/lookbook/new">
            <Button><Plus className="w-4 h-4 mr-1" /> New Collection</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(collections ?? []).map((c) => <LookbookCard key={c.id} collection={c} />)}
          {(collections ?? []).length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-16">No lookbook collections yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
