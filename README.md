# AKARANDA Fashion

Monorepo for the AKARANDA Fashion brand — a premium Afro‑inspired ready‑to‑wear label for women (AKARANDA Chics), children (AKARANDA Kids), and families.

## Projects

| Folder | Description | Stack |
|---|---|---|
| [`akaranda`](./akaranda) | Public storefront — shop, cart, lookbook, blog, wardrobe services | Next.js 14, Tailwind, TypeScript |
| [`akaranda-admin`](./akaranda-admin) | Admin dashboard / CMS — products, orders, customers, wardrobe requests, lookbook, blog, testimonials, newsletter, site content, settings | Next.js 15, Supabase, shadcn/ui, Tailwind |

Both apps share one Supabase backend (Postgres + Auth + Storage). The admin dashboard manages all content; the public storefront reads it live and writes orders, wardrobe requests, and newsletter signups back into the same database.

## Getting started

Each app is self-contained. In each folder:

```bash
npm install
cp .env.local.example .env.local   # then fill in your Supabase values
npm run dev
```

The public site runs on `:3001` and the admin on `:3000` by default.

## Deploying to Vercel

This repo holds **two independent Next.js apps**, not a single project. Each one is deployed as
its **own separate Vercel project**, pointed at this same Git repository but with a different
**Root Directory**. Do not try to deploy the repo root itself — there is no Next.js app there,
which is what produces a `404: NOT_FOUND` if a Vercel project is created without setting Root
Directory.

### 1. Website (`akaranda`)

1. In Vercel: **Add New → Project** → import this repository.
2. **Root Directory:** `akaranda`
3. Framework Preset: Next.js (auto-detected).
4. Build Command / Output: leave as default (`next build`, `.next`).
5. **Environment Variables** (Project Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET`
   - `SUPABASE_SERVICE_ROLE_KEY` (used by server actions for orders/wardrobe/newsletter write-backs)
6. Deploy.

### 2. Admin (`akaranda-admin`)

1. In Vercel: **Add New → Project** → import this repository again (as a second, separate
   project).
2. **Root Directory:** `akaranda-admin`
3. Framework Preset: Next.js (auto-detected).
4. Build Command / Output: leave as default.
5. **Environment Variables:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET`
   - `NEXT_PUBLIC_ADMIN_APP_URL` → set to the admin's production URL (e.g. `https://admin.akarandafashion.com`)
   - `NEXT_PUBLIC_PUBLIC_SITE_URL` → set to the storefront's production URL
   - `RESEND_API_KEY`, `EMAIL_FROM` (optional, for order-status email notifications)
   - `SUPABASE_DB_PASSWORD` is **not** needed in Vercel — it's only used by local migration
     scripts in `akaranda-admin/scripts/`.
6. Deploy.

Because each project has its own Root Directory, lockfile, `package.json`, `next.config`, and
`tsconfig.json`, Vercel builds and deploys each app in isolation — a change to one does not
require redeploying the other, and neither app needs to know the other's file layout.

## Database

SQL migrations live in [`akaranda-admin/supabase/migrations`](./akaranda-admin/supabase/migrations):

1. `0001_initial_schema.sql` — tables, enums, indexes, triggers, RLS
2. `0002_seed_reference_data.sql` — starter categories, settings, homepage content
3. `0003_storage_bucket.sql` — media storage bucket + policies
4. `0004_public_read_policies.sql` — anon read access for storefront data

Helper scripts in `akaranda-admin/scripts` (all read secrets from `.env.local`):
`run-migrations.mjs`, `apply-migration.mjs`, `create-super-admin.mjs`, `seed-products.mjs`.

## Security

Real secrets live only in each app's `.env.local`, which is git-ignored. Only `.env.local.example` templates (placeholders) are committed. Never commit a real service-role key or database password.
