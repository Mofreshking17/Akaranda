import Link from "next/link";
import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import type { WardrobeType } from "@/lib/types/database";

export default async function WardrobePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: WardrobeType }>;
}) {
  await requireModule("wardrobe");
  const { type = "kiddies" } = await searchParams;
  const supabase = await createClient();

  const { data: requests } = await supabase
    .from("wardrobe_requests")
    .select("*")
    .eq("type", type)
    .order("created_at", { ascending: false });

  return (
    <div>
      <Topbar title="Wardrobe Service Management" />
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex flex-wrap gap-1 bg-card border border-border rounded-md p-1 w-fit">
          {(["kiddies", "chics"] as WardrobeType[]).map((t) => (
            <Link
              key={t}
              href={`/wardrobe?type=${t}`}
              className={`px-4 py-1.5 text-sm rounded-md capitalize transition-colors ${
                type === t ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {t} Wardrobe Requests
            </Link>
          ))}
        </div>

        <div className="bg-card border border-border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Occasion</TableHead>
                <TableHead>Colours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(requests ?? []).map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Link href={`/wardrobe/${r.id}`} className="font-medium text-foreground hover:underline">
                      {r.full_name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{r.phone}</p>
                  </TableCell>
                  <TableCell>{r.occasion ?? "â€”"}</TableCell>
                  <TableCell className="text-sm">{r.colour_preferences?.join(", ") || "â€”"}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{r.status.replace(/_/g, " ")}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(r.created_at)}</TableCell>
                </TableRow>
              ))}
              {(requests ?? []).length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-10">No requests yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
