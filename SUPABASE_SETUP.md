# Supabase Database & Security Guide — ESME METRIX 2026

Setup guide for **Supabase** tables, Storage buckets, RLS security policies, and CMS configuration.

---

## 1. Required `.env.local` Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
QR_SIGNING_SECRET=your-secure-random-secret-key-32-chars
```

---

## 2. Running SQL Migrations

Open **Supabase Dashboard > SQL Editor** and run the migration files inside `supabase/migrations/` in order (`0001` through `0007`), or run [supabase_schema.sql](supabase_schema.sql) for a fresh setup.

---

## 3. Storage Bucket (`photos`)

1. Open **Storage** in Supabase.
2. Create a bucket named `photos` (or confirm it exists from `supabase_schema.sql`).
3. Ensure upload policies accept `jpg`, `jpeg`, and `png` files through the registration form and Admin CMS uploader.

---

## 4. Admin Console User

1. Go to **Authentication > Users** in Supabase.
2. Click **Add User > Create User** and enter an email (e.g., `admin@esme-cu.com`) and a strong password.
3. Sign in via `/admin`.
