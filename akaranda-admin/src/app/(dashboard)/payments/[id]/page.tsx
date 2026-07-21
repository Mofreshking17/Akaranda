import Link from "next/link";
import { notFound } from "next/navigation";
import { requireModule } from "@/lib/guard";
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/layout/Topbar";
import { Badge } from "@/components/ui/badge";
import { formatNaira, formatDate } from "@/lib/utils";
import { AutoPrint, PrintButton, VerifyAgainButton, RefundButton } from "@/components/payments/PaymentDetailActions";

export default async function PaymentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ print?: string }>;
}) {
  await requireModule("payments");
  const { id } = await params;
  const { print } = await searchParams;
  const supabase = await createClient();

  const { data: payment } = await supabase.from("payments").select("*").eq("id", id).single();
  if (!payment) notFound();

  const { data: order } = await supabase.from("orders").select("*").eq("id", payment.order_id).maybeSingle();

  const authorization = (payment.authorization ?? {}) as Record<string, unknown>;

  return (
    <div>
      <AutoPrint shouldPrint={print === "1"} />
      <Topbar title={`Payment — ${payment.reference}`} />
      <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6 print:p-0">
        <div className="flex flex-wrap gap-2 justify-end print:hidden">
          <VerifyAgainButton paymentId={payment.id} />
          <PrintButton />
          <RefundButton paymentId={payment.id} disabled={payment.status !== "paid"} />
        </div>

        <section className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-foreground">AKARANDA Fashion</h2>
            <Badge variant={payment.status === "paid" ? "default" : payment.status === "failed" ? "destructive" : "secondary"} className="capitalize">
              {payment.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Payment Receipt</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-4 border-t border-border">
            <p><span className="text-muted-foreground">Order Number:</span> {order?.order_number ?? "—"}</p>
            <p><span className="text-muted-foreground">Customer:</span> {order?.customer_name ?? "—"}</p>
            <p><span className="text-muted-foreground">Amount:</span> {formatNaira(payment.amount)} {payment.currency}</p>
            <p><span className="text-muted-foreground">Gateway:</span> <span className="capitalize">{payment.gateway}</span></p>
            <p><span className="text-muted-foreground">Payment Method:</span> {payment.payment_method ?? "—"}</p>
            <p><span className="text-muted-foreground">Transaction ID:</span> {payment.transaction_id ?? "—"}</p>
            <p className="sm:col-span-2"><span className="text-muted-foreground">Reference:</span> <span className="font-mono">{payment.reference}</span></p>
            <p><span className="text-muted-foreground">Paid At:</span> {payment.paid_at ? formatDate(payment.paid_at) : "—"}</p>
            <p><span className="text-muted-foreground">Created At:</span> {formatDate(payment.created_at)}</p>
            {payment.status === "refunded" && (
              <>
                <p><span className="text-muted-foreground">Refunded At:</span> {payment.refunded_at ? formatDate(payment.refunded_at) : "—"}</p>
                <p className="sm:col-span-2"><span className="text-muted-foreground">Refund Reason:</span> {payment.refund_reason ?? "—"}</p>
              </>
            )}
          </div>

          {payment.gateway_response && (
            <p className="text-xs text-muted-foreground pt-2 border-t border-border">Gateway response: {payment.gateway_response}</p>
          )}

          {Object.keys(authorization).length > 0 && (
            <div className="pt-4 border-t border-border">
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">Authorization (for future reuse)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {"card_type" in authorization && <p><span className="text-muted-foreground">Card:</span> {String(authorization.card_type)} •••• {String(authorization.last4 ?? "")}</p>}
                {"bank" in authorization && <p><span className="text-muted-foreground">Bank:</span> {String(authorization.bank)}</p>}
                {"reusable" in authorization && <p><span className="text-muted-foreground">Reusable:</span> {String(authorization.reusable)}</p>}
              </div>
            </div>
          )}
        </section>

        {order && (
          <section className="bg-card border border-border rounded-lg p-4 md:p-6 print:hidden">
            <h3 className="font-medium text-foreground mb-3">Related Order</h3>
            <div className="flex items-center justify-between text-sm">
              <span>{order.order_number} — {order.customer_name}</span>
              <Link href={`/orders/${order.id}`} className="text-primary hover:underline">View Order →</Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
