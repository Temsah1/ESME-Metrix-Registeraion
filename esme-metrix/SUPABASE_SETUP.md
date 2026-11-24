# Supabase Database & Security Guide — ESME METRIX 2026

دليل إعداد قاعدة بيانات **Supabase** وجداول التسجيل والأمان وإدارة المحتوى (CMS).

---

## 1. المتغيرات المطلوبة في `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
QR_SIGNING_SECRET=your-secure-random-secret-key-32-chars
```

---

## 2. تشغيل المهاجرات (SQL Migrations)

ادخل إلى **Supabase Dashboard > SQL Editor** وقم بتشغيل ملفات المهاجرة بالترتيب:

### 1) جدول المشتركين (Registrants Table):
```sql
CREATE TABLE IF NOT EXISTS public.registrants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  national_id VARCHAR(20),
  graduation_year VARCHAR(10),
  university TEXT NOT NULL,
  faculty TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  city TEXT NOT NULL,
  job_title TEXT NOT NULL,
  company TEXT,
  id_photo_url TEXT NOT NULL,
  karnet_photo_url TEXT NOT NULL,
  avatar_url TEXT,
  qr_code TEXT NOT NULL,
  registration_id TEXT NOT NULL UNIQUE,
  linkedin_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2) جدول الحضور (Attendance Table):
```sql
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registrant_id UUID REFERENCES public.registrants(id) ON DELETE CASCADE,
  scanned_by TEXT NOT NULL,
  scanned_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT
);
```

### 3) جدول إدارة المحتوى (Site Content / CMS):
```sql
CREATE TABLE IF NOT EXISTS public.site_content (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  label VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'general',
  field_type VARCHAR(50) NOT NULL DEFAULT 'text',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- السماح للجميع بقراءة المحتوى
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admin write site_content" ON public.site_content FOR ALL USING (auth.role() = 'authenticated');
```

---

## 3. إعداد التخزين (Storage Buckets)

1. توجه إلى **Storage** في Supabase.
2. أنشئ Bucket باسم `photos`.
3. اضبط الصلاحيات (Policies) بحيث يُسمح برفع الصور (`jpg`, `jpeg`, `png`) من خلال الفورم.

---

## 4. حساب مدير النظام (Admin User)

1. توجه إلى **Authentication > Users** في Supabase.
2. اضغط **Add User > Create User** وأدخل:
   - Email: `admin@esme-cu.com` (أو إيميلك الشخصي).
   - Password: كلمة مرور قوية.
3. يمكنك الآن تسجيل الدخول مباشرة عبر:
   `http://localhost:3000/admin`
