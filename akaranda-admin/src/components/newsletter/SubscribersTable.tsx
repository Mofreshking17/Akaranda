"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { deleteSubscriber } from "@/app/(dashboard)/newsletter/actions";
import type { NewsletterSubscriber } from "@/lib/types/database";

export default function SubscribersTable({ subscribers }: { subscribers: NewsletterSubscriber[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function remove(id: string, email: string) {
    if (!confirm(`Remove ${email} from the list?`)) return;
    setBusyId(id);
    try {
      await deleteSubscriber(id);
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Subscribed</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscribers.map((s) => (
          <TableRow key={s.id}>
            <TableCell>{s.email}</TableCell>
            <TableCell>{s.full_name ?? "—"}</TableCell>
            <TableCell className="text-sm text-neutral-500">{formatDate(s.subscribed_at)}</TableCell>
            <TableCell>
              <button onClick={() => remove(s.id, s.email)} disabled={busyId === s.id} className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </TableCell>
          </TableRow>
        ))}
        {subscribers.length === 0 && (
          <TableRow><TableCell colSpan={4} className="text-center text-neutral-400 py-10">No subscribers yet.</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  );
}
