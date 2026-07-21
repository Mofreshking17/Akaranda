"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import MediaPicker from "@/components/media/MediaPicker";
import type { ProductCollection } from "@/lib/types/database";

export default function LookbookForm({
  onSubmit,
}: {
  onSubmit: (
    values: { title: string; collection_group: ProductCollection; description: string; is_featured: boolean; is_published: boolean },
    images: string[]
  ) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [collectionGroup, setCollectionGroup] = useState<ProductCollection>("kids");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ title, collection_group: collectionGroup, description, is_featured: featured, is_published: published }, images);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <section className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
        <div>
          <Label>Collection Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="AKARANDA Kids â€” Summer 2025" />
        </div>
        <div>
          <Label>Collection Group</Label>
          <Select value={collectionGroup} onValueChange={(v) => v && setCollectionGroup(v as ProductCollection)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="kids">AKARANDA Kids</SelectItem>
              <SelectItem value="chics">AKARANDA Chics</SelectItem>
              <SelectItem value="family">Family Collection</SelectItem>
              <SelectItem value="seasonal">Seasonal Collection</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Description</Label>
          <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </section>

      <section className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
        <h3 className="font-medium text-foreground">Gallery Images & Videos</h3>
        <MediaPicker selected={images} onChange={setImages} folder="lookbook" />
      </section>

      <section className="bg-card border border-border rounded-lg p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center justify-between border border-border rounded-md px-4 py-3">
          <Label>Feature Collection</Label>
          <Switch checked={featured} onCheckedChange={setFeatured} />
        </div>
        <div className="flex items-center justify-between border border-border rounded-md px-4 py-3">
          <Label>Publish Now</Label>
          <Switch checked={published} onCheckedChange={setPublished} />
        </div>
      </section>

      <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Create Collection"}</Button>
    </form>
  );
}
