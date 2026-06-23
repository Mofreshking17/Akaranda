// Verifies the Supabase connection + auth + RLS end-to-end.
// Signs in as the super admin, reads its own profile, counts a couple tables.
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

const email = process.argv[2] || "mayowaking71@gmail.com";
const password = process.argv[3] || "Akaranda@2026";

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
  if (authErr) throw new Error(`Sign-in failed: ${authErr.message}`);
  console.log(`✓ Signed in as ${auth.user.email}`);

  const { data: profile, error: profErr } = await supabase
    .from("profiles").select("full_name, role, is_active").eq("id", auth.user.id).single();
  if (profErr) throw new Error(`Profile read failed (RLS?): ${profErr.message}`);
  console.log(`✓ Profile: ${profile.full_name} — role=${profile.role}, active=${profile.is_active}`);

  const { count: catCount } = await supabase.from("categories").select("*", { count: "exact", head: true });
  const { count: settingsCount } = await supabase.from("settings").select("*", { count: "exact", head: true });
  const { count: contentCount } = await supabase.from("site_content").select("*", { count: "exact", head: true });
  console.log(`✓ Seed data: ${catCount} categories, ${settingsCount} settings, ${contentCount} site_content rows`);

  console.log("\nAll checks passed. The admin app can talk to Supabase.");
}

main().catch((err) => {
  console.error("\nFAILED:", err.message);
  process.exit(1);
});
