import Link from "next/link";
import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNaira, formatDate } from "@/lib/utils";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireModule("customers");
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("customers").select("*").order("created_at", { ascending: false });
  if (q) query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`);
  const { data: customers } = await query;

  return (
    <div>
      <Topbar title="Customer Management" />
      <div className="p-4 md:p-6 space-y-4">
        <form className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by name, email, or phone..."
            className="border border-neutral-300 rounded-md px-3 py-1.5 text-sm w-full sm:w-72 outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </form>

        <div className="bg-card border border-border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Total Spend</TableHead>
                <TableHead>Customer Since</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(customers ?? []).map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link href={`/customers/${c.id}`} className="font-medium text-foreground hover:underline">
                      {c.full_name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {c.email && <p>{c.email}</p>}
                    {c.phone && <p className="text-muted-foreground">{c.phone}</p>}
                  </TableCell>
                  <TableCell>{formatNaira(c.total_spend)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(c.created_at)}</TableCell>
                </TableRow>
              ))}
              {(customers ?? []).length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-10">No customers yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
