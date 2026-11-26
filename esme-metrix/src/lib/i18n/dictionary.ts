import type { AppLanguage } from "./types";

export interface UiDictionary {
  nav: {
    brandSubtitle: string;
    story: string;
    gallery: string;
    agenda: string;
    memberDashboard: string;
    adminLogin: string;
    registerNow: string;
  };
  common: {
    continue: string;
    back: string;
    completeRegistration: string;
    valid: string;
    optional: string;
    loading: string;
    retry: string;
    close: string;
    previous: string;
    next: string;
    copied: string;
    save: string;
    cancel: string;
    download: string;
    searchPlaceholder: string;
  };
  upload: {
    uploading: string;
    ready: string;
    dropPrompt: string;
    hint: string;
    invalidFormat: string;
    fileTooLarge: string;
    uploadFailed: string;
    removeReupload: string;
  };
  landing: {
    heroPortalBadge: string;
    heroPortalSubtitle: string;
    heroPortalCta: string;
    statDateLabel: string;
    statVenueLabel: string;
    statVenueCta: string;
    statPassLabel: string;
    statPassValue: string;
    highlightsPrefix: string;
    pillarsEyebrowTag: string;
    experienceEyebrow: string;
    certificateAccredited: string;
    footerCtaEyebrow: string;
  };
  gallery: {
    mobileSwipeHint: string;
    previousPhoto: string;
    nextPhoto: string;
    closeLightbox: string;
    zoomPhoto: string;
  };
  agenda: {
    hall1DefaultName: string;
    hall1CapacityLabel: string;
    hall2DefaultName: string;
    hall2CapacityLabel: string;
    allHallsTab: string;
    hall1Tab: string;
    hall2Tab: string;
    parallelTracksLabel: string;
    hall1TrackTag: string;
    hall2TrackTag: string;
    fullEventSharedLabel: string;
    scheduleUpdatedNotice: string;
    emptyTrackNotice: string;
    parallelTracksHint: string;
    syncHallsNotice: string;
  };
  register: {
    stepPrefix: string;
    stepOf: string;
    submittingTitle: string;
    submittingButton: string;
    selectCity: string;
    selectFaculty: string;
    selectFacultyFirst: string;
    selectDepartment: string;
    selectAcademicYear: string;
    selectGraduationYear: string;
    selectCommittee: string;
    esmeMemberQuestion: string;
    yesEsmeMember: string;
    noEsmeMember: string;
    committeeLabel: string;
    committeePlaceholder: string;
    privacyHint: string;
    reviewNamesLabel: string;
    reviewNationalIdLabel: string;
    reviewPhoneLabel: string;
    reviewEmailLabel: string;
    reviewCityLabel: string;
    reviewUniversityLabel: string;
    reviewFacultyLabel: string;
    reviewDepartmentLabel: string;
    reviewYearLabel: string;
    reviewGradYearLabel: string;
    reviewRoleLabel: string;
    reviewCompanyLabel: string;
    reviewEsmeLabel: string;
    reviewDocsReady: string;
    reviewDocsPortraitOnly: string;
    reviewDocsIdOnly: string;
    genericSaveError: string;
    missingRequiredError: string;
    existingAccountHint: string;
    accessExistingDashboardCta: string;
  };
  dashboard: {
    loginEyebrow: string;
    loginTitle: string;
    loginSubtitle: string;
    phoneOrEmailLabel: string;
    phoneOrEmailPlaceholder: string;
    nationalIdLabel: string;
    nationalIdPlaceholder: string;
    accessButton: string;
    verifyingButton: string;
    loginHelpText: string;
    notRegisteredYet: string;
    missingInputError: string;
    badCredentialsError: string;
    networkError: string;
    logoutButton: string;
    passVerifiedBadge: string;
    ticketIdLabel: string;
    universityLabel: string;
    facultyLabel: string;
    departmentLabel: string;
    committeeLabel: string;
    esmeMemberBadge: string;
    quickActionsTitle: string;
    downloadTicketPdf: string;
    downloadQrPng: string;
    shareOnLinkedin: string;
    copyPostText: string;
    copiedPostText: string;
    joinWhatsapp: string;
    openVenueMaps: string;
    linkedinStudioTitle: string;
    linkedinStudioBadge: string;
    linkedinStudioSubtitle: string;
    linkedinCaptionLabel: string;
    downloadBadgePng: string;
    linkedinFlowTip: string;
    standaloneCardLinkLabel: string;
    ticketPreviewTitle: string;
    ticketPreviewSubtitle: string;
    embeddedAgendaBadge: string;
    alreadyRegisteredCta: string;
    alreadyRegisteredButton: string;
  };
  share: {
    officialPortal: string;
    joinSummitCta: string;
    verifiedBadge: string;
    headingTitle: string;
    headingSubtitle: string;
    registerYourSeat: string;
    backToSummit: string;
    ticketIdLabel: string;
    eventLabel: string;
    venueLabel: string;
    dateLabel: string;
  };
  footer: {
    quickLinksTitle: string;
    portalCardTitle: string;
    portalCardSubtitle: string;
    followUsTitle: string;
    aboutLink: string;
    storyLink: string;
    galleryLink: string;
    agendaLink: string;
    memberDashboardLink: string;
    registerNowLink: string;
    adminPortalLink: string;
    designedFor: string;
  };
  admin: {
    loginTitle: string;
    loginSubtitle: string;
    emailLabel: string;
    passwordLabel: string;
    signInButton: string;
    signingIn: string;
    rlsNotice: string;
    consoleTitle: string;
    consoleSubtitle: string;
    navDashboard: string;
    navRegistrants: string;
    navAttendance: string;
    navScanner: string;
    navSearch: string;
    signOut: string;
    dashboardHeader: string;
    dashboardSubtitle: string;
    tabAnalytics: string;
    tabCms: string;
    totalRegistrants: string;
    checkedInToday: string;
    remainingExpected: string;
    attendanceRate: string;
    esmeMembersCount: string;
    sharedLinkedinCount: string;
    hourlyVelocity: string;
    topUniversities: string;
    topCities: string;
    departmentsBreakdown: string;
    registrantsTitle: string;
    registrantsSubtitle: string;
    exportCsv: string;
    filterAll: string;
    filterCheckedIn: string;
    filterPending: string;
    attendanceTitle: string;
    attendanceSubtitle: string;
    liveRealtime: string;
    scannerTitle: string;
    scannerSubtitle: string;
    startCamera: string;
    stopCamera: string;
    searchTitle: string;
    searchSubtitle: string;
    searchInputPlaceholder: string;
    checkInButton: string;
    alreadyCheckedIn: string;
    cmsLanguageModeLabel: string;
    cmsLanguageModeEn: string;
    cmsLanguageModeAr: string;
    cmsArabicModeHint: string;
    cmsSaveAll: string;
    cmsSaving: string;
    cmsSavedBanner: string;
  };
}

export const DICTIONARY: Record<AppLanguage, UiDictionary> = {
  en: {
    nav: {
      brandSubtitle: "CAIRO STUDENT CHAPTER",
      story: "Story",
      gallery: "Gallery",
      agenda: "Agenda",
      memberDashboard: "Member Dashboard",
      adminLogin: "Admin Login",
      registerNow: "Register Now",
    },
    common: {
      continue: "Continue",
      back: "Back",
      completeRegistration: "Complete Registration",
      valid: "Valid",
      optional: "Optional",
      loading: "Loading...",
      retry: "Retry",
      close: "Close",
      previous: "Previous",
      next: "Next",
      copied: "Copied!",
      save: "Save Changes",
      cancel: "Cancel",
      download: "Download",
      searchPlaceholder: "Search by name, phone, national ID, or ticket ID...",
    },
    upload: {
      uploading: "Uploading...",
      ready: "Ready",
      dropPrompt: "Click to upload or drag and drop",
      hint: "JPEG or PNG (Max 5MB)",
      invalidFormat: "Invalid file format. Please upload a JPG or PNG image.",
      fileTooLarge: "File is too large. Maximum allowed size is 5MB.",
      uploadFailed: "Upload failed. Please try again.",
      removeReupload: "Remove & Re-upload",
    },
    landing: {
      heroPortalBadge: "Already Registered?",
      heroPortalSubtitle: "Access your QR pass, agenda & LinkedIn badge anytime",
      heroPortalCta: "Access Your Member Dashboard",
      statDateLabel: "Summit Date",
      statVenueLabel: "Venue",
      statVenueCta: "Open Venue in Google Maps",
      statPassLabel: "Official Access",
      statPassValue: "QR Digital Pass",
      highlightsPrefix: "Summit Numbers",
      pillarsEyebrowTag: "01 — Strategic Vision",
      experienceEyebrow: "Inside ESME METRIX",
      certificateAccredited: "Certified Summit",
      footerCtaEyebrow: "Secure Your Pass",
    },
    gallery: {
      mobileSwipeHint: "Swipe left or right to browse all 8 gallery highlights",
      previousPhoto: "Previous photo",
      nextPhoto: "Next photo",
      closeLightbox: "Close gallery preview",
      zoomPhoto: "Click to preview full resolution",
    },
    agenda: {
      hall1DefaultName: "Hall 1",
      hall1CapacityLabel: "Capacity: 250 Attendees",
      hall2DefaultName: "Hall 2",
      hall2CapacityLabel: "Capacity: 150 Attendees",
      allHallsTab: "All Halls (Side-by-Side)",
      hall1Tab: "Hall 1",
      hall2Tab: "Hall 2",
      parallelTracksLabel: "Parallel Technical Tracks",
      hall1TrackTag: "Materials & Energy Track",
      hall2TrackTag: "Innovation & Career Track",
      fullEventSharedLabel: "Main Auditorium — Full Summit",
      scheduleUpdatedNotice: "Agenda stays automatically synced via Admin CMS.",
      emptyTrackNotice: "No sessions added for this track yet.",
      parallelTracksHint: "Opening Ceremony, Giveaways, and Closing Ceremony unite all attendees together.",
      syncHallsNotice: "Both halls run concurrently during core afternoon sessions.",
    },
    register: {
      stepPrefix: "Step",
      stepOf: "of 4",
      submittingTitle: "Generating your cryptographic QR pass...",
      submittingButton: "Confirming Registration...",
      selectCity: "Select City / Governorate",
      selectFaculty: "Select Faculty / Field",
      selectFacultyFirst: "Select your faculty first",
      selectDepartment: "Select Department / Specialization",
      selectAcademicYear: "Select Academic Year",
      selectGraduationYear: "Select Expected Graduation Year",
      selectCommittee: "Select Committee",
      esmeMemberQuestion: "Are you a member of the ESME Chapter?",
      yesEsmeMember: "Yes — ESME Member",
      noEsmeMember: "No",
      committeeLabel: "Committee",
      committeePlaceholder: "Choose your committee",
      privacyHint: "Encrypted via TLS — used strictly for identity verification at the DRTPC event gate.",
      reviewNamesLabel: "Full Name",
      reviewNationalIdLabel: "National ID (14 digits)",
      reviewPhoneLabel: "Phone Number",
      reviewEmailLabel: "Email Address",
      reviewCityLabel: "City of Residence",
      reviewUniversityLabel: "University",
      reviewFacultyLabel: "Faculty / Major Category",
      reviewDepartmentLabel: "Department / Specialization",
      reviewYearLabel: "Academic Year",
      reviewGradYearLabel: "Graduation Year",
      reviewRoleLabel: "Job Title",
      reviewCompanyLabel: "Organization / Company",
      reviewEsmeLabel: "ESME Chapter Member",
      reviewDocsReady: "National ID attached + badge portrait loaded — ready for cryptographic signing.",
      reviewDocsPortraitOnly: "Badge portrait uploaded.",
      reviewDocsIdOnly: "National ID attached — ready for verification.",
      genericSaveError: "Could not save registration. Please verify your entries and try again.",
      missingRequiredError: "Please complete all highlighted required fields before continuing.",
      existingAccountHint: "Already registered with this Phone, Email, or National ID?",
      accessExistingDashboardCta: "Access Your Member Dashboard",
    },
    dashboard: {
      loginEyebrow: "Attendee Identity Portal",
      loginTitle: "Access Your Member Dashboard",
      loginSubtitle: "Sign in with your registered Phone Number or Email plus your 14-digit National ID to unlock your ticket, QR pass, agenda, and LinkedIn badge.",
      phoneOrEmailLabel: "Registered Phone Number or Email",
      phoneOrEmailPlaceholder: "01xxxxxxxxx or name@example.com",
      nationalIdLabel: "National ID (14 digits)",
      nationalIdPlaceholder: "14-digit National ID",
      accessButton: "Access Your Member Dashboard",
      verifyingButton: "Verifying Credentials...",
      loginHelpText: "Both fields must match your submitted registration record.",
      notRegisteredYet: "Haven't registered yet?",
      missingInputError: "Please enter both your registered Phone/Email and 14-digit National ID.",
      badCredentialsError: "No matching registration found. Please check your phone/email and National ID.",
      networkError: "Unable to reach verification server. Please try again.",
      logoutButton: "Switch Account",
      passVerifiedBadge: "Verified Attendee Pass",
      ticketIdLabel: "Ticket ID",
      universityLabel: "University",
      facultyLabel: "Faculty",
      departmentLabel: "Department",
      committeeLabel: "Committee",
      esmeMemberBadge: "ESME Chapter Member",
      quickActionsTitle: "Quick Actions & Event Tools",
      downloadTicketPdf: "Download Ticket (PDF)",
      downloadQrPng: "Download QR (PNG)",
      shareOnLinkedin: "Share on LinkedIn",
      copyPostText: "Copy Post Text",
      copiedPostText: "Post Text Copied!",
      joinWhatsapp: "Join Official WhatsApp Group",
      openVenueMaps: "Open Venue in Google Maps",
      linkedinStudioTitle: "LinkedIn \"I'm Attending\" Card Studio",
      linkedinStudioBadge: "Ready for LinkedIn Feed",
      linkedinStudioSubtitle: "Copy the official post caption, then open LinkedIn directly with your standalone personalized badge preview attached.",
      linkedinCaptionLabel: "Pre-Filled LinkedIn Post Text",
      downloadBadgePng: "Download Badge (PNG)",
      linkedinFlowTip: "Tip: Clicking Share on LinkedIn copies this post automatically and attaches your standalone card preview.",
      standaloneCardLinkLabel: "Open Standalone Share Card",
      ticketPreviewTitle: "Digital Summit Pass Preview",
      ticketPreviewSubtitle: "Present this pass or your QR code at DRTPC, Cairo University.",
      embeddedAgendaBadge: "Personal Schedule Guide",
      alreadyRegisteredCta: "Complete registration to receive your personalized pass.",
      alreadyRegisteredButton: "Register Now",
    },
    share: {
      officialPortal: "Official Event Pass",
      joinSummitCta: "Register Now",
      verifiedBadge: "Verified Attendee Card",
      headingTitle: "I'm Attending ESME METRIX 2026!",
      headingSubtitle: "Technical sessions, industry topics, and career skills at DRTPC, Cairo University.",
      registerYourSeat: "Reserve Your Seat at ESME METRIX",
      backToSummit: "Explore Summit Agenda",
      ticketIdLabel: "Ticket ID",
      eventLabel: "Summit",
      venueLabel: "Venue",
      dateLabel: "Date",
    },
    footer: {
      quickLinksTitle: "Summit Navigation",
      portalCardTitle: "Attendee Portal",
      portalCardSubtitle: "Already secured your seat? Retrieve your QR pass, agenda, and share card anytime.",
      followUsTitle: "Connect With ESME Chapter",
      aboutLink: "About Summit",
      storyLink: "Story & Vision",
      galleryLink: "Event Gallery",
      agendaLink: "Event Agenda",
      memberDashboardLink: "Member Dashboard",
      registerNowLink: "Register Now",
      adminPortalLink: "Admin Login",
      designedFor: "Engineered for Materials & Energy Excellence",
    },
    admin: {
      loginTitle: "Admin Console Login",
      loginSubtitle: "Authorized ESME organizers & gate operators only",
      emailLabel: "Admin Email",
      passwordLabel: "Password",
      signInButton: "Sign In to Dashboard",
      signingIn: "Signing In...",
      rlsNotice: "Protected by Supabase Auth Row-Level Security.",
      consoleTitle: "ESME Admin",
      consoleSubtitle: "Command Center",
      navDashboard: "Overview & CMS",
      navRegistrants: "Registrants Directory",
      navAttendance: "Live Attendance Feed",
      navScanner: "QR Gate Scanner",
      navSearch: "Manual Check-In",
      signOut: "Sign Out",
      dashboardHeader: "Command Center & Analytics",
      dashboardSubtitle: "Real-time registration insights, live check-in metrics, and full platform CMS control.",
      tabAnalytics: "Analytics Overview",
      tabCms: "CMS Content Studio",
      totalRegistrants: "Total Registrants",
      checkedInToday: "Checked-In",
      remainingExpected: "Awaiting Arrival",
      attendanceRate: "Check-In Rate",
      esmeMembersCount: "ESME Chapter Members",
      sharedLinkedinCount: "LinkedIn Shares",
      hourlyVelocity: "Check-In Velocity (Hourly)",
      topUniversities: "Top Universities",
      topCities: "Governorate Distribution",
      departmentsBreakdown: "Top Specializations",
      registrantsTitle: "Registrants Directory",
      registrantsSubtitle: "Browse, inspect, filter, and export attendee registrations in real time.",
      exportCsv: "Export Excel / CSV",
      filterAll: "All Registrants",
      filterCheckedIn: "Checked In",
      filterPending: "Pending Arrival",
      attendanceTitle: "Live Gate Attendance Feed",
      attendanceSubtitle: "Streaming real-time gate scans via Supabase Realtime.",
      liveRealtime: "LIVE STREAM",
      scannerTitle: "QR Gate Check-In Scanner",
      scannerSubtitle: "Scan attendee digital tickets instantly using your device camera.",
      startCamera: "Start Scanner Camera",
      stopCamera: "Stop Camera",
      searchTitle: "Manual Identity & Ticket Check-In",
      searchSubtitle: "Verify and check in attendees quickly by Ticket ID, Phone, National ID, or Name.",
      searchInputPlaceholder: "Enter name, phone, National ID, or Ticket ID...",
      checkInButton: "Mark Checked In",
      alreadyCheckedIn: "Already Checked In",
      cmsLanguageModeLabel: "Editing Language:",
      cmsLanguageModeEn: "English (Primary)",
      cmsLanguageModeAr: "العربية (Arabic Version)",
      cmsArabicModeHint: "You are editing the Arabic content shown when visitors switch the site to العربية. Leave any field empty to fall back to the English version or default Arabic copy.",
      cmsSaveAll: "Save & Publish to Live Site",
      cmsSaving: "Publishing...",
      cmsSavedBanner: "Saved & published! Public pages refreshed immediately.",
    },
  },
  ar: {
    nav: {
      brandSubtitle: "شابتر جامعة القاهرة",
      story: "رؤية الحدث",
      gallery: "معرض الصور",
      agenda: "جدول الفعاليات",
      memberDashboard: "لوحة المشارك",
      adminLogin: "دخول المشرفين",
      registerNow: "سجّل الآن",
    },
    common: {
      continue: "التالي",
      back: "السابق",
      completeRegistration: "تأكيد التسجيل",
      valid: "صحيح",
      optional: "اختياري",
      loading: "جاري التحميل...",
      retry: "إعادة المحاولة",
      close: "إغلاق",
      previous: "السابق",
      next: "التالي",
      copied: "تم النسخ!",
      save: "حفظ التعديلات",
      cancel: "إلغاء",
      download: "تحميل",
      searchPlaceholder: "ابحث بالاسم أو الهاتف أو الرقم القومي أو رقم التذكرة...",
    },
    upload: {
      uploading: "جاري الرفع...",
      ready: "جاهزة",
      dropPrompt: "اضغط لرفع الصورة أو اسحبها وأفلتها هنا",
      hint: "صيغة JPEG أو PNG (بحد أقصى 5 ميجابايت)",
      invalidFormat: "صيغة الملف غير مدعومة. يُرجى رفع صورة بصيغة JPG أو PNG فقط.",
      fileTooLarge: "حجم الصورة يتجاوز الحد المسموح (5 ميجابايت كحد أقصى).",
      uploadFailed: "تعذّر رفع الصورة، يُرجى المحاولة مجدداً.",
      removeReupload: "حذف وإعادة الرفع",
    },
    landing: {
      heroPortalBadge: "هل سجّلت مسبقاً؟",
      heroPortalSubtitle: "احصل على تذكرتك الذكية وجدول الفعاليات وبادج LinkedIn في أي وقت",
      heroPortalCta: "الدخول إلى لوحة المشارك",
      statDateLabel: "موعد الملتقى",
      statVenueLabel: "مقر الانعقاد",
      statVenueCta: "فتح موقع الحدث على خرائط جوجل",
      statPassLabel: "الدخول الإلكتروني",
      statPassValue: "تذكرة QR رقمية",
      highlightsPrefix: "أرقام الملتقى",
      pillarsEyebrowTag: "01 — الرؤية والهدف",
      experienceEyebrow: "داخل قاعات ESME METRIX",
      certificateAccredited: "ملتقى معتمد",
      footerCtaEyebrow: "احجز مقعدك الآن",
    },
    gallery: {
      mobileSwipeHint: "اسحب يميناً أو يساراً لاستعراض صور الفعاليات السابقة",
      previousPhoto: "الصورة السابقة",
      nextPhoto: "الصورة التالية",
      closeLightbox: "إغلاق معاينة الصورة",
      zoomPhoto: "اضغط لتكبير الصورة",
    },
    agenda: {
      hall1DefaultName: "القاعة الأولى (Hall 1)",
      hall1CapacityLabel: "السعة: 250 مشارك",
      hall2DefaultName: "القاعة الثانية (Hall 2)",
      hall2CapacityLabel: "السعة: 150 مشارك",
      allHallsTab: "جميع القاعات معاً",
      hall1Tab: "القاعة الأولى (Hall 1)",
      hall2Tab: "القاعة الثانية (Hall 2)",
      parallelTracksLabel: "مسارات متوازية",
      hall1TrackTag: "مسار المواد والطاقة",
      hall2TrackTag: "مسار الابتكار وسوق العمل",
      fullEventSharedLabel: "القاعة الرئيسية — لجميع المشاركين",
      scheduleUpdatedNotice: "يتم تحديث جدول الفعاليات تلقائياً عبر لوحة التحكم.",
      emptyTrackNotice: "لا توجد جلسات مسجلة لهذا المسار حالياً.",
      parallelTracksHint: "الجلسة الافتتاحية والهدايا والجلسة الختامية تجمع كافة المشاركين في القاعة الرئيسية.",
      syncHallsNotice: "تنعقد جلسات القاعتين بالتوازي خلال الفترة الرئيسية للملتقى.",
    },
    register: {
      stepPrefix: "الخطوة",
      stepOf: "من 4",
      submittingTitle: "جاري إصدار تذكرتك الإلكترونية المشفّرة...",
      submittingButton: "جاري تأكيد التسجيل...",
      selectCity: "اختر محافظة الإقامة",
      selectFaculty: "اختر الكلية أو المجال الدراسي",
      selectFacultyFirst: "اختر الكلية أولاً",
      selectDepartment: "اختر القسم أو التخصص",
      selectAcademicYear: "اختر الفرقة الدراسية",
      selectGraduationYear: "اختر سنة التخرج المتوقعة",
      selectCommittee: "اختر اللجنة",
      esmeMemberQuestion: "هل أنت عضو في شابتر ESME؟",
      yesEsmeMember: "نعم — عضو في الشابتر",
      noEsmeMember: "لا",
      committeeLabel: "اللجنة",
      committeePlaceholder: "اختر لجنتك داخل الشابتر",
      privacyHint: "جميع البيانات ومستندات الهوية محمية ومشفّرة وتُستخدم حصرياً لتوثيق الدخول في بوابة مركز DRTPC.",
      reviewNamesLabel: "الاسم بالكامل",
      reviewNationalIdLabel: "الرقم القومي (14 رقم)",
      reviewPhoneLabel: "رقم الهاتف",
      reviewEmailLabel: "البريد الإلكتروني",
      reviewCityLabel: "محافظة الإقامة",
      reviewUniversityLabel: "الجامعة",
      reviewFacultyLabel: "الكلية / المجال الدراسي",
      reviewDepartmentLabel: "القسم / التخصص",
      reviewYearLabel: "الفرقة الدراسية",
      reviewGradYearLabel: "سنة التخرج المتوقعة",
      reviewRoleLabel: "المسمى / الصفة",
      reviewCompanyLabel: "الجهة / الشركة",
      reviewEsmeLabel: "عضو في شابتر ESME",
      reviewDocsReady: "تم إرفاق صورة البطاقة والصورة الشخصية بنجاح — التذكرة جاهزة للإصدار.",
      reviewDocsPortraitOnly: "تم رفع الصورة الشخصية بنجاح.",
      reviewDocsIdOnly: "تم إرفاق صورة البطاقة الشخصية — جاهزة للتحقق.",
      genericSaveError: "تعذّر حفظ التسجيل، يُرجى مراجعة بياناتك والمحاولة مرة أخرى.",
      missingRequiredError: "يُرجى استكمال جميع الحقول الإلزامية المحددة قبل المتابعة.",
      existingAccountHint: "هل قمت بالتسجيل مسبقاً بهذا الهاتف أو البريد أو الرقم القومي؟",
      accessExistingDashboardCta: "الدخول إلى لوحة المشارك",
    },
    dashboard: {
      loginEyebrow: "بوابة المشارك المعتمدة",
      loginTitle: "الدخول إلى لوحة المشارك",
      loginSubtitle: "أدخل رقم الهاتف أو البريد الإلكتروني المسجّل مع الرقم القومي (14 رقم) لاستعراض تذكرتك، رمز الدخول، وجدول الفعاليات.",
      phoneOrEmailLabel: "رقم الهاتف أو البريد الإلكتروني المسجّل",
      phoneOrEmailPlaceholder: "01xxxxxxxxx أو name@example.com",
      nationalIdLabel: "الرقم القومي (14 رقم)",
      nationalIdPlaceholder: "الرقم القومي المكوّن من 14 رقم",
      accessButton: "الدخول إلى لوحة المشارك",
      verifyingButton: "جاري التحقق من البيانات...",
      loginHelpText: "يجب أن يتطابق الرقم القومي وبيانات التواصل مع ما تم تسجيله مسبقاً.",
      notRegisteredYet: "لم تسجّل بعد؟",
      missingInputError: "يُرجى إدخال رقم الهاتف أو البريد الإلكتروني مع الرقم القومي المكوّن من 14 رقم.",
      badCredentialsError: "لم نتمكن من العثور على تسجيل مطابق لهذه البيانات، يُرجى التأكد والمحاولة مرة أخرى.",
      networkError: "حدث خطأ أثناء الاتصال بالخادم، يُرجى المحاولة مجدداً.",
      logoutButton: "تبديل الحساب",
      passVerifiedBadge: "تذكرة مشارك معتمدة",
      ticketIdLabel: "رقم التذكرة",
      universityLabel: "الجامعة",
      facultyLabel: "الكلية",
      departmentLabel: "القسم",
      committeeLabel: "اللجنة",
      esmeMemberBadge: "عضو شابتر ESME",
      quickActionsTitle: "أدوات المشارك والإجراءات السريعة",
      downloadTicketPdf: "تحميل التذكرة (PDF)",
      downloadQrPng: "تحميل رمز الدخول (QR)",
      shareOnLinkedin: "مشاركة على LinkedIn",
      copyPostText: "نسخ نص المنشور",
      copiedPostText: "تم نسخ نص المنشور!",
      joinWhatsapp: "انضم لجروب الواتساب الرسمي",
      openVenueMaps: "فتح موقع الحدث على خرائط جوجل",
      linkedinStudioTitle: "منصة بطاقة المشاركة على LinkedIn",
      linkedinStudioBadge: "جاهزة للنشر الفوري",
      linkedinStudioSubtitle: "انسخ نص المنشور المعد مسبقاً، ثم اضغط مشاركة ليُفتح LinkedIn مرفقاً ببطاقتك الخاصة المستقلة.",
      linkedinCaptionLabel: "النص المقترح لمنشور LinkedIn",
      downloadBadgePng: "تحميل صورة البطاقة (PNG)",
      linkedinFlowTip: "ملاحظة: عند الضغط على مشاركة يتم نسخ النص تلقائياً وربط المنشور ببطاقتك الرسمية فقط دون أي عناصر أخرى.",
      standaloneCardLinkLabel: "معاينة رابط البطاقة المستقل",
      ticketPreviewTitle: "معاينة التذكرة الرقمية للدخول",
      ticketPreviewSubtitle: "يُرجى إبراز هذه التذكرة أو رمز QR عند بوابة مركز DRTPC بجامعة القاهرة.",
      embeddedAgendaBadge: "دليلك ليوم الملتقى",
      alreadyRegisteredCta: "سجّل الآن للحصول على تذكرتك الرقمية وبطاقة المشاركة.",
      alreadyRegisteredButton: "سجّل الآن",
    },
    share: {
      officialPortal: "تذكرة مشارك رسمية",
      joinSummitCta: "سجّل الآن",
      verifiedBadge: "بطاقة حضور موثّقة",
      headingTitle: "أنا مشارك في ملتقى ESME METRIX 2026!",
      headingSubtitle: "جلسات تقنية وموضوعات صناعية ومهارات مهنية في مركز DRTPC بجامعة القاهرة.",
      registerYourSeat: "احجز مقعدك الآن في ESME METRIX",
      backToSummit: "استعراض تفاصيل الملتقى",
      ticketIdLabel: "رقم التذكرة",
      eventLabel: "الحدث",
      venueLabel: "المقر",
      dateLabel: "التاريخ",
    },
    footer: {
      quickLinksTitle: "روابط الملتقى",
      portalCardTitle: "لوحة المشارك",
      portalCardSubtitle: "أتممت تسجيلك؟ استرجع تذكرتك، رمز QR، وبطاقة LinkedIn في أي وقت.",
      followUsTitle: "تواصل مع شابتر ESME",
      aboutLink: "عن الملتقى",
      storyLink: "الرؤية والرسالة",
      galleryLink: "معرض الصور",
      agendaLink: "جدول الفعاليات",
      memberDashboardLink: "لوحة المشارك",
      registerNowLink: "سجّل الآن",
      adminPortalLink: "دخول المشرفين",
      designedFor: "بُني بشغف لطلاب هندسة المواد والطاقة",
    },
    admin: {
      loginTitle: "دخول المشرفين والمنظمين",
      loginSubtitle: "مخصص لمنظمي شابتر ESME ومشرفي بوابات الدخول فقط",
      emailLabel: "البريد الإلكتروني للمشرف",
      passwordLabel: "كلمة المرور",
      signInButton: "تسجيل الدخول للوحة التحكم",
      signingIn: "جاري التحقق...",
      rlsNotice: "محمي بواسطة نظام صلاحيات Supabase Auth RLS.",
      consoleTitle: "إدارة ESME",
      consoleSubtitle: "غرفة العمليات",
      navDashboard: "الإحصائيات والمحتوى",
      navRegistrants: "قائمة المسجلين",
      navAttendance: "الحضور المباشر",
      navScanner: "ماسح تذاكر QR",
      navSearch: "تسجيل حضور يدوي",
      signOut: "تسجيل الخروج",
      dashboardHeader: "غرفة العمليات والتحليلات",
      dashboardSubtitle: "متابعة لحظية لأعداد المسجلين والحضور، مع تحكم كامل في نصوص وإعدادات المنصة.",
      tabAnalytics: "التحليلات والرسوم البيانية",
      tabCms: "إدارة محتوى المنصة (CMS)",
      totalRegistrants: "إجمالي المسجلين",
      checkedInToday: "تم تسجيل حضورهم",
      remainingExpected: "بانتظار الوصول",
      attendanceRate: "نسبة الحضور",
      esmeMembersCount: "أعضاء شابتر ESME",
      sharedLinkedinCount: "مشاركات LinkedIn",
      hourlyVelocity: "معدل توافد الحضور بالساعة",
      topUniversities: "توزيع الجامعات",
      topCities: "توزيع المحافظات",
      departmentsBreakdown: "أكثر التخصصات تسجيلاً",
      registrantsTitle: "سجل المشاركين الكامل",
      registrantsSubtitle: "عرض وتصفية بيانات المسجلين والتحقق من العضوية وتصدير ملف Excel.",
      exportCsv: "تصدير إلى Excel / CSV",
      filterAll: "جميع المسجلين",
      filterCheckedIn: "تم حضورهم",
      filterPending: "لم يحضروا بعد",
      attendanceTitle: "سجل الحضور اللحظي عند البوابة",
      attendanceSubtitle: "متابعة فورية لعمليات مسح التذاكر عبر Supabase Realtime.",
      liveRealtime: "بث مباشر",
      scannerTitle: "ماسح رمز QR عند البوابة",
      scannerSubtitle: "وجّه الكاميرا نحو رمز QR الخاص بالمشارك لتسجيل الحضور فوراً.",
      startCamera: "تشغيل الكاميرا",
      stopCamera: "إيقاف الكاميرا",
      searchTitle: "البحث وتسجيل الحضور يدوياً",
      searchSubtitle: "ابحث برقم التذكرة أو الهاتف أو الرقم القومي أو الاسم لتأكيد حضور المشارك.",
      searchInputPlaceholder: "اكتب الاسم أو الهاتف أو الرقم القومي أو رقم التذكرة...",
      checkInButton: "تأكيد الحضور",
      alreadyCheckedIn: "مسجّل حضور مسبقاً",
      cmsLanguageModeLabel: "لغة التعديل:",
      cmsLanguageModeEn: "الإنجليزية (English)",
      cmsLanguageModeAr: "العربية (Arabic)",
      cmsArabicModeHint: "أنت تعدّل الآن النسخة العربية التي تظهر للزوار عند تفعيل اللغة العربية. حفظ التعديلات ينشر النسختين معاً إلى قاعدة البيانات.",
      cmsSaveAll: "حفظ ونشر التعديلات للموقع",
      cmsSaving: "جاري النشر...",
      cmsSavedBanner: "تم الحفظ والنشر بنجاح وتحديث الصفحات العامة فوراً.",
    },
  },
};

export function getDictionary(lang: AppLanguage): UiDictionary {
  return DICTIONARY[lang];
}
