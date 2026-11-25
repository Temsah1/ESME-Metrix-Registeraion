import { z } from "zod";
import {
  FACULTIES,
  ESME_COMMITTEES,
  ESME_ROLES,
  getDepartmentsForFaculty,
  isOtherFaculty,
  requiresCustomMajor,
} from "@/config/registration";

export {
  FACULTIES,
  DEPARTMENTS_BY_FACULTY,
  ESME_COMMITTEES,
  ESME_ROLES,
  getDepartmentsForFaculty,
  isOtherFaculty,
  isOtherDepartment,
  requiresCustomMajor,
  resolveDepartment,
} from "@/config/registration";

export const EGYPTIAN_PHONE_REGEX = /^01[0125][0-9]{8}$/;

export const EGYPTIAN_NATIONAL_ID_REGEX = /^[23][0-9]{13}$/;

export const step1Schema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name is too long"),
  nationalId: z
    .string()
    .regex(
      EGYPTIAN_NATIONAL_ID_REGEX,
      "Enter a valid 14-digit Egyptian National ID (الرقم القومي مكون من 14 رقم)"
    ),
  phone: z
    .string()
    .regex(EGYPTIAN_PHONE_REGEX, "Enter a valid Egyptian mobile number (01XXXXXXXXX)"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .toLowerCase(),
  city: z
    .string()
    .min(2, "Please select or enter your city of residence"),
});

export const step2BaseSchema = z.object({
  university: z
    .string()
    .trim()
    .min(2, "University name is required"),
  faculty: z
    .string()
    .trim()
    .min(2, "Please select your Faculty / Major Category"),
  department: z
    .string()
    .trim()
    .optional()
    .default(""),
  customMajor: z
    .string()
    .trim()
    .optional()
    .default(""),
  academicYear: z
    .enum(["1st", "2nd", "3rd", "4th", "Graduate", "Alumni"], {
      message: "Please select your academic year",
    }),
  graduationYear: z
    .string()
    .min(4, "Graduation year is required (e.g. 2026)")
    .max(4, "Enter a 4-digit year"),
  jobTitle: z
    .string()
    .trim()
    .min(2, "Job title is required (e.g. Student)"),
  company: z
    .string()
    .optional(),
  isEsmeMember: z.boolean({
    message: "Please indicate whether you are a member of the ESME Chapter",
  }),
  committee: z
    .string()
    .trim()
    .optional()
    .default(""),
  role: z
    .string()
    .trim()
    .optional()
    .default(""),
});

function validateStep2Fields(
  data: z.infer<typeof step2BaseSchema>,
  ctx: z.RefinementCtx
) {
  const validFaculty = (FACULTIES as readonly string[]).includes(data.faculty);
  if (!validFaculty) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["faculty"],
      message: "Please select a valid Faculty / Major Category",
    });
  }

  const otherFac = isOtherFaculty(data.faculty);
  if (!otherFac) {
    if (!data.department || data.department.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["department"],
        message: "Please select your Department / Specialization",
      });
    } else if (validFaculty) {
      const allowedDepartments = getDepartmentsForFaculty(data.faculty);
      if (!allowedDepartments.includes(data.department)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["department"],
          message: "Please select a valid Department for the chosen Faculty",
        });
      }
    }
  }

  if (requiresCustomMajor(data.faculty, data.department)) {
    const custom = data.customMajor?.trim() || "";
    if (custom.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customMajor"],
        message: "Please specify your Major / Department",
      });
    } else if (custom.length > 150) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customMajor"],
        message: "Major / Department must be 150 characters or fewer",
      });
    }
  }

  if (data.isEsmeMember) {
    if (!(ESME_COMMITTEES as readonly string[]).includes(data.committee || "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["committee"],
        message: "Please select your ESME Committee",
      });
    }
    if (!(ESME_ROLES as readonly string[]).includes(data.role || "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["role"],
        message: "Please select your ESME Role / Position",
      });
    }
  }
}

export const step2Schema = step2BaseSchema.superRefine(validateStep2Fields);

export const step3Schema = z.object({
  idPhotoUrl: z
    .string()
    .min(1, "National ID front photo is required"),
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
  .merge(step2BaseSchema)
  .merge(step3Schema)
  .merge(step4Schema)
  .superRefine(validateStep2Fields);

export type CompleteRegistrationInput = z.input<typeof completeRegistrationSchema>;
export type CompleteRegistrationParsed = z.infer<typeof completeRegistrationSchema>;
