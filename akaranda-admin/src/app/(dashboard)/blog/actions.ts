"use server";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { blogPostSchema, type BlogPostFormValues } from "@/lib/validation/blog";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBlogPost(values: BlogPostFormValues) {
  const profile = await requireProfile();
  const parsed = blogPostSchema.parse(values);
  const supabase = await createClient();

  const published_at = parsed.status === "published" ? new Date().toISOString() : null;

  const { data: post, error } = await supabase
    .from("blog_posts")
    .insert({
      ...parsed,
      category_id: parsed.category_id || null,
      scheduled_for: parsed.scheduled_for || null,
      featured_image: parsed.featured_image || null,
      author_id: profile.id,
      published_at,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logActivity({ actorId: profile.id, actorName: profile.full_name, action: "blog.created", entityType: "blog_post", entityId: post.id, details: { title: post.title } });
  revalidatePath("/blog");
  redirect("/blog");
}

export async function updateBlogPost(id: string, values: BlogPostFormValues) {
  const profile = await requireProfile();
  const parsed = blogPostSchema.parse(values);
  const supabase = await createClient();

  const { data: existing } = await supabase.from("blog_posts").select("status, published_at").eq("id", id).single();
  const published_at = parsed.status === "published" ? (existing?.published_at ?? new Date().toISOString()) : existing?.published_at ?? null;

  const { error } = await supabase
    .from("blog_posts")
    .update({
      ...parsed,
      category_id: parsed.category_id || null,
      scheduled_for: parsed.scheduled_for || null,
      featured_image: parsed.featured_image || null,
      published_at,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await logActivity({ actorId: profile.id, actorName: profile.full_name, action: "blog.updated", entityType: "blog_post", entityId: id, details: { title: parsed.title } });
  revalidatePath("/blog");
  redirect("/blog");
}

export async function deleteBlogPost(id: string) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity({ actorId: profile.id, actorName: profile.full_name, action: "blog.deleted", entityType: "blog_post", entityId: id });
  revalidatePath("/blog");
}
