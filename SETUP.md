# Supabase setup – next steps

You've created a Supabase project. Complete these steps:

## 1. Run the database migration

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New query**
5. Paste and run this SQL:

```sql
create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now() not null,
  name text not null,
  email text not null,
  message text not null
);

alter table public.form_submissions enable row level security;

create policy "Allow public insert"
  on public.form_submissions for insert to anon with check (true);

create policy "Allow authenticated read"
  on public.form_submissions for select to authenticated using (true);
```

6. Click **Run** (or Cmd/Ctrl+Enter)

## 2. Get your API credentials

1. In the Supabase Dashboard, go to **Settings** (gear icon) → **API**
2. Copy:
   - **Project URL** (e.g. `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## 3. Add credentials to your project

**Mobile app** – edit `.env` in the project root:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Website** – edit `website/.env`:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Use the same URL and key in both files.

## 4. Enable email auth (for admin sign-up)

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Ensure **Email** is enabled
3. (Optional) Under **Email**, turn off "Confirm email" if you want to skip verification during development

## 5. Run the apps

**Website:**
```bash
cd website
npm run dev
```

**Mobile app** (restart if already running so it picks up `.env`):
```bash
npm start
```

Then sign up in the mobile app to create your first admin account.
