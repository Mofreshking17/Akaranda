"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateWardrobeNotes } from "@/app/(dashboard)/wardrobe/actions";

export default function WardrobeNotes({
  requestId,
  initialAdminNotes,
  initialInternalNotes,
}: {
  requestId: string;
  initialAdminNotes: string;
  initialInternalNotes: string;
}) {
  const [adminNotes, setAdminNotes] = useState(initialAdminNotes);
  const [internalNotes, setInternalNotes] = useState(initialInternalNotes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await updateWardrobeNotes(requestId, adminNotes, internalNotes);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-1.5">Admin Notes (visible to admin team)</Label>
        <Textarea rows={3} value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} />
      </div>
      <div>
        <Label className="mb-1.5">Internal Team Notes (private)</Label>
        <Textarea rows={3} value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} />
      </div>
      <Button size="sm" onClick={save} disabled={saving}>
        {saving ? "Saving..." : saved ? "Saved ✓" : "Save Notes"}
      </Button>
    </div>
  );
}
