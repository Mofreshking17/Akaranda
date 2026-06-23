"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import MediaPicker from "@/components/media/MediaPicker";
import { saveSetting } from "@/app/(dashboard)/settings/actions";

export default function BrandSettingsForm({
  initialValue,
}: {
  initialValue: { name?: string; tagline?: string; logo_url?: string };
}) {
  const [name, setName] = useState(initialValue.name ?? "");
  const [tagline, setTagline] = useState(initialValue.tagline ?? "");
  const [logo, setLogo] = useState<string[]>(initialValue.logo_url ? [initialValue.logo_url] : []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await saveSetting("brand", { name, tagline, logo_url: logo[0] ?? "" });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
      <h3 className="font-medium text-neutral-900">Brand Information</h3>
      <div>
        <Label>Brand Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label>Tagline</Label>
        <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
      </div>
      <div>
        <Label>Logo</Label>
        <MediaPicker selected={logo} onChange={(urls) => setLogo(urls.slice(-1))} folder="branding" />
      </div>
      <Button size="sm" onClick={save} disabled={saving}>
        {saving ? "Saving..." : saved ? "Saved ✓" : "Save Brand Settings"}
      </Button>
    </section>
  );
}
