export const EVENT_SITE_URL = "esme-metrix-registeration.vercel.app";
export const DEFAULT_EVENT_DATE_BAR = "12 DECEMBER 2026 | CAIRO UNIVERSITY";
export const TEMPLATE_BASE_WIDTH = 1024;
export const TEMPLATE_BASE_HEIGHT = 576;

/**
 * Pixel coordinates measured directly against public/images/attending-card-template.png (1024x576).
 */
export const TEMPLATE_SLOTS = {
  portrait: {
    x: 749,
    y: 116,
    width: 236,
    height: 253,
    // Octagonal chamfer points relative to portrait top-left (width=236, height=253)
    polygonPoints: [
      [24, 0],
      [217, 0],
      [236, 20],
      [236, 233],
      [216, 253],
      [24, 253],
      [0, 230],
      [0, 22],
    ] as const,
  },
  nameMask: {
    x: 756,
    y: 394,
    width: 228,
    height: 28,
    centerX: 870,
    textY: 413,
    fill: "#000C1A",
  },
  universityMask: {
    x: 756,
    y: 432,
    width: 228,
    height: 29,
    centerX: 870,
    textY: 451,
    fill: "#000C1A",
  },
  bottomVenueMask: {
    x: 368,
    y: 516,
    width: 194,
    height: 30,
    textX: 374,
    textY: 537,
    fill: "#001125",
  },
} as const;

export function formatRoleOrMajor(input: {
  jobTitle?: string | null;
  department?: string | null;
  faculty?: string | null;
  isEsmeMember?: boolean | null;
  committee?: string | null;
  role?: string | null;
}): string {
  const job = input.jobTitle?.trim() || "";
  const dept = input.department?.trim() || "";
  const fac = input.faculty?.trim() || "";

  if (input.isEsmeMember && input.committee) {
    const chapterBadge = `ESME Member — ${input.committee}`;
    if (dept) {
      const combined = `${chapterBadge} | ${dept}`;
      if (combined.length > 56 && dept.length > 24) {
        return `${chapterBadge} | ${dept.slice(0, 24).trimEnd()}...`;
      }
      return combined;
    }
    return chapterBadge;
  }

  const major = dept || fac;
  if (job && major && job.toLowerCase() !== major.toLowerCase()) {
    const combined = `${job} • ${major}`;
    return combined.length > 48 ? `${job} • ${major.slice(0, 32)}...` : combined;
  }

  return job || major || "Student";
}

export function formatEventDateLocationBar(
  eventDate?: string | null,
  eventVenue?: string | null
): string {
  const d = (eventDate || "12 DECEMBER 2026").trim().toUpperCase();
  const v = (eventVenue || "CAIRO UNIVERSITY").trim().toUpperCase();
  return `${d} | ${v}`;
}

export function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "EM"
  );
}

export function truncateText(value: string, maxLen: number): string {
  const clean = value.trim();
  if (clean.length <= maxLen) return clean;
  return `${clean.slice(0, Math.max(0, maxLen - 3)).trimEnd()}...`;
}

export function computeNameFontSize(name: string, baseScale: number): number {
  const len = name.trim().length;
  const basePx = len > 26 ? 12 : len > 20 ? 14 : len > 15 ? 16 : 18;
  return Math.round(basePx * baseScale);
}

export function computeUniversityFontSize(university: string, baseScale: number): number {
  const len = university.trim().length;
  const basePx = len > 30 ? 11 : len > 22 ? 12.5 : 14;
  return Math.round(basePx * baseScale);
}
