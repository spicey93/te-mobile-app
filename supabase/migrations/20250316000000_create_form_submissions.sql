-- Form submissions table (customer-facing form data)
create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now() not null,
  name text not null,
  email text not null,
  message text not null
);

-- Enable RLS
alter table public.form_submissions enable row level security;

-- Anyone can insert (public form submissions)
create policy "Allow public insert"
  on public.form_submissions
  for insert
  to anon
  with check (true);

-- Only authenticated users can read (admin in mobile app)
create policy "Allow authenticated read"
  on public.form_submissions
  for select
  to authenticated
  using (true);
