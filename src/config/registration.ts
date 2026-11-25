export const FACULTIES = [
  "Engineering (الهندسة)",
  "Computer Science & IT (الحاسبات والمعلومات)",
  "Medicine & Healthcare (القطاع الطبي)",
  "Science (العلوم)",
  "Business & Commerce (التجارة وإدارة الأعمال)",
  "Applied Arts & Fine Arts (الفنون التطبيقية والجميلة)",
  "Economics & Political Science (الاقتصاد والعلوم السياسية)",
  "Mass Communication (الإعلام)",
  "Law (الحقوق)",
  "Agriculture (الزراعة)",
  "Education & Arts (التربية والآداب)",
  "Other (تخصص آخر)",
] as const;

export type FacultyCategory = (typeof FACULTIES)[number];

export const OTHER_FACULTY: FacultyCategory = "Other (تخصص آخر)";
export const OTHER_DEPARTMENT_GENERIC = "Other / Specify Major";

export const DEPARTMENTS_BY_FACULTY: Record<FacultyCategory, readonly string[]> = {
  "Engineering (الهندسة)": [
    "Materials & Metallurgical Engineering",
    "Chemical Engineering",
    "Petroleum Engineering",
    "Mechanical Engineering",
    "Electrical Power Engineering",
    "Electronics & Communications",
    "Computer Engineering",
    "Civil Engineering",
    "Architectural Engineering",
    "Aerospace Engineering",
    "Biomedical Engineering",
    "Industrial Engineering",
    "Other Engineering Department",
  ],
  "Computer Science & IT (الحاسبات والمعلومات)": [
    "Computer Science (CS)",
    "Artificial Intelligence (AI)",
    "Data Science",
    "Software Engineering",
    "Cybersecurity",
    "Information Systems (IS)",
    "Information Technology (IT)",
    "Bioinformatics",
    "Other CS / IT Specialization",
  ],
  "Medicine & Healthcare (القطاع الطبي)": [
    "Human Medicine (MBBS / MD)",
    "Pharmacy",
    "Dentistry",
    "Physical Therapy",
    "Nursing",
    "Veterinary Medicine",
    "Medical Laboratory Sciences",
    "Other Medical Field",
  ],
  "Science (العلوم)": [
    "Materials Science & Nanotechnology",
    "Chemistry",
    "Physics",
    "Mathematics",
    "Geology & Geophysics",
    "Biochemistry",
    "Biotechnology",
    "Other Science Major",
  ],
  "Business & Commerce (التجارة وإدارة الأعمال)": [
    "Accounting",
    "Business Administration",
    "Finance & Investment",
    "Marketing",
    "Management Information Systems (MIS)",
    "Economics & Foreign Trade",
    "Actuarial Science",
    OTHER_DEPARTMENT_GENERIC,
  ],
  "Applied Arts & Fine Arts (الفنون التطبيقية والجميلة)": [
    "Industrial Design",
    "Interior Design & Decor",
    "Graphic & Advertising Design",
    "Product Design",
    "Architecture",
    "Animation & Digital Arts",
    "Textile & Fashion Design",
    OTHER_DEPARTMENT_GENERIC,
  ],
  "Economics & Political Science (الاقتصاد والعلوم السياسية)": [
    "Economics",
    "Political Science",
    "Statistics",
    "Public Administration",
    "Socio-Computing",
    OTHER_DEPARTMENT_GENERIC,
  ],
  "Mass Communication (الإعلام)": [
    "Radio & Television",
    "Public Relations & Advertising",
    "Journalism & Digital Media",
    "Digital Media Production",
    OTHER_DEPARTMENT_GENERIC,
  ],
  "Law (الحقوق)": [
    "Arabic Law Section",
    "English Law Section",
    "French Law Section",
    "Corporate & International Law",
    OTHER_DEPARTMENT_GENERIC,
  ],
  "Agriculture (الزراعة)": [
    "Agricultural Engineering",
    "Biotechnology & Genetics",
    "Food Science & Technology",
    "Soil & Water Sciences",
    "Agribusiness & Economics",
    OTHER_DEPARTMENT_GENERIC,
  ],
  "Education & Arts (التربية والآداب)": [
    "Languages & Translation",
    "History & Civilization",
    "Geography & GIS",
    "Psychology & Sociology",
    "Educational Sciences",
    OTHER_DEPARTMENT_GENERIC,
  ],
  "Other (تخصص آخر)": [OTHER_DEPARTMENT_GENERIC],
};

/** Centralized ESME Chapter committees — add future committees here. */
export const ESME_COMMITTEES = ["IT", "Marketing", "Digital"] as const;
export type EsmeCommittee = (typeof ESME_COMMITTEES)[number];

/** Centralized ESME Chapter roles. */
export const ESME_ROLES = ["High Board", "Head", "Member"] as const;
export type EsmeRole = (typeof ESME_ROLES)[number];

export function isOtherFaculty(faculty?: string | null): boolean {
  if (!faculty) return false;
  return faculty === OTHER_FACULTY || faculty.trim().toLowerCase().startsWith("other");
}

export function isOtherDepartment(department?: string | null): boolean {
  if (!department) return false;
  return department.trim().toLowerCase().startsWith("other");
}

export function requiresCustomMajor(faculty?: string | null, department?: string | null): boolean {
  return isOtherFaculty(faculty) || isOtherDepartment(department);
}

export function getDepartmentsForFaculty(faculty?: string | null): readonly string[] {
  if (!faculty) return [];
  return DEPARTMENTS_BY_FACULTY[faculty as FacultyCategory] ?? [OTHER_DEPARTMENT_GENERIC];
}

export function resolveDepartment(input: {
  faculty?: string | null;
  department?: string | null;
  customMajor?: string | null;
}): string {
  const custom = input.customMajor?.trim() || "";
  if (requiresCustomMajor(input.faculty, input.department) && custom) {
    return custom;
  }
  return input.department?.trim() || custom || input.faculty?.trim() || "";
}

export interface OgHighlightItem {
  value: string;
  label: string;
}

export const DEFAULT_OG_HIGHLIGHTS: OgHighlightItem[] = [
  { value: "500+", label: "ATTENDEES" },
  { value: "15+", label: "SPEAKERS" },
  { value: "10+", label: "WORKSHOPS" },
  { value: "12+", label: "PARTNERS" },
  { value: "3", label: "TRACKS" },
  { value: "1", label: "CONFERENCE" },
];

export const DEFAULT_OG_HIGHLIGHTS_TEXT = DEFAULT_OG_HIGHLIGHTS.map(
  (h) => `${h.value} | ${h.label}`
).join("\n");

export function parseOgHighlights(raw?: string | null): OgHighlightItem[] {
  if (!raw || !raw.trim()) return DEFAULT_OG_HIGHLIGHTS;
  const parsed = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 6)
    .map((line) => {
      const pipeParts = line.split("|").map((p) => p.trim());
      if (pipeParts.length >= 2 && pipeParts[0] && pipeParts[1]) {
        return { value: pipeParts[0], label: pipeParts[1].toUpperCase() };
      }
      const spaceMatch = line.match(/^(\S+)\s+(.+)$/);
      if (spaceMatch) {
        return { value: spaceMatch[1], label: spaceMatch[2].toUpperCase() };
      }
      return { value: "•", label: line.toUpperCase() };
    });

  if (parsed.length === 0) return DEFAULT_OG_HIGHLIGHTS;
  while (parsed.length < 6) {
    parsed.push(DEFAULT_OG_HIGHLIGHTS[parsed.length]);
  }
  return parsed;
}

export const LINKEDIN_POST_TEXT = `I'm attending *ESME METRIX*!

Join us on 12 December 2026 at Cairo University for an exciting event exploring the world of Materials Engineering, innovation, and advanced materials.

Discover, learn, and connect with fellow engineering students.

Register now: https://esme-metrix-registeration.vercel.app/

#ESMEMetrix #MaterialsEngineering #ESMECU #CairoUniversity`;
