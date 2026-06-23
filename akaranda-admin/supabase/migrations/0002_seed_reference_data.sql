-- ===================================================================
-- Reference / starter data — safe to run once after 0001_initial_schema.sql
-- ===================================================================

insert into categories (name, slug) values
  ('Dresses', 'dresses'),
  ('Sets', 'sets'),
  ('Bottoms', 'bottoms'),
  ('Sibling Sets', 'sibling-sets'),
  ('Occasion Wear', 'occasion-wear'),
  ('Kaftans', 'kaftans'),
  ('Jumpsuits', 'jumpsuits'),
  ('Gowns', 'gowns'),
  ('Corporate', 'corporate'),
  ('Casuals', 'casuals'),
  ('Event', 'event'),
  ('Matching', 'matching'),
  ('Holiday', 'holiday'),
  ('Siblings', 'siblings'),
  ('Occasion', 'occasion')
on conflict (slug) do nothing;

insert into blog_categories (name, slug) values
  ('Kids Fashion', 'kids-fashion'),
  ('Women''s Fashion', 'womens-fashion'),
  ('Family Style', 'family-style')
on conflict (slug) do nothing;

insert into settings (key, value) values
  ('brand', '{"name":"AKARANDA Fashion","tagline":"Uniquely Styled. Beautifully African.","logo_url":""}'),
  ('whatsapp', '{"number":"","default_message":"Hello AKARANDA, I would like to place an order."}'),
  ('social_links', '{"instagram":"","facebook":"","tiktok":""}'),
  ('delivery_pricing', '{"standard_days":7,"priority_days":3,"express_hours":24,"free_delivery_threshold":50000}'),
  ('shipping_zones', '[]'),
  ('seo', '{"google_analytics_id":"","facebook_pixel_id":""}')
on conflict (key) do nothing;

insert into site_content (section, key, value) values
  ('homepage_hero', 'slide_1', '{"image":"/images/hero/hero-1.jpg","tag":"AKARANDA FASHION","headline":"Uniquely Styled.\nBeautifully African.","sub":"Premium Nigerian Ankara, Iro & Buba, and Agbada fashion for women, children, and families."}'),
  ('homepage_hero', 'slide_2', '{"image":"/images/hero/hero-2.jpg","tag":"FAMILY COLLECTION","headline":"Style That\nConnects Generations","sub":"Mother & Daughter matching Ankara sets crafted with love and Nigerian elegance."}'),
  ('homepage_hero', 'slide_3', '{"image":"/images/hero/hero-3.jpg","tag":"AKARANDA CHICS","headline":"Dressed to\nImpress. Always.","sub":"Kaftans, Agbada fusion, Iro & Buba, and corporate Ankara for the modern Nigerian queen."}'),
  ('brand_story', 'meet_aranda', '{"image":"/images/misc/meet-aranda.jpg","title":"Meet Aranda, Our Inspiration","body":"AKARANDA Fashion is named after Aranda, whose charm, innocence, and elegance embody the values of everything we create."}'),
  ('footer', 'contact', '{"phone":"","email":"","address":""}'),
  ('policies', 'delivery', '{"body":""}'),
  ('policies', 'refund', '{"body":""}'),
  ('faqs', 'list', '[]')
on conflict (section, key) do nothing;
