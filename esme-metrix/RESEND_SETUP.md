# Resend Email Setup Guide — ESME METRIX 2026

دليل تشغيل وإعداد خدمة **Resend** لإرسال رسائل تأكيد التسجيل وكود الـ QR والبيانات للمشاركين تلقائياً.

---

## 1. ما الذي يقوم به النظام؟
فور قيام أي مشارك بالتسجيل في المنصة:
1. يتم توليد كود الـ QR الرقمي الموقّع ومشفّر.
2. يتم إرسال بريد إلكتروني رسمي فوري يحتوي على:
   - **كود الـ QR كمرفق وفي داخل جسم الرسالة (CID Inline Image)**.
   - بيانات المشارك بالكامل (الاسم، الجامعة، القسم، سنة التخرج، رقم التسجيل).
   - ميعاد ومكان الحدث (12 ديسمبر 2026 - جامعة القاهرة).
   - تنويه الحصول على شهادة الحضور المعتمدة عند إبراز الكود.
   - زر ورابط مباشر للانضمام لجروب الواتساب الرسمي.

---

## 2. خطوات الحصول على Resend API Key

1. ادخل إلى موقع [Resend.com](https://resend.com) وأنشئ حساباً مجانياً.
2. انتقل إلى قائمة **API Keys** واضغط على **Create API Key**.
3. قم بتسمية المفتاح مثلاً: `esme-metrix-prod` واختر الصلاحيات `Full Access`.
4. انسخ المفتاح الذي يبدأ بـ `re_...`.

---

## 3. إعداد الدومين (أو وضع الاختبار المجاني)

### الخيار أ: وضع الاختبار السريع (Development / Testing)
- يمكنك استخدام دومين الاختبار التلقائي من Resend:
  ```env
  RESEND_FROM_EMAIL="ESME Metrix <onboarding@resend.dev>"
  ```
  *(في هذا الوضع يسمح Resend بالإرسال إلى نفس الإيميل المسجل به في حساب Resend فقط).*

### الخيار ب: وضع الإنتاج بالدومين الخاص (Production Domain)
- انتقل إلى صفحة **Domains** في Resend وأضف دومين موقعك أو كليتك (مثل: `esme-cu.org`).
- أضف سجلات الـ DNS المطلوبة (DKIM, SPF, MX) في مزود الدومين الخاص بك (مثل Cloudflare أو Namecheap).
- بعد تفعيل الدومين، اضبط المتغير:
  ```env
  RESEND_FROM_EMAIL="ESME Metrix <contact@yourdomain.com>"
  ```

---

## 4. إضافة المتغيرات في ملف `.env.local`

أضف المتغيرات التالية في ملفك المحلي أو في إعدادات البيئة على **Vercel**:

```env
# مفتاح Resend API
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx

# البريد المرسل
RESEND_FROM_EMAIL="ESME Metrix <onboarding@resend.dev>"

# (اختياري) بديل Gmail SMTP في حالة عدم توفر Resend:
SMTP_USER=
SMTP_PASS=
```

---

## 5. آلية العمل البرمجية (Architecture)
- تم بناء الكود في [confirmation.ts](file:///d:/ESME-Metrix-Registeraion-main/src/lib/email/confirmation.ts) ليعمل بمحرك **Resend** الأساسي:
  ```ts
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: emailContent.from,
    to,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text,
    attachments: emailContent.attachments,
  });
  ```
- يتم تشغيل الإرسال داخل Next.js `after()` في [register/route.ts](file:///d:/ESME-Metrix-Registeraion-main/src/app/api/register/route.ts) بحيث لا يؤخر استجابة التسجيل للمستخدم على المتصفح نهائياً (Background Worker Dispatch).
