import { z } from "zod";

export const EGYPTIAN_PHONE_REGEX = /^01[0125][0-9]{8}$/;

export const step1Schema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name is too long"),
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
    .min(2, "Faculty / Department is required"),
  academicYear: z
    .enum(["1st", "2nd", "3rd", "4th", "Graduate", "Alumni"], {
      message: "Please select your academic year",
    }),
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
