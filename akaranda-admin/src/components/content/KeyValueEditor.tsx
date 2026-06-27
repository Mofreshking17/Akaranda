"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveSiteContent } from "@/app/(dashboard)/content/actions";

export default function KeyValueEditor({
  section,
  contentKey,
  title,
  fields,
  initialValue,
}: {
  section: string;
  contentKey: string;
  title: string;
  fields: { name: string; label: string; multiline?: boolean }[];
  initialValue: Record<string, string>;
}) {
  const [values, setValues] = useState<Record<string, string>>(initialValue);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await saveSiteContent(section, contentKey, values);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h3 className="font-medium text-foreground">{title}</h3>
      {fields.map((f) => (
        <div key={f.name}>
          <Label>{f.label}</Label>
          {f.multiline ? (
            <Textarea rows={5} value={values[f.name] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))} />
          ) : (
            <Input value={values[f.name] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))} />
          )}
        </div>
      ))}
      <Button size="sm" onClick={save} disabled={saving}>
        {saving ? "Saving..." : saved ? "Saved âœ“" : "Save Changes"}
      </Button>
    </section>
  );
}
