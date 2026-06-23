import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import Topbar from "@/components/layout/Topbar";
import StatCard from "@/components/dashboard/StatCard";
import { OrdersByMonthChart, ProductsByCategoryChart, WardrobeRequestsChart } from "@/components/dashboard/Charts";
import { Package, ShoppingBag, AlertTriangle, Receipt, Clock, Wallet, Mail, Shirt } from "lucide-react";

export default async function DashboardPage() {
  await requireModule("dashboard");
  const supabase = await createClient();

  const [
    { count: totalProducts },
    { count: activeProducts },
    { count: lowStockProducts },
    { count: totalOrders },
    { count: pendingOrders },
    { count: subscribers },
    { count: wardrobeRequests },
    { data: recentActivity },
    { data: orders },
    { data: products },
    { data: wardrobe },
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("products").select("id", { count: "exact", head: true }).lt("stock_quantity", 5),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("wardrobe_requests").select("id", { count: "exact", head: true }),
    supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(8),
    supabase.from("orders").select("created_at"),
    supabase.from("products").select("category_id, categories(name)"),
    supabase.from("wardrobe_requests").select("status"),
  ]);

  const monthMap = new Map<string, number>();
  (orders ?? []).forEach((o) => {
    const m = new Date(o.created_at).toLocaleString("en-US", { month: "short", year: "2-digit" });
    monthMap.set(m, (monthMap.get(m) ?? 0) + 1);
  });
  const ordersByMonth = Array.from(monthMap.entries()).map(([month, orders]) => ({ month, orders }));

  const catMap = new Map<string, number>();
  (products ?? []).forEach((p: { categories: { name: string }[] | { name: string } | null }) => {
    const cat = Array.isArray(p.categories) ? p.categories[0] : p.categories;
    const name = cat?.name ?? "Uncategorised";
    catMap.set(name, (catMap.get(name) ?? 0) + 1);
  });
  const productsByCategory = Array.from(catMap.entries()).map(([category, count]) => ({ category, count }));

  const statusMap = new Map<string, number>();
  (wardrobe ?? []).forEach((w) => {
    statusMap.set(w.status, (statusMap.get(w.status) ?? 0) + 1);
  });
  const wardrobeByStatus = Array.from(statusMap.entries()).map(([status, count]) => ({ status, count }));

  return (
    <div>
      <Topbar title="Dashboard Overview" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Products" value={totalProducts ?? 0} icon={ShoppingBag} />
          <StatCard label="Active Products" value={activeProducts ?? 0} icon={Package} hint="Published" />
          <StatCard label="Low Stock" value={lowStockProducts ?? 0} icon={AlertTriangle} hint="Under 5 units" />
          <StatCard label="Total Orders" value={totalOrders ?? 0} icon={Receipt} />
          <StatCard label="Pending Orders" value={pendingOrders ?? 0} icon={Clock} />
          <StatCard label="Revenue" value="₦ —" icon={Wallet} hint="Connect payment provider" />
          <StatCard label="Newsletter Subscribers" value={subscribers ?? 0} icon={Mail} />
          <StatCard label="Wardrobe Requests" value={wardrobeRequests ?? 0} icon={Shirt} />
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="bg-white border border-neutral-200 rounded-lg p-5 lg:col-span-1">
            <p className="text-sm font-medium text-neutral-800 mb-2">Orders By Month</p>
            <OrdersByMonthChart data={ordersByMonth} />
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-5 lg:col-span-1">
            <p className="text-sm font-medium text-neutral-800 mb-2">Products By Category</p>
            <ProductsByCategoryChart data={productsByCategory} />
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-5 lg:col-span-1">
            <p className="text-sm font-medium text-neutral-800 mb-2">Wardrobe Requests</p>
            <WardrobeRequestsChart data={wardrobeByStatus} />
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <p className="text-sm font-medium text-neutral-800 mb-4">Recent Activity</p>
          <div className="space-y-3">
            {(recentActivity ?? []).length === 0 && (
              <p className="text-sm text-neutral-400">No activity yet.</p>
            )}
            {(recentActivity ?? []).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between text-sm border-b border-neutral-100 pb-2 last:border-0 last:pb-0">
                <span className="text-neutral-700">
                  <span className="font-medium">{entry.actor_name ?? "System"}</span> {entry.action.replace(/_/g, " ")}
                </span>
                <span className="text-neutral-400 text-xs">{formatDate(entry.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
