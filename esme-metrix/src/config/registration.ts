export interface FacultyDefinition {
  name: string;
  departments: readonly string[];
}

export const OTHER_DEPARTMENT_GENERIC = "Other / Specify Major";
export const OTHER_FACULTY_NAME = "Other";

export const DEFAULT_FACULTY_CONFIGS: readonly FacultyDefinition[] = [
  {
    name: "Engineering",
    departments: [
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
  },
  {
    name: "Computer Science & IT",
    departments: [
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
  },
  {
    name: "Medicine & Healthcare",
    departments: [
      "Human Medicine (MBBS / MD)",
      "Pharmacy",
      "Dentistry",
      "Physical Therapy",
      "Nursing",
      "Veterinary Medicine",
      "Medical Laboratory Sciences",
      "Other Medical Field",
    ],
  },
  {
    name: "Science",
    departments: [
      "Materials Science & Nanotechnology",
      "Chemistry",
      "Physics",
      "Mathematics",
      "Geology & Geophysics",
      "Biochemistry",
      "Biotechnology",
      "Other Science Major",
    ],
  },
  {
    name: "Business & Commerce",
    departments: [
      "Accounting",
      "Business Administration",
      "Finance & Investment",
      "Marketing",
      "Management Information Systems (MIS)",
      "Economics & Foreign Trade",
      "Actuarial Science",
      OTHER_DEPARTMENT_GENERIC,
    ],
  },
  {
    name: "Applied Arts & Fine Arts",
    departments: [
      "Industrial Design",
      "Interior Design & Decor",
      "Graphic & Advertising Design",
      "Product Design",
      "Architecture",
      "Animation & Digital Arts",
      "Textile & Fashion Design",
      OTHER_DEPARTMENT_GENERIC,
    ],
  },
  {
    name: "Economics & Political Science",
    departments: [
      "Economics",
      "Political Science",
      "Statistics",
      "Public Administration",
      "Socio-Computing",
      OTHER_DEPARTMENT_GENERIC,
    ],
  },
  {
    name: "Mass Communication",
    departments: [
      "Radio & Television",
      "Public Relations & Advertising",
      "Journalism & Digital Media",
      "Digital Media Production",
      OTHER_DEPARTMENT_GENERIC,
    ],
  },
  {
    name: "Law",
    departments: [
      "Arabic Law Section",
      "English Law Section",
      "French Law Section",
      "Corporate & International Law",
      OTHER_DEPARTMENT_GENERIC,
    ],
  },
  {
    name: "Agriculture",
    departments: [
      "Agricultural Engineering",
      "Biotechnology & Genetics",
      "Food Science & Technology",
      "Soil & Water Sciences",
      "Agribusiness & Economics",
      OTHER_DEPARTMENT_GENERIC,
    ],
  },
  {
    name: "Education & Arts",
    departments: [
      "Languages & Translation",
      "History & Civilization",
      "Geography & GIS",
      "Psychology & Sociology",
      "Educational Sciences",
      OTHER_DEPARTMENT_GENERIC,
    ],
  },
  {
    name: OTHER_FACULTY_NAME,
    departments: [OTHER_DEPARTMENT_GENERIC],
  },
];

export const FACULTIES = DEFAULT_FACULTY_CONFIGS.map((f) => f.name);

export const OTHER_FACULTY = OTHER_FACULTY_NAME;

export const DEPARTMENTS_BY_FACULTY: Record<string, readonly string[]> = Object.fromEntries(
  DEFAULT_FACULTY_CONFIGS.map((f) => [f.name, f.departments])
);

export const DEFAULT_CITIES: readonly string[] = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Qalyubia",
  "Sharqia",
  "Dakahlia",
  "Gharbia",
  "Monufia",
  "Beheira",
  "Kafr El Sheikh",
  "Damietta",
  "Port Said",
  "Ismailia",
  "Suez",
  "Fayoum",
  "Beni Suef",
  "Minya",
  "Assiut",
  "Sohag",
  "Qena",
  "Luxor",
  "Aswan",
  "Other Governorate",
];

export const DEFAULT_ACADEMIC_YEARS = [
  { value: "1st", label: "1st Year (Freshman)" },
  { value: "2nd", label: "2nd Year (Sophomore)" },
  { value: "3rd", label: "3rd Year (Junior)" },
  { value: "4th", label: "4th Year (Senior / Graduation)" },
  { value: "Graduate", label: "Graduate Student (MSc / PhD)" },
  { value: "Alumni", label: "Alumni / Graduate" },
] as const;

export const DEFAULT_GRADUATION_YEARS = [
  { value: "2024", label: "2024 (Alumni)" },
  { value: "2025", label: "2025" },
  { value: "2026", label: "2026" },
  { value: "2027", label: "2027" },
  { value: "2028", label: "2028" },
  { value: "2029", label: "2029" },
  { value: "2030", label: "2030+" },
] as const;

/** Centralized default ESME Chapter committees (editable via Admin CMS Form Builder). */
export const ESME_COMMITTEES = ["IT", "Marketing", "Digital"] as const;
export type EsmeCommittee = (typeof ESME_COMMITTEES)[number];

/** Centralized default ESME Chapter roles (editable via Admin CMS Form Builder). */
export const ESME_ROLES = ["High Board", "Head", "Member"] as const;
export type EsmeRole = (typeof ESME_ROLES)[number];

export function isOtherFaculty(faculty?: string | null): boolean {
  if (!faculty) return false;
  const trimmed = faculty.trim().toLowerCase();
  return trimmed === "other" || trimmed.startsWith("other");
}

export function isOtherDepartment(department?: string | null): boolean {
  if (!department) return false;
  return department.trim().toLowerCase().startsWith("other");
}

export function requiresCustomMajor(faculty?: string | null, department?: string | null): boolean {
  return isOtherFaculty(faculty) || isOtherDepartment(department);
}

export function getDepartmentsForFaculty(
  faculty?: string | null,
  facultyConfigs: readonly FacultyDefinition[] = DEFAULT_FACULTY_CONFIGS
): readonly string[] {
  if (!faculty) return [];
  const match = facultyConfigs.find((f) => f.name === faculty);
  if (match && match.departments.length > 0) {
    return match.departments;
  }
  return [OTHER_DEPARTMENT_GENERIC];
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
  { value: "2", label: "HALLS" },
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

export const OFFICIAL_ESME_LINKEDIN_URL =
  "https://www.linkedin.com/company/esme-cairo-university-student-chapter/";

export const LINKEDIN_POST_TEXT = `I'm attending *ESME METRIX*!

Join us on 12 December 2026 at Cairo University for an exciting event exploring the world of Materials Engineering, innovation, and advanced materials.

Discover, learn, and connect with fellow engineering students.

Register now: https://esme-metrix-registeration.vercel.app/
Follow ESME Cairo University: ${OFFICIAL_ESME_LINKEDIN_URL}

#ESMEMetrix #MaterialsEngineering #ESMECU #CairoUniversity`;
