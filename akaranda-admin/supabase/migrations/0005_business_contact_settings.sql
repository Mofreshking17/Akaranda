-- ===================================================================
-- Business Contact settings (WhatsApp Support & Sales line) + backfill
-- the existing whatsapp key with the official number/label.
-- ===================================================================

insert into settings (key, value) values
  ('business_contact', '{
    "phone": "+234 814 001 2132",
    "whatsapp_number": "+234 814 001 2132",
    "support_email": "hello@akaranda.com",
    "business_hours": "Monday – Saturday, 9:00 AM – 6:00 PM",
    "label": "AKARANDA Support & Sales Line"
  }')
on conflict (key) do nothing;

update settings
set value = value || '{"number": "2348140012132", "label": "AKARANDA Support & Sales Line"}'::jsonb
where key = 'whatsapp';
