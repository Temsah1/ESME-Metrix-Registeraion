import { z } from "zod";
import {
  DEFAULT_ACADEMIC_YEARS,
  DEFAULT_FACULTY_CONFIGS,
  ESME_COMMITTEES,
  ESME_ROLES,
  FacultyDefinition,
  getDepartmentsForFaculty,
  isOtherFaculty,
  requiresCustomMajor,
} from "@/config/registration";
import type { RegistrationFormConfig } from "@/lib/cms/types";

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

export interface SchemaBuildOptions {
  fields?: Partial<RegistrationFormConfig["fields"]>;
  faculties?: readonly FacultyDefinition[];
  academicYears?: readonly { value: string; label: string }[];
  esmeCommittees?: readonly string[];
  esmeRoles?: readonly string[];
}

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
    role?: string;
  },
  ctx: z.RefinementCtx,
  opts: Required<Pick<SchemaBuildOptions, "faculties" | "academicYears" | "esmeCommittees" | "esmeRoles">> & {
    fields?: Partial<RegistrationFormConfig["fields"]>;
  }
) {
  const fCfg = opts.fields;
  const facultyRequired = fCfg?.faculty?.required ?? true;
  const departmentRequired = fCfg?.department?.required ?? true;
  const customMajorRequired = fCfg?.customMajor?.required ?? true;
  const esmeRequired = fCfg?.isEsmeMember?.required ?? true;
  const committeeRequired = fCfg?.committee?.required ?? true;
  const roleRequired = fCfg?.role?.required ?? true;
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
      message: "University name is required",
    });
  }

  const faculty = (data.faculty || "").trim();
  const validFacultyNames = opts.faculties.map((f) => f.name);
  const validFaculty = validFacultyNames.includes(faculty);

  if (facultyRequired && faculty.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["faculty"],
      message: "Please select your Faculty / Major Category",
    });
  } else if (faculty.length > 0 && !validFaculty) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["faculty"],
      message: "Please select a valid Faculty / Major Category",
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
          message: "Please select your Department / Specialization",
        });
      }
    } else if (validFaculty) {
      const allowedDepartments = getDepartmentsForFaculty(faculty, opts.faculties);
      if (!allowedDepartments.includes(dept)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["department"],
          message: "Please select a valid Department for the chosen Faculty",
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

  const acadYear = (data.academicYear || "").trim();
  const validAcademicValues = opts.academicYears.map((a) => a.value);
  if (academicRequired && !acadYear) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["academicYear"],
      message: "Please select your academic year",
    });
  } else if (acadYear && !validAcademicValues.includes(acadYear)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["academicYear"],
      message: "Please select a valid academic year",
    });
  }

  const gradYear = (data.graduationYear || "").trim();
  if (gradRequired && (gradYear.length < 4 || gradYear.length > 10)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["graduationYear"],
      message: "Graduation year is required (e.g. 2026)",
    });
  }

  const jobTitle = (data.jobTitle || "").trim();
  if (jobRequired && jobTitle.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["jobTitle"],
      message: "Current role / job title is required (e.g. Student)",
    });
  }

  const company = (data.company || "").trim();
  if (companyRequired && company.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["company"],
      message: "Company / Organization is required",
    });
  }

  if (esmeRequired && typeof data.isEsmeMember !== "boolean") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["isEsmeMember"],
      message: "Please indicate whether you are a member of the ESME Chapter",
    });
  }

  if (data.isEsmeMember) {
    if (committeeRequired && !opts.esmeCommittees.includes(data.committee || "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["committee"],
        message: "Please select your ESME Committee",
      });
    }
    if (roleRequired && !opts.esmeRoles.includes(data.role || "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["role"],
        message: "Please select your ESME Role / Position",
      });
    }
  }
}

/**
 * Builds step and full registration Zod schemas dynamically from CMS form configuration.
 * Both client form validation and `POST /api/register` share this exact builder.
 */
export function createRegistrationSchemas(options: SchemaBuildOptions = {}) {
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
  const esmeRoles =
    options.esmeRoles && options.esmeRoles.length > 0
      ? options.esmeRoles
      : [...ESME_ROLES];

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
          .min(3, "Full name must be at least 3 characters")
          .max(100, "Full name is too long")
      : z.string().trim().max(100).optional().default(""),
    nationalId: nationalIdRequired
      ? z
          .string()
          .regex(
            EGYPTIAN_NATIONAL_ID_REGEX,
            "Enter a valid 14-digit Egyptian National ID"
          )
      : z
          .string()
          .optional()
          .default("")
          .refine(
            (v) => !v || EGYPTIAN_NATIONAL_ID_REGEX.test(v),
            "Enter a valid 14-digit Egyptian National ID"
          ),
    phone: phoneRequired
      ? z
          .string()
          .regex(EGYPTIAN_PHONE_REGEX, "Enter a valid Egyptian mobile number (01XXXXXXXXX)")
      : z
          .string()
          .optional()
          .default("")
          .refine(
            (v) => !v || EGYPTIAN_PHONE_REGEX.test(v),
            "Enter a valid Egyptian mobile number (01XXXXXXXXX)"
          ),
    email: emailRequired
      ? z.string().trim().email("Enter a valid email address").toLowerCase()
      : z
          .string()
          .trim()
          .toLowerCase()
          .optional()
          .default("")
          .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email address"),
    city: cityRequired
      ? z.string().min(2, "Please select your governorate / city")
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
    role: z.string().trim().optional().default(""),
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
      esmeRoles,
    });

  const step2 = step2Base.superRefine(step2Refine);

  const step3 = z.object({
    idPhotoUrl: idPhotoRequired
      ? z.string().min(1, "National ID front photo is required")
      : z.string().optional().default(""),
    avatarUrl: avatarRequired
      ? z.string().min(1, "Profile badge photo is required")
      : z.string().optional(),
  });

  const step4 = z.object({
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, "You must accept the terms and conditions"),
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
