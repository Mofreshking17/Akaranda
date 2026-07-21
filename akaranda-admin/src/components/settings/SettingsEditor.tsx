"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { saveSetting } from "@/app/(dashboard)/settings/actions";

export default function SettingsEditor({
  settingKey,
  title,
  fields,
  initialValue,
}: {
  settingKey: string;
  title: string;
  fields: { name: string; label: string; type?: string; placeholder?: string }[];
  initialValue: Record<string, string | number>;
}) {
  const [values, setValues] = useState<Record<string, string | number>>(initialValue);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await saveSetting(settingKey, values);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
      <h3 className="font-medium text-foreground">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.name}>
            <Label>{f.label}</Label>
            <Input
              type={f.type ?? "text"}
              placeholder={f.placeholder}
              value={values[f.name] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
            />
          </div>
        ))}
      </div>
      <Button size="sm" onClick={save} disabled={saving}>
        {saving ? "Saving..." : saved ? "Saved âœ“" : "Save"}
      </Button>
    </section>
  );
}
