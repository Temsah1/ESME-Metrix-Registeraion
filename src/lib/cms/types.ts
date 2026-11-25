export interface StoryPillar {
  id: string;
  tag: string;
  title: string;
  description: string;
}

export interface LandingCmsConfig {
  statusBadge: string;
  titleLine1: string;
  titleHighlight: string;
  subtitle: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  certificateBadge: string;
  certificateTitle: string;
  certificateDescription: string;
  storyEyebrow: string;
  storyTitle: string;
  storyLead: string;
  storyPillars: StoryPillar[];
  aboutEyebrow: string;
  aboutTitle: string;
  aboutText: string;
  experienceBullets: string[];
  galleryEyebrow: string;
  galleryTitle: string;
  gallerySubtitle: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonLabel: string;
}

export interface HighlightMetric {
  value: string;
  label: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  alt: string;
}

export type AgendaHallType = "shared" | "hall1" | "hall2";

export interface AgendaSession {
  id: string;
  hallType: AgendaHallType;
  sortOrder: number;
  time: string;
  title: string;
  speaker: string;
  role: string;
  tag: string;
  description: string;
}

export interface DualHallAgendaConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  hall1Name: string;
  hall1Capacity: string;
  hall1Subtitle: string;
  hall2Name: string;
  hall2Capacity: string;
  hall2Subtitle: string;
  sessions: AgendaSession[];
}

export interface FormFieldConfig {
  label: string;
  placeholder: string;
  helperText?: string;
  required: boolean;
}

export interface FacultyConfigItem {
  name: string;
  departments: string[];
}

export interface SelectOptionItem {
  value: string;
  label: string;
}

export interface StepHeaderConfig {
  navLabel: string;
  title: string;
  subtitle: string;
}

export interface RegistrationFormConfig {
  bannerBadge: string;
  bannerTitle: string;
  bannerDescription: string;
  steps: {
    step1: StepHeaderConfig;
    step2: StepHeaderConfig;
    step3: StepHeaderConfig;
    step4: StepHeaderConfig;
  };
  fields: {
    fullName: FormFieldConfig;
    nationalId: FormFieldConfig;
    phone: FormFieldConfig;
    email: FormFieldConfig;
    city: FormFieldConfig;
    university: FormFieldConfig;
    faculty: FormFieldConfig;
    department: FormFieldConfig;
    customMajor: FormFieldConfig;
    academicYear: FormFieldConfig;
    graduationYear: FormFieldConfig;
    jobTitle: FormFieldConfig;
    company: FormFieldConfig;
    isEsmeMember: {
      label: string;
      yesLabel: string;
      noLabel: string;
      required: boolean;
    };
    committee: FormFieldConfig;
    idPhotoUrl: FormFieldConfig;
    avatarUrl: FormFieldConfig;
  };
  faculties: FacultyConfigItem[];
  cities: string[];
  academicYears: SelectOptionItem[];
  graduationYears: SelectOptionItem[];
  esmeCommittees: string[];
  termsLabel: string;
  submitButtonLabel: string;
}

export interface ChecklistItemConfig {
  title: string;
  description: string;
}

export interface ConfirmationCmsConfig {
  badgeLabel: string;
  heading: string;
  subheading: string;
  whatsappBadge: string;
  whatsappTitle: string;
  whatsappDescription: string;
  whatsappButtonLabel: string;
  postRegistrationWhatsappUrl: string;
  checklistTitle: string;
  checklist: ChecklistItemConfig[];
  linkedinCaption: string;
  ogHighlightsText: string;
}

export type SocialPlatform =
  | "linkedin"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "website"
  | "email";

export interface SocialLinkItem {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  enabled: boolean;
}

export interface FooterCmsConfig {
  brandTitle: string;
  chapterName: string;
  tagline: string;
  bio: string;
  eventMeta: string;
  portalLabel: string;
  portalUrl: string;
  copyrightText: string;
  socialLinks: SocialLinkItem[];
}

export interface ArabicCmsSessionCopy {
  time?: string;
  title: string;
  speaker: string;
  role: string;
  tag: string;
  description: string;
}

export interface ArabicCmsFieldCopy {
  label: string;
  placeholder?: string;
  helperText?: string;
  yesLabel?: string;
  noLabel?: string;
}

export interface ArabicCmsData {
  eventDate: string;
  eventVenue: string;
  eventTime: string;
  landing: LandingCmsConfig;
  highlights: HighlightMetric[];
  gallery: { id: string; caption: string; alt: string }[];
  agenda: {
    eyebrow: string;
    title: string;
    subtitle: string;
    hall1Name: string;
    hall1Capacity: string;
    hall1Subtitle: string;
    hall2Name: string;
    hall2Capacity: string;
    hall2Subtitle: string;
    sessions: Record<string, ArabicCmsSessionCopy>;
  };
  form: {
    bannerBadge: string;
    bannerTitle: string;
    bannerDescription: string;
    steps: RegistrationFormConfig["steps"];
    fields: Record<keyof RegistrationFormConfig["fields"], ArabicCmsFieldCopy>;
    termsLabel: string;
    submitButtonLabel: string;
  };
  confirmation: {
    badgeLabel: string;
    heading: string;
    subheading: string;
    whatsappBadge: string;
    whatsappTitle: string;
    whatsappDescription: string;
    whatsappButtonLabel: string;
    checklistTitle: string;
    checklist: ChecklistItemConfig[];
    linkedinCaption: string;
  };
  footer: {
    brandTitle: string;
    chapterName: string;
    tagline: string;
    bio: string;
    eventMeta: string;
    portalLabel: string;
    copyrightText: string;
  };
}

export interface FullCmsData {
  eventDate: string;
  eventVenue: string;
  eventTime: string;
  eventMapsUrl: string;
  heroLogoUrl: string;
  ticketBgUrl: string;
  landing: LandingCmsConfig;
  highlights: HighlightMetric[];
  gallery: GalleryItem[];
  agenda: DualHallAgendaConfig;
  form: RegistrationFormConfig;
  confirmation: ConfirmationCmsConfig;
  footer: FooterCmsConfig;
  ar?: ArabicCmsData;
}
