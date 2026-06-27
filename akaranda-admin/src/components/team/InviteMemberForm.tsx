"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { AdminRole } from "@/lib/types/database";
import { inviteTeamMember } from "@/app/(dashboard)/team/actions";
import { useRouter } from "next/navigation";

export default function InviteMemberForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<AdminRole>("content_manager");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await inviteTeamMember(email, fullName, role);
      setEmail("");
      setFullName("");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h3 className="font-medium text-foreground">Invite Team Member</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Full Name</Label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label>Role</Label>
          <Select value={role} onValueChange={(v) => v && setRole(v as AdminRole)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="content_manager">Content Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" disabled={submitting}>{submitting ? "Sending Invite..." : "Send Invite"}</Button>
    </form>
  );
}
