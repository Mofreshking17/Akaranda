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
