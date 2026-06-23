// Seeds the original AKARANDA catalogue into Supabase so the storefront isn't empty.
// Idempotent: upserts by slug. Image URLs are the public site's local /images/products paths.
// Usage: node scripts/seed-products.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envText = readFileSync(join(__dirname, "..", ".env.local"), "utf8");
const env = {};
for (const line of envText.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const P = [
  { id: "kids-dress-1", name: "Ankara Butterfly Dress", price: 18500, tag: "New", cat: "Dresses", collection: "kids", sizes: ["0-6m","6-12m","1yr","2yr","3yr","4yr","5yr"], desc: "A gorgeous Afro-inspired butterfly dress in vibrant Ankara print. Perfect for parties, family events, and everyday elegance." },
  { id: "kids-shirt-1", name: "Kente Print Shirt & Shorts", price: 12000, tag: "Best Seller", cat: "Sets", collection: "kids", sizes: ["1yr","2yr","3yr","4yr","5yr","6yr","7yr"], desc: "Bold Kente-inspired two-piece set for boys. Lightweight, breathable fabric perfect for active little ones." },
  { id: "kids-dress-2", name: "Little Princess Occasion Dress", price: 22000, tag: "Occasion Wear", cat: "Occasion Wear", collection: "kids", sizes: ["1yr","2yr","3yr","4yr","5yr","6yr"], desc: "Stunning occasion dress with African print details. Every little girl deserves to feel like royalty." },
  { id: "kids-skirt-1", name: "Adire Mini Skirt & Top", price: 14500, tag: null, cat: "Sets", collection: "kids", sizes: ["2yr","3yr","4yr","5yr","6yr","7yr","8yr"], desc: "Adire-dyed skirt and crop top set in rich indigo tones. Comfortable, stylish, and uniquely African." },
  { id: "kids-twopiece-1", name: "Kiddies Two-Piece Playsuit", price: 9500, tag: null, cat: "Sets", collection: "kids", sizes: ["0-6m","6-12m","1yr","2yr","3yr"], desc: "Soft, comfortable two-piece playsuit with Ankara print trims. Designed for play, styled for life." },
  { id: "kids-trouser-1", name: "Ankara Print Trousers", price: 8000, tag: null, cat: "Bottoms", collection: "kids", sizes: ["1yr","2yr","3yr","4yr","5yr","6yr","7yr","8yr"], desc: "Vibrant Ankara print trousers that pair beautifully with any top. Elastic waistband for all-day comfort." },
  { id: "kids-sibling-1", name: "Sibling Matching Set (2 pieces)", price: 28000, tag: "Hot", cat: "Sibling Sets", collection: "kids", sizes: ["Custom"], desc: "Adorable matching outfits for two siblings. Choose sizes individually and let the magic happen." },
  { id: "kids-occasionset-1", name: "Royal Occasion Two-Piece Set", price: 32000, tag: "New", cat: "Occasion Wear", collection: "kids", sizes: ["2yr","3yr","4yr","5yr","6yr","7yr","8yr","9yr","10yr"], desc: "Premium two-piece occasion set with hand-finished Ankara details. Designed for the most special moments." },

  { id: "chics-kaftan-1", name: "Royal Kaftan Set", price: 45000, tag: "Best Seller", cat: "Kaftans", collection: "chics", sizes: ["XS","S","M","L","XL","XXL","XXXL"], desc: "Luxurious royal kaftan in rich, flowing fabric with hand-embroidered African motifs. The definition of effortless elegance." },
  { id: "chics-jumpsuit-1", name: "Ankara Fusion Jumpsuit", price: 38000, tag: "Hot", cat: "Jumpsuits", collection: "chics", sizes: ["XS","S","M","L","XL","XXL"], desc: "Bold Ankara fusion jumpsuit that transitions seamlessly from office to evening. A true wardrobe essential." },
  { id: "chics-gown-1", name: "Adire Maxi Evening Gown", price: 55000, tag: "Limited", cat: "Gowns", collection: "chics", sizes: ["XS","S","M","L","XL","XXL"], desc: "A show-stopping Adire maxi gown in deep indigo. Limited edition — once it's gone, it's gone." },
  { id: "chics-corporate-1", name: "Ankara Corporate Blazer Set", price: 68000, tag: null, cat: "Corporate", collection: "chics", sizes: ["XS","S","M","L","XL","XXL"], desc: "Command the boardroom in this Ankara blazer and trouser set. Professional, powerful, and proudly African." },
  { id: "chics-kaftan-2", name: "Boubou Kaftan Elegance", price: 42000, tag: null, cat: "Kaftans", collection: "chics", sizes: ["S","M","L","XL","XXL","XXXL"], desc: "A flowing Boubou kaftan in breathable fabric with beautiful African print borders. Perfect for church, events, and occasions." },
  { id: "chics-casual-1", name: "Weekend Ankara Smart Casual", price: 28000, tag: null, cat: "Casuals", collection: "chics", sizes: ["XS","S","M","L","XL","XXL"], desc: "Your go-to weekend look. Relaxed, stylish, and effortlessly African. Pairs beautifully with sandals or sneakers." },
  { id: "chics-event-1", name: "Glam Event Iro & Buba Set", price: 72000, tag: "New", cat: "Event", collection: "chics", sizes: ["XS","S","M","L","XL","XXL","XXXL"], desc: "A breathtaking Iro & Buba set for your most glamorous events. Rich fabric, elegant finish, unforgettable look." },
  { id: "chics-skirt-1", name: "Ankara Pencil Skirt & Top", price: 32000, tag: null, cat: "Sets", collection: "chics", sizes: ["XS","S","M","L","XL","XXL"], desc: "A sleek Ankara pencil skirt paired with a tailored top. Office-ready, event-ready, queen-ready." },

  { id: "family-1", name: "Mother & Daughter Matching Set", price: 62000, tag: "New", cat: "Matching", collection: "family", sizes: ["Custom"], desc: "The most heartwarming fashion statement — matching outfits for mother and daughter in premium Ankara fabric." },
  { id: "family-2", name: "Family Event Coordinated Set", price: 95000, tag: "New", cat: "Event", collection: "family", sizes: ["Custom"], desc: "Complete family coordinated outfits for your most special occasions. Available for 2–6 family members." },
  { id: "family-3", name: "Mother & Son Coordinated Set", price: 55000, tag: null, cat: "Matching", collection: "family", sizes: ["Custom"], desc: "Beautiful coordinated outfits for mother and son. Share the style, share the love." },
  { id: "family-4", name: "Holiday Family Collection", price: 120000, tag: "Holiday", cat: "Holiday", collection: "family", sizes: ["Custom"], desc: "Make every holiday unforgettable with AKARANDA's signature holiday family collection." },
  { id: "family-5", name: "Ankara Sisters Twinning Set", price: 45000, tag: null, cat: "Siblings", collection: "family", sizes: ["Custom"], desc: "Adorable twinning sets for sisters of any age. Identical prints, tailored to each sister's style." },
  { id: "family-6", name: "Special Occasion Family Ensemble", price: 145000, tag: "Premium", cat: "Occasion", collection: "family", sizes: ["Custom"], desc: "Our most premium family collection — bespoke coordinated outfits for your most unforgettable occasion." },
];

function flags(tag) {
  return {
    is_new_arrival: tag === "New",
    is_best_seller: tag === "Best Seller" || tag === "Hot",
    is_limited_edition: tag === "Limited",
    is_featured: ["kids-dress-1","chics-kaftan-1","family-1","kids-shirt-1","chics-jumpsuit-1","kids-dress-2","chics-gown-1","family-2"].includes(tag),
  };
}

async function main() {
  // Build category name -> id map
  const { data: cats } = await supabase.from("categories").select("id, name");
  const catMap = new Map((cats ?? []).map((c) => [c.name.toLowerCase(), c.id]));

  const featuredIds = new Set(["kids-dress-1","chics-kaftan-1","family-1","kids-shirt-1","chics-jumpsuit-1","kids-dress-2","chics-gown-1","family-2"]);

  let ok = 0;
  for (const p of P) {
    const row = {
      name: p.name,
      slug: p.id,
      sku: p.id.toUpperCase(),
      description: p.desc,
      short_description: p.desc.slice(0, 120),
      category_id: catMap.get(p.cat.toLowerCase()) ?? null,
      collection: p.collection,
      price: p.price,
      stock_quantity: 25,
      available_sizes: p.sizes,
      available_colours: [],
      status: "published",
      is_new_arrival: p.tag === "New",
      is_best_seller: p.tag === "Best Seller" || p.tag === "Hot",
      is_limited_edition: p.tag === "Limited",
      is_featured: featuredIds.has(p.id),
    };

    const { data: product, error } = await supabase
      .from("products")
      .upsert(row, { onConflict: "slug" })
      .select("id")
      .single();

    if (error) {
      console.log(`✗ ${p.id}: ${error.message}`);
      continue;
    }

    // Reset images for this product, then add the local catalogue image
    await supabase.from("product_images").delete().eq("product_id", product.id);
    await supabase.from("product_images").insert({
      product_id: product.id,
      url: `/images/products/${p.id}.jpg`,
      sort_order: 0,
    });
    ok++;
  }

  const { count } = await supabase.from("products").select("id", { count: "exact", head: true });
  console.log(`\n✓ Seeded/updated ${ok}/${P.length} products. Total products in DB: ${count}`);
}

main().catch((e) => { console.error("FATAL:", e.message); process.exit(1); });
