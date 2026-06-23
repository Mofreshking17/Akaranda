-- ===================================================================
-- AKARANDA ADMIN DASHBOARD — FULL DATABASE SCHEMA (DRAFT)
-- This is a staging file; real migrations go into akaranda-admin/supabase/migrations
-- ===================================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ===================================================================
-- ENUM TYPES
-- ===================================================================
create type admin_role as enum ('super_admin', 'admin', 'content_manager');
create type product_status as enum ('draft', 'published', 'archived');
create type product_collection as enum ('kids', 'chics', 'family', 'seasonal');
create type order_status as enum ('pending', 'paid', 'processing', 'ready_for_delivery', 'delivered', 'cancelled');
create type payment_status as enum ('unpaid', 'pending', 'paid', 'refunded', 'failed');
create type wardrobe_type as enum ('kiddies', 'chics');
create type wardrobe_status as enum ('new_request', 'in_review', 'styling', 'ready', 'delivered');
create type blog_status as enum ('draft', 'scheduled', 'published');
create type media_kind as enum ('image', 'video');

-- ===================================================================
-- PROFILES (admin users, mirrors auth.users)
-- ===================================================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role admin_role not null default 'content_manager',
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_profiles_role on profiles(role);

-- ===================================================================
-- CATEGORIES & COLLECTIONS
-- ===================================================================
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  parent_id uuid references categories(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ===================================================================
-- MEDIA LIBRARY
-- ===================================================================
create table media_files (
  id uuid primary key default uuid_generate_v4(),
  file_name text not null,
  storage_path text not null,
  url text not null,
  kind media_kind not null,
  folder text not null default 'general',
  size_bytes bigint,
  width int,
  height int,
  uploaded_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index idx_media_folder on media_files(folder);
create index idx_media_kind on media_files(kind);

-- ===================================================================
-- PRODUCTS
-- ===================================================================
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  sku text unique,
  description text,
  short_description text,
  category_id uuid references categories(id) on delete set null,
  collection product_collection not null,
  price numeric(12,2) not null,
  sale_price numeric(12,2),
  stock_quantity int not null default 0,
  available_sizes text[] not null default '{}',
  available_colours text[] not null default '{}',
  fabric_info text,
  care_instructions text,
  delivery_time text,
  is_featured boolean not null default false,
  is_new_arrival boolean not null default false,
  is_best_seller boolean not null default false,
  is_limited_edition boolean not null default false,
  video_url text,
  status product_status not null default 'draft',
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_products_status on products(status);
create index idx_products_collection on products(collection);
create index idx_products_category on products(category_id);
create index idx_products_featured on products(is_featured) where is_featured = true;
create index idx_products_stock on products(stock_quantity);

create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  media_id uuid references media_files(id) on delete set null,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index idx_product_images_product on product_images(product_id);

-- ===================================================================
-- CUSTOMERS
-- ===================================================================
create table customers (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text unique,
  phone text,
  whatsapp_number text,
  address text,
  city text,
  state text,
  total_spend numeric(12,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_customers_email on customers(email);
create index idx_customers_phone on customers(phone);

create table wishlists (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references customers(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(customer_id, product_id)
);

-- ===================================================================
-- ORDERS
-- ===================================================================
create table orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text not null unique,
  customer_id uuid references customers(id) on delete set null,
  customer_name text not null,
  customer_phone text,
  customer_email text,
  delivery_address text,
  subtotal numeric(12,2) not null default 0,
  delivery_fee numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  status order_status not null default 'pending',
  payment_status payment_status not null default 'unpaid',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_orders_status on orders(status);
create index idx_orders_customer on orders(customer_id);
create index idx_orders_created on orders(created_at desc);

create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  selected_size text,
  selected_colour text,
  quantity int not null default 1,
  unit_price numeric(12,2) not null,
  line_total numeric(12,2) not null
);
create index idx_order_items_order on order_items(order_id);

create table order_status_history (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  status order_status not null,
  changed_by uuid references profiles(id) on delete set null,
  notified boolean not null default false,
  created_at timestamptz not null default now()
);

-- ===================================================================
-- WARDROBE SERVICE REQUESTS
-- ===================================================================
create table wardrobe_requests (
  id uuid primary key default uuid_generate_v4(),
  type wardrobe_type not null,
  customer_id uuid references customers(id) on delete set null,
  full_name text not null,
  phone text not null,
  email text,
  measurements jsonb not null default '{}',
  colour_preferences text[] not null default '{}',
  style_preferences text,
  occasion text,
  budget_range text,
  uploaded_photos text[] not null default '{}',
  status wardrobe_status not null default 'new_request',
  admin_notes text,
  internal_team_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_wardrobe_type on wardrobe_requests(type);
create index idx_wardrobe_status on wardrobe_requests(status);
create index idx_wardrobe_customer on wardrobe_requests(customer_id);

-- ===================================================================
-- LOOKBOOK
-- ===================================================================
create table lookbook_collections (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  collection_group product_collection not null,
  description text,
  cover_image text,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_lookbook_published on lookbook_collections(is_published);

create table lookbook_items (
  id uuid primary key default uuid_generate_v4(),
  collection_id uuid not null references lookbook_collections(id) on delete cascade,
  media_id uuid references media_files(id) on delete set null,
  url text not null,
  kind media_kind not null default 'image',
  caption text,
  sort_order int not null default 0
);
create index idx_lookbook_items_collection on lookbook_items(collection_id);

-- ===================================================================
-- BLOG
-- ===================================================================
create table blog_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique
);

create table blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  featured_image text,
  category_id uuid references blog_categories(id) on delete set null,
  tags text[] not null default '{}',
  seo_title text,
  seo_description text,
  author_id uuid references profiles(id) on delete set null,
  status blog_status not null default 'draft',
  scheduled_for timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_blog_status on blog_posts(status);
create index idx_blog_scheduled on blog_posts(scheduled_for) where status = 'scheduled';

-- ===================================================================
-- TESTIMONIALS
-- ===================================================================
create table testimonials (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  location text,
  customer_photo text,
  rating int not null check (rating between 1 and 5),
  testimonial_text text not null,
  related_collection text,
  is_featured boolean not null default false,
  show_on_homepage boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index idx_testimonials_homepage on testimonials(show_on_homepage) where show_on_homepage = true;

-- ===================================================================
-- NEWSLETTER
-- ===================================================================
create table newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  full_name text,
  subscribed_at timestamptz not null default now(),
  is_active boolean not null default true
);

create table newsletter_campaigns (
  id uuid primary key default uuid_generate_v4(),
  subject text not null,
  body_html text,
  status text not null default 'draft',
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

-- ===================================================================
-- WEBSITE CONTENT (key-value, fully admin-editable)
-- ===================================================================
create table site_content (
  id uuid primary key default uuid_generate_v4(),
  section text not null,            -- e.g. 'homepage_hero', 'brand_story', 'footer', 'faqs'
  key text not null,                -- e.g. 'slide_1_headline'
  value jsonb not null default '{}',
  updated_by uuid references profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique(section, key)
);
create index idx_site_content_section on site_content(section);

-- ===================================================================
-- SETTINGS (singleton-style key-value)
-- ===================================================================
create table settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_by uuid references profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- ===================================================================
-- ACTIVITY LOG
-- ===================================================================
create table activity_log (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references profiles(id) on delete set null,
  actor_name text,
  action text not null,         -- e.g. 'product.created', 'order.status_changed'
  entity_type text,
  entity_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);
create index idx_activity_created on activity_log(created_at desc);

-- ===================================================================
-- updated_at triggers
-- ===================================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated before update on profiles for each row execute function set_updated_at();
create trigger trg_products_updated before update on products for each row execute function set_updated_at();
create trigger trg_customers_updated before update on customers for each row execute function set_updated_at();
create trigger trg_orders_updated before update on orders for each row execute function set_updated_at();
create trigger trg_wardrobe_updated before update on wardrobe_requests for each row execute function set_updated_at();
create trigger trg_lookbook_updated before update on lookbook_collections for each row execute function set_updated_at();
create trigger trg_blog_updated before update on blog_posts for each row execute function set_updated_at();

-- ===================================================================
-- ROW LEVEL SECURITY
-- ===================================================================
alter table profiles enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table categories enable row level security;
alter table media_files enable row level security;
alter table customers enable row level security;
alter table wishlists enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_status_history enable row level security;
alter table wardrobe_requests enable row level security;
alter table lookbook_collections enable row level security;
alter table lookbook_items enable row level security;
alter table blog_categories enable row level security;
alter table blog_posts enable row level security;
alter table testimonials enable row level security;
alter table newsletter_subscribers enable row level security;
alter table newsletter_campaigns enable row level security;
alter table site_content enable row level security;
alter table settings enable row level security;
alter table activity_log enable row level security;

-- Helper: current user's role
create or replace function current_role_name()
returns admin_role as $$
  select role from profiles where id = auth.uid();
$$ language sql security definer stable;

-- profiles: users can read their own row; super_admin can read/write all
create policy profiles_self_select on profiles for select using (id = auth.uid() or current_role_name() = 'super_admin');
create policy profiles_super_admin_all on profiles for all using (current_role_name() = 'super_admin');

-- Generic pattern: super_admin + admin full access to commerce tables, content_manager read-only
create policy products_admin_write on products for all using (current_role_name() in ('super_admin','admin'));
create policy products_cm_read on products for select using (current_role_name() = 'content_manager');

create policy product_images_admin_write on product_images for all using (current_role_name() in ('super_admin','admin'));
create policy categories_admin_write on categories for all using (current_role_name() in ('super_admin','admin'));
create policy media_all_roles on media_files for all using (current_role_name() in ('super_admin','admin','content_manager'));

create policy customers_admin_write on customers for all using (current_role_name() in ('super_admin','admin'));
create policy wishlists_admin_write on wishlists for all using (current_role_name() in ('super_admin','admin'));

create policy orders_admin_write on orders for all using (current_role_name() in ('super_admin','admin'));
create policy order_items_admin_write on order_items for all using (current_role_name() in ('super_admin','admin'));
create policy order_history_admin_write on order_status_history for all using (current_role_name() in ('super_admin','admin'));

create policy wardrobe_admin_write on wardrobe_requests for all using (current_role_name() in ('super_admin','admin'));

-- content manager tables: content_manager + super_admin full access
create policy lookbook_cm_write on lookbook_collections for all using (current_role_name() in ('super_admin','content_manager'));
create policy lookbook_items_cm_write on lookbook_items for all using (current_role_name() in ('super_admin','content_manager'));
create policy blog_categories_cm_write on blog_categories for all using (current_role_name() in ('super_admin','content_manager'));
create policy blog_posts_cm_write on blog_posts for all using (current_role_name() in ('super_admin','content_manager'));
create policy testimonials_cm_write on testimonials for all using (current_role_name() in ('super_admin','content_manager'));

create policy newsletter_admin_read on newsletter_subscribers for all using (current_role_name() in ('super_admin','admin'));
create policy newsletter_campaigns_admin on newsletter_campaigns for all using (current_role_name() in ('super_admin','admin'));

create policy site_content_super_admin_write on site_content for all using (current_role_name() = 'super_admin');
create policy site_content_cm_read on site_content for select using (current_role_name() in ('admin','content_manager'));

create policy settings_super_admin_only on settings for all using (current_role_name() = 'super_admin');

create policy activity_log_read_all on activity_log for select using (current_role_name() in ('super_admin','admin','content_manager'));
create policy activity_log_insert_all on activity_log for insert with check (auth.uid() is not null);

-- Public (anon) read access for published content consumed by the public website
create policy products_public_read on products for select using (status = 'published');
create policy lookbook_public_read on lookbook_collections for select using (is_published = true);
create policy blog_public_read on blog_posts for select using (status = 'published');
create policy testimonials_public_read on testimonials for select using (true);
create policy site_content_public_read on site_content for select using (true);
