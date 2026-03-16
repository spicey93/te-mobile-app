# Mobile App + Public Website

A React Native (Expo) admin app with a customer-facing public website. Form submissions from the website are stored in Supabase and viewable by admin users in the mobile app.

## Architecture

- **Website** (`/website`) – Public contact form (name, email, message)
- **Mobile app** – Admin login to view form submissions
- **Supabase** – Database, auth, and RLS

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).

2. Run the migration in the SQL editor (Supabase Dashboard → SQL Editor):

```sql
-- From supabase/migrations/20250316000000_create_form_submissions.sql
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

3. Get your project URL and anon key from **Settings → API**.

4. Create env files:

**Mobile app** – create `.env` in the project root:

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Website** – create `website/.env`:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Run the website

```bash
cd website
npm run dev
```

Open the URL shown (e.g. http://localhost:5173). Submit the form to create a submission.

## Run the mobile app

```bash
npm start
```

- Press **i** for iOS Simulator
- Press **a** for Android Emulator
- Or scan the QR code with Expo Go

**Admin flow:** Sign up with email/password (first time), then sign in. Use "View submissions" to see form entries.

## Project structure

```
├── App.tsx
├── lib/supabase.ts          # Supabase client (mobile)
├── context/AuthContext.tsx  # Supabase Auth
├── screens/
│   ├── LoginScreen.tsx
│   ├── HomeScreen.tsx
│   └── SubmissionsScreen.tsx
├── supabase/migrations/
│   └── 20250316000000_create_form_submissions.sql
└── website/
    ├── src/
    │   ├── App.tsx          # Contact form
    │   └── lib/supabase.ts
    └── .env
```
