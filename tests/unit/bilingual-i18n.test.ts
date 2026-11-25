import { describe, it, expect } from "vitest";
import { getDictionary } from "@/lib/i18n/dictionary";
import {
  localizeCity,
  localizeCommittee,
  localizeDepartment,
  localizeFaculty,
  localizeRole,
} from "@/lib/i18n/registrationLabels";
import { DEFAULT_FULL_CMS } from "@/lib/cms/defaults";
import {
  DEFAULT_ARABIC_CMS,
  getLocalizedCms,
  getLocalizedFormConfig,
} from "@/lib/cms/arabic";
import { buildFullCmsData, serializeFullCmsToSiteContentRows } from "@/lib/cms/parse";
import { createRegistrationSchemas } from "@/lib/validations/registration";

describe("Bilingual EN/AR approved glossary & i18n integrity", () => {
  it("matches every exact approved Arabic terminology glossary entry", () => {
    const arDict = getDictionary("ar");
    const arCms = getLocalizedCms(DEFAULT_FULL_CMS, "ar");

    // Navbar & Actions
    expect(arDict.nav.registerNow).toBe("سجّل الآن");
    expect(arDict.nav.memberDashboard).toBe("لوحة المشارك");
    expect(arDict.nav.adminLogin).toBe("دخول المشرفين");
    expect(arDict.common.continue).toBe("التالي");
    expect(arDict.common.back).toBe("السابق");
    expect(arCms.form.submitButtonLabel).toBe("تأكيد التسجيل");

    // Registration Form steps & fields
    expect(arCms.form.steps.step1.title).toBe("البيانات الشخصية");
    expect(arCms.form.steps.step2.title).toBe("البيانات الأكاديمية والتخصص");
    expect(arCms.form.steps.step3.title).toBe("مستندات التحقق");
    expect(arCms.form.steps.step4.title).toBe("المراجعة النهائية والتأكيد");

    expect(arCms.form.fields.fullName.label).toBe("الاسم بالكامل");
    expect(arCms.form.fields.nationalId.label).toBe("الرقم القومي (14 رقم)");
    expect(arCms.form.fields.phone.label).toBe("رقم الهاتف");
    expect(arCms.form.fields.email.label).toBe("البريد الإلكتروني");
    expect(arCms.form.fields.city.label).toBe("محافظة الإقامة");
    expect(arCms.form.fields.university.label).toBe("الجامعة");
    expect(arCms.form.fields.faculty.label).toBe("الكلية / المجال الدراسي");
    expect(arCms.form.fields.department.label).toBe("القسم / التخصص");
    expect(arCms.form.fields.academicYear.label).toBe("الفرقة الدراسية");
    expect(arCms.form.fields.graduationYear.label).toBe("سنة التخرج المتوقعة");
    expect(arCms.form.fields.isEsmeMember.label).toBe("هل أنت عضو في شابتر ESME؟");
    expect(arCms.form.fields.isEsmeMember.yesLabel).toBe("نعم — عضو في الشابتر");
    expect(arCms.form.fields.isEsmeMember.noLabel).toBe("لا");
    expect(arCms.form.fields.committee.label).toBe("اللجنة");
    expect(arCms.form.fields.role.label).toBe("المنصب");
    expect(arCms.form.fields.idPhotoUrl.label).toBe(
      "صورة بطاقة الرقم القومي (الوجه الأمامي)"
    );
    expect(arCms.form.fields.avatarUrl.label).toBe(
      "الصورة الشخصية (للبادج التعريفي — اختياري)"
    );

    // Committees & Roles
    expect(localizeCommittee("High Board", "ar")).toBe("الهيئة العليا (High Board)");
    expect(localizeCommittee("IT", "ar")).toBe("لجنة تكنولوجيا المعلومات (IT)");
    expect(localizeCommittee("Marketing", "ar")).toBe("لجنة التسويق (Marketing)");
    expect(localizeCommittee("Digital", "ar")).toBe("لجنة المحتوى الرقمي (Digital)");

    expect(localizeRole("Member", "ar")).toBe("عضو (Member)");
    expect(localizeRole("Director", "ar")).toBe("مدير لجنة (Director)");
    expect(localizeRole("Head", "ar")).toBe("رئيس لجنة (Head)");

    // Agenda & Halls
    expect(arCms.agenda.title).toBe("جدول الفعاليات");
    expect(arCms.agenda.hall1Name).toBe("القاعة الأولى (Hall 1)");
    expect(arCms.agenda.hall1Capacity).toBe("السعة: 250 مشارك");
    expect(arCms.agenda.hall2Name).toBe("القاعة الثانية (Hall 2)");
    expect(arCms.agenda.hall2Capacity).toBe("السعة: 150 مشارك");
    const opening = arCms.agenda.sessions.find((s) => s.id === "shared-opening");
    const closing = arCms.agenda.sessions.find((s) => s.id === "shared-closing");
    expect(opening?.title).toBe("الجلسة الافتتاحية");
    expect(closing?.title).toBe("الجلسة الختامية");

    // Member Dashboard & Ticket actions
    expect(arDict.dashboard.loginTitle).toBe("الدخول إلى لوحة المشارك");
    expect(arDict.dashboard.ticketIdLabel).toBe("رقم التذكرة");
    expect(arDict.dashboard.downloadTicketPdf).toBe("تحميل التذكرة (PDF)");
    expect(arDict.dashboard.downloadQrPng).toBe("تحميل رمز الدخول (QR)");
    expect(arDict.dashboard.shareOnLinkedin).toBe("مشاركة على LinkedIn");
    expect(arDict.dashboard.copyPostText).toBe("نسخ نص المنشور");
    expect(arDict.dashboard.joinWhatsapp).toBe("انضم لجروب الواتساب الرسمي");
    expect(arDict.dashboard.openVenueMaps).toBe("فتح موقع الحدث على خرائط جوجل");
    expect(arDict.landing.statVenueCta).toBe("فتح موقع الحدث على خرائط جوجل");
  });

  it("localizes faculties, departments, and cities while preserving EN canonical defaults", () => {
    expect(localizeCity("Cairo", "ar")).toBe("القاهرة");
    expect(localizeCity("Cairo", "en")).toBe("Cairo");
    expect(localizeFaculty("Engineering", "ar")).toBe("كلية الهندسة");
    expect(localizeDepartment("Materials & Metallurgical Engineering", "ar")).toBe(
      "هندسة الفلزات والمواد"
    );
  });

  it("serializes and parses cms_arabic overrides cleanly without breaking EN defaults", () => {
    const updated = {
      ...DEFAULT_FULL_CMS,
      ar: {
        ...DEFAULT_ARABIC_CMS,
        eventDate: "12 ديسمبر — نسخة محدثة",
        landing: {
          ...DEFAULT_ARABIC_CMS.landing,
          storyTitle: "قصة الملتقى المحدثة",
        },
      },
    };
    const rows = serializeFullCmsToSiteContentRows(updated);
    const rawMap = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    const roundTripped = buildFullCmsData(rawMap);
    const arView = getLocalizedCms(roundTripped, "ar");
    const enView = getLocalizedCms(roundTripped, "en");

    expect(arView.eventDate).toBe("12 ديسمبر — نسخة محدثة");
    expect(arView.landing.storyTitle).toBe("قصة الملتقى المحدثة");
    expect(enView.landing.storyTitle).toBe(DEFAULT_FULL_CMS.landing.storyTitle);

    const arForm = getLocalizedFormConfig(
      DEFAULT_FULL_CMS.form,
      roundTripped.ar?.form,
      "ar"
    );
    expect(arForm.submitButtonLabel).toBe("تأكيد التسجيل");
  });

  it("produces natural Arabic validation messages when schema lang is ar", () => {
    const arSchemas = createRegistrationSchemas({ lang: "ar" });
    const res = arSchemas.step1Schema.safeParse({
      fullName: "م",
      nationalId: "123",
      phone: "099",
      email: "bad",
      city: "",
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      const joined = res.error.issues.map((i) => i.message).join(" ");
      expect(joined).toMatch(/[\u0600-\u06FF]/);
      expect(joined).toContain("الرقم القومي");
    }
  });
});
