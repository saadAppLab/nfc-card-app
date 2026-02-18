
# NFC Business Card – Next.js + Supabase (Free MVP)

A complete starter to run your NFC-enabled digital business card: public profile pages, QR code, vCard download, theming, image upload, and basic analytics.

## 1) Prerequisites
- Node.js 18+ and npm (or pnpm)
- A free [Supabase](https://supabase.com/) project
- (Optional) A free [Vercel](https://vercel.com/) account for deployment

## 2) Create Supabase project
1. Go to Supabase → create a new project (Free).
2. Grab your **Project URL** and **anon public key** from **Project Settings → API**.
3. Also copy the **service_role** key (server-only) from the same page. Keep it secret.
4. Create a **Storage bucket** named `avatars` and set it to **public**.

## 3) Create Database Tables & Policies
Open the **SQL editor** in Supabase and run the following (execute sequentially):

```sql
-- Enable UUID generation
create extension if not exists pgcrypto;

-- PROFILES table
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  title text,
  bio text,
  phone text,
  email text,
  whatsapp text,
  linkedin text,
  instagram text,
  website text,
  avatar_url text,
  theme jsonb default '{}'::jsonb,
  slug text unique not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create or replace trigger profiles_touch
before update on public.profiles
for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;

-- Anyone can read profiles (public profiles)
create policy profiles_read_public on public.profiles
for select using (true);

-- Users can insert their own profile
create policy profiles_insert_own on public.profiles
for insert with check (auth.uid() = user_id);

-- Users can update only their own profile
create policy profiles_update_own on public.profiles
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ANALYTICS table
create table if not exists public.analytics (
  id bigint generated always as identity primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  event text not null,
  ip text,
  user_agent text,
  referrer text,
  ts timestamptz default now()
);

alter table public.analytics enable row level security;

-- Allow server to insert; allow users to read their own analytics
create policy analytics_select_own on public.analytics
for select using (
  exists (
    select 1 from public.profiles p
    where p.id = analytics.profile_id and p.user_id = auth.uid()
  )
);

-- Optional: if you prefer client-side insert (no service key), uncomment to allow anon inserts
-- create policy analytics_insert_any on public.analytics for insert with check (true);
```

**Storage Policies** (if needed): in Storage → `avatars` bucket → Policies → add **public read**, **authenticated write**.

```sql
-- Allow anyone to read files in avatars bucket
create policy "Public read" on storage.objects for select
  using (bucket_id = 'avatars');

-- Allow authenticated users to upload to avatars
create policy "Users can upload" on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- Allow authenticated users to update/delete their own files (optional)
create policy "Users manage own" on storage.objects for update using (
  bucket_id = 'avatars' and auth.role() = 'authenticated'
) with check (
  bucket_id = 'avatars' and auth.role() = 'authenticated'
);
```

## 4) Configure environment
Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...your url...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...anon key...
SUPABASE_SERVICE_ROLE_KEY=...service_role key (server-only)...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Never** expose the service role key in the browser. It only lives in server-side env (Vercel project env or local .env.local).

## 5) Install & run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

- Go to **/login**, enter your email → check inbox → click magic link → you will land on **/dashboard**.
- Fill out your profile and **Save**.
- Your public URL is **/profile/<slug>** → share it or encode it into your NFC tag.

## 6) Deployment (Vercel)
1. Push this project to GitHub.
2. Import into Vercel → Framework preset: Next.js.
3. Set Environment Variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server)
   - `NEXT_PUBLIC_SITE_URL` (e.g., https://yourdomain.com)
4. Deploy. After deploy, test your public profile and vCard.

## 7) NFC Encoding (URL in tag)
- Write the public profile URL (e.g., `https://yourdomain.com/profile/your-slug`) into your NFC card.
- Use apps like **NFC Tools** (Android/iOS) or **NXP TagWriter** to write a URL record.
- On tap, the phone opens the profile page.

## 8) Notes & Options
- **Analytics**: By default, the server API `/api/track` inserts events using the service role key. You can instead allow client-side inserts by enabling the `analytics_insert_any` policy.
- **Custom domain**: Point your domain to Vercel, update `NEXT_PUBLIC_SITE_URL`.
- **Security**: This is an MVP. Add rate limiting, validation, and captcha for production.
- **Web NFC** (optional): Only supported on Android Chrome. Not required because NFC only needs to store a URL.

## 9) Troubleshooting
- Magic link doesn’t redirect? Ensure `SITE_URL` and `Redirect URLs` in Supabase **Authentication → URL Configuration** include your local URL and production domain.
- Avatar upload fails? Ensure the `avatars` bucket exists and storage policies allow authenticated uploads.
- Analytics empty? Share your profile and check `/api/track` is reachable and `SUPABASE_SERVICE_ROLE_KEY` is set.

---
Enjoy building! 🚀
