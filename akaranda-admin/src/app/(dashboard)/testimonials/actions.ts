"use server";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTestimonial(values: {
  customer_name: string;
  location: string;
  customer_photo: string;
  rating: number;
  testimonial_text: string;
  related_collection: string;
  is_featured: boolean;
  show_on_homepage: boolean;
}) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: testimonial, error } = await supabase
    .from("testimonials")
    .insert({ ...values, customer_photo: values.customer_photo || null, location: values.location || null, related_collection: values.related_collection || null })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logActivity({ actorId: profile.id, actorName: profile.full_name, action: "testimonial.created", entityType: "testimonial", entityId: testimonial.id });
  revalidatePath("/testimonials");
  redirect("/testimonials");
}

export async function toggleTestimonialHomepage(id: string, show: boolean) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").update({ show_on_homepage: show }).eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity({ actorId: profile.id, actorName: profile.full_name, action: show ? "testimonial.shown_homepage" : "testimonial.hidden_homepage", entityType: "testimonial", entityId: id });
  revalidatePath("/testimonials");
}

export async function toggleTestimonialFeatured(id: string, featured: boolean) {
  await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").update({ is_featured: featured }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/testimonials");
}

export async function deleteTestimonial(id: string) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity({ actorId: profile.id, actorName: profile.full_name, action: "testimonial.deleted", entityType: "testimonial", entityId: id });
  revalidatePath("/testimonials");
}
