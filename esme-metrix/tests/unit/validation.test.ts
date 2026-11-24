import { describe, it, expect } from "vitest";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  completeRegistrationSchema,
  EGYPTIAN_PHONE_REGEX,
  EGYPTIAN_NATIONAL_ID_REGEX,
  GRADUATION_YEAR_REGEX,
  MIN_GRADUATION_YEAR,
  MAX_GRADUATION_YEAR,
} from "@/lib/validations/registration";

const validStep1 = {
  fullName: "Omar Hassan El-Sayed",
  nationalId: "29912010101234",
  phone: "01012345678",
  email: "Omar.Sayed@Gmail.com",
  city: "Cairo",
};

const validStep2 = {
  university: "Cairo University",
  faculty: "Faculty of Engineering",
  academicYear: "3rd",
  graduationYear: "2026",
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

describe("REG-08 Egyptian National ID validation", () => {
  it.each(["29912010101234", "30001010101234", " 29912010101234 "])("accepts valid national ID %j", (nationalId) => {
    expect(EGYPTIAN_NATIONAL_ID_REGEX.test(nationalId.trim())).toBe(true);
    expect(step1Schema.safeParse({ ...validStep1, nationalId }).success).toBe(true);
  });

  it("trims surrounding whitespace", () => {
    expect(step1Schema.parse({ ...validStep1, nationalId: " 29912010101234 " }).nationalId).toBe("29912010101234");
  });

  it.each([
    "",
    "1991201010123", // 13 digits
    "299120101012345", // 15 digits
    "19912010101234", // must start with 2 or 3
    "49912010101234",
    "2991201010123a",
    "2991-201010123",
  ])("rejects invalid national ID %j", (nationalId) => {
    expect(step1Schema.safeParse({ ...validStep1, nationalId }).success).toBe(false);
  });

  it("rejects a missing national ID", () => {
    const { nationalId: _nid, ...rest } = validStep1;
    expect(step1Schema.safeParse(rest).success).toBe(false);
  });
});

describe("REG-09 graduation year validation", () => {
  it.each(["2024", "2026", "2030", String(MIN_GRADUATION_YEAR), String(MAX_GRADUATION_YEAR)])(
    "accepts %s",
    (graduationYear) => {
      expect(step2Schema.safeParse({ ...validStep2, graduationYear }).success).toBe(true);
    }
  );

  it.each(["", "26", "20266", "abcd", "2O26", "1850", "2099", String(MIN_GRADUATION_YEAR - 1), String(MAX_GRADUATION_YEAR + 1)])(
    "rejects %j",
    (graduationYear) => {
      expect(step2Schema.safeParse({ ...validStep2, graduationYear }).success).toBe(false);
    }
  );

  it("matches the database CHECK pattern", () => {
    expect(GRADUATION_YEAR_REGEX.test("2026")).toBe(true);
    expect(GRADUATION_YEAR_REGEX.test("2026+")).toBe(false);
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