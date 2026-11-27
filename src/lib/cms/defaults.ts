import {
  DEFAULT_ACADEMIC_YEARS,
  DEFAULT_CITIES,
  DEFAULT_FACULTY_CONFIGS,
  DEFAULT_GRADUATION_YEARS,
  DEFAULT_OG_HIGHLIGHTS_TEXT,
  ESME_COMMITTEES,
  LINKEDIN_POST_TEXT,
  OFFICIAL_ESME_LINKEDIN_URL,
} from "@/config/registration";
import {
  DEFAULT_EVENT_STATS,
  type ConfirmationCmsConfig,
  type DualHallAgendaConfig,
  type EventStatItem,
  type FooterCmsConfig,
  type FullCmsData,
  type GalleryItem,
  type HighlightMetric,
  type LandingCmsConfig,
  type RegistrationFormConfig,
} from "@/lib/cms/types";
import { DEFAULT_ARABIC_CMS } from "@/lib/cms/arabic";

export const DEFAULT_EVENT_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Development+Research+and+Technological+Planning+Center+DRTPC+Cairo+University";

export const DEFAULT_LANDING_CMS: LandingCmsConfig = {
  statusBadge: "REGISTRATION OPEN — 500 SEATS",
  titleLine1: "ESME METRIX — 2nd Edition",
  titleHighlight: "One day. Closer to real industry.",
  subtitle:
    "Following the success of its first edition in February 2026, ESME METRIX returns with 11 technical sessions across two parallel halls covering AI, robotics, materials engineering, and modern industry, alongside a practical CV and interview skills session.",
  primaryCtaLabel: "REGISTER FOR ADMISSION",
  secondaryCtaLabel: "Explore Event Agenda",
  certificateBadge: "FULL DAY",
  certificateTitle: "Attendance Certificate for Full-Day Participation",
  certificateDescription:
    "Complete the full-day program and collect attendance stamps at all three stations to qualify for the event certificate.",
  storyEyebrow: "ESME METRIX • Second Edition",
  storyTitle: "A full day of practical engineering and career skills",
  storyLead:
    "On Saturday, December 12, 2026, the ESME Cairo University Student Chapter brings students, faculty, and industry experts together at DRTPC for a full-day program from 9:00 AM to 5:00 PM. Choose from parallel sessions in AI, robotics, inspection, materials, and infrastructure, then build practical CV and interview skills.",
  storyPillars: [
    {
      id: "story-1",
      tag: "01 // AI & AUTOMATION",
      title: "Smarter Industrial Systems",
      description:
        "Explore AI visual inspection, defect detection, robotics, industrial automation, and predictive maintenance.",
    },
    {
      id: "story-2",
      tag: "02 // TWO PARALLEL HALLS",
      title: "Materials, Quality & Infrastructure",
      description:
        "Choose sessions on NDT with AI, nanomaterials, green steel, water treatment, earthquake-resistant structures, and corrosion protection.",
    },
    {
      id: "story-3",
      tag: "03 // CAREER DEVELOPMENT",
      title: "Practical HR Session",
      description:
        "Get practical guidance on CV writing and interview skills, meet peers and experts, and complete the full-day program to qualify for an attendance certificate.",
    },
  ],
  aboutEyebrow: "Saturday • December 12, 2026",
  aboutTitle: "ESME METRIX returns for its second edition",
  aboutText:
    "Join the ESME Cairo University Student Chapter at the Development Research and Technological Planning Center (DRTPC), Cairo University, from 9:00 AM to 5:00 PM. The program features two parallel halls with capacities of 300 and 200, 11 technical sessions, and a dedicated HR session.",
  experienceBullets: [
    "Attendance certificate for participants who complete the full day and collect stamps at all three stations.",
    "A practical HR session on CV writing and interview skills.",
    "Brunch, tea, networking, and scheduled breaks throughout the day.",
    "Meet Cairo University faculty members and industry experts across both halls.",
  ],
  galleryEyebrow: "Visual Showcase • 8 Event Moments",
  galleryTitle: "Inside Past Editions at Cairo University",
  gallerySubtitle:
    "Authentic moments from our Cairo University auditorium sessions, speaker briefings, student organizing teams, and industrial talks.",
  ctaTitle: "Book your seat at ESME METRIX",
  ctaDescription:
    "Only 500 seats are available. Register now for the December 12 program at DRTPC, Cairo University. Registration closes when capacity is reached.",
  ctaButtonLabel: "REGISTER NOW — FREE ADMISSION",
};

export const DEFAULT_EVENT_STATS_CMS: EventStatItem[] = DEFAULT_EVENT_STATS.map((item) => ({
  value: item.value,
  label: { ...item.label },
}));

export const DEFAULT_HIGHLIGHTS_CMS: HighlightMetric[] = DEFAULT_EVENT_STATS_CMS.map((item) => ({
  value: item.value,
  label: item.label.en,
}));

export const DEFAULT_GALLERY_CMS: GalleryItem[] = [
  {
    id: "gal-1",
    url: "/images/gallery/event-1.jpg",
    caption: "ESME Organizing Team — Attendee Reception & Check-In Crew",
    alt: "Five female ESME METRIX organizers smiling with orange lanyards and badges",
  },
  {
    id: "gal-2",
    url: "/images/gallery/event-2.jpg",
    caption: "Industrial Partners Briefing & Surface Engineering Showcase",
    alt: "Industry speaker presenting lubricants and industrial brands on stage",
  },
  {
    id: "gal-3",
    url: "/images/gallery/event-3.jpg",
    caption: "Academic Seminar — Casting Design & Solidification Modeling",
    alt: "Professor and moderator leading metallurgy casting seminar in the lecture hall",
  },
  {
    id: "gal-4",
    url: "/images/gallery/event-4.jpg",
    caption: "Faculty & Student Delegates During Plenary Session",
    alt: "Professors and engineering students seated together inside Cairo University hall",
  },
  {
    id: "gal-5",
    url: "/images/gallery/event-5.jpg",
    caption: "Special Steels & Industrial Applications Keynote",
    alt: "Full lecture hall following a materials engineering keynote",
  },
  {
    id: "gal-6",
    url: "/images/gallery/event-6.jpg",
    caption: "Packed Main Auditorium — Cross-University Student Turnout",
    alt: "Wide auditorium view showing packed engineering audience and ESME banners",
  },
  {
    id: "gal-7",
    url: "/images/gallery/event-7.jpg",
    caption: "Sustainability & Scope 3 Carbon Emissions Engineering Talk",
    alt: "Speaker presenting carbon emissions and sustainability metrics for materials engineers",
  },
  {
    id: "gal-8",
    url: "/images/gallery/event-8.jpg",
    caption: "ESME Cairo Student Chapter Leadership & Guest Speakers",
    alt: "Four ESME Cairo Student Chapter team members and guests by the official chapter banner",
  },
];

export const DEFAULT_AGENDA_CMS: DualHallAgendaConfig = {
  eyebrow: "Official Day Schedule",
  title: "Two-Hall Agenda",
  subtitle: "Saturday, December 12, 2026 • 9:00 AM–5:00 PM • DRTPC, Cairo University.",
  hall1Name: "MAIN HALL",
  hall1Capacity: "300 Capacity",
  hall1Subtitle: "Main Hall • Keynote, technical sessions, HR, sponsor slots",
  hall2Name: "SMALL HALL",
  hall2Capacity: "200 Capacity",
  hall2Subtitle: "Small Hall • Parallel technical sessions",
  sessions: [
    {
      id: "shared-registration",
      hallType: "shared",
      sortOrder: 1,
      time: "09:00 AM – 09:30 AM",
      title: "Registration, Reception & Brunch",
      speaker: "",
      role: "",
      tag: "Registration",
      description: "Attendee check-in, welcome reception, brunch, and Ahmed Tea catering.",
    },
    {
      id: "shared-opening",
      hallType: "shared",
      sortOrder: 2,
      time: "09:30 AM – 10:10 AM",
      title: "Chapter Opening & Keynote",
      speaker: "",
      role: "",
      tag: "Main Hall • Small Hall Closed",
      description:
        "Chapter and academic supervisor remarks, a 10-minute keynote speaker slot, and one sponsor slot. The keynote speaker is to be announced; the Small Hall is closed.",
    },
    {
      id: "h1-ai-visual-inspection",
      hallType: "hall1",
      sortOrder: 3,
      time: "10:15 AM – 11:00 AM",
      title: "AI Visual Inspection",
      speaker: "",
      role: "",
      tag: "Technical Session",
      description: "",
    },
    {
      id: "h2-earthquake-structures",
      hallType: "hall2",
      sortOrder: 4,
      time: "10:15 AM – 11:00 AM",
      title: "Earthquake-Resistant Structures",
      speaker: "",
      role: "",
      tag: "Technical Session",
      description: "",
    },
    {
      id: "h1-robotics-automation",
      hallType: "hall1",
      sortOrder: 5,
      time: "11:05 AM – 11:50 AM",
      title: "Robotics & Automation",
      speaker: "",
      role: "",
      tag: "Technical Session",
      description: "",
    },
    {
      id: "h2-water-treatment",
      hallType: "hall2",
      sortOrder: 6,
      time: "11:05 AM – 11:50 AM",
      title: "Water Treatment",
      speaker: "",
      role: "",
      tag: "Technical Session",
      description: "",
    },
    {
      id: "shared-dhuhr-break",
      hallType: "shared",
      sortOrder: 7,
      time: "11:50 AM – 12:25 PM",
      title: "Dhuhr Break • 35 min",
      speaker: "",
      role: "",
      tag: "Prayer • Catering • Networking",
      description: "Prayer, catering, and networking. Both halls are closed during the break.",
    },
    {
      id: "h1-ndt-ai",
      hallType: "hall1",
      sortOrder: 8,
      time: "12:25 PM – 01:10 PM",
      title: "NDT with AI",
      speaker: "",
      role: "",
      tag: "Technical Session",
      description: "",
    },
    {
      id: "h2-nanomaterials",
      hallType: "hall2",
      sortOrder: 9,
      time: "12:25 PM – 01:10 PM",
      title: "Nanomaterials",
      speaker: "",
      role: "",
      tag: "Technical Session",
      description: "",
    },
    {
      id: "h1-predictive-maintenance",
      hallType: "hall1",
      sortOrder: 10,
      time: "01:15 PM – 02:00 PM",
      title: "Predictive Maintenance",
      speaker: "",
      role: "",
      tag: "Technical Session",
      description: "",
    },
    {
      id: "h2-green-steel",
      hallType: "hall2",
      sortOrder: 11,
      time: "01:15 PM – 02:00 PM",
      title: "Green Steel with DRI",
      speaker: "",
      role: "",
      tag: "Technical Session",
      description: "",
    },
    {
      id: "shared-hr-session",
      hallType: "shared",
      sortOrder: 12,
      time: "02:00 PM – 02:40 PM",
      title: "HR Session — Interviews & CVs",
      speaker: "",
      role: "",
      tag: "Main Hall • Small Hall Closed",
      description:
        "One shared session for all attendees covering CVs and interview skills. The Small Hall is closed.",
    },
    {
      id: "shared-asr-break",
      hallType: "shared",
      sortOrder: 13,
      time: "02:40 PM – 03:10 PM",
      title: "Asr Break • 30 min",
      speaker: "",
      role: "",
      tag: "Prayer • Tea",
      description: "Afternoon prayer and Ahmed Tea. Both halls are closed during the break.",
    },
    {
      id: "h1-ai-cad",
      hallType: "hall1",
      sortOrder: 14,
      time: "03:10 PM – 03:55 PM",
      title: "AI in CAD & Generative Design",
      speaker: "",
      role: "",
      tag: "Technical Session",
      description: "",
    },
    {
      id: "h2-corrosion-protection",
      hallType: "hall2",
      sortOrder: 15,
      time: "03:10 PM – 03:55 PM",
      title: "Corrosion & Materials Protection",
      speaker: "",
      role: "",
      tag: "Technical Session",
      description: "Additive Manufacturing is reserved as a backup topic.",
    },
    {
      id: "shared-sponsor-talks",
      hallType: "shared",
      sortOrder: 16,
      time: "04:00 PM – 04:30 PM",
      title: "Sponsor Talks",
      speaker: "",
      role: "",
      tag: "2 Slots • 15 min each • Small Hall Closed",
      description:
        "Two 15-minute sponsor talk slots in the Main Hall. Company names will be announced after confirmation.",
    },
    {
      id: "shared-closing",
      hallType: "shared",
      sortOrder: 17,
      time: "04:30 PM – 05:00 PM",
      title: "Closing & Certificates",
      speaker: "",
      role: "",
      tag: "Main Hall • All Attendees",
      description:
        "Closing, certificate distribution, and group photo in the Main Hall. The Small Hall is closed.",
    },
  ],
};

/* The keynote is included in the eleven technical sessions; ten more topics follow in the halls. */
export const DEFAULT_FORM_CMS: RegistrationFormConfig = {
  bannerBadge: "Accredited",
  bannerTitle: "Attendance Certificate for Full-Day Participation",
  bannerDescription:
    "Participants who complete the full-day program and collect attendance stamps at all three stations qualify for an event certificate.",
  steps: {
    step1: {
      navLabel: "Personal",
      title: "Personal Details",
      subtitle: "Provide your full legal name, 14-digit National ID, and contact details.",
    },
    step2: {
      navLabel: "Academic",
      title: "Academic & Chapter Info",
      subtitle:
        "Specify your university, faculty, specialization, graduation year, and ESME Chapter status.",
    },
    step3: {
      navLabel: "Documents",
      title: "Verification Documents",
      subtitle:
        "Upload your Egyptian National ID front image. Your badge portrait photo is optional.",
    },
    step4: {
      navLabel: "Review",
      title: "Final Review & Submission",
      subtitle: "Confirm all submitted details before generating your encrypted QR pass.",
    },
  },
  fields: {
    fullName: {
      label: "Full Name",
      placeholder: "e.g. Omar Ahmed Hassan",
      helperText: "Enter your full name as it should appear on your certificate.",
      required: true,
    },
    nationalId: {
      label: "National ID (14 Digits)",
      placeholder: "29912010101234",
      helperText: "14-digit Egyptian National ID number for venue security verification.",
      required: true,
    },
    phone: {
      label: "Mobile Phone Number",
      placeholder: "01012345678",
      helperText: "Egyptian mobile format: 010, 011, 012, or 015",
      required: true,
    },
    email: {
      label: "Email Address",
      placeholder: "student@cu.edu.eg",
      helperText: "Your QR pass and confirmation will be sent here.",
      required: true,
    },
    city: {
      label: "Governorate / City",
      placeholder: "Select Governorate...",
      required: true,
    },
    university: {
      label: "University / Institution",
      placeholder: "e.g. Cairo University",
      required: true,
    },
    faculty: {
      label: "Faculty / Major Category",
      placeholder: "Select Faculty / Major Category...",
      required: true,
    },
    department: {
      label: "Department / Specialization",
      placeholder: "Select Department / Specialization...",
      required: true,
    },
    customMajor: {
      label: "Specify Your Major / Department",
      placeholder: "Enter your exact major (e.g. Nanotechnology, Architecture...)",
      required: true,
    },
    academicYear: {
      label: "Academic Year",
      placeholder: "Select Academic Year...",
      required: true,
    },
    graduationYear: {
      label: "Expected Graduation Year",
      placeholder: "Select Graduation Year...",
      required: true,
    },
    jobTitle: {
      label: "Current Role / Title",
      placeholder: "Student, Research Assistant, or Engineer",
      required: true,
    },
    company: {
      label: "Company / Organization",
      placeholder: "Company or Lab Name (if applicable)",
      required: false,
    },
    isEsmeMember: {
      label: "Are you a member of the ESME Chapter?",
      yesLabel: "Yes — ESME Member",
      noLabel: "No — External Attendee",
      required: true,
    },
    committee: {
      label: "Committee",
      placeholder: "Select Committee...",
      required: true,
    },
    idPhotoUrl: {
      label: "National ID Card (Front)",
      placeholder: "",
      helperText: "Clear image of your Egyptian National ID card front (JPEG or PNG, max 5MB).",
      required: true,
    },
    avatarUrl: {
      label: "Profile Photo (For Event Badge)",
      placeholder: "",
      helperText: "Optional: Displayed inside your digital ticket stub and LinkedIn badge.",
      required: false,
    },
  },
  faculties: DEFAULT_FACULTY_CONFIGS.map((f) => ({
    name: f.name,
    departments: [...f.departments],
  })),
  cities: [...DEFAULT_CITIES],
  academicYears: DEFAULT_ACADEMIC_YEARS.map((item) => ({ ...item })),
  graduationYears: DEFAULT_GRADUATION_YEARS.map((item) => ({ ...item })),
  esmeCommittees: [...ESME_COMMITTEES],
  termsLabel:
    "I confirm that all submitted details and uploaded documents are authentic, and I agree to follow the ESME Cairo University event code of conduct.",
  submitButtonLabel: "COMPLETE REGISTRATION",
};

export const DEFAULT_CONFIRMATION_CMS: ConfirmationCmsConfig = {
  badgeLabel: "ADMISSION CONFIRMED & CREDENTIAL ISSUED",
  heading: "Welcome to ESME METRIX 2026!",
  subheading:
    "Your official member dashboard, encrypted gate QR code, and digital event pass are ready below.",
  whatsappBadge: "NEXT STEP: JOIN THE ATTENDEE COMMUNITY",
  whatsappTitle: "Official Attendee WhatsApp Group",
  whatsappDescription:
    "Join the verified attendee group to receive live workshop schedules, hall room updates, and direct coordination with organizers.",
  whatsappButtonLabel: "Join WhatsApp Group",
  postRegistrationWhatsappUrl: "https://chat.whatsapp.com/KOT8wY8h2lK5p0mNN7NcNW",
  checklistTitle: "Attendee Admission Checklist",
  checklist: [
    {
      title: "Confirmation Email Sent",
      description:
        "A backup copy containing your high-resolution QR admission badge has been dispatched to your inbox.",
    },
    {
      title: "Original Physical ID Required",
      description:
        "Please bring your original Egyptian National ID card for verification at DRTPC, Cairo University.",
    },
    {
      title: "Digital Badge Ready on Mobile",
      description:
        "Save your PDF ticket or PNG QR badge on your phone for instant fast-track scanning at check-in.",
    },
  ],
  linkedinCaption: LINKEDIN_POST_TEXT,
  ogHighlightsText: DEFAULT_OG_HIGHLIGHTS_TEXT,
};

export const DEFAULT_FOOTER_CMS: FooterCmsConfig = {
  brandTitle: "ESME METRIX",
  chapterName: "ESME Cairo University Student Chapter",
  tagline: "BE POSITIVE • BE VALUABLE",
  bio: "Advancing materials engineering, industrial research dialogue, and student technical leadership across Cairo University and Egypt.",
  eventMeta: "December 12, 2026 • DRTPC, Cairo University",
  portalLabel: "ESME Cairo Chapter Hub",
  portalUrl: "https://eslamemadportfolio22.my.canva.site/esmecairo",
  copyrightText: "© 2026 ESME Cairo University Student Chapter. All rights reserved.",
  socialLinks: [
    {
      id: "soc-portal",
      platform: "website",
      label: "Chapter Portal",
      url: "https://eslamemadportfolio22.my.canva.site/esmecairo",
      enabled: true,
    },
    {
      id: "soc-linkedin",
      platform: "linkedin",
      label: "LinkedIn",
      url: OFFICIAL_ESME_LINKEDIN_URL,
      enabled: true,
    },
    {
      id: "soc-facebook",
      platform: "facebook",
      label: "Facebook",
      url: "https://www.facebook.com/ESME.CairoUniversity/",
      enabled: true,
    },
    {
      id: "soc-instagram",
      platform: "instagram",
      label: "Instagram",
      url: "https://www.instagram.com/esme.cairo/",
      enabled: true,
    },
    {
      id: "soc-tiktok",
      platform: "tiktok",
      label: "TikTok",
      url: "https://www.tiktok.com/@esme.cairo",
      enabled: true,
    },
    {
      id: "soc-youtube",
      platform: "youtube",
      label: "YouTube",
      url: "https://www.youtube.com/@esmecairo",
      enabled: true,
    },
    {
      id: "soc-email",
      platform: "email",
      label: "Email",
      url: "mailto:contact@esme-cu.org",
      enabled: true,
    },
  ],
};

export const DEFAULT_FULL_CMS: FullCmsData = {
  eventDate: "Saturday, December 12, 2026",
  eventVenue: "DRTPC, Cairo University",
  eventTime: "Saturday, December 12, 2026 • 09:00 AM–05:00 PM",
  eventMapsUrl: DEFAULT_EVENT_MAPS_URL,
  heroLogoUrl: "/esme-icon.jpg",
  ticketBgUrl: "/images/ticket-bg.jpg",
  landing: DEFAULT_LANDING_CMS,
  highlights: DEFAULT_HIGHLIGHTS_CMS,
  eventStats: DEFAULT_EVENT_STATS_CMS,
  gallery: DEFAULT_GALLERY_CMS,
  agenda: DEFAULT_AGENDA_CMS,
  form: DEFAULT_FORM_CMS,
  confirmation: DEFAULT_CONFIRMATION_CMS,
  footer: DEFAULT_FOOTER_CMS,
  ar: DEFAULT_ARABIC_CMS,
};
