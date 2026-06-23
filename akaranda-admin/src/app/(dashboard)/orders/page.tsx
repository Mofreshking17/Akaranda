import Link from "next/link";
import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNaira, formatDate } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types/database";

const STATUS_VARIANT: Record<OrderStatus, "default" | "secondary" | "outline" | "destructive"> = {
  pending: "secondary",
  paid: "default",
  processing: "default",
  ready_for_delivery: "default",
  delivered: "outline",
  cancelled: "destructive",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requireModule("orders");
  const { q, status } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (q) query = query.or(`order_number.ilike.%${q}%,customer_name.ilike.%${q}%`);
  if (status) query = query.eq("status", status);
  const { data: orders } = await query;

  return (
    <div>
      <Topbar title="Order Management" />
      <div className="p-6 space-y-4">
        <form className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by order # or customer..."
            className="border border-neutral-300 rounded-md px-3 py-1.5 text-sm w-72 outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </form>

        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(orders ?? []).map((o) => (
                <TableRow key={o.id}>
                  <TableCell>
                    <Link href={`/orders/${o.id}`} className="font-medium text-neutral-900 hover:underline">
                      {o.order_number}
                    </Link>
                  </TableCell>
                  <TableCell>{o.customer_name}</TableCell>
                  <TableCell>{formatNaira(o.total)}</TableCell>
                  <TableCell className="capitalize text-sm">{o.payment_status}</TableCell>
                  <TableCell><Badge variant={STATUS_VARIANT[o.status as OrderStatus]} className="capitalize">{o.status.replace(/_/g, " ")}</Badge></TableCell>
                  <TableCell className="text-sm text-neutral-500">{formatDate(o.created_at)}</TableCell>
                </TableRow>
              ))}
              {(orders ?? []).length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-neutral-400 py-10">No orders yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
