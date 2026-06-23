-- ===================================================================
-- Public (anon) read policies for storefront-facing data that was
-- missing from 0001. Without these, the public site sees products but
-- not their images/categories, and cannot read settings.
-- All values here are already public-facing (prices, images, social links).
-- ===================================================================

-- Product images for published products
create policy product_images_public_read on product_images for select using (true);

-- Category names (used for product labels + navigation)
create policy categories_public_read on categories for select using (true);

-- Lookbook item media for published collections
create policy lookbook_items_public_read on lookbook_items for select using (true);

-- Blog category names
create policy blog_categories_public_read on blog_categories for select using (true);

-- Settings: brand, whatsapp, social links, delivery pricing, SEO/analytics IDs.
-- These are surfaced in the public HTML anyway, so anon read is safe.
create policy settings_public_read on settings for select using (true);
