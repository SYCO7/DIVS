-- ============================================================
--  DIVS — Digital Identity Verification System
--  Supabase SQL Schema
--  Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
--  TABLE: identities
-- ============================================================
create table if not exists public.identities (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users(id) on delete set null,
  full_name         text not null,
  email             text not null,
  phone             text,
  date_of_birth     date,
  document_type     text check (document_type in ('aadhaar', 'pan', 'passport', 'driving')),
  document_number   text,
  document_url      text,
  selfie_url        text,
  face_descriptor   float8[],             -- 128-point facial embedding
  status            text default 'pending'
                    check (status in ('pending', 'verified', 'rejected', 'under_review')),
  verification_score integer default 0,
  liveness_score    integer,
  ocr_confidence    integer,
  audit_hash        text,
  rejection_reason  text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),
  verified_at       timestamptz
);

-- ============================================================
--  TABLE: verification_logs  (Blockchain-style audit trail)
-- ============================================================
create table if not exists public.verification_logs (
  id            uuid primary key default gen_random_uuid(),
  identity_id   uuid references public.identities(id) on delete cascade,
  action        text not null,            -- e.g. 'identity_submitted', 'status_changed'
  metadata      jsonb default '{}',
  ip_address    inet,
  hash          text,                     -- SHA-256 hash for tamper detection
  created_at    timestamptz default now()
);

-- ============================================================
--  TABLE: admin_users
-- ============================================================
create table if not exists public.admin_users (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade unique,
  role        text default 'reviewer' check (role in ('admin', 'reviewer')),
  created_at  timestamptz default now()
);

-- ============================================================
--  AUTO-UPDATE updated_at
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger identities_updated_at
  before update on public.identities
  for each row execute function public.handle_updated_at();

-- ============================================================
--  ROW LEVEL SECURITY
-- ============================================================
alter table public.identities enable row level security;
alter table public.verification_logs enable row level security;
alter table public.admin_users enable row level security;

create policy "Users can check own admin status"
  on public.admin_users for select
  using (auth.uid() = user_id);

-- Users can read and insert their own identity
create policy "Users can insert own identity"
  on public.identities for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users can view own identity"
  on public.identities for select
  using (auth.uid() = user_id);

create policy "Admins can view all identities"
  on public.identities for select
  using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid()
    )
  );

create policy "Admins can update identities"
  on public.identities for update
  using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid()
    )
  );

-- Logs are insert-only for authenticated users
create policy "Insert verification logs"
  on public.verification_logs for insert
  with check (true);

create policy "Admins can read logs"
  on public.verification_logs for select
  using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid()
    )
  );

-- ============================================================
--  STORAGE BUCKET for documents
-- ============================================================
-- Run in Supabase Dashboard > Storage > New Bucket
-- Bucket name: identity-docs
-- Public: false (private)

-- ============================================================
--  MAKE YOURSELF ADMIN (replace with your user UUID)
-- ============================================================
-- insert into public.admin_users (user_id, role)
-- values ('your-user-uuid-here', 'admin');

-- ============================================================
--  INDEXES for performance
-- ============================================================
create index if not exists idx_identities_email on public.identities(email);
create index if not exists idx_identities_status on public.identities(status);
create index if not exists idx_identities_user_id on public.identities(user_id);
create index if not exists idx_logs_identity_id on public.verification_logs(identity_id);
