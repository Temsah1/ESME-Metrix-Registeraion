import { z } from "zod";
import {
  DEFAULT_ACADEMIC_YEARS,
  DEFAULT_FACULTY_CONFIGS,
  ESME_COMMITTEES,
  FacultyDefinition,
  getDepartmentsForFaculty,
  isOtherFaculty,
  requiresCustomMajor,
} from "@/config/registration";
import type { RegistrationFormConfig } from "@/lib/cms/types";
import type { AppLanguage } from "@/lib/i18n/types";

export {
  FACULTIES,
  DEPARTMENTS_BY_FACULTY,
  ESME_COMMITTEES,
  getDepartmentsForFaculty,
  isOtherFaculty,
  isOtherDepartment,
  requiresCustomMajor,
  resolveDepartment,
} from "@/config/registration";

export const EGYPTIAN_PHONE_REGEX = /^01[0125][0-9]{8}$/;

export const EGYPTIAN_NATIONAL_ID_REGEX = /^[23][0-9]{13}$/;

export interface SchemaBuildOptions {
  fields?: Partial<RegistrationFormConfig["fields"]>;
  faculties?: readonly FacultyDefinition[];
  academicYears?: readonly { value: string; label: string }[];
  esmeCommittees?: readonly string[];
  lang?: AppLanguage;
}

const VALIDATION_MESSAGES = {
  en: {
    fullNameMin: "Full name must be at least 3 characters",
    fullNameMax: "Full name is too long",
    nationalIdInvalid: "Enter a valid 14-digit Egyptian National ID",
    phoneInvalid: "Enter a valid Egyptian mobile number (01XXXXXXXXX)",
    emailInvalid: "Enter a valid email address",
    cityRequired: "Please select your governorate / city",
    universityRequired: "University name is required",
    facultyRequired: "Please select your Faculty / Major Category",
    facultyInvalid: "Please select a valid Faculty / Major Category",
    departmentRequired: "Please select your Department / Specialization",
    departmentInvalid: "Please select a valid Department for the chosen Faculty",
    customMajorRequired: "Please specify your Major / Department",
    customMajorMax: "Major / Department must be 150 characters or fewer",
    academicYearRequired: "Please select your academic year",
    academicYearInvalid: "Please select a valid academic year",
    graduationYearRequired: "Graduation year is required (e.g. 2026)",
    jobTitleRequired: "Current role / job title is required (e.g. Student)",
    companyRequired: "Company / Organization is required",
    esmeMemberRequired: "Please indicate whether you are a member of the ESME Chapter",
    committeeRequired: "Please select your ESME Committee",
    idPhotoRequired: "National ID front photo is required",
    avatarRequired: "Profile badge photo is required",
    termsRequired: "You must accept the terms and conditions",
  },
  ar: {
    fullNameMin: "يُرجى إدخال الاسم بالكامل (3 أحرف على الأقل)",
    fullNameMax: "الاسم المدخل طويل جداً",
    nationalIdInvalid: "يُرجى إدخال الرقم القومي المصري المكوّن من 14 رقم بشكل صحيح",
    phoneInvalid: "يُرجى إدخال رقم هاتف مصري صحيح يبدأ بـ 010 أو 011 أو 012 أو 015",
    emailInvalid: "يُرجى إدخال بريد إلكتروني صحيح",
    cityRequired: "يُرجى اختيار محافظة الإقامة",
    universityRequired: "اسم الجامعة مطلوب",
    facultyRequired: "يُرجى اختيار الكلية أو المجال الدراسي",
    facultyInvalid: "يُرجى اختيار كلية صالحة من القائمة",
    departmentRequired: "يُرجى اختيار القسم أو التخصص",
    departmentInvalid: "القسم المختار غير مطابق للكلية المحددة",
    customMajorRequired: "يُرجى كتابة التخصص أو القسم يدويًا",
    customMajorMax: "اسم التخصص يجب ألا يتجاوز 150 حرفاً",
    academicYearRequired: "يُرجى اختيار الفرقة الدراسية",
    academicYearInvalid: "يُرجى اختيار فرقة دراسية صالحة",
    graduationYearRequired: "يُرجى تحديد سنة التخرج المتوقعة (مثال: 2026)",
    jobTitleRequired: "المسمى الوظيفي أو الصفة الحالية مطلوبة (مثال: طالب)",
    companyRequired: "اسم الشركة أو الجهة مطلوب",
    esmeMemberRequired: "يُرجى تحديد ما إذا كنت عضواً في شابتر ESME",
    committeeRequired: "يُرجى اختيار لجنتك داخل الشابتر",
    idPhotoRequired: "صورة بطاقة الرقم القومي (الوجه الأمامي) مطلوبة للمتابعة",
    avatarRequired: "الصورة الشخصية مطلوبة للبادج",
    termsRequired: "يجب الموافقة على الشروط والأحكام لإتمام التسجيل",
  },
} as const;

function validateDynamicStep2(
  data: {
    university?: string;
    faculty?: string;
    department?: string;
    customMajor?: string;
    academicYear?: string;
    graduationYear?: string;
    jobTitle?: string;
    company?: string;
    isEsmeMember?: boolean;
    committee?: string;
  },
  ctx: z.RefinementCtx,
  opts: Required<Pick<SchemaBuildOptions, "faculties" | "academicYears" | "esmeCommittees">> & {
    fields?: Partial<RegistrationFormConfig["fields"]>;
    lang: AppLanguage;
  }
) {
  const m = VALIDATION_MESSAGES[opts.lang];
  const fCfg = opts.fields;
  const facultyRequired = fCfg?.faculty?.required ?? true;
  const departmentRequired = fCfg?.department?.required ?? true;
  const customMajorRequired = fCfg?.customMajor?.required ?? true;
  const esmeRequired = fCfg?.isEsmeMember?.required ?? true;
  const committeeRequired = fCfg?.committee?.required ?? true;
  const uniRequired = fCfg?.university?.required ?? true;
  const academicRequired = fCfg?.academicYear?.required ?? true;
  const gradRequired = fCfg?.graduationYear?.required ?? true;
  const jobRequired = fCfg?.jobTitle?.required ?? true;
  const companyRequired = fCfg?.company?.required ?? false;

  const uni = (data.university || "").trim();
  if (uniRequired && uni.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["university"],
      message: m.universityRequired,
    });
  }

  const faculty = (data.faculty || "").trim();
  const validFacultyNames = opts.faculties.map((f) => f.name);
  const validFaculty = validFacultyNames.includes(faculty);

  if (facultyRequired && faculty.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["faculty"],
      message: m.facultyRequired,
    });
  } else if (faculty.length > 0 && !validFaculty) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["faculty"],
      message: m.facultyInvalid,
    });
  }

  const dept = (data.department || "").trim();
  const otherFac = isOtherFaculty(faculty);
  if (!otherFac && (departmentRequired || faculty.length > 0)) {
    if (!dept || dept.length < 2) {
      if (departmentRequired || validFaculty) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["department"],
          message: m.departmentRequired,
        });
      }
    } else if (validFaculty) {
      const allowedDepartments = getDepartmentsForFaculty(faculty, opts.faculties);
      if (!allowedDepartments.includes(dept)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["department"],
          message: m.departmentInvalid,
        });
      }
    }
  }

  if (requiresCustomMajor(faculty, dept) && customMajorRequired) {
    const custom = (data.customMajor || "").trim();
    if (custom.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customMajor"],
        message: m.customMajorRequired,
      });
    } else if (custom.length > 150) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customMajor"],
        message: m.customMajorMax,
      });
    }
  }

  const acadYear = (data.academicYear || "").trim();
  const validAcademicValues = opts.academicYears.map((a) => a.value);
  if (academicRequired && !acadYear) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["academicYear"],
      message: m.academicYearRequired,
    });
  } else if (acadYear && !validAcademicValues.includes(acadYear)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["academicYear"],
      message: m.academicYearInvalid,
    });
  }

  const gradYear = (data.graduationYear || "").trim();
  if (gradRequired && (gradYear.length < 4 || gradYear.length > 10)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["graduationYear"],
      message: m.graduationYearRequired,
    });
  }

  const jobTitle = (data.jobTitle || "").trim();
  if (jobRequired && jobTitle.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["jobTitle"],
      message: m.jobTitleRequired,
    });
  }

  const company = (data.company || "").trim();
  if (companyRequired && company.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["company"],
      message: m.companyRequired,
    });
  }

  if (esmeRequired && typeof data.isEsmeMember !== "boolean") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["isEsmeMember"],
      message: m.esmeMemberRequired,
    });
  }

  if (data.isEsmeMember) {
    if (committeeRequired && !opts.esmeCommittees.includes(data.committee || "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["committee"],
        message: m.committeeRequired,
      });
    }
  }
}

/**
 * Builds step and full registration Zod schemas dynamically from CMS form configuration.
 * Both client form validation and `POST /api/register` share this exact builder.
 */
export function createRegistrationSchemas(options: SchemaBuildOptions = {}) {
  const lang: AppLanguage = options.lang ?? "en";
  const m = VALIDATION_MESSAGES[lang];
  const fCfg = options.fields;
  const faculties =
    options.faculties && options.faculties.length > 0
      ? options.faculties
      : DEFAULT_FACULTY_CONFIGS;
  const academicYears =
    options.academicYears && options.academicYears.length > 0
      ? options.academicYears
      : DEFAULT_ACADEMIC_YEARS;
  const esmeCommittees =
    options.esmeCommittees && options.esmeCommittees.length > 0
      ? options.esmeCommittees
      : [...ESME_COMMITTEES];

  const fullNameRequired = fCfg?.fullName?.required ?? true;
  const nationalIdRequired = fCfg?.nationalId?.required ?? true;
  const phoneRequired = fCfg?.phone?.required ?? true;
  const emailRequired = fCfg?.email?.required ?? true;
  const cityRequired = fCfg?.city?.required ?? true;
  const idPhotoRequired = fCfg?.idPhotoUrl?.required ?? true;
  const avatarRequired = fCfg?.avatarUrl?.required ?? false;

  const step1 = z.object({
    fullName: fullNameRequired
      ? z
          .string()
          .trim()
          .min(3, m.fullNameMin)
          .max(100, m.fullNameMax)
      : z.string().trim().max(100).optional().default(""),
    nationalId: nationalIdRequired
      ? z
          .string()
          .regex(EGYPTIAN_NATIONAL_ID_REGEX, m.nationalIdInvalid)
      : z
          .string()
          .optional()
          .default("")
          .refine(
            (v) => !v || EGYPTIAN_NATIONAL_ID_REGEX.test(v),
            m.nationalIdInvalid
          ),
    phone: phoneRequired
      ? z
          .string()
          .regex(EGYPTIAN_PHONE_REGEX, m.phoneInvalid)
      : z
          .string()
          .optional()
          .default("")
          .refine(
            (v) => !v || EGYPTIAN_PHONE_REGEX.test(v),
            m.phoneInvalid
          ),
    email: emailRequired
      ? z.string().trim().email(m.emailInvalid).toLowerCase()
      : z
          .string()
          .trim()
          .toLowerCase()
          .optional()
          .default("")
          .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), m.emailInvalid),
    city: cityRequired
      ? z.string().min(2, m.cityRequired)
      : z.string().optional().default(""),
  });

  const step2Base = z.object({
    university: z.string().trim().optional().default(""),
    faculty: z.string().trim().optional().default(""),
    department: z.string().trim().optional().default(""),
    customMajor: z.string().trim().optional().default(""),
    academicYear: z.string().trim().optional().default(""),
    graduationYear: z.string().trim().optional().default(""),
    jobTitle: z.string().trim().optional().default(""),
    company: z.string().optional().default(""),
    isEsmeMember: z.boolean().optional(),
    committee: z.string().trim().optional().default(""),
  });

  const step2Refine = (
    data: z.infer<typeof step2Base>,
    ctx: z.RefinementCtx
  ) =>
    validateDynamicStep2(data, ctx, {
      fields: fCfg,
      faculties,
      academicYears,
      esmeCommittees,
      lang,
    });

  const step2 = step2Base.superRefine(step2Refine);

  const step3 = z.object({
    idPhotoUrl: idPhotoRequired
      ? z.string().min(1, m.idPhotoRequired)
      : z.string().optional().default(""),
    avatarUrl: avatarRequired
      ? z.string().min(1, m.avatarRequired)
      : z.string().optional(),
  });

  const step4 = z.object({
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, m.termsRequired),
  });

  const complete = step1
    .merge(step2Base)
    .merge(step3)
    .merge(step4)
    .superRefine(step2Refine);

  return {
    step1Schema: step1,
    step2BaseSchema: step2Base,
    step2Schema: step2,
    step3Schema: step3,
    step4Schema: step4,
    completeRegistrationSchema: complete,
  };
}

const defaultSchemas = createRegistrationSchemas();

export const step1Schema = defaultSchemas.step1Schema;
export const step2BaseSchema = defaultSchemas.step2BaseSchema;
export const step2Schema = defaultSchemas.step2Schema;
export const step3Schema = defaultSchemas.step3Schema;
export const step4Schema = defaultSchemas.step4Schema;
export const completeRegistrationSchema = defaultSchemas.completeRegistrationSchema;

export type CompleteRegistrationInput = z.input<typeof completeRegistrationSchema>;
export type CompleteRegistrationParsed = z.infer<typeof completeRegistrationSchema>;
