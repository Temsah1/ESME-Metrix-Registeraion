import type { AppLanguage } from "./types";

const COMMITTEE_AR_LABELS: Record<string, string> = {
  "High Board": "الهيئة العليا (High Board)",
  IT: "لجنة تكنولوجيا المعلومات (IT)",
  Marketing: "لجنة التسويق (Marketing)",
  Digital: "لجنة المحتوى الرقمي (Digital)",
};

const ROLE_AR_LABELS: Record<string, string> = {
  Member: "عضو (Member)",
  Director: "مدير لجنة (Director)",
  Head: "رئيس لجنة (Head)",
};

const ACADEMIC_YEAR_AR_LABELS: Record<string, string> = {
  "1st": "الفرقة الأولى",
  "2nd": "الفرقة الثانية",
  "3rd": "الفرقة الثالثة",
  "4th": "الفرقة الرابعة (سنة التخرج)",
  Graduate: "دراسات عليا (ماجستير / دكتوراه)",
  Alumni: "خريج",
};

const GRADUATION_YEAR_AR_LABELS: Record<string, string> = {
  "2024": "2024 (خريج)",
  "2025": "2025",
  "2026": "2026",
  "2027": "2027",
  "2028": "2028",
  "2029": "2029",
  "2030": "2030 فأكثر",
};

const CITY_AR_LABELS: Record<string, string> = {
  Cairo: "القاهرة",
  Giza: "الجيزة",
  Alexandria: "الإسكندرية",
  Qalyubia: "القليوبية",
  Sharqia: "الشرقية",
  Dakahlia: "الدقهلية",
  Gharbia: "الغربية",
  Monufia: "المنوفية",
  Beheira: "البحيرة",
  "Kafr El Sheikh": "كفر الشيخ",
  Damietta: "دمياط",
  "Port Said": "بورسعيد",
  Ismailia: "الإسماعيلية",
  Suez: "السويس",
  Fayoum: "الفيوم",
  "Beni Suef": "بني سويف",
  Minya: "المنيا",
  Assiut: "أسيوط",
  Sohag: "سوهاج",
  Qena: "قنا",
  Luxor: "الأقصر",
  Aswan: "أسوان",
  "Other Governorate": "محافظة أخرى",
};

const FACULTY_AR_LABELS: Record<string, string> = {
  Engineering: "كلية الهندسة",
  "Computer Science & IT": "الحاسبات والمعلومات وتكنولوجيا المعلومات",
  "Medicine & Healthcare": "الطب والعلوم الصحية",
  Science: "كلية العلوم",
  "Business & Commerce": "التجارة وإدارة الأعمال",
  "Applied Arts & Fine Arts": "الفنون التطبيقية والفنون الجميلة",
  "Economics & Political Science": "الاقتصاد والعلوم السياسية",
  "Mass Communication": "الإعلام",
  Law: "الحقوق",
  Agriculture: "الزراعة",
  "Education & Arts": "الآداب والتربية",
  Other: "أخرى (تخصص مختلف)",
};

const DEPARTMENT_AR_LABELS: Record<string, string> = {
  "Materials & Metallurgical Engineering": "هندسة الفلزات والمواد",
  "Chemical Engineering": "الهندسة الكيميائية",
  "Petroleum Engineering": "هندسة البترول",
  "Mechanical Engineering": "الهندسة الميكانيكية",
  "Electrical Power Engineering": "هندسة القوى الكهربائية",
  "Electronics & Communications": "الإلكترونيات والاتصالات",
  "Computer Engineering": "هندسة الحاسبات",
  "Civil Engineering": "الهندسة المدنية",
  "Architectural Engineering": "الهندسة المعمارية",
  "Aerospace Engineering": "هندسة الطيران والفضاء",
  "Biomedical Engineering": "الهندسة الطبية الحيوية",
  "Industrial Engineering": "الهندسة الصناعية",
  "Other Engineering Department": "قسم هندسي آخر",

  "Computer Science (CS)": "علوم الحاسب (CS)",
  "Artificial Intelligence (AI)": "الذكاء الاصطناعي (AI)",
  "Data Science": "علوم البيانات",
  "Software Engineering": "هندسة البرمجيات",
  Cybersecurity: "الأمن السيبراني",
  "Information Systems (IS)": "نظم المعلومات (IS)",
  "Information Technology (IT)": "تكنولوجيا المعلومات (IT)",
  Bioinformatics: "المعلوماتية الحيوية",
  "Other CS / IT Specialization": "تخصص حاسبات آخر",

  "Human Medicine (MBBS / MD)": "الطب البشري",
  Pharmacy: "الصيدلة",
  Dentistry: "طب الأسنان",
  "Physical Therapy": "العلاج الطبيعي",
  Nursing: "التمريض",
  "Veterinary Medicine": "الطب البيطري",
  "Medical Laboratory Sciences": "علوم المختبرات الطبية",
  "Other Medical Field": "تخصص طبي آخر",

  "Materials Science & Nanotechnology": "علوم المواد والنانوتكنولوجي",
  Chemistry: "الكيمياء",
  Physics: "الفيزياء",
  Mathematics: "الرياضيات",
  "Geology & Geophysics": "الجيولوجيا والجيوفيزياء",
  Biochemistry: "الكيمياء الحيوية",
  Biotechnology: "التكنولوجيا الحيوية",
  "Other Science Major": "تخصص علوم آخر",

  Accounting: "المحاسبة",
  "Business Administration": "إدارة الأعمال",
  "Finance & Investment": "التمويل والاستثمار",
  Marketing: "التسويق",
  "Management Information Systems (MIS)": "نظم المعلومات الإدارية (MIS)",
  "Economics & Foreign Trade": "الاقتصاد والتجارة الخارجية",
  "Actuarial Science": "العلوم الاكتوارية",

  "Industrial Design": "التصميم الصناعي",
  "Interior Design & Decor": "التصميم الداخلي والديكور",
  "Graphic & Advertising Design": "التصميم الجرافيكي والإعلاني",
  "Product Design": "تصميم المنتجات",
  Architecture: "العمارة",
  "Animation & Digital Arts": "الرسوم المتحركة والفنون الرقمية",
  "Textile & Fashion Design": "تصميم المنسوجات والأزياء",

  Economics: "الاقتصاد",
  "Political Science": "العلوم السياسية",
  Statistics: "الإحصاء",
  "Public Administration": "الإدارة العامة",
  "Socio-Computing": "الحوسبة الاجتماعية",

  "Radio & Television": "الإذاعة والتلفزيون",
  "Public Relations & Advertising": "العلاقات العامة والإعلان",
  "Journalism & Digital Media": "الصحافة والإعلام الرقمي",
  "Digital Media Production": "إنتاج الوسائط الرقمية",

  "Arabic Law Section": "شعبة اللغة العربية (حقوق)",
  "English Law Section": "شعبة اللغة الإنجليزية (حقوق)",
  "French Law Section": "شعبة اللغة الفرنسية (حقوق)",
  "Corporate & International Law": "القانون التجاري والدولي",

  "Agricultural Engineering": "الهندسة الزراعية",
  "Biotechnology & Genetics": "التكنولوجيا الحيوية والوراثة",
  "Food Science & Technology": "علوم وتكنولوجيا الأغذية",
  "Soil & Water Sciences": "علوم الأراضي والمياه",
  "Agribusiness & Economics": "إدارة الأعمال الزراعية والاقتصاد",

  "Languages & Translation": "اللغات والترجمة",
  "History & Civilization": "التاريخ والحضارة",
  "Geography & GIS": "الجغرافيا ونظم المعلومات الجغرافية (GIS)",
  "Psychology & Sociology": "علم النفس والاجتماع",
  "Educational Sciences": "العلوم التربوية",

  "Other / Specify Major": "أخرى / تحديد التخصص يدويًا",
};

export function localizeCommittee(committee: string, lang: AppLanguage): string {
  if (lang !== "ar") return committee;
  return COMMITTEE_AR_LABELS[committee] || committee;
}

export function localizeRole(role: string, lang: AppLanguage): string {
  if (lang !== "ar") return role;
  return ROLE_AR_LABELS[role] || role;
}

export function localizeCity(city: string, lang: AppLanguage): string {
  if (lang !== "ar") return city;
  return CITY_AR_LABELS[city] || city;
}

export function localizeFaculty(faculty: string, lang: AppLanguage): string {
  if (lang !== "ar") return faculty;
  return FACULTY_AR_LABELS[faculty] || faculty;
}

export function localizeDepartment(department: string, lang: AppLanguage): string {
  if (lang !== "ar") return department;
  return DEPARTMENT_AR_LABELS[department] || department;
}

export function localizeAcademicYear(
  value: string,
  fallbackLabel: string,
  lang: AppLanguage
): string {
  if (lang !== "ar") return fallbackLabel;
  return ACADEMIC_YEAR_AR_LABELS[value] || fallbackLabel;
}

export function localizeGraduationYear(
  value: string,
  fallbackLabel: string,
  lang: AppLanguage
): string {
  if (lang !== "ar") return fallbackLabel;
  return GRADUATION_YEAR_AR_LABELS[value] || fallbackLabel;
}
