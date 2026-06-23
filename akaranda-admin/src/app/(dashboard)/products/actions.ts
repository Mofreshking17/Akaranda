"use server";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { productSchema, type ProductFormValues } from "@/lib/validation/product";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(values: ProductFormValues, imageUrls: string[]) {
  const profile = await requireProfile();
  const parsed = productSchema.parse(values);
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .insert({ ...parsed, category_id: parsed.category_id || null, created_by: profile.id })
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (imageUrls.length > 0) {
    await supabase.from("product_images").insert(
      imageUrls.map((url, i) => ({ product_id: product.id, url, sort_order: i }))
    );
  }

  await logActivity({
    actorId: profile.id,
    actorName: profile.full_name,
    action: "product.created",
    entityType: "product",
    entityId: product.id,
    details: { name: product.name },
  });

  revalidatePath("/products");
  redirect("/products");
}

export async function updateProduct(id: string, values: ProductFormValues, imageUrls: string[]) {
  const profile = await requireProfile();
  const parsed = productSchema.parse(values);
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({ ...parsed, category_id: parsed.category_id || null })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await supabase.from("product_images").delete().eq("product_id", id);
  if (imageUrls.length > 0) {
    await supabase.from("product_images").insert(
      imageUrls.map((url, i) => ({ product_id: id, url, sort_order: i }))
    );
  }

  await logActivity({
    actorId: profile.id,
    actorName: profile.full_name,
    action: "product.updated",
    entityType: "product",
    entityId: id,
    details: { name: parsed.name },
  });

  revalidatePath("/products");
  redirect("/products");
}

export async function deleteProduct(id: string) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logActivity({ actorId: profile.id, actorName: profile.full_name, action: "product.deleted", entityType: "product", entityId: id });
  revalidatePath("/products");
}

export async function archiveProduct(id: string, archived: boolean) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ status: archived ? "archived" : "draft" }).eq("id", id);
  if (error) throw new Error(error.message);

  await logActivity({ actorId: profile.id, actorName: profile.full_name, action: archived ? "product.archived" : "product.unarchived", entityType: "product", entityId: id });
  revalidatePath("/products");
}

export async function toggleFeatureProduct(id: string, featured: boolean) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ is_featured: featured }).eq("id", id);
  if (error) throw new Error(error.message);

  await logActivity({ actorId: profile.id, actorName: profile.full_name, action: featured ? "product.featured" : "product.unfeatured", entityType: "product", entityId: id });
  revalidatePath("/products");
}

export async function duplicateProduct(id: string) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: original, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error || !original) throw new Error(error?.message ?? "Product not found");

  const { id: _id, created_at: _createdAt, updated_at: _updatedAt, ...rest } = original;
  const copy = {
    ...rest,
    name: `${original.name} (Copy)`,
    slug: `${original.slug}-copy-${Date.now()}`,
    sku: original.sku ? `${original.sku}-COPY` : null,
    status: "draft" as const,
    created_by: profile.id,
  };

  const { data: newProduct, error: insertError } = await supabase.from("products").insert(copy).select().single();
  if (insertError) throw new Error(insertError.message);

  const { data: images } = await supabase.from("product_images").select("url, sort_order").eq("product_id", id);
  if (images && images.length > 0) {
    await supabase.from("product_images").insert(
      images.map((img) => ({ product_id: newProduct.id, url: img.url, sort_order: img.sort_order }))
    );
  }

  await logActivity({ actorId: profile.id, actorName: profile.full_name, action: "product.duplicated", entityType: "product", entityId: newProduct.id, details: { from: id } });
  revalidatePath("/products");
}
