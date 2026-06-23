"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateCustomerNotes } from "@/app/(dashboard)/customers/actions";

export default function CustomerNotes({ customerId, initialNotes }: { customerId: string; initialNotes: string }) {
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await updateCustomerNotes(customerId, notes);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal notes about this customer..." />
      <Button size="sm" onClick={save} disabled={saving}>
        {saving ? "Saving..." : saved ? "Saved ✓" : "Save Notes"}
      </Button>
    </div>
  );
}
