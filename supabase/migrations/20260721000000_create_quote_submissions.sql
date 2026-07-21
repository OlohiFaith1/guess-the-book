-- Community quote submissions for Guess the Book.
-- Every submission starts as 'pending' and is only usable in gameplay once
-- manually approved (via the Supabase Table Editor) AND the AI hint has
-- been generated for it by the generate-hint Edge Function.

create table if not exists public.quote_submissions (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  book_title text not null,
  author text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  -- Filled in automatically by the generate-hint Edge Function once a
  -- submission is approved — never entered by the submitting user.
  hint text,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  genre text,
  hint_generated_at timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.quote_submissions is
  'User-submitted book quotes awaiting moderation. Approve/reject manually '
  'from the Supabase Table Editor by editing the status column.';

create index if not exists quote_submissions_status_idx
  on public.quote_submissions (status);

alter table public.quote_submissions enable row level security;

-- Anyone (the anon key used by the app) can submit a new quote, but only
-- ever as 'pending' — they cannot insert a row that's already approved.
create policy "Anyone can submit a pending quote"
  on public.quote_submissions
  for insert
  to anon
  with check (status = 'pending');

-- Anyone can read quotes once they're approved and have a hint — this is
-- what gameplay fetches from. Pending/rejected rows stay invisible to the
-- app; only you can see them, via the Table Editor (which uses your
-- authenticated dashboard session, not this policy).
create policy "Anyone can read approved, hinted quotes"
  on public.quote_submissions
  for select
  to anon
  using (status = 'approved' and hint is not null);

-- No update/delete policy for anon — status changes happen only via the
-- Table Editor (dashboard) or the service-role key (the Edge Function),
-- both of which bypass RLS entirely.
