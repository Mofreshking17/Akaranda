// Applies a single migration file by name. Usage: node scripts/apply-migration.mjs 0004_public_read_policies.sql
import { Client } from "pg";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = process.argv[2];
if (!file) { console.error("Pass a migration filename."); process.exit(1); }

// Read secrets from .env.local (gitignored) — never hardcode them.
const env = {};
for (const line of readFileSync(join(__dirname, "..", ".env.local"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const PROJECT_REF = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
const PASSWORD = env.SUPABASE_DB_PASSWORD;
if (!PASSWORD) { console.error("Set SUPABASE_DB_PASSWORD in .env.local"); process.exit(1); }

const client = new Client({
  host: `db.${PROJECT_REF}.supabase.co`,
  port: 5432,
  user: "postgres",
  password: PASSWORD,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

const sql = readFileSync(join(__dirname, "..", "supabase", "migrations", file), "utf8");

await client.connect();
try {
  await client.query(sql);
  console.log(`✓ Applied ${file}`);
} catch (e) {
  console.error(`✗ ${file}: ${e.message}`);
} finally {
  await client.end();
}
