# Resend Email Setup Guide — ESME METRIX 2026

دليل إعداد إرسال إيميل تأكيد التسجيل عبر **Resend** من خلال **Supabase Edge Function** باسم `send-confirmation`، كما هو محدد في ملف `ESME Metrix Prompt.html` (القسم 6: QR Code & Email System).

---

## 1. ما الذي يقوم به النظام؟

فور حفظ المشارك في جدول `registrants`، يرسل `/api/register` طلباً إلى الـ Edge Function في الخلفية (داخل `after()` في Next.js، فلا يتأخر رد التسجيل على المستخدم). الـ Function تقرأ بيانات المشارك من قاعدة البيانات وترسل له الإيميل عبر Resend.

| البند (حسب الـ Prompt) | التنفيذ |
|---|---|
| From | `"ESME Metrix <...>"` من المتغير `RESEND_FROM_EMAIL` |
| Subject | `✅ You're registered — ESME Metrix 2026` |
| 1. هيدر بالشعار واسم الحدث | شعار `esme_logo.png` من رابط الموقع + "ESME METRIX 2026" |
| 2. تحية شخصية | `Dear [Full Name],` + رسالة الترحيب المعتمدة من فريق التنظيم |
| 3. تأكيد بعلامة خضراء | دائرة ✓ خضراء + شارة "REGISTRATION CONFIRMED" |
| 4. كود QR داخل الإيميل | مرفق Inline بطريقة CID (`cid:metrix-qr`) — يظهر في Gmail و Outlook |
| 5. بيانات المشارك (Visitor Pass) | الاسم، الحالة الأكاديمية، الجامعة، القسم، الحدث، التاريخ، رقم التسجيل |
| 6. بيانات الحدث | التاريخ، المكان، الميعاد |
| 7. تعليمات الـ QR + التوقيع | إبراز الكود عند البوابة، توقيع Kareem Tamer — Director of Digital Transformation & IT |
| 8. روابط السوشيال + فوتر | فيسبوك / إنستجرام / لينكد إن / واتساب (الموجود منها فقط) |
| 9. الشعار اللفظي | `BE POSITIVE VALUABLE` |

> **الخصوصية:** الرقم القومي **لا يظهر في الإيميل نهائياً** لأن الإيميلات قد يُعاد توجيهها. الرقم الكامل موجود فقط في قاعدة البيانات ولوحة الأدمن.

### ترتيب الإرسال (Fallback)

```
/api/register
   │
   ├─ 1) Supabase Edge Function "send-confirmation" ──► Resend   (الأساسي)
   │        يفشل أو غير مُعد؟
   ├─ 2) Resend مباشرة من سيرفر Next.js                         (بديل)
   │        يفشل أو غير مُعد؟
   └─ 3) Gmail SMTP (nodemailer)                                 (آخر حل)
```

- كل المسارات تستخدم **نفس قالب الإيميل** من ملف واحد: `supabase/functions/_shared/confirmation-template.ts`.
- يتم إرسال `Idempotency-Key` لـ Resend لكل رقم تسجيل، فلو فشل الاتصال بالـ Function بعد ما أرسلت فعلاً ثم حاول Next.js مرة أخرى، **لن يصل الإيميل مرتين** (خلال 24 ساعة).

---

## 2. الحصول على Resend API Key

1. ادخل إلى [Resend.com](https://resend.com) وأنشئ حساباً مجانياً (3,000 إيميل/شهر، 100/يوم).
2. من قائمة **API Keys** اضغط **Create API Key**.
3. سمّه مثلاً `esme-metrix-prod`، واختر الصلاحية **Sending access** فقط (أكثر أماناً من Full Access).
4. انسخ المفتاح الذي يبدأ بـ `re_...` — لن يظهر مرة أخرى.

---

## 3. إعداد الدومين

### الخيار أ: وضع الاختبار (Development)
```env
RESEND_FROM_EMAIL="ESME Metrix <onboarding@resend.dev>"
```
*في هذا الوضع يسمح Resend بالإرسال فقط إلى الإيميل المسجّل به حساب Resend.*

### الخيار ب: الإنتاج بدومين خاص (Production)
1. من صفحة **Domains** في Resend أضف الدومين (مثل `esme-cu.org`).
2. أضف سجلات DNS المطلوبة (DKIM, SPF, MX) عند مزود الدومين (Cloudflare / Namecheap ...).
3. بعد ظهور الحالة **Verified**:
```env
RESEND_FROM_EMAIL="ESME Metrix <noreply@esme-cu.org>"
```

---

## 4. نشر الـ Edge Function على Supabase

### أ) تثبيت Supabase CLI وربط المشروع
```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>
```
*(الـ project ref موجود في رابط المشروع: `https://<project-ref>.supabase.co`)*

### ب) إنشاء سر مشترك بين Next.js والـ Function
```bash
# أي نص عشوائي طويل — مثال لتوليده:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### ج) إضافة الأسرار (Secrets) للـ Function
```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
supabase secrets set RESEND_FROM_EMAIL="ESME Metrix <noreply@esme-cu.org>"
supabase secrets set EMAIL_FUNCTION_SECRET=<السر الذي ولّدته>
supabase secrets set APP_URL=https://your-domain.vercel.app

# اختياري: بيانات الحدث وروابط السوشيال
supabase secrets set EVENT_DATE="12 December 2026"
supabase secrets set EVENT_VENUE="Cairo University, Faculty of Engineering"
supabase secrets set EVENT_TIME="Saturday 12 / 12 / 2026 — 09:00 AM"
supabase secrets set ESME_FACEBOOK_URL=https://facebook.com/...
supabase secrets set ESME_INSTAGRAM_URL=https://instagram.com/...
supabase secrets set ESME_LINKEDIN_URL=https://linkedin.com/company/...
supabase secrets set ESME_WHATSAPP_URL=https://chat.whatsapp.com/...
```
*يمكن أيضاً إضافتها من **Supabase Dashboard → Edge Functions → Secrets**. المتغيران `SUPABASE_URL` و `SUPABASE_SERVICE_ROLE_KEY` متاحان تلقائياً.*

### د) النشر
```bash
supabase functions deploy send-confirmation --no-verify-jwt
```
> `--no-verify-jwt` مطلوب لأن الحماية تتم بالسر المشترك `x-esme-email-secret` بدلاً من JWT.
> الـ Function **لا تقبل عنوان إيميل أو نص رسالة من الطلب (request)**؛ تقرأ إيميل المشارك من قاعدة البيانات فقط، فحتى لو تسرّب السر لا يمكن استخدامها لإرسال رسائل لأي شخص آخر.

---

## 5. متغيرات Next.js (`.env.local` و Vercel)

```env
# مطلوب لتشغيل الـ Edge Function (المسار الأساسي)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EMAIL_FUNCTION_SECRET=<نفس السر المضاف في Supabase>

# مطلوب للبديل المباشر (يُفضّل إضافته)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL="ESME Metrix <noreply@esme-cu.org>"

# الشعار في الإيميل يُحمّل من هنا (يجب أن يكون https)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# اختياري
EVENT_DATE="12 December 2026"
EVENT_VENUE="Cairo University, Faculty of Engineering"
EVENT_TIME="Saturday 12 / 12 / 2026 — 09:00 AM"
ESME_FACEBOOK_URL=
ESME_INSTAGRAM_URL=
ESME_LINKEDIN_URL=
ESME_WHATSAPP_URL=

# اختياري: "direct" لتخطي الـ Edge Function والإرسال من Next.js مباشرة
EMAIL_DELIVERY=

# آخر حل: Gmail SMTP (App Password)
# الإيميل يُرسل من عنوان Gmail نفسه باسم "ESME Metrix" (حد Gmail حوالي 500 إيميل/يوم)
SMTP_USER=your.account@gmail.com
SMTP_PASS=<App Password من 16 حرف>
```

---

## 6. اختبار الإرسال

### اختبار الـ Function مباشرة
```bash
curl -X POST "https://<project-ref>.supabase.co/functions/v1/send-confirmation" \
  -H "Content-Type: application/json" \
  -H "x-esme-email-secret: <EMAIL_FUNCTION_SECRET>" \
  -d '{"registration_id":"MX8-ABCDEF"}'
```
| الرد | المعنى |
|---|---|
| `200 {"success":true,"resend_id":"..."}` | تم الإرسال |
| `401 Unauthorized` | السر غير صحيح أو مفقود |
| `404 Registration not found` | رقم التسجيل غير موجود |
| `500 Email function is not configured` | ينقص أحد الأسرار (`RESEND_API_KEY` / `EMAIL_FUNCTION_SECRET`) |
| `502 Email provider rejected the message` | Resend رفض الرسالة — غالباً الدومين غير مُفعّل أو المستلم غير مسموح في وضع الاختبار |

### متابعة السجلات
- سجلات الـ Function: **Supabase Dashboard → Edge Functions → send-confirmation → Logs** أو `supabase functions logs send-confirmation`.
- حالة كل إيميل: **Resend Dashboard → Emails**.
- سجلات Next.js على Vercel تُظهر أي مسار تم استخدامه (`sent via Edge Function` / `sent via Resend` / `sent via Gmail SMTP`).

---

## 7. الملفات المعنية

| الملف | الدور |
|---|---|
| `supabase/functions/send-confirmation/index.ts` | الـ Edge Function (Deno) |
| `supabase/functions/_shared/confirmation-template.ts` | قالب الإيميل + الإرسال عبر Resend REST API (مشترك) |
| `src/lib/email/confirmation.ts` | ترتيب الإرسال في Next.js (Function ← Resend ← SMTP) |
| `src/app/api/register/route.ts` | يستدعي `dispatchConfirmationEmail()` بعد حفظ التسجيل |
| `tests/unit/email-template.test.ts` | اختبارات القالب |
