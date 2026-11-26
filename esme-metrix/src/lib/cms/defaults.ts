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

export const DEFAULT_EVENT_MAPS_URL = "https://maps.app.goo.gl/rZuGj1EEioQNB8K5A?g_st=ic";

export const DEFAULT_LANDING_CMS: LandingCmsConfig = {
  statusBadge: "REGISTRATION OPEN — LIMITED CAPACITY",
  titleLine1: "The Annual Materials & Engineering Conference",
  titleHighlight: "ESME METRIX 2026",
  subtitle:
    "Hosted by the ESME Cairo University Student Chapter. Uniting students, researchers, and industrial pioneers across هندسة الكيمياء، الميكانيكا، الهندسة المدنية، و المواد والبترول.",
  primaryCtaLabel: "REGISTER FOR ADMISSION",
  secondaryCtaLabel: "Explore Event Agenda",
  certificateBadge: "معتمد",
  certificateTitle: "Official Certificate of Attendance",
  certificateDescription:
    "يحصل كل حاضر على شهادة حضور رسمية معتمدة وموثقة برقم تسجيله تسلم في مقر الفعالية.",
  storyEyebrow: "Event Summary • Overview & Vision",
  storyTitle: "What Is ESME METRIX 2026?",
  storyLead:
    "ESME METRIX 2026 is the flagship annual summit by the Egyptian Society of Materials Engineers (ESME) Student Chapter at Cairo University — bridging university classrooms with real industrial R&D, advanced materials engineering, technical leadership, and direct hiring mentorship.",
  storyPillars: [
    {
      id: "story-1",
      tag: "01 // VISION",
      title: "Materials Engineering Innovation",
      description:
        "From advanced alloys and sustainable metallurgy to green hydrogen catalysis and smart composites — explore how materials engineering shapes heavy industry across Egypt and MENA.",
    },
    {
      id: "story-2",
      tag: "02 // DUAL-TRACK TALKS",
      title: "Two Parallel Knowledge Halls",
      description:
        "Follow executive keynotes in Hall 1 (250 Capacity) alongside specialized technical talks and failure-analysis workshops in Hall 2 (150 Capacity), united by shared plenary ceremonies.",
    },
    {
      id: "story-3",
      tag: "03 // NETWORK & CAREERS",
      title: "Industry Connections & Recognition",
      description:
        "Connect directly with plant leaders, recruiters, and alumni at Cairo University, compete for giveaways and project recognition, and walk away with an accredited participation credential.",
    },
  ],
  aboutEyebrow: "Event Summary • Inside The Gathering",
  aboutTitle: "Pioneering Engineering at Cairo University",
  aboutText:
    "ESME METRIX brings together 400+ ambitious engineering delegates, distinguished academic professors, and top industrial partners for one high-impact day on campus — equipping students with hands-on industrial case studies, R&D career roadmaps, and lasting community impact.",
  experienceBullets: [
    "شهادة حضور رسمية معتمدة لكل المشاركين.",
    "ورش عمل هندسية وتطبيقية مع خبراء ومسؤولي الشركات.",
    "مسابقات هندسية وجوائز للمشاريع المتميزة.",
    "Direct technical networking with ESME Cairo Chapter & industry mentors across Hall 1 and Hall 2.",
  ],
  galleryEyebrow: "Visual Showcase • 8 Event Moments",
  galleryTitle: "Inside Past Editions at Cairo University",
  gallerySubtitle:
    "Authentic moments from our Cairo University auditorium sessions, speaker briefings, student organizing teams, and industrial talks.",
  ctaTitle: "Secure Your Seat at ESME METRIX 2026",
  ctaDescription:
    "Complete your 4-step online registration to unlock your encrypted QR entrance pass, personal attendee dashboard, and official attendance certificate.",
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
    alt: "Full lecture hall listening to Elgabry Metal materials engineering keynote",
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
  title: "Agenda",
  subtitle:
    "مواعيد وفقرات يوم الحدث الرسمية — السبت 12 ديسمبر 2026 في جامعة القاهرة.",
  hall1Name: "HALL 1",
  hall1Capacity: "250 Capacity",
  hall1Subtitle: "Main Auditorium — Keynotes & Core Sessions",
  hall2Name: "HALL 2",
  hall2Capacity: "150 Capacity",
  hall2Subtitle: "Innovation Hall — Technical Workshops & Industry Talks",
  sessions: [
    {
      id: "shared-opening",
      hallType: "shared",
      sortOrder: 1,
      time: "09:30 AM – 10:30 AM",
      title: "Opening",
      speaker: "ESME Cairo Student Chapter & Faculty Leadership",
      role: "Shared Plenary • All Attendees (Main Auditorium)",
      tag: "Shared Plenary",
      description:
        "Gates open, QR pass check-in, welcome address, and official launch of ESME METRIX 2026.",
    },
    // Parallel Sessions — Left Column (Hall 1 • Green • 250 Capacity)
    {
      id: "h1-s1",
      hallType: "hall1",
      sortOrder: 2,
      time: "10:30 AM – 11:30 AM",
      title: "Future of Smart & Green Metallurgy",
      speaker: "Prof. Dr. Tarek El-Menshawy",
      role: "Chair of Metallurgy & Materials Innovation",
      tag: "Keynote",
      description:
        "Low-carbon alloys, solid-state storage, and industrial transformation across MENA.",
    },
    {
      id: "h1-s2",
      hallType: "hall1",
      sortOrder: 3,
      time: "11:45 AM – 12:45 PM",
      title: "Executive Panel: Academia to Plant Floor",
      speaker: "Eng. Salma Abdelrahman & Industry Directors",
      role: "R&D Consortium • Energy & Steel",
      tag: "Panel",
      description:
        "Bridging graduation projects with production standards in quality and materials R&D.",
    },
    {
      id: "h1-s3",
      hallType: "hall1",
      sortOrder: 4,
      time: "01:15 PM – 02:15 PM",
      title: "AI-Driven Materials Discovery & Digital Twins",
      speaker: "Dr. Karim Nabil",
      role: "Computational Materials Lead",
      tag: "Core Session",
      description:
        "Predictive modeling, defect detection, and accelerated alloy qualification in industry.",
    },
    // Parallel Sessions — Right Column (Hall 2 • Orange • 150 Capacity)
    {
      id: "h2-s1",
      hallType: "hall2",
      sortOrder: 2,
      time: "10:30 AM – 11:30 AM",
      title: "Fractography & Failure Analysis Clinic",
      speaker: "Eng. Mostafa El-Sayed",
      role: "Lead Integrity Engineer, PetroEnergy",
      tag: "Workshop",
      description:
        "Reading SEM fracture surfaces, corrosion fatigue signatures, and root-cause reports.",
    },
    {
      id: "h2-s2",
      hallType: "hall2",
      sortOrder: 3,
      time: "11:45 AM – 12:45 PM",
      title: "Polymer Composites & Light-Weighting",
      speaker: "Dr. Nadia Hassan",
      role: "Senior Composites Researcher",
      tag: "Tech Talk",
      description:
        "Carbon-fiber layup tolerances, thermal curing cycles, and non-destructive inspection.",
    },
    {
      id: "h2-s3",
      hallType: "hall2",
      sortOrder: 4,
      time: "01:15 PM – 02:15 PM",
      title: "Green Hydrogen Catalysts & Corrosion Defense",
      speaker: "Eng. Youssef Mansour",
      role: "Clean Energy Materials Lead",
      tag: "Energy Track",
      description:
        "Electrode stability and protective coatings under demanding electrochemical environments.",
    },
    // Shared Bottom Plenary Rectangles
    {
      id: "shared-giveaways",
      hallType: "shared",
      sortOrder: 5,
      time: "02:30 PM – 03:15 PM",
      title: "Giveaways / Awards Distribution",
      speaker: "ESME Jury Board & Corporate Partners",
      role: "Shared Plenary • All Attendees",
      tag: "Awards & Giveaways",
      description:
        "Interactive trivia giveaways, industrial partner prizes, and top student project awards.",
    },
    {
      id: "shared-closing",
      hallType: "shared",
      sortOrder: 6,
      time: "03:15 PM – 04:00 PM",
      title: "Closing",
      speaker: "ESME METRIX 2026 High Board",
      role: "Shared Plenary • Group Photo & Certificates",
      tag: "Closing Ceremony",
      description:
        "Closing remarks, official certificate accreditation sign-off, and commemorative chapter photo.",
    },
  ],
};

export const DEFAULT_FORM_CMS: RegistrationFormConfig = {
  bannerBadge: "Accredited",
  bannerTitle: "Official Certificate of Attendance",
  bannerDescription:
    "Every verified attendee receives an official certificate linked to their unique registration ID upon check-in at Cairo University.",
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
        "Please bring your original Egyptian National ID card for rapid verification at the entrance gate.",
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
  eventMeta: "12 December 2026 • Cairo University",
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
  eventDate: "12 December 2026",
  eventVenue: "Cairo University — Faculty of Engineering",
  eventTime: "Saturday 12 / 12 / 2026 • 09:30 AM",
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
