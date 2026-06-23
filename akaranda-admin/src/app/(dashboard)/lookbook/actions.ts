"use server";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ProductCollection, MediaKind } from "@/lib/types/database";

export async function createLookbookCollection(values: {
  title: string;
  collection_group: ProductCollection;
  description: string;
  is_featured: boolean;
  is_published: boolean;
}, items: { url: string; kind: MediaKind; caption?: string }[]) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: collection, error } = await supabase
    .from("lookbook_collections")
    .insert({
      title: values.title,
      slug: `${slugify(values.title)}-${Date.now().toString(36)}`,
      collection_group: values.collection_group,
      description: values.description || null,
      cover_image: items[0]?.url ?? null,
      is_featured: values.is_featured,
      is_published: values.is_published,
      created_by: profile.id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (items.length > 0) {
    await supabase.from("lookbook_items").insert(
      items.map((item, i) => ({ collection_id: collection.id, url: item.url, kind: item.kind, caption: item.caption ?? null, sort_order: i }))
    );
  }

  await logActivity({ actorId: profile.id, actorName: profile.full_name, action: "lookbook.created", entityType: "lookbook_collection", entityId: collection.id, details: { title: values.title } });
  revalidatePath("/lookbook");
  redirect("/lookbook");
}

export async function togglePublishCollection(id: string, published: boolean) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("lookbook_collections").update({ is_published: published }).eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity({ actorId: profile.id, actorName: profile.full_name, action: published ? "lookbook.published" : "lookbook.unpublished", entityType: "lookbook_collection", entityId: id });
  revalidatePath("/lookbook");
}

export async function toggleFeatureCollection(id: string, featured: boolean) {
  await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("lookbook_collections").update({ is_featured: featured }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/lookbook");
}

export async function deleteLookbookCollection(id: string) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("lookbook_collections").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity({ actorId: profile.id, actorName: profile.full_name, action: "lookbook.deleted", entityType: "lookbook_collection", entityId: id });
  revalidatePath("/lookbook");
}
