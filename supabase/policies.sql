-- Linfeng System Supabase RLS policies
--
-- Purpose:
-- - Frontend pages can read published content with the anon public key.
-- - Admin write operations should require authenticated users in the future.
-- - Before login is implemented, do not enable write access on the production project.
--
-- Important:
-- The current app uses NEXT_PUBLIC_SUPABASE_ANON_KEY. If RLS is disabled on a
-- production Supabase project, anyone with the public anon key may be able to
-- write through the exposed API. Execute these policies before configuring
-- Supabase environment variables on Vercel.

alter table public.knowledge_nodes enable row level security;
alter table public.video_topics enable row level security;
alter table public.topics enable row level security;
alter table public.tags enable row level security;

grant usage on schema public to anon, authenticated;

grant select on public.knowledge_nodes to anon, authenticated;
grant insert, update, delete on public.knowledge_nodes to authenticated;

grant select on public.video_topics to anon, authenticated;
grant insert, update, delete on public.video_topics to authenticated;

grant select on public.topics to anon, authenticated;
grant insert, update, delete on public.topics to authenticated;

grant select on public.tags to anon, authenticated;
grant insert, update, delete on public.tags to authenticated;

drop policy if exists "Public can read published knowledge nodes" on public.knowledge_nodes;
create policy "Public can read published knowledge nodes"
on public.knowledge_nodes
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Authenticated users can manage knowledge nodes" on public.knowledge_nodes;
create policy "Authenticated users can manage knowledge nodes"
on public.knowledge_nodes
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read published video topics" on public.video_topics;
create policy "Public can read published video topics"
on public.video_topics
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Authenticated users can manage video topics" on public.video_topics;
create policy "Authenticated users can manage video topics"
on public.video_topics
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read published topics" on public.topics;
create policy "Public can read published topics"
on public.topics
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Authenticated users can manage topics" on public.topics;
create policy "Authenticated users can manage topics"
on public.topics
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read tags" on public.tags;
create policy "Public can read tags"
on public.tags
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated users can manage tags" on public.tags;
create policy "Authenticated users can manage tags"
on public.tags
for all
to authenticated
using (true)
with check (true);

-- Development-only option:
-- If you need to test /admin/nodes write operations before login is implemented,
-- use an isolated Supabase test project and leave Vercel environment variables
-- empty. Do not add anon insert/update/delete policies on a production project.
