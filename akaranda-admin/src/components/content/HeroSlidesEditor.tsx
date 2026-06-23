"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MediaPicker from "@/components/media/MediaPicker";
import { saveSiteContent } from "@/app/(dashboard)/content/actions";

interface Slide {
  image: string;
  tag: string;
  headline: string;
  sub: string;
}

export default function HeroSlidesEditor({ slides }: { slides: Record<string, Slide> }) {
  const [data, setData] = useState<Record<string, Slide>>(slides);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  function update(key: string, field: keyof Slide, value: string) {
    setData((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  }

  async function save(key: string) {
    setSavingKey(key);
    try {
      await saveSiteContent("homepage_hero", key, data[key]);
    } finally {
      setSavingKey(null);
    }
  }

  const keys = ["slide_1", "slide_2", "slide_3"];

  return (
    <div className="space-y-6">
      {keys.map((key, i) => {
        const slide = data[key] ?? { image: "", tag: "", headline: "", sub: "" };
        return (
          <section key={key} className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
            <h3 className="font-medium text-neutral-900">Slide {i + 1}</h3>
            <div>
              <Label>Slide Image</Label>
              <MediaPicker selected={slide.image ? [slide.image] : []} onChange={(urls) => update(key, "image", urls.slice(-1)[0] ?? "")} folder="hero" />
            </div>
            <div>
              <Label>Tag</Label>
              <Input value={slide.tag} onChange={(e) => update(key, "tag", e.target.value)} />
            </div>
            <div>
              <Label>Headline</Label>
              <Textarea rows={2} value={slide.headline} onChange={(e) => update(key, "headline", e.target.value)} />
            </div>
            <div>
              <Label>Subtext</Label>
              <Textarea rows={2} value={slide.sub} onChange={(e) => update(key, "sub", e.target.value)} />
            </div>
            <Button size="sm" onClick={() => save(key)} disabled={savingKey === key}>
              {savingKey === key ? "Saving..." : "Save Slide"}
            </Button>
          </section>
        );
      })}
    </div>
  );
}
