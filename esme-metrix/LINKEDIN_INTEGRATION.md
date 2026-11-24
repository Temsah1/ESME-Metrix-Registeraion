# LinkedIn Integration & Social Share Card Guide — ESME METRIX 2026

دليل شرح وتفعيل بطاقة الحضور المخصصة للشير على **LinkedIn** بنفس أسلوب المعارض الكبرى مثل **EGYPS** و **CAIRO ICT**.

---

## 1. كيف يعمل نظام بطاقة LinkedIn؟

1. بعد إتمام المشارك لعملية التسجيل، يتوجه إلى صفحة `/success`.
2. يتم توليد كارد حضور بدقة فائقة (1200x630) مخصص للشخص يحتوي على:
   - **صورته الشخصية (Attendee Portrait Photo)**.
   - شارة الحضور المعتمد `✓ VERIFIED ATTENDEE`.
   - اسمه الكامل، كليته وجامعته، ومسمى تخصصه الهندسي.
   - معرّف التسجيل الرسمي (Registration ID).
3. عند الضغط على زر **SHARE ON LINKEDIN**:
   - يتم نسخ نص البوست الاحترافي الجاهز إلى الحافظة تلقائياً.
   - يتم فتح نافذة مشاركة لينكد إن الرسمية:
     `https://www.linkedin.com/sharing/share-offsite/?url=...`
   - يوجه الرابط إلى `/share/[ticketId]`.
   - يقوم محرك Open Graph المدمج في الموقع بتسليم صورة الكارد المولدة ديناميكياً بدقة 1200x630 من:
     `/api/og?id=[ticketId]`
   - تظهر صورة بطاقة المشترك مباشرة في معاينة البوست على لينكد إن!

---

## 2. متطلبات عمل المعاينة في الإنتاج (Production)

لكي يقرأ زاحف لينكد إن (LinkedIn Crawler) الصورة بنجاح:
1. يجب أن يكون الموقع مرفوعاً على رابط متاح عاماً (مثل Vercel).
2. يجب ضبط المتغير التالي على Vercel أو في الاستضافة:
   ```env
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```
   *(في وضع localhost لن يتمكن سيرفر لينكد إن الخارجي من سحب الصورة من جهازك الخاص).*

---

## 3. اختبار البطاقة باستخدام LinkedIn Post Inspector

لاختبار شكل المنشور والتأكد من ظهور صورة المشترك بوضوح:
1. انسخ رابط صفحة المشاركة لأي مسجل، مثلاً:
   `https://your-domain.vercel.app/share/MX8-ABCDEF`
2. ادخل إلى أداة فحص لينكد إن الرسمية:
   [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
3. الصق الرابط واضغط **Inspect**؛ ستشاهد صورة الكارد بالبيانات والصورة وتاريخ الحدث (12 ديسمبر 2026).

---

## 4. الخصوصية: الرقم القومي وسنة التخرج

- **الرقم القومي (`national_id`) لا يظهر أبداً** في بطاقة LinkedIn، أو صفحة `/share/[ticketId]`، أو صورة `/api/og`، أو رد `GET /api/register` العام.
  - `/api/og` يقرأ فقط: `full_name, university, faculty, job_title, registration_id, avatar_url`.
  - `/share/[ticketId]` يقرأ فقط: `full_name`.
  - أي تعديل مستقبلي على هذه الملفات يجب ألا يضيف `national_id` إلى الـ `select`، لأن هذه الروابط عامة ويقرأها LinkedIn Crawler.
- الرقم القومي متاح فقط للأدمن (صفحات `/admin/*` و `/api/scan` بعد تسجيل الدخول) ولا يظهر في إيميل التأكيد.
- **سنة التخرج (`graduation_year`)** محفوظة في قاعدة البيانات ومتصلة بلوحة الأدمن (فلتر + تصدير)، لكنها غير معروضة على بطاقة LinkedIn حالياً. لإضافتها لاحقاً (مثلاً "Class of 2026")، أضف `graduation_year` إلى الـ `select` في `src/app/api/og/route.tsx` فقط.
