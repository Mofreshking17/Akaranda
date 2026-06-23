"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { AdminRole, Profile } from "@/lib/types/database";
import { toggleTeamMemberActive, updateTeamMemberRole } from "@/app/(dashboard)/team/actions";

export default function TeamTable({ members, currentUserId }: { members: Profile[]; currentUserId: string }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function run(id: string, fn: () => Promise<void>) {
    setBusyId(id);
    try {
      await fn();
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Active</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((m) => (
          <TableRow key={m.id}>
            <TableCell className="font-medium">{m.full_name}{m.id === currentUserId && " (You)"}</TableCell>
            <TableCell className="text-sm text-neutral-500">{m.email}</TableCell>
            <TableCell>
              <Select
                defaultValue={m.role}
                disabled={busyId === m.id || m.id === currentUserId}
                onValueChange={(v) => v && run(m.id, () => updateTeamMemberRole(m.id, v as AdminRole))}
              >
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="content_manager">Content Manager</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Switch
                checked={m.is_active}
                disabled={busyId === m.id || m.id === currentUserId}
                onCheckedChange={(v) => run(m.id, () => toggleTeamMemberActive(m.id, v))}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
