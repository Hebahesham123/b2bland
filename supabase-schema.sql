-- Run this in Supabase SQL Editor

-- Campaigns: each row is a landing page reachable at /<id>
create table if not exists public.campaigns (
  id bigint generated always as identity primary key,
  name text not null,
  title text not null default 'شركة نجيب سليم | خبرة، جودة، واستمرارية',
  discount_text text not null default 'خصم 10% علي جميع الأقمشة',
  subtitle text not null default 'في فروع الاسكندرية',
  cta_text text not null default 'سجّل الآن لتحصل على قسيمتك!',
  promo_code text not null,
  banner_url text not null default '/banner.png',
  logo_url text not null default '/logo.png',
  active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists public.submissions (
  id uuid default gen_random_uuid() primary key,
  campaign_id bigint references public.campaigns(id) on delete cascade,
  full_name text not null,
  phone_number text not null,
  promo_code text not null,
  created_at timestamptz default now()
);

-- Add campaign_id if migrating from older schema
alter table public.submissions
  add column if not exists campaign_id bigint references public.campaigns(id) on delete cascade;

create index if not exists submissions_campaign_id_idx on public.submissions(campaign_id);

alter table public.campaigns enable row level security;
alter table public.submissions enable row level security;

-- Public can read campaigns (so the landing page can render)
drop policy if exists "Public read campaigns" on public.campaigns;
create policy "Public read campaigns"
  on public.campaigns for select using (true);

-- Admin writes go through the API which gates with ADMIN_SECRET, but the API
-- uses the anon key to talk to Supabase, so we need permissive write policies.
drop policy if exists "Public insert campaigns" on public.campaigns;
create policy "Public insert campaigns"
  on public.campaigns for insert with check (true);

drop policy if exists "Public update campaigns" on public.campaigns;
create policy "Public update campaigns"
  on public.campaigns for update using (true) with check (true);

drop policy if exists "Public delete campaigns" on public.campaigns;
create policy "Public delete campaigns"
  on public.campaigns for delete using (true);

-- Public can insert a submission (the landing form)
drop policy if exists "Public insert submissions" on public.submissions;
create policy "Public insert submissions"
  on public.submissions for insert with check (true);

-- Read submissions allowed (admin gate is enforced in the API via ADMIN_SECRET)
drop policy if exists "Public read submissions" on public.submissions;
create policy "Public read submissions"
  on public.submissions for select using (true);
