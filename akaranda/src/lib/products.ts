// Public-facing product shape used across the storefront + cart.
// Data now comes from Supabase (see lib/data.ts). This file holds the type
// and the DB->UI mapper so cart/components keep a stable interface.

export type Collection = "kids" | "chics" | "family" | "seasonal";

export interface Product {
  id: string; // Supabase uuid (used as order_items.product_id)
  slug: string; // used for /shop/[slug] routing
  name: string;
  price: number;
  salePrice?: number | null;
  tag?: string;
  category: string;
  collection: Collection;
  image: string;
  sizes: string[];
  description: string;
}

// Raw row shape returned from Supabase (products + joined relations)
export interface DbProductRow {
  id: string;
  slug: string;
  name: string;
  price: number | string;
  sale_price: number | string | null;
  short_description: string | null;
  description: string | null;
  collection: Collection;
  available_sizes: string[] | null;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_limited_edition: boolean;
  categories?: { name: string } | { name: string }[] | null;
  product_images?: { url: string; sort_order: number }[] | null;
}

const PLACEHOLDER_IMAGE = "/images/misc/meet-aranda.jpg";

function deriveTag(row: DbProductRow): string | undefined {
  if (row.sale_price != null) return "Sale";
  if (row.is_new_arrival) return "New";
  if (row.is_best_seller) return "Best Seller";
  if (row.is_limited_edition) return "Limited";
  return undefined;
}

export function mapDbProduct(row: DbProductRow): Product {
  const cat = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  const images = (row.product_images ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: Number(row.price),
    salePrice: row.sale_price != null ? Number(row.sale_price) : null,
    tag: deriveTag(row),
    category: cat?.name ?? "AKARANDA",
    collection: row.collection,
    image: images[0]?.url ?? PLACEHOLDER_IMAGE,
    sizes: row.available_sizes ?? [],
    description: row.description ?? row.short_description ?? "",
  };
}

// Columns selected for every product query (keeps mapper inputs consistent)
export const PRODUCT_SELECT =
  "id, slug, name, price, sale_price, short_description, description, collection, available_sizes, is_new_arrival, is_best_seller, is_limited_edition, categories(name), product_images(url, sort_order)";
