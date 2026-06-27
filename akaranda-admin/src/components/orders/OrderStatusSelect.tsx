"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { OrderStatus } from "@/lib/types/database";
import { updateOrderStatus } from "@/app/(dashboard)/orders/actions";

const STATUSES: OrderStatus[] = ["pending", "paid", "processing", "ready_for_delivery", "delivered", "cancelled"];

export default function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function change(value: string | null) {
    if (!value) return;
    setBusy(true);
    try {
      await updateOrderStatus(orderId, value as OrderStatus);
      toast.success(`Order marked as ${value.replace(/_/g, " ")}`);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update order");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Select defaultValue={status} onValueChange={change} disabled={busy}>
      <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, " ")}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
