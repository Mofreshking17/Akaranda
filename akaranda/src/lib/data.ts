import { createClient } from "@/lib/supabase/server";
import { mapDbProduct, PRODUCT_SELECT, type Product, type Collection } from "@/lib/products";

// ─── PRODUCTS ──────────────────────────────────────────────
export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapDbProduct);
}

export async function getProductsByCollection(collection: Collection): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "published")
    .eq("collection", collection)
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapDbProduct);
}

export async function getNewArrivals(): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "published")
    .eq("is_new_arrival", true)
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapDbProduct);
}

export async function getBestSellers(): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "published")
    .eq("is_best_seller", true)
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapDbProduct);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "published")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  let products = (data ?? []).map(mapDbProduct);
  // Fall back to newest products if nothing is flagged featured yet
  if (products.length === 0) {
    const { data: recent } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(limit);
    products = (recent ?? []).map(mapDbProduct);
  }
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  return data ? mapDbProduct(data) : null;
}

export async function getRelatedProducts(collection: Collection, excludeSlug: string, limit = 4): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "published")
    .eq("collection", collection)
    .neq("slug", excludeSlug)
    .limit(limit);
  return (data ?? []).map(mapDbProduct);
}

// ─── SITE CONTENT (hero, brand story, footer, policies, faqs) ──
export type SiteContentMap = Record<string, Record<string, unknown>>;

export async function getSiteContentSection(section: string): Promise<Record<string, unknown>[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_content").select("key, value").eq("section", section);
  return (data ?? []).map((r) => ({ key: r.key, value: r.value }));
}

export interface HeroSlide {
  image: string;
  tag: string;
  headline: string;
  sub: string;
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_content")
    .select("key, value")
    .eq("section", "homepage_hero")
    .order("key");
  return (data ?? [])
    .map((r) => r.value as HeroSlide)
    .filter((v) => v && v.headline);
}

export async function getMeetAranda(): Promise<{ image: string; title: string; body: string } | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_content")
    .select("value")
    .eq("section", "brand_story")
    .eq("key", "meet_aranda")
    .maybeSingle();
  return (data?.value as { image: string; title: string; body: string }) ?? null;
}

// ─── TESTIMONIALS ──────────────────────────────────────────
export interface PublicTestimonial {
  id: string;
  customer_name: string;
  location: string | null;
  rating: number;
  testimonial_text: string;
  related_collection: string | null;
  customer_photo: string | null;
}

export async function getHomepageTestimonials(): Promise<PublicTestimonial[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("id, customer_name, location, rating, testimonial_text, related_collection, customer_photo")
    .eq("show_on_homepage", true)
    .order("sort_order");
  return (data ?? []) as PublicTestimonial[];
}

// ─── BLOG ──────────────────────────────────────────────────
export interface PublicBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  tags: string[];
  published_at: string | null;
  created_at: string;
  blog_categories?: { name: string } | { name: string }[] | null;
}

export async function getBlogPosts(limit?: number): Promise<PublicBlogPost[]> {
  const supabase = await createClient();
  let query = supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, content, featured_image, tags, published_at, created_at, blog_categories(name)")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });
  if (limit) query = query.limit(limit);
  const { data } = await query;
  return (data ?? []) as PublicBlogPost[];
}

export async function getBlogPostBySlug(slug: string): Promise<PublicBlogPost | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, content, featured_image, tags, published_at, created_at, blog_categories(name)")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  return (data as PublicBlogPost) ?? null;
}

// ─── LOOKBOOK ──────────────────────────────────────────────
export interface PublicLookbook {
  id: string;
  title: string;
  collection_group: string;
  description: string | null;
  cover_image: string | null;
  lookbook_items?: { url: string; caption: string | null; sort_order: number }[];
}

export async function getLookbookCollections(): Promise<PublicLookbook[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lookbook_collections")
    .select("id, title, collection_group, description, cover_image, lookbook_items(url, caption, sort_order)")
    .eq("is_published", true)
    .order("sort_order");
  return (data ?? []) as PublicLookbook[];
}

export async function getContactInfo(): Promise<{ phone?: string; email?: string; address?: string }> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_content")
    .select("value")
    .eq("section", "footer")
    .eq("key", "contact")
    .maybeSingle();
  return (data?.value as { phone?: string; email?: string; address?: string }) ?? {};
}

// ─── SETTINGS ──────────────────────────────────────────────
export type Settings = Record<string, Record<string, unknown>>;

export async function getSettings(): Promise<Settings> {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("key, value");
  const map: Settings = {};
  (data ?? []).forEach((r) => {
    map[r.key] = (r.value as Record<string, unknown>) ?? {};
  });
  return map;
}

export type BusinessContact = {
  phone?: string;
  whatsapp_number?: string;
  support_email?: string;
  business_hours?: string;
  label?: string;
};

/** Admin-editable WhatsApp/phone/email/hours, read dynamically rather than hardcoded. */
export async function getBusinessContact(): Promise<BusinessContact> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "business_contact")
    .maybeSingle();
  return (data?.value as BusinessContact) ?? {};
}
