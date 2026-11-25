import { describe, it, expect } from "vitest";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  completeRegistrationSchema,
  EGYPTIAN_PHONE_REGEX,
  FACULTIES,
  ESME_COMMITTEES,
  ESME_ROLES,
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
  faculty: "Engineering (الهندسة)",
  department: "Materials & Metallurgical Engineering",
  customMajor: "",
  academicYear: "3rd" as const,
  graduationYear: "2026",
  jobTitle: "Student",
  company: "",
  isEsmeMember: false,
  committee: "",
  role: "",
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
    void _city;
    expect(step1Schema.safeParse(rest).success).toBe(false);
  });

  it("rejects empty university/faculty/department/jobTitle", () => {
    expect(step2Schema.safeParse({ ...validStep2, university: "" }).success).toBe(false);
    expect(step2Schema.safeParse({ ...validStep2, faculty: "" }).success).toBe(false);
    expect(step2Schema.safeParse({ ...validStep2, department: "" }).success).toBe(false);
    expect(step2Schema.safeParse({ ...validStep2, jobTitle: "" }).success).toBe(false);
  });
});

describe("REG-05 cascading faculty/department & custom major", () => {
  it("supports all 12 configured faculties and dynamic departments", () => {
    expect(FACULTIES).toHaveLength(12);
    for (const fac of FACULTIES) {
      const depts = getDepartmentsForFaculty(fac);
      expect(depts.length).toBeGreaterThan(0);
    }
  });

  it("accepts non-engineering faculties like CS & IT and Medicine", () => {
    expect(
      step2Schema.safeParse({
        ...validStep2,
        faculty: "Computer Science & IT (الحاسبات والمعلومات)",
        department: "Artificial Intelligence (AI)",
      }).success
    ).toBe(true);

    expect(
      step2Schema.safeParse({
        ...validStep2,
        faculty: "Medicine & Healthcare (القطاع الطبي)",
        department: "Pharmacy",
      }).success
    ).toBe(true);
  });

  it("rejects mismatched department for selected faculty", () => {
    expect(
      step2Schema.safeParse({
        ...validStep2,
        faculty: "Science (العلوم)",
        department: "Civil Engineering",
      }).success
    ).toBe(false);
  });

  it("requires customMajor when Other is selected in faculty or department", () => {
    expect(
      step2Schema.safeParse({
        ...validStep2,
        faculty: "Engineering (الهندسة)",
        department: "Other Engineering Department",
        customMajor: "",
      }).success
    ).toBe(false);

    expect(
      step2Schema.safeParse({
        ...validStep2,
        faculty: "Engineering (الهندسة)",
        department: "Other Engineering Department",
        customMajor: "Nuclear Engineering",
      }).success
    ).toBe(true);

    expect(
      step2Schema.safeParse({
        ...validStep2,
        faculty: "Other (تخصص آخر)",
        department: "Other / Specify Major",
        customMajor: "",
      }).success
    ).toBe(false);

    expect(
      step2Schema.safeParse({
        ...validStep2,
        faculty: "Other (تخصص آخر)",
        department: "Other / Specify Major",
        customMajor: "Archaeology",
      }).success
    ).toBe(true);
  });

  it("resolves customMajor over generic Other label", () => {
    expect(
      resolveDepartment({
        faculty: "Other (تخصص آخر)",
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

  it("skips committee/role validation when isEsmeMember is false", () => {
    expect(
      step2Schema.safeParse({
        ...validStep2,
        isEsmeMember: false,
        committee: "",
        role: "",
      }).success
    ).toBe(true);
  });

  it("requires valid committee and role when isEsmeMember is true", () => {
    expect(ESME_COMMITTEES).toEqual(["IT", "Marketing", "Digital"]);
    expect(ESME_ROLES).toEqual(["High Board", "Head", "Member"]);

    expect(
      step2Schema.safeParse({
        ...validStep2,
        isEsmeMember: true,
        committee: "",
        role: "",
      }).success
    ).toBe(false);

    expect(
      step2Schema.safeParse({
        ...validStep2,
        isEsmeMember: true,
        committee: "IT",
        role: "",
      }).success
    ).toBe(false);

    expect(
      step2Schema.safeParse({
        ...validStep2,
        isEsmeMember: true,
        committee: "Digital",
        role: "Head",
      }).success
    ).toBe(true);
  });
});

describe("REG-06 academic year enum & terms", () => {
  it.each(["1st", "2nd", "3rd", "4th", "Graduate", "Alumni"] as const)(
    "accepts %s",
    (year) => {
      expect(step2Schema.safeParse({ ...validStep2, academicYear: year }).success).toBe(true);
    }
  );

  it("rejects unknown year", () => {
    expect(step2Schema.safeParse({ ...validStep2, academicYear: "5th" }).success).toBe(false);
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
    expect(completeRegistrationSchema.safeParse({ ...valid, termsAccepted: false }).success).toBe(false);
  });
});
