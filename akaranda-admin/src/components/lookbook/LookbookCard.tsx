"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { LookbookCollection } from "@/lib/types/database";
import { deleteLookbookCollection, toggleFeatureCollection, togglePublishCollection } from "@/app/(dashboard)/lookbook/actions";

export default function LookbookCard({ collection }: { collection: LookbookCollection }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    try {
      await fn();
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="relative h-40 bg-muted">
        {collection.cover_image && <Image src={collection.cover_image} alt={collection.title} fill className="object-cover" />}
        {collection.is_featured && <Star className="absolute top-2 right-2 w-5 h-5 text-amber-400 fill-amber-400" />}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <p className="font-medium text-foreground">{collection.title}</p>
          <Badge variant="outline" className="capitalize mt-1">{collection.collection_group}</Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Published</span>
          <Switch checked={collection.is_published} disabled={busy} onCheckedChange={(v) => run(() => togglePublishCollection(collection.id, v))} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Featured</span>
          <Switch checked={collection.is_featured} disabled={busy} onCheckedChange={(v) => run(() => toggleFeatureCollection(collection.id, v))} />
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 w-full justify-start px-0"
          disabled={busy}
          onClick={() => {
            if (confirm(`Delete "${collection.title}"?`)) run(() => deleteLookbookCollection(collection.id));
          }}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
        </Button>
      </div>
    </div>
  );
}
