create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.knowledge_nodes (
  id uuid primary key default gen_random_uuid(),
  code text,
  slug text unique,
  title text not null,
  module text,
  summary text,
  definition text,
  core_idea text,
  explanation text,
  examples jsonb default '[]'::jsonb,
  tags text[] default '{}',
  relations text[] default '{}',
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.video_topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  core_idea text,
  related_nodes text[] default '{}',
  status text default 'inspiration',
  platform text,
  outline text,
  script text,
  publish_url text,
  publish_date date,
  review text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  description text,
  related_nodes text[] default '{}',
  related_videos text[] default '{}',
  sort_order integer default 0,
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  type text,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists knowledge_nodes_slug_idx on public.knowledge_nodes (slug);
create index if not exists knowledge_nodes_module_idx on public.knowledge_nodes (module);
create index if not exists knowledge_nodes_status_idx on public.knowledge_nodes (status);
create index if not exists video_topics_status_idx on public.video_topics (status);
create index if not exists topics_slug_idx on public.topics (slug);
create index if not exists topics_status_idx on public.topics (status);
create index if not exists tags_type_idx on public.tags (type);

drop trigger if exists set_knowledge_nodes_updated_at on public.knowledge_nodes;
create trigger set_knowledge_nodes_updated_at
before update on public.knowledge_nodes
for each row
execute function public.set_updated_at();

drop trigger if exists set_video_topics_updated_at on public.video_topics;
create trigger set_video_topics_updated_at
before update on public.video_topics
for each row
execute function public.set_updated_at();

drop trigger if exists set_topics_updated_at on public.topics;
create trigger set_topics_updated_at
before update on public.topics
for each row
execute function public.set_updated_at();

drop trigger if exists set_tags_updated_at on public.tags;
create trigger set_tags_updated_at
before update on public.tags
for each row
execute function public.set_updated_at();
