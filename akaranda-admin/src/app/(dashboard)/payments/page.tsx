import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import StatCard from "@/components/dashboard/StatCard";
import PaymentsTable, { type PaymentRow } from "@/components/payments/PaymentsTable";
import ExportPaymentsButton from "@/components/payments/ExportPaymentsButton";
import {
  Wallet, CalendarDays, CalendarRange, CheckCircle2, Clock, XCircle, Undo2, Receipt,
} from "lucide-react";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireModule("payments");
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("payments")
    .select("id, order_id, customer_id, amount, status, gateway, reference, created_at, paid_at, orders(order_number, customer_name)")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data: rows } = await query;

  const payments: PaymentRow[] = (rows ?? []).map((r) => {
    const order = r.orders as unknown as { order_number: string; customer_name: string } | null;
    return {
      id: r.id,
      order_id: r.order_id,
      customer_id: r.customer_id,
      order_number: order?.order_number ?? "—",
      customer_name: order?.customer_name ?? "—",
      amount: r.amount,
      status: r.status,
      gateway: r.gateway,
      reference: r.reference,
      created_at: r.created_at,
    };
  });

  // Simple in-memory aggregation — payment volume for a boutique storefront
  // doesn't warrant separate SQL aggregate queries yet.
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const paid = (rows ?? []).filter((r) => r.status === "paid");
  const totalRevenue = paid.reduce((sum, r) => sum + r.amount, 0);
  const todaysRevenue = paid.filter((r) => r.paid_at && new Date(r.paid_at) >= startOfToday).reduce((sum, r) => sum + r.amount, 0);
  const monthRevenue = paid.filter((r) => r.paid_at && new Date(r.paid_at) >= startOfMonth).reduce((sum, r) => sum + r.amount, 0);
  const pendingCount = (rows ?? []).filter((r) => r.status === "pending" || r.status === "unpaid").length;
  const failedCount = (rows ?? []).filter((r) => r.status === "failed").length;
  const refundedCount = (rows ?? []).filter((r) => r.status === "refunded").length;
  const avgOrderValue = paid.length > 0 ? totalRevenue / paid.length : 0;

  return (
    <div>
      <Topbar title="Payments" />
      <div className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Revenue" value={`₦${totalRevenue.toLocaleString()}`} icon={<Wallet />} />
          <StatCard label="Today's Revenue" value={`₦${todaysRevenue.toLocaleString()}`} icon={<CalendarDays />} />
          <StatCard label="This Month" value={`₦${monthRevenue.toLocaleString()}`} icon={<CalendarRange />} />
          <StatCard label="Average Order Value" value={`₦${Math.round(avgOrderValue).toLocaleString()}`} icon={<Receipt />} />
          <StatCard label="Successful Payments" value={paid.length} icon={<CheckCircle2 />} />
          <StatCard label="Pending Payments" value={pendingCount} icon={<Clock />} />
          <StatCard label="Failed Payments" value={failedCount} icon={<XCircle />} />
          <StatCard label="Refunded Payments" value={refundedCount} icon={<Undo2 />} />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap gap-1 bg-card border border-border rounded-md p-1 w-fit">
            {[
              { label: "All", value: "" },
              { label: "Paid", value: "paid" },
              { label: "Pending", value: "pending" },
              { label: "Failed", value: "failed" },
              { label: "Refunded", value: "refunded" },
            ].map((f) => (
              <a
                key={f.value}
                href={f.value ? `/payments?status=${f.value}` : "/payments"}
                className={`px-3 py-1.5 text-sm rounded-md capitalize transition-colors ${
                  (status ?? "") === f.value ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {f.label}
              </a>
            ))}
          </div>
          <ExportPaymentsButton rows={payments} />
        </div>

        <div className="bg-card border border-border rounded-lg overflow-x-auto">
          <PaymentsTable payments={payments} />
        </div>
      </div>
    </div>
  );
}
