"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { formatNaira, formatDate } from "@/lib/utils";
import { verifyPaymentAgain } from "@/app/(dashboard)/payments/actions";
import type { PaymentStatus } from "@/lib/types/database";

export interface PaymentRow {
  id: string;
  order_id: string;
  customer_id: string | null;
  order_number: string;
  customer_name: string;
  amount: number;
  status: PaymentStatus;
  gateway: string;
  reference: string;
  created_at: string;
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  paid: "default",
  pending: "secondary",
  unpaid: "secondary",
  failed: "destructive",
  refunded: "outline",
};

export default function PaymentsTable({ payments }: { payments: PaymentRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleVerifyAgain(id: string) {
    setBusyId(id);
    try {
      const res = await verifyPaymentAgain(id);
      toast.success(`Verification result: ${res.status}`);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setBusyId(null);
    }
  }

  function copyReference(reference: string) {
    navigator.clipboard.writeText(reference);
    toast.success("Reference copied to clipboard");
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order Number</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payment Status</TableHead>
          <TableHead>Gateway</TableHead>
          <TableHead>Transaction Reference</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-medium text-foreground">{p.order_number}</TableCell>
            <TableCell>{p.customer_name}</TableCell>
            <TableCell>{formatNaira(p.amount)}</TableCell>
            <TableCell><Badge variant={STATUS_VARIANT[p.status]} className="capitalize">{p.status}</Badge></TableCell>
            <TableCell className="capitalize">{p.gateway}</TableCell>
            <TableCell className="font-mono text-xs">{p.reference}</TableCell>
            <TableCell>{formatDate(p.created_at)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger
                  disabled={busyId === p.id}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted disabled:opacity-50"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push(`/payments/${p.id}`)}>View Details</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleVerifyAgain(p.id)}>Verify Again</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.open(`/payments/${p.id}?print=1`, "_blank")}>Print Receipt</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyReference(p.reference)}>Copy Reference</DropdownMenuItem>
                  {p.customer_id && (
                    <DropdownMenuItem onClick={() => router.push(`/customers/${p.customer_id}`)}>View Customer</DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => router.push(`/orders/${p.order_id}`)}>View Order</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
        {payments.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
              No payments yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
