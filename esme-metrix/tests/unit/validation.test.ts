import { describe, it, expect } from "vitest";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  completeRegistrationSchema,
  createRegistrationSchemas,
  EGYPTIAN_PHONE_REGEX,
  FACULTIES,
  ESME_COMMITTEES,
  getDepartmentsForFaculty,
  resolveDepartment,
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
  faculty: "Engineering",
  department: "Materials & Metallurgical Engineering",
  customMajor: "",
  academicYear: "3rd",
  graduationYear: "2026",
  jobTitle: "Student",
  company: "",
  isEsmeMember: false,
  committee: "",
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

describe("REG-04 required fields & 100% English localization", () => {
  it("rejects short full name and keeps error messages English", () => {
    expect(step1Schema.safeParse({ ...validStep1, fullName: "Ab" }).success).toBe(false);
    const badId = step1Schema.safeParse({ ...validStep1, nationalId: "123" });
    expect(badId.success).toBe(false);
    if (!badId.success) {
      expect(badId.error.issues[0].message).not.toMatch(/[\u0600-\u06FF]/);
    }
  });

  it("rejects empty university/faculty/department/jobTitle", () => {
    expect(step2Schema.safeParse({ ...validStep2, university: "" }).success).toBe(false);
    expect(step2Schema.safeParse({ ...validStep2, faculty: "" }).success).toBe(false);
    expect(step2Schema.safeParse({ ...validStep2, department: "" }).success).toBe(false);
    expect(step2Schema.safeParse({ ...validStep2, jobTitle: "" }).success).toBe(false);
  });
});

describe("REG-05 cascading faculty/department & custom major (English labels)", () => {
  it("supports all 12 pure-English faculties with zero Arabic text", () => {
    expect(FACULTIES).toHaveLength(12);
    for (const fac of FACULTIES) {
      expect(fac).not.toMatch(/[\u0600-\u06FF]/);
      const depts = getDepartmentsForFaculty(fac);
      expect(depts.length).toBeGreaterThan(0);
    }
  });

  it("accepts non-engineering faculties like CS & IT and Medicine", () => {
    expect(
      step2Schema.safeParse({
        ...validStep2,
        faculty: "Computer Science & IT",
        department: "Artificial Intelligence (AI)",
      }).success
    ).toBe(true);

    expect(
      step2Schema.safeParse({
        ...validStep2,
        faculty: "Medicine & Healthcare",
        department: "Pharmacy",
      }).success
    ).toBe(true);
  });

  it("rejects mismatched department for selected faculty", () => {
    expect(
      step2Schema.safeParse({
        ...validStep2,
        faculty: "Science",
        department: "Civil Engineering",
      }).success
    ).toBe(false);
  });

  it("requires customMajor when Other is selected in faculty or department", () => {
    expect(
      step2Schema.safeParse({
        ...validStep2,
        faculty: "Engineering",
        department: "Other Engineering Department",
        customMajor: "",
      }).success
    ).toBe(false);

    expect(
      step2Schema.safeParse({
        ...validStep2,
        faculty: "Engineering",
        department: "Other Engineering Department",
        customMajor: "Nuclear Engineering",
      }).success
    ).toBe(true);

    expect(
      step2Schema.safeParse({
        ...validStep2,
        faculty: "Other",
        department: "Other / Specify Major",
        customMajor: "",
      }).success
    ).toBe(false);

    expect(
      step2Schema.safeParse({
        ...validStep2,
        faculty: "Other",
        department: "Other / Specify Major",
        customMajor: "Archaeology",
      }).success
    ).toBe(true);
  });

  it("resolves customMajor over generic Other label", () => {
    expect(
      resolveDepartment({
        faculty: "Other",
        department: "Other / Specify Major",
        customMajor: "Renewable Energy Technology",
      })
    ).toBe("Renewable Energy Technology");
  });
});

describe("REG-05b conditional ESME Chapter membership", () => {
  it("requires explicit yes/no choice for isEsmeMember", () => {
    const { isEsmeMember: _flag, ...withoutMember } = validStep2;
    void _flag;
    expect(step2Schema.safeParse(withoutMember).success).toBe(false);
  });

  it("skips committee validation when isEsmeMember is false", () => {
    expect(
      step2Schema.safeParse({
        ...validStep2,
        isEsmeMember: false,
        committee: "",
      }).success
    ).toBe(true);
  });

  it("requires valid committee (8 official committees/sectors, no role) when isEsmeMember is true", () => {
    expect(ESME_COMMITTEES).toEqual([
      "High Board",
      "Business & Finance Sector",
      "IT & Digital Transformation Sector",
      "Marketing & Media Sector",
      "Operations & Supply Chain Sector",
      "Quality Sector",
      "Technical & Engineering Sector",
      "SID Sector",
    ]);

    expect(
      step2Schema.safeParse({
        ...validStep2,
        isEsmeMember: true,
        committee: "",
      }).success
    ).toBe(false);

    expect(
      step2Schema.safeParse({
        ...validStep2,
        isEsmeMember: true,
        committee: "Digital",
      }).success
    ).toBe(false);

    for (const comm of ESME_COMMITTEES) {
      expect(
        step2Schema.safeParse({
          ...validStep2,
          isEsmeMember: true,
          committee: comm,
        }).success
      ).toBe(true);
    }
  });
});

describe("REG-06 CMS-driven dynamic schema builder", () => {
  it("accepts custom CMS committees, faculties, academic years, and optional fields", () => {
    const customSchemas = createRegistrationSchemas({
      faculties: [{ name: "Energy Studies", departments: ["Solar Grid Lab"] }],
      academicYears: [{ value: "5th", label: "5th Year" }],
      esmeCommittees: ["PR"],
      fields: {
        nationalId: { label: "National ID", placeholder: "", required: false },
      },
    });

    expect(
      customSchemas.step1Schema.safeParse({ ...validStep1, nationalId: "" }).success
    ).toBe(true);

    expect(
      customSchemas.step2Schema.safeParse({
        ...validStep2,
        faculty: "Energy Studies",
        department: "Solar Grid Lab",
        academicYear: "5th",
        isEsmeMember: true,
        committee: "PR",
      }).success
    ).toBe(true);
  });

  it("requires termsAccepted true", () => {
    expect(step4Schema.safeParse({ termsAccepted: true }).success).toBe(true);
    expect(step4Schema.safeParse({ termsAccepted: false }).success).toBe(false);
  });
});

describe("REG-07 Step 3 documents (National ID required, Karnet removed, Avatar optional)", () => {
  it("accepts idPhotoUrl without karnetPhotoUrl or avatarUrl", () => {
    expect(step3Schema.safeParse({ idPhotoUrl: "x" }).success).toBe(true);
    expect(step3Schema.safeParse({ idPhotoUrl: "x", avatarUrl: "" }).success).toBe(true);
  });

  it("rejects missing idPhotoUrl", () => {
    expect(step3Schema.safeParse({ idPhotoUrl: "" }).success).toBe(false);
  });
});

describe("complete schema", () => {
  const valid = {
    ...validStep1,
    ...validStep2,
    idPhotoUrl: "https://example.supabase.co/storage/v1/object/public/photos/a.jpg",
    termsAccepted: true,
  };

  it("accepts a complete valid registration without karnet or avatar", () => {
    expect(completeRegistrationSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects when terms not accepted", () => {
    expect(completeRegistrationSchema.safeParse({ ...valid, termsAccepted: false }).success).toBe(
      false
    );
  });
});
