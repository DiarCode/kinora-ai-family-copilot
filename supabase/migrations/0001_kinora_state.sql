-- Kinora: single-family demo state
--
-- The app's repository stores one FamilyState JSON snapshot per family. That
-- keeps the file backend and the hosted backend identical. The publishable key
-- cannot run DDL, so apply this migration in the Supabase SQL editor or with
-- `supabase db push` using a secret key.
--
-- This migration intentionally scopes anonymous access to the single demo row
-- (`bennett-demo`). Do not reuse these policies for real family data. For a
-- production multi-family deployment, add auth, a family_members table, and
-- policies that check `auth.uid()` against membership before reading the row.

create table if not exists public.kinora_state (
  id text primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.kinora_state enable row level security;

drop policy if exists "kinora demo read" on public.kinora_state;
create policy "kinora demo read"
  on public.kinora_state
  for select
  to anon, authenticated
  using (id = 'bennett-demo');

drop policy if exists "kinora demo insert" on public.kinora_state;
create policy "kinora demo insert"
  on public.kinora_state
  for insert
  to anon, authenticated
  with check (id = 'bennett-demo');

drop policy if exists "kinora demo update" on public.kinora_state;
create policy "kinora demo update"
  on public.kinora_state
  for update
  to anon, authenticated
  using (id = 'bennett-demo')
  with check (id = 'bennett-demo');

-- Optional: keep the table small and auditable.
create index if not exists kinora_state_updated_at_idx
  on public.kinora_state (updated_at desc);

-- The app seeds the row on first read. You can also seed it explicitly after
-- generating a state with the app:
-- insert into public.kinora_state (id, state)
-- values ('bennett-demo', '{}'::jsonb)
-- on conflict (id) do nothing;
