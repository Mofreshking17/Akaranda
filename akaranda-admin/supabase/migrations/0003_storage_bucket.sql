-- ===================================================================
-- Storage bucket for the Media Library
-- Run after enabling Storage in your Supabase project.
-- ===================================================================

insert into storage.buckets (id, name, public)
values ('akaranda-media', 'akaranda-media', true)
on conflict (id) do nothing;

-- Public read for published media (site needs to render images)
create policy "akaranda_media_public_read"
on storage.objects for select
using (bucket_id = 'akaranda-media');

-- Authenticated admin users can upload/update/delete
create policy "akaranda_media_admin_insert"
on storage.objects for insert
with check (bucket_id = 'akaranda-media' and auth.role() = 'authenticated');

create policy "akaranda_media_admin_update"
on storage.objects for update
using (bucket_id = 'akaranda-media' and auth.role() = 'authenticated');

create policy "akaranda_media_admin_delete"
on storage.objects for delete
using (bucket_id = 'akaranda-media' and auth.role() = 'authenticated');
