import { notFound } from "next/navigation";
import Link from "next/link";
import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import CustomerNotes from "@/components/customers/CustomerNotes";
import { Badge } from "@/components/ui/badge";
import { formatNaira, formatDate } from "@/lib/utils";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireModule("customers");
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: customer }, { data: orders }, { data: wishlist }, { data: wardrobeRequests }] = await Promise.all([
    supabase.from("customers").select("*").eq("id", id).single(),
    supabase.from("orders").select("*").eq("customer_id", id).order("created_at", { ascending: false }),
    supabase.from("wishlists").select("*, products(name, price, slug)").eq("customer_id", id),
    supabase.from("wardrobe_requests").select("*").eq("customer_id", id).order("created_at", { ascending: false }),
  ]);

  if (!customer) notFound();

  return (
    <div>
      <Topbar title={customer.full_name} />
      <div className="p-4 md:p-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
            <h3 className="font-medium text-neutral-900 mb-4">Order History</h3>
            <div className="divide-y divide-neutral-100">
              {(orders ?? []).map((o) => (
                <Link key={o.id} href={`/orders/${o.id}`} className="py-3 flex flex-wrap items-center justify-between gap-2 text-sm hover:bg-neutral-50 -mx-2 px-2 rounded">
                  <div>
                    <p className="font-medium text-neutral-800">{o.order_number}</p>
                    <p className="text-neutral-400 text-xs">{formatDate(o.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="capitalize">{o.status.replace(/_/g, " ")}</Badge>
                    <span className="font-medium">{formatNaira(o.total)}</span>
                  </div>
                </Link>
              ))}
              {(orders ?? []).length === 0 && <p className="text-sm text-neutral-400">No orders yet.</p>}
            </div>
          </section>

          <section className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
            <h3 className="font-medium text-neutral-900 mb-4">Wishlist</h3>
            <div className="divide-y divide-neutral-100">
              {(wishlist ?? []).map((w) => {
                const product = w.products as unknown as { name: string; price: number; slug: string } | null;
                return (
                  <div key={w.id} className="py-2.5 flex items-center justify-between text-sm">
                    <span>{product?.name ?? "Unknown product"}</span>
                    <span className="text-neutral-500">{product ? formatNaira(product.price) : ""}</span>
                  </div>
                );
              })}
              {(wishlist ?? []).length === 0 && <p className="text-sm text-neutral-400">Wishlist is empty.</p>}
            </div>
          </section>

          <section className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
            <h3 className="font-medium text-neutral-900 mb-4">Wardrobe Service Requests</h3>
            <div className="divide-y divide-neutral-100">
              {(wardrobeRequests ?? []).map((w) => (
                <Link key={w.id} href={`/wardrobe/${w.id}`} className="py-2.5 flex flex-wrap items-center justify-between gap-2 text-sm hover:bg-neutral-50 -mx-2 px-2 rounded">
                  <span className="capitalize">{w.type} Wardrobe — {w.occasion ?? "General"}</span>
                  <Badge variant="outline" className="capitalize">{w.status.replace(/_/g, " ")}</Badge>
                </Link>
              ))}
              {(wardrobeRequests ?? []).length === 0 && <p className="text-sm text-neutral-400">No wardrobe requests yet.</p>}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
            <h3 className="font-medium text-neutral-900 mb-3">Profile</h3>
            <div className="space-y-1.5 text-sm">
              {customer.email && <p><span className="text-neutral-500">Email:</span> {customer.email}</p>}
              {customer.phone && <p><span className="text-neutral-500">Phone:</span> {customer.phone}</p>}
              {customer.whatsapp_number && <p><span className="text-neutral-500">WhatsApp:</span> {customer.whatsapp_number}</p>}
              {customer.address && <p><span className="text-neutral-500">Address:</span> {customer.address}, {customer.city}, {customer.state}</p>}
            </div>
          </section>

          <section className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
            <h3 className="font-medium text-neutral-900 mb-1">Total Spend</h3>
            <p className="text-2xl font-semibold text-neutral-900">{formatNaira(customer.total_spend)}</p>
          </section>

          <section className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
            <h3 className="font-medium text-neutral-900 mb-3">Customer Notes</h3>
            <CustomerNotes customerId={customer.id} initialNotes={customer.notes ?? ""} />
          </section>
        </div>
      </div>
    </div>
  );
}
