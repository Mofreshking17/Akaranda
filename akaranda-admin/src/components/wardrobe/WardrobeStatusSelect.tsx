"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { WardrobeStatus } from "@/lib/types/database";
import { updateWardrobeStatus } from "@/app/(dashboard)/wardrobe/actions";

const STATUSES: WardrobeStatus[] = ["new_request", "in_review", "styling", "ready", "delivered"];

export default function WardrobeStatusSelect({ requestId, status }: { requestId: string; status: WardrobeStatus }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function change(value: string | null) {
    if (!value) return;
    setBusy(true);
    try {
      await updateWardrobeStatus(requestId, value as WardrobeStatus);
      router.refresh();
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
