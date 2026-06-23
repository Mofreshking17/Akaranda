# AKARANDA Admin Dashboard

Production CMS for the AKARANDA Fashion business — products, orders, customers, wardrobe services, lookbook, blog, testimonials, newsletter, site content, and settings. Next.js 15 + Supabase.

## 1. Create a Supabase project

Create a project at [supabase.com](https://supabase.com), then enable **Storage**.

## 2. Run the migrations

In the Supabase SQL editor (or via `supabase db push` with the CLI), run the files in `supabase/migrations/` **in order**:

1. `0001_initial_schema.sql` — tables, enums, indexes, triggers, RLS policies
2. `0002_seed_reference_data.sql` — starter categories, settings, and homepage content
3. `0003_storage_bucket.sql` — creates the `akaranda-media` bucket and its access policies

## 3. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase Settings → API
- `SUPABASE_SERVICE_ROLE_KEY` — same page, **server-only**, never expose to the client
- `NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET` — leave as `akaranda-media` unless you renamed the bucket

## 4. Create your first Super Admin

The app has no public sign-up — accounts are provisioned by a Super Admin via the **Team** page, which uses Supabase's invite-by-email flow. To bootstrap the very first account:

1. In Supabase Auth, create a user manually (Authentication → Users → Add User) with a password.
2. In the SQL editor, insert their profile row:
   ```sql
   insert into profiles (id, full_name, email, role)
   values ('<the-user-id-from-auth>', 'Your Name', 'you@example.com', 'super_admin');
   ```
3. Sign in at `/login`. From there, use the **Team** page to invite the rest of the team — they'll receive an email invite and their role/profile row is created automatically.

## 5. Run the app

```bash
npm install
npm run dev
```

## Architecture notes

- **Roles**: `super_admin` (full access), `admin` (products/orders/customers/wardrobe), `content_manager` (media/lookbook/blog/testimonials). Enforced both in the UI (`src/lib/permissions.ts`) and at the database level via Postgres RLS policies keyed off `profiles.role`.
- **Media Library**: uploads go to Supabase Storage bucket `akaranda-media`, with a row recorded in `media_files` for browsing/search.
- **Website Content** (`/content`) and **Settings** (`/settings`) write to the `site_content` and `settings` key-value tables — the public AKARANDA site should read from these tables instead of hardcoding hero copy, brand story text, or footer info.
- **Order status emails**: `updateOrderStatus` in `src/app/(dashboard)/orders/actions.ts` has a placeholder comment for wiring up Resend/SMTP — no email provider is connected yet.
- **Newsletter campaigns**: drafts are stored in `newsletter_campaigns`; actual sending requires connecting an ESP.
