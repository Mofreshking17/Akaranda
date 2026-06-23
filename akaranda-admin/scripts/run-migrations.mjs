// Runs the SQL migrations in supabase/migrations against the remote Supabase Postgres.
// Usage: node scripts/run-migrations.mjs
import { Client } from "pg";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, "..", "supabase", "migrations");

// Read secrets from .env.local (gitignored) — never hardcode them.
const env = {};
for (const line of readFileSync(join(__dirname, "..", ".env.local"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const PROJECT_REF = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
const PASSWORD = env.SUPABASE_DB_PASSWORD;
if (!PASSWORD) { console.error("Set SUPABASE_DB_PASSWORD in .env.local"); process.exit(1); }

// Candidate connections, tried in order. Direct first, then pooler regions.
const candidates = [
  { label: "direct", host: `db.${PROJECT_REF}.supabase.co`, port: 5432, user: "postgres" },
  { label: "pooler us-east-1", host: "aws-0-us-east-1.pooler.supabase.com", port: 5432, user: `postgres.${PROJECT_REF}` },
  { label: "pooler us-east-2", host: "aws-0-us-east-2.pooler.supabase.com", port: 5432, user: `postgres.${PROJECT_REF}` },
  { label: "pooler us-west-1", host: "aws-0-us-west-1.pooler.supabase.com", port: 5432, user: `postgres.${PROJECT_REF}` },
  { label: "pooler eu-west-1", host: "aws-0-eu-west-1.pooler.supabase.com", port: 5432, user: `postgres.${PROJECT_REF}` },
  { label: "pooler eu-west-2", host: "aws-0-eu-west-2.pooler.supabase.com", port: 5432, user: `postgres.${PROJECT_REF}` },
  { label: "pooler eu-central-1", host: "aws-0-eu-central-1.pooler.supabase.com", port: 5432, user: `postgres.${PROJECT_REF}` },
  { label: "pooler ap-southeast-1", host: "aws-0-ap-southeast-1.pooler.supabase.com", port: 5432, user: `postgres.${PROJECT_REF}` },
  { label: "pooler ap-south-1", host: "aws-0-ap-south-1.pooler.supabase.com", port: 5432, user: `postgres.${PROJECT_REF}` },
];

async function connect() {
  for (const c of candidates) {
    const client = new Client({
      host: c.host,
      port: c.port,
      user: c.user,
      password: PASSWORD,
      database: "postgres",
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 12000,
    });
    try {
      await client.connect();
      console.log(`✓ Connected via ${c.label} (${c.host})`);
      return client;
    } catch (err) {
      console.log(`✗ ${c.label} failed: ${err.message}`);
      try { await client.end(); } catch {}
    }
  }
  throw new Error("Could not connect via any candidate host.");
}

async function main() {
  const client = await connect();

  const files = readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
  console.log(`\nApplying ${files.length} migration files...\n`);

  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    process.stdout.write(`-> ${file} ... `);
    try {
      await client.query(sql);
      console.log("OK");
    } catch (err) {
      console.log("FAILED");
      console.error(`   ${err.message}`);
    }
  }

  const { rows } = await client.query(
    "select table_name from information_schema.tables where table_schema = 'public' order by table_name"
  );
  console.log(`\nPublic tables now present (${rows.length}):`);
  console.log(rows.map((r) => "  - " + r.table_name).join("\n"));

  await client.end();
}

main().catch((err) => {
  console.error("\nFATAL:", err.message);
  process.exit(1);
});
