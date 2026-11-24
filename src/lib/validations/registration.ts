import { z } from "zod";

export const EGYPTIAN_PHONE_REGEX = /^01[0125][0-9]{8}$/;

// Must stay in sync with registrants_national_id_format_chk (migration 0006).
export const EGYPTIAN_NATIONAL_ID_REGEX = /^[23][0-9]{13}$/;

// Must stay in sync with registrants_graduation_year_format_chk (migration 0006).
export const GRADUATION_YEAR_REGEX = /^(19|20)[0-9]{2}$/;
export const MIN_GRADUATION_YEAR = 1990;
export const MAX_GRADUATION_YEAR = 2035;

export const CAIRO_ENG_DEPARTMENTS = [
  "Chemical Engineering (هندسة الكيمياء)",
  "Mechanical Engineering (هندسة الميكانيكا - عام / قوى / إنتاج)",
  "Civil Engineering (الهندسة المدنية)",
  "Metallurgical & Materials Engineering (هندسة الفلزات والمواد)",
  "Petroleum & Mining Engineering (هندسة البترول والتعدين)",
  "Mechatronics Engineering (هندسة الميكاترونكس)",
  "Mechanical Power Engineering (هندسة القوى الميكانيكية)",
  "Mechanical Design & Production (هندسة التصميم الميكانيكي والإنتاج)",
  "Electrical Power & Machines (هندسة القوى والآلات الكهربية)",
  "Electronics & Electrical Communications (هندسة الإلكترونيات والاتصالات)",
  "Computer Engineering (هندسة الحاسبات)",
  "Architectural Engineering (الهندسة المعمارية)",
  "Aerospace Engineering (هندسة الطيران والفضاء)",
  "Biomedical Engineering (الهندسة الطبية والحيوية)",
  "Other Engineering Discipline / Faculty (قسم أو كلية أخرى)",
] as const;

export const step1Schema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name is too long"),
  nationalId: z
    .string()
    .trim()
    .regex(
      EGYPTIAN_NATIONAL_ID_REGEX,
      "Enter a valid 14-digit Egyptian National ID (الرقم القومي مكون من 14 رقم)"
    ),
  phone: z
    .string()
    .regex(EGYPTIAN_PHONE_REGEX, "Enter a valid Egyptian mobile number (01XXXXXXXXX)"),
  email: z
    .string()
    .email("Enter a valid email address")
    .toLowerCase(),
  city: z
    .string()
    .min(2, "Please select or enter your city of residence"),
});

export const step2Schema = z.object({
  university: z
    .string()
    .min(2, "University name is required"),
  faculty: z
    .string()
    .min(2, "Department / Specialization is required"),
  academicYear: z
    .enum(["1st", "2nd", "3rd", "4th", "Graduate", "Alumni"], {
      message: "Please select your academic year",
    }),
  graduationYear: z
    .string()
    .trim()
    .min(1, "Graduation year is required (e.g. 2026)")
    .regex(GRADUATION_YEAR_REGEX, "Enter a 4-digit graduation year (e.g. 2026)")
    .refine(
      (val) => {
        const year = Number(val);
        return year >= MIN_GRADUATION_YEAR && year <= MAX_GRADUATION_YEAR;
      },
      `Graduation year must be between ${MIN_GRADUATION_YEAR} and ${MAX_GRADUATION_YEAR}`
    ),
  jobTitle: z
    .string()
    .min(2, "Job title is required (e.g. Student)"),
  company: z
    .string()
    .optional(),
});

export const step3Schema = z.object({
  idPhotoUrl: z
    .string()
    .min(1, "National ID front photo is required"),
  karnetPhotoUrl: z
    .string()
    .min(1, "Student Karnet / Academic card photo is required"),
  avatarUrl: z
    .string()
    .optional(),
});

export const step4Schema = z.object({
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
});

export const completeRegistrationSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema);

export type CompleteRegistrationInput = z.infer<typeof completeRegistrationSchema>;
