import { notFound } from "next/navigation";
import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import OrderStatusSelect from "@/components/orders/OrderStatusSelect";
import { formatNaira, formatDate } from "@/lib/utils";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireModule("orders");
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: order }, { data: items }, { data: history }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).single(),
    supabase.from("order_items").select("*").eq("order_id", id),
    supabase.from("order_status_history").select("*").eq("order_id", id).order("created_at", { ascending: false }),
  ]);

  if (!order) notFound();

  return (
    <div>
      <Topbar title={`Order ${order.order_number}`} />
      <div className="p-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="font-medium text-neutral-900 mb-4">Products Purchased</h3>
            <div className="divide-y divide-neutral-100">
              {(items ?? []).map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-neutral-800">{item.product_name}</p>
                    <p className="text-neutral-400 text-xs">
                      {item.selected_size && `Size: ${item.selected_size}`}
                      {item.selected_colour && ` · Colour: ${item.selected_colour}`} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">{formatNaira(item.line_total)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-200 mt-4 pt-4 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-neutral-500">Subtotal</span><span>{formatNaira(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Delivery Fee</span><span>{formatNaira(order.delivery_fee)}</span></div>
              <div className="flex justify-between font-medium text-base pt-1"><span>Total</span><span>{formatNaira(order.total)}</span></div>
            </div>
          </section>

          <section className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="font-medium text-neutral-900 mb-4">Status History</h3>
            <div className="space-y-2">
              {(history ?? []).map((h) => (
                <div key={h.id} className="flex justify-between text-sm border-b border-neutral-100 pb-2 last:border-0">
                  <span className="capitalize">{h.status.replace(/_/g, " ")}</span>
                  <span className="text-neutral-400">{formatDate(h.created_at)}</span>
                </div>
              ))}
              {(history ?? []).length === 0 && <p className="text-sm text-neutral-400">No status changes yet.</p>}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="font-medium text-neutral-900 mb-3">Order Status</h3>
            <OrderStatusSelect orderId={order.id} status={order.status} />
            <p className="text-xs text-neutral-400 mt-2">Customer is notified by email when status changes.</p>
          </section>

          <section className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="font-medium text-neutral-900 mb-3">Customer Information</h3>
            <div className="space-y-1.5 text-sm">
              <p><span className="text-neutral-500">Name:</span> {order.customer_name}</p>
              {order.customer_phone && <p><span className="text-neutral-500">Phone:</span> {order.customer_phone}</p>}
              {order.customer_email && <p><span className="text-neutral-500">Email:</span> {order.customer_email}</p>}
              {order.delivery_address && <p><span className="text-neutral-500">Address:</span> {order.delivery_address}</p>}
            </div>
          </section>

          <section className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="font-medium text-neutral-900 mb-3">Payment</h3>
            <p className="text-sm capitalize">{order.payment_status}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
