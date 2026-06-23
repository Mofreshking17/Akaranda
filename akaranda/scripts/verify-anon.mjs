import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = {};
for (const line of readFileSync(join(__dirname, "..", ".env.local"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const { data: prods } = await sb.from("products").select("name, collection, product_images(url)").eq("status", "published");
console.log("Anon sees", prods?.length, "published products");
console.log("Sample:", prods?.slice(0, 3).map((p) => p.name).join(" | "));
console.log("First image:", prods?.[0]?.product_images?.[0]?.url);
const { data: cats } = await sb.from("categories").select("id");
const { data: settings } = await sb.from("settings").select("key");
const { data: content } = await sb.from("site_content").select("section");
console.log("Anon sees", cats?.length, "categories,", settings?.length, "settings,", content?.length, "site_content rows");
