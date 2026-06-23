// Creates the first Super Admin: an auth user + a matching profiles row.
// Usage: node scripts/create-super-admin.mjs <email> <password> "<full name>"
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Minimal .env.local parser (avoids extra deps)
const envText = readFileSync(join(__dirname, "..", ".env.local"), "utf8");
const env = {};
for (const line of envText.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = env.SUPABASE_SERVICE_ROLE_KEY;

const email = process.argv[2] || "mayowaking71@gmail.com";
const password = process.argv[3] || process.env.SUPER_ADMIN_PASSWORD || "ChangeMe123!";
const fullName = process.argv[4] || "AKARANDA Super Admin";

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  // 1. Create (or find) the auth user
  let userId;
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (createErr) {
    if (/already.*registered|already.*exists/i.test(createErr.message)) {
      // Find existing user by listing
      const { data: list } = await admin.auth.admin.listUsers();
      const existing = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
      if (!existing) throw new Error(`User exists but could not be located: ${createErr.message}`);
      userId = existing.id;
      // Reset password + confirm to be safe
      await admin.auth.admin.updateUserById(userId, { password, email_confirm: true });
      console.log(`Auth user already existed — reused and password reset (${email}).`);
    } else {
      throw new Error(createErr.message);
    }
  } else {
    userId = created.user.id;
    console.log(`Auth user created: ${email}`);
  }

  // 2. Upsert the profile row with super_admin role
  const { error: profileErr } = await admin.from("profiles").upsert(
    {
      id: userId,
      full_name: fullName,
      email,
      role: "super_admin",
      is_active: true,
    },
    { onConflict: "id" }
  );

  if (profileErr) throw new Error(`Profile upsert failed: ${profileErr.message}`);

  console.log(`\n✓ Super Admin ready.`);
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
  console.log(`  Role:     super_admin`);
  console.log(`\nLog in at http://localhost:3000/login and change the password afterwards.`);
}

main().catch((err) => {
  console.error("\nFATAL:", err.message);
  process.exit(1);
});
