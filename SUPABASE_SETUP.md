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

| الحالة | ماذا تشغّل |
|---|---|
| **مشروع جديد (قاعدة فاضية)** | ملف `supabase_schema.sql` كاملاً مرة واحدة، ثم `0004` و `0005` (لمحتوى الـ CMS فقط). |
| **مشروع قائم وفيه تسجيلات** | ملفات `supabase/migrations/` بالترتيب: `0003` → `0004` → `0005` → `0006`. |

| ملف المهاجرة | الغرض |
|---|---|
| `0001_security_hardening.sql` | جعل الـ bucket خاص (**لا تشغّله** قبل تعديل كود الصور — راجع التعليق داخل الملف). |
| `0002_site_content.sql` | جدول الـ CMS. |
| `0003_avatar_url.sql` | عمود الصورة الشخصية `avatar_url`. |
| `0004_homepage_cms.sql` | نصوص ومعرض الصفحة الرئيسية. |
| `0005_fields_and_agenda.sql` | إضافة عمودي `national_id` و `graduation_year` + أجندة الحدث. |
| `0006_national_id_graduation_year_constraints.sql` | **ربط الحقلين بقاعدة البيانات:** منع تكرار الرقم القومي، التحقق من الصيغة، فهرس سنة التخرج، وتحديث الـ schema cache. |

### 1) جدول المشتركين (Registrants Table):
```sql
CREATE TABLE IF NOT EXISTS public.registrants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  national_id VARCHAR(20),          -- الرقم القومي (14 رقم) — فريد
  graduation_year VARCHAR(10),      -- سنة التخرج (4 أرقام) مثل 2026
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
  created_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT registrants_national_id_format_chk
    CHECK (national_id IS NULL OR national_id ~ '^[23][0-9]{13}$'),
  CONSTRAINT registrants_graduation_year_format_chk
    CHECK (graduation_year IS NULL OR graduation_year ~ '^(19|20)[0-9]{2}$')
);

-- لا يمكن التسجيل مرتين بنفس الرقم القومي
CREATE UNIQUE INDEX IF NOT EXISTS uq_registrants_national_id
  ON public.registrants (national_id) WHERE national_id IS NOT NULL;

-- فلترة وتقارير حسب سنة التخرج
CREATE INDEX IF NOT EXISTS idx_registrants_graduation_year
  ON public.registrants (graduation_year);

-- تحديث الـ API حتى يرى الأعمدة الجديدة
NOTIFY pgrst, 'reload schema';
```

### 1-ب) الرقم القومي وسنة التخرج — كيف يرتبطان بالنظام

| المرحلة | الرقم القومي `national_id` | سنة التخرج `graduation_year` |
|---|---|---|
| فورم التسجيل (`/register`) | الخطوة 1، إجباري، 14 رقم يبدأ بـ 2 أو 3 | الخطوة 2، إجباري، قائمة 2024 → 2030 |
| التحقق (`validations/registration.ts`) | `EGYPTIAN_NATIONAL_ID_REGEX` + `trim` | `GRADUATION_YEAR_REGEX`، من 1990 إلى 2035 |
| الـ API (`/api/register`) | فحص التكرار مع الموبايل والإيميل → رسالة 409 | يُحفظ مع التسجيل |
| قاعدة البيانات | `CHECK` للصيغة + `UNIQUE INDEX` | `CHECK` للصيغة + `INDEX` |
| إيميل التأكيد | **لا يظهر** | غير معروض (الإيميل يعرض الحالة الأكاديمية والقسم) |
| لوحة الأدمن — Registrants | بحث + عمود + تصدير Excel | فلتر "Class of" + عمود + تصدير Excel |
| لوحة الأدمن — Search | بحث مباشر بالرقم القومي (14 رقم) | يظهر في بطاقة المشترك |
| الماسح (`/admin/scanner`) | يظهر لمطابقته مع البطاقة عند البوابة | يظهر "Class of 2026" |
| بطاقة LinkedIn / صفحة الشير / OG | **لا يظهر أبداً** (بيانات حساسة) | غير مستخدم |

> **ملاحظة:** العمودان يقبلان `NULL` حتى لا تفشل المهاجرة على التسجيلات القديمة التي تمت قبل إضافة الحقلين. التسجيلات الجديدة يفرض عليها الفورم والـ API إدخالهما. بعد التأكد من أن كل الصفوف بها قيم، يمكنك جعلهما `NOT NULL` بالأوامر الموجودة في آخر ملف `0006`.

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

---

## 5. حل المشاكل (Troubleshooting)

| الخطأ | السبب | الحل |
|---|---|---|
| `Could not find the 'national_id' column of 'registrants' in the schema cache` | لم يتم تشغيل `0005` أو الـ API لم يحدّث الـ cache | شغّل `0005` ثم `0006` (يحتوي على `NOTIFY pgrst, 'reload schema'`). |
| `WARNING: uq_registrants_national_id NOT created` | يوجد رقم قومي مكرر في تسجيلات قديمة | استخدم استعلام البحث عن المكرر في آخر ملف `0006`، احذف أو صحح المكرر، ثم أعد تشغيل `0006`. |
| رسالة "A registration already exists with this National ID." | الرقم القومي مسجل بالفعل | سلوك مقصود — شخص واحد = تسجيل واحد. |
| خطأ `23514` (check_violation) | قيمة بصيغة غير صحيحة وصلت لقاعدة البيانات | الـ API يحوّله لرسالة 400 واضحة؛ تأكد أن العميل يرسل 14 رقم و سنة من 4 أرقام. |
