import { describe, it, expect } from "vitest";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  completeRegistrationSchema,
  EGYPTIAN_PHONE_REGEX,
} from "@/lib/validations/registration";

const validStep1 = {
  fullName: "Omar Hassan El-Sayed",
  phone: "01012345678",
  email: "Omar.Sayed@Gmail.com",
  city: "Cairo",
};

const validStep2 = {
  university: "Cairo University",
  faculty: "Faculty of Engineering",
  academicYear: "3rd",
  jobTitle: "Student",
  company: "",
};

describe("REG-01/02 Egyptian phone validation", () => {
  it.each(["01012345678", "01112345678", "01212345678", "01512345678"])(
    "accepts valid phone %s",
    (phone) => {
      expect(EGYPTIAN_PHONE_REGEX.test(phone)).toBe(true);
      expect(step1Schema.safeParse({ ...validStep1, phone }).success).toBe(true);
    }
  );

  it.each([
    "02012345678",
    "01312345678",
    "0101234567",
    "010123456789",
    "+201012345678",
    "0101234567a",
    "",
    "1012345678",
  ])("rejects invalid phone %s", (phone) => {
    expect(step1Schema.safeParse({ ...validStep1, phone }).success).toBe(false);
  });
});

describe("REG-03 email validation", () => {
  it("rejects invalid email", () => {
    expect(step1Schema.safeParse({ ...validStep1, email: "not-an-email" }).success).toBe(false);
  });

  it("lowercases email", () => {
    const parsed = step1Schema.parse(validStep1);
    expect(parsed.email).toBe("omar.sayed@gmail.com");
  });
});

describe("REG-04 required fields", () => {
  it("rejects short full name", () => {
    expect(step1Schema.safeParse({ ...validStep1, fullName: "Ab" }).success).toBe(false);
  });

  it("rejects missing city", () => {
    const { city: _city, ...rest } = validStep1;
    expect(step1Schema.safeParse(rest).success).toBe(false);
  });

  it("rejects empty university/faculty/jobTitle", () => {
    expect(step2Schema.safeParse({ ...validStep2, university: "" }).success).toBe(false);
    expect(step2Schema.safeParse({ ...validStep2, faculty: "x" }).success).toBe(false);
    expect(step2Schema.safeParse({ ...validStep2, jobTitle: "" }).success).toBe(false);
  });
});

describe("REG-05 academic year enum", () => {
  it.each(["1st", "2nd", "3rd", "4th", "Graduate", "Alumni"])("accepts %s", (year) => {
    expect(step2Schema.safeParse({ ...validStep2, academicYear: year }).success).toBe(true);
  });

  it("rejects unknown year", () => {
    expect(step2Schema.safeParse({ ...validStep2, academicYear: "5th" }).success).toBe(false);
  });
});

describe("REG-06 terms acceptance", () => {
  it("requires termsAccepted true", () => {
    expect(step4Schema.safeParse({ termsAccepted: true }).success).toBe(true);
    expect(step4Schema.safeParse({ termsAccepted: false }).success).toBe(false);
  });
});

describe("REG-07 photo URL validation (current behavior baseline)", () => {
  it("step3 currently accepts any non-empty string (defect documented in BUG-REPORT)", () => {
    expect(step3Schema.safeParse({ idPhotoUrl: "x", karnetPhotoUrl: "y" }).success).toBe(true);
  });
});

describe("complete schema", () => {
  const valid = {
    ...validStep1,
    ...validStep2,
    idPhotoUrl: "https://example.supabase.co/storage/v1/object/public/photos/a.jpg",
    karnetPhotoUrl: "https://example.supabase.co/storage/v1/object/public/photos/b.jpg",
    termsAccepted: true,
  };

  it("accepts a complete valid registration", () => {
    expect(completeRegistrationSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects when terms not accepted", () => {
    expect(completeRegistrationSchema.safeParse({ ...valid, termsAccepted: false }).success).toBe(false);
  });
});