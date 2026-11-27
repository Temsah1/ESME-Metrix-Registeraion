import type { AppLanguage } from "@/lib/i18n/types";
import { DEFAULT_EVENT_STATS, type ArabicCmsData, type FullCmsData } from "@/lib/cms/types";

export const DEFAULT_ARABIC_CMS: ArabicCmsData = {
  eventDate: "السبت 12 ديسمبر 2026",
  eventVenue: "مركز بحوث واستشارات التنمية والتخطيط التكنولوجي (DRTPC) – جامعة القاهرة",
  eventTime: "السبت 12 ديسمبر 2026 • 09:00 صباحاً – 05:00 مساءً",
  landing: {
    statusBadge: "التسجيل مفتوح — 500 مقعد",
    titleLine1: "ESME METRIX — النسخة الثانية",
    titleHighlight: "يوم واحد... أقرب للصناعة الحقيقية",
    subtitle:
      "بعد نجاح النسخة الأولى في فبراير 2026، يعود ESME METRIX بنسخة أكبر تضم 11 جلسة تقنية في قاعتين متوازيتين حول الذكاء الاصطناعي والروبوتات وهندسة المواد والصناعة الحديثة، إلى جانب جلسة مهنية عملية عن كتابة السيرة الذاتية ومهارات المقابلات.",
    primaryCtaLabel: "سجّل الآن لحجز مقعدك",
    secondaryCtaLabel: "استعرض جدول الفعاليات",
    certificateBadge: "معتمد",
    certificateTitle: "شهادة حضور للمشاركين طوال اليوم",
    certificateDescription:
      "تُمنح شهادة الحضور للمشاركين الذين يكملون البرنامج طوال اليوم ويجمعون الأختام من محطات الحضور الثلاث.",
    storyEyebrow: "ESME METRIX • النسخة الثانية",
    storyTitle: "يوم كامل من الهندسة التطبيقية والمهارات المهنية",
    storyLead:
      "يعلن شابتر ESME جامعة القاهرة عن النسخة الثانية من ESME METRIX يوم السبت 12 ديسمبر 2026 في مركز بحوث واستشارات التنمية والتخطيط التكنولوجي (DRTPC) من 9 صباحاً حتى 5 مساءً. يختار المشاركون بين مسارات متوازية في الذكاء الاصطناعي والروبوتات والفحص والمواد والبنية التحتية، مع تطوير مهارات السيرة الذاتية والمقابلات.",
    storyPillars: [
      {
        id: "story-1",
        tag: "01 // الذكاء الاصطناعي والأتمتة",
        title: "أنظمة صناعية أكثر ذكاءً",
        description:
          "الفحص البصري بالذكاء الاصطناعي واكتشاف العيوب والروبوتات والأتمتة الصناعية والصيانة التنبؤية.",
      },
      {
        id: "story-2",
        tag: "02 // قاعتان بالتوازي",
        title: "المواد والجودة والبنية التحتية",
        description:
          "جلسات عن الاختبارات غير الإتلافية بالذكاء الاصطناعي والمواد النانوية والصلب الأخضر ومعالجة المياه والمنشآت المقاومة للزلازل والحماية من التآكل.",
      },
      {
        id: "story-3",
        tag: "03 // تطوير المسار المهني",
        title: "جلسة HR تطبيقية",
        description:
          "إرشادات عملية لكتابة السيرة الذاتية ومهارات المقابلات، مع فرص للتواصل مع الزملاء والخبراء وشهادة للحضور طوال اليوم.",
      },
    ],
    aboutEyebrow: "السبت • 12 ديسمبر 2026",
    aboutTitle: "عودة ESME METRIX في نسخته الثانية",
    aboutText:
      "انضموا إلى شابتر ESME جامعة القاهرة في مركز بحوث واستشارات التنمية والتخطيط التكنولوجي (DRTPC) من 9 صباحاً حتى 5 مساءً. يضم البرنامج قاعتين متوازيتين بسعتي 300 و200 مقعد، و11 جلسة تقنية، وجلسة HR مخصصة.",
    experienceBullets: [
      "شهادة حضور للمشاركين الذين يكملون اليوم ويجمعون الأختام من محطات الحضور الثلاث.",
      "جلسة HR عملية عن كتابة السيرة الذاتية ومهارات المقابلات.",
      "Brunch وشاي وتواصل وفترات راحة منظمة طوال اليوم.",
      "لقاء أساتذة جامعة القاهرة وخبراء الصناعة في القاعتين.",
    ],
    galleryEyebrow: "لقطات توثيقية • 8 صور من قلب الحدث",
    galleryTitle: "محطات بارزة من النسخ السابقة بجامعة القاهرة",
    gallerySubtitle:
      "لقطات من النسخ السابقة توثّق الجلسات العلمية وكلمات خبراء الصناعة وفرق التنظيم والتفاعل الطلابي في جامعة القاهرة.",
    ctaTitle: "احجز مقعدك في ESME METRIX",
    ctaDescription:
      "المقاعد محدودة بـ500 مقعد. سجّل الآن لحضور برنامج 12 ديسمبر في DRTPC بجامعة القاهرة. يُغلق التسجيل عند اكتمال العدد.",
    ctaButtonLabel: "سجّل الآن — المقاعد محدودة",
  },
  highlights: DEFAULT_EVENT_STATS.map((item) => ({
    value: item.value,
    label: item.label.ar,
  })),
  gallery: [
    {
      id: "gal-1",
      caption: "فريق تنظيم ESME — طاقم الاستقبال وتوثيق دخول المشاركين",
      alt: "خمس عضوات من فريق تنظيم ESME METRIX ببطاقات التعريف الرسمية",
    },
    {
      id: "gal-2",
      caption: "جلسة شركاء الصناعة وتطبيقات هندسة الأسطح والزيوت الصناعية",
      alt: "أحد متحدثي الصناعة يستعرض التطبيقات الهندسية على المنصة",
    },
    {
      id: "gal-3",
      caption: "ندوة أكاديمية — تصميم المسبوكات ونمذجة عمليات التجمد",
      alt: "أستاذة جامعية ومدير الجلسة خلال مناقشة هندسية في القاعة",
    },
    {
      id: "gal-4",
      caption: "تفاعل أعضاء هيئة التدريس والطلاب خلال الجلسات العامة",
      alt: "حضور طلابي وأكاديمي مميز داخل قاعة المحاضرات بجامعة القاهرة",
    },
    {
      id: "gal-5",
      caption: "كلمة رئيسية حول السبائك الخاصة وتطبيقاتها في الصناعات الثقيلة",
      alt: "المدرج مكتمل العدد أثناء متابعة المحاضرة الهندسية",
    },
    {
      id: "gal-6",
      caption: "القاعة الرئيسية مكتملة — حضور طلابي من مختلف الجامعات المصرية",
      alt: "لقطة واسعة للمدرج الرئيسي تبرز الإقبال الكبير من طلاب الهندسة",
    },
    {
      id: "gal-7",
      caption: "ندوة الاستدامة وخفض الانبعاثات الكربونية في هندسة المواد",
      alt: "متحدث يناقش معايير الاستدامة والانبعاثات مع الحضور",
    },
    {
      id: "gal-8",
      caption: "قيادات شابتر ESME جامعة القاهرة برفقة ضيوف الشرف والمتحدثين",
      alt: "فريق القيادة الطلابية لشابتر ESME أمام لافتة الملتقى الرسمية",
    },
  ],
  agenda: {
    eyebrow: "السبت 12 ديسمبر 2026 • من 9 صباحاً حتى 5 مساءً",
    title: "الأجندة المقسمة بين القاعتين",
    subtitle:
      "مركز بحوث واستشارات التنمية والتخطيط التكنولوجي (DRTPC) – جامعة القاهرة.",
    hall1Name: "القاعة الرئيسية",
    hall1Capacity: "السعة: 300 مشارك",
    hall1Subtitle: "القاعة الرئيسية • كلمة رئيسية وجلسات تقنية وHR ورعاة",
    hall2Name: "القاعة الصغيرة",
    hall2Capacity: "السعة: 200 مشارك",
    hall2Subtitle: "القاعة الصغيرة • سعة 200 مشارك",
    sessions: {
      "shared-registration": {
        time: "09:00 – 09:30 صباحاً",
        title: "التسجيل والاستقبال والبرانش",
        speaker: "",
        role: "",
        tag: "التسجيل",
        description: "تسجيل الحضور والاستقبال والبرانش والضيافة من Ahmed Tea.",
      },
      "shared-opening": {
        time: "09:30 – 10:10 صباحاً",
        title: "افتتاح الشابتر والكلمة الرئيسية",
        speaker: "",
        role: "",
        tag: "القاعة الرئيسية • القاعة الصغيرة مغلقة",
        description:
          "كلمة الشابتر والمشرفة الأكاديمية، وفقرة 10 دقائق للكلمة الرئيسية وفقرة راعٍ. يُعلن عن المتحدث بعد التأكيد.",
      },
      "h1-ai-visual-inspection": {
        time: "10:15 – 11:00 صباحاً",
        title: "الفحص البصري بالذكاء الاصطناعي",
        speaker: "",
        role: "",
        tag: "جلسة تقنية",
        description: "",
      },
      "h2-earthquake-structures": {
        time: "10:15 – 11:00 صباحاً",
        title: "المنشآت المقاومة للزلازل",
        speaker: "",
        role: "",
        tag: "جلسة تقنية",
        description: "",
      },
      "h1-robotics-automation": {
        time: "11:05 – 11:50 صباحاً",
        title: "الروبوتات والأتمتة",
        speaker: "",
        role: "",
        tag: "جلسة تقنية",
        description: "",
      },
      "h2-water-treatment": {
        time: "11:05 – 11:50 صباحاً",
        title: "معالجة المياه",
        speaker: "",
        role: "",
        tag: "جلسة تقنية",
        description: "",
      },
      "shared-dhuhr-break": {
        time: "11:50 صباحاً – 12:25 ظهراً",
        title: "استراحة الظهر • 35 دقيقة",
        speaker: "",
        role: "",
        tag: "صلاة • ضيافة • تواصل",
        description: "صلاة الظهر والضيافة والتواصل. القاعتان مغلقتان أثناء الاستراحة.",
      },
      "h1-ndt-ai": {
        time: "12:25 – 01:10 ظهراً",
        title: "الاختبارات غير الإتلافية بالذكاء الاصطناعي (NDT)",
        speaker: "",
        role: "",
        tag: "جلسة تقنية",
        description: "",
      },
      "h2-nanomaterials": {
        time: "12:25 – 01:10 ظهراً",
        title: "المواد النانوية",
        speaker: "",
        role: "",
        tag: "جلسة تقنية",
        description: "",
      },
      "h1-predictive-maintenance": {
        time: "01:15 – 02:00 ظهراً",
        title: "الصيانة التنبؤية",
        speaker: "",
        role: "",
        tag: "جلسة تقنية",
        description: "",
      },
      "h2-green-steel": {
        time: "01:15 – 02:00 ظهراً",
        title: "الصلب الأخضر بتقنية الاختزال المباشر (DRI)",
        speaker: "",
        role: "",
        tag: "جلسة تقنية",
        description: "",
      },
      "shared-hr-session": {
        time: "02:00 – 02:40 ظهراً",
        title: "جلسة HR — المقابلات والسيرة الذاتية",
        speaker: "",
        role: "",
        tag: "القاعة الرئيسية • القاعة الصغيرة مغلقة",
        description: "جلسة واحدة للجميع عن السيرة الذاتية والمقابلات. القاعة الصغيرة مغلقة.",
      },
      "shared-asr-break": {
        time: "02:40 – 03:10 مساءً",
        title: "استراحة العصر • 30 دقيقة",
        speaker: "",
        role: "",
        tag: "صلاة العصر • شاي Ahmed Tea",
        description: "صلاة العصر والضيافة بالشاي. القاعتان مغلقتان أثناء الاستراحة.",
      },
      "h1-ai-cad": {
        time: "03:10 – 03:55 مساءً",
        title: "الذكاء الاصطناعي في CAD والتصميم التوليدي",
        speaker: "",
        role: "",
        tag: "جلسة تقنية",
        description: "",
      },
      "h2-corrosion-protection": {
        time: "03:10 – 03:55 مساءً",
        title: "التآكل وحماية المواد",
        speaker: "",
        role: "",
        tag: "جلسة تقنية",
        description: "التصنيع بالإضافة موضوع احتياطي.",
      },
      "shared-sponsor-talks": {
        time: "04:00 – 04:30 مساءً",
        title: "كلمات الشركات الراعية",
        speaker: "",
        role: "",
        tag: "فقرتان • 15 دقيقة لكل شركة • القاعة الصغيرة مغلقة",
        description: "فقرتان للشركات الراعية، 15 دقيقة لكل شركة. تُعلن الأسماء بعد التأكيد.",
      },
      "shared-closing": {
        time: "04:30 – 05:00 مساءً",
        title: "الختام وتوزيع الشهادات",
        speaker: "",
        role: "",
        tag: "القاعة الرئيسية • القاعة الصغيرة مغلقة",
        description: "الختام وتوزيع الشهادات والصورة الجماعية. القاعة الصغيرة مغلقة.",
      },
    },
  },
  form: {
    bannerBadge: "شهادة معتمدة",
    bannerTitle: "شهادة حضور للمشاركين طوال اليوم",
    bannerDescription:
      "تُمنح شهادة الحضور للمشاركين الذين يكملون البرنامج طوال اليوم ويجمعون الأختام من محطات الحضور الثلاث.",
    steps: {
      step1: {
        navLabel: "الشخصية",
        title: "البيانات الشخصية",
        subtitle: "أدخل اسمك الثلاثي أو الرباعي بالكامل، الرقم القومي المكوّن من 14 رقم، وبيانات التواصل.",
      },
      step2: {
        navLabel: "الأكاديمية",
        title: "البيانات الأكاديمية والتخصص",
        subtitle: "حدد جامعتك وكليتك وتخصصك الدراسي وسنة التخرج، بالإضافة لوضع عضويتك في شابتر ESME.",
      },
      step3: {
        navLabel: "المستندات",
        title: "مستندات التحقق",
        subtitle: "ارفع صورة واضحة للوجه الأمامي لبطاقة الرقم القومي. الصورة الشخصية اختيارية للبادج.",
      },
      step4: {
        navLabel: "التأكيد",
        title: "المراجعة النهائية والتأكيد",
        subtitle: "راجع جميع بياناتك بدقة قبل إرسال الطلب وإصدار تذكرة الدخول الإلكترونية.",
      },
    },
    fields: {
      fullName: {
        label: "الاسم بالكامل",
        placeholder: "مثال: عمر أحمد حسن محمود",
        helperText: "اكتب اسمك كما ترغب في طباعته على شهادة الحضور الرسمية.",
      },
      nationalId: {
        label: "الرقم القومي (14 رقم)",
        placeholder: "29912010101234",
        helperText: "يُستخدم الرقم القومي المكوّن من 14 رقم لتوثيق الهوية عند بوابة الدخول.",
      },
      phone: {
        label: "رقم الهاتف",
        placeholder: "01012345678",
        helperText: "رقم محمول مصري صحيح يبدأ بـ 010 أو 011 أو 012 أو 015.",
      },
      email: {
        label: "البريد الإلكتروني",
        placeholder: "student@cu.edu.eg",
        helperText: "تُرسل إليه نسخة التذكرة الإلكترونية ورمز الدخول.",
      },
      city: {
        label: "محافظة الإقامة",
        placeholder: "اختر المحافظة...",
      },
      university: {
        label: "الجامعة",
        placeholder: "مثال: جامعة القاهرة",
      },
      faculty: {
        label: "الكلية / المجال الدراسي",
        placeholder: "اختر الكلية أو المجال الدراسي...",
      },
      department: {
        label: "القسم / التخصص",
        placeholder: "اختر القسم أو التخصص...",
      },
      customMajor: {
        label: "تحديد التخصص أو القسم يدويًا",
        placeholder: "اكتب تخصصك الدقيق (مثال: هندسة الطاقة، النانوتكنولوجي...)",
      },
      academicYear: {
        label: "الفرقة الدراسية",
        placeholder: "اختر الفرقة الدراسية...",
      },
      graduationYear: {
        label: "سنة التخرج المتوقعة",
        placeholder: "اختر سنة التخرج...",
      },
      jobTitle: {
        label: "المسمى الوظيفي / الصفة الحالية",
        placeholder: "طالب، معيد، باحث، أو مهندس",
      },
      company: {
        label: "الشركة / الجهة (إن وُجدت)",
        placeholder: "اسم الشركة أو المعمل البحثي (اختياري)",
      },
      isEsmeMember: {
        label: "هل أنت عضو في شابتر ESME؟",
        yesLabel: "نعم — عضو في الشابتر",
        noLabel: "لا",
      },
      committee: {
        label: "اللجنة",
        placeholder: "اختر اللجنة...",
      },
      idPhotoUrl: {
        label: "صورة بطاقة الرقم القومي (الوجه الأمامي)",
        helperText: "ارفع صورة واضحة للوجه الأمامي لبطاقة الرقم القومي (JPEG أو PNG بحد أقصى 5 ميجابايت).",
      },
      avatarUrl: {
        label: "الصورة الشخصية (للبادج التعريفي — اختياري)",
        helperText: "تظهر هذه الصورة اختيارياً على بطاقة التذكرة الرقمية وبادج المشاركة في LinkedIn.",
      },
    },
    termsLabel:
      "أقر بصحة جميع البيانات والمستندات المرفقة، وألتزم بكافة قواعد التنظيم والسلوك المعتمدة في ملتقى ESME جامعة القاهرة.",
    submitButtonLabel: "تأكيد التسجيل",
  },
  confirmation: {
    badgeLabel: "تم تأكيد تسجيلك وإصدار التذكرة بنجاح",
    heading: "مرحباً بك في ESME METRIX 2026!",
    subheading:
      "تذكرتك الإلكترونية المشفّرة ورمز الدخول QR وبادج المشاركة أصبحت جاهزة للاستخدام في لوحة المشارك.",
    whatsappBadge: "الخطوة التالية: انضم لمجتمع المشاركين",
    whatsappTitle: "جروب الواتساب الرسمي للملتقى",
    whatsappDescription:
      "انضم الآن لمتابعة مواعيد الجلسات، تحديثات القاعات، وتفاصيل الشهادات والتنظيم لحظة بلحظة.",
    whatsappButtonLabel: "انضم لجروب الواتساب الرسمي",
    checklistTitle: "تجهيزات يوم الملتقى",
    checklist: [
      {
        title: "إكمال البرنامج اليومي",
        description:
          "للتأهل لشهادة الحضور، أكمل جلسات اليوم واجمع الأختام من محطات الحضور الثلاث.",
      },
      {
        title: "إحضار أصل بطاقة الرقم القومي",
        description:
          "يُرجى اصطحاب أصل بطاقة الرقم القومي لمطابقتها عند بوابة مركز DRTPC بجامعة القاهرة.",
      },
      {
        title: "تذكرة QR جاهزة على هاتفك",
        description:
          "احتفظ بملف التذكرة PDF أو صورة QR على هاتفك لتسجيل الدخول السريع فور وصولك.",
      },
    ],
    linkedinCaption:
      "يسعدني الإعلان عن مشاركتي في النسخة الثانية من *ESME METRIX*!\n\nالسبت 12 ديسمبر 2026 من 9 صباحاً حتى 5 مساءً في مركز DRTPC بجامعة القاهرة. يوم كامل من الجلسات التقنية المتوازية وجلسة مهنية عن السيرة الذاتية والمقابلات.\n\nسجّل مقعدك الآن: https://esme-metrix-registeration.vercel.app/share/[ticketId]\nتابع صفحة الشابتر الرسمية: https://www.linkedin.com/company/esme-cairo-university-student-chapter/\n\n#ESMEMetrix #MaterialsEngineering #ESMECU #CairoUniversity",
  },
  footer: {
    brandTitle: "ESME METRIX",
    chapterName: "شابتر الجمعية المصرية لمهندسي المواد — جامعة القاهرة",
    tagline: "BE POSITIVE • BE VALUABLE",
    bio: "نسعى للارتقاء بمجال هندسة المواد، وتعزيز الحوار بين الأبحاث الأكاديمية والصناعة، وتمكين الجيل الجديد من المهندسين في جامعة القاهرة ومصر.",
    eventMeta: "12 ديسمبر 2026 • مركز DRTPC، جامعة القاهرة",
    portalLabel: "منصة شابتر ESME القاهرة",
    copyrightText: "© 2026 شابتر ESME جامعة القاهرة. جميع الحقوق محفوظة.",
  },
};

function strOrFallback(value: string | undefined, fallback: string): string {
  return value && value.trim() ? value.trim() : fallback;
}

/**
 * Returns a view-ready FullCmsData merged with Arabic CMS copy when lang === "ar",
 * seamlessly preserving all structural URLs, dates, coordinates, required flags,
 * dropdown option keys, and live image assets configured in English/Supabase.
 */
export function getLocalizedCms(cms: FullCmsData, lang: AppLanguage): FullCmsData {
  if (lang !== "ar") return cms;

  const ar = cms.ar ?? DEFAULT_ARABIC_CMS;
  const fallback = DEFAULT_ARABIC_CMS;

  const arLanding = ar.landing ?? fallback.landing;
  const arAgenda = ar.agenda ?? fallback.agenda;
  const arForm = ar.form ?? fallback.form;
  const arConf = ar.confirmation ?? fallback.confirmation;
  const arFooter = ar.footer ?? fallback.footer;

  const mergedPillars = cms.landing.storyPillars.map((pillar, idx) => {
    const customPillar = arLanding.storyPillars?.find((p) => p.id === pillar.id);
    const defaultPillar = fallback.landing.storyPillars[idx];
    const picked = customPillar ?? defaultPillar;
    return {
      id: pillar.id,
      tag: strOrFallback(picked?.tag, pillar.tag),
      title: strOrFallback(picked?.title, pillar.title),
      description: strOrFallback(picked?.description, pillar.description),
    };
  });

  const mergedGallery = cms.gallery.map((item, idx) => {
    const customItem = ar.gallery?.find((g) => g.id === item.id);
    const defaultItem = fallback.gallery[idx];
    return {
      id: item.id,
      url: item.url,
      caption: strOrFallback(customItem?.caption ?? defaultItem?.caption, item.caption),
      alt: strOrFallback(customItem?.alt ?? defaultItem?.alt, item.alt),
    };
  });

  const mergedSessions = cms.agenda.sessions.map((session) => {
    const customSession = arAgenda.sessions?.[session.id];
    const defaultSession = fallback.agenda.sessions[session.id];
    return {
      ...session,
      time: strOrFallback(customSession?.time ?? defaultSession?.time, session.time),
      title: strOrFallback(customSession?.title ?? defaultSession?.title, session.title),
      speaker: strOrFallback(customSession?.speaker ?? defaultSession?.speaker, session.speaker),
      role: strOrFallback(customSession?.role ?? defaultSession?.role, session.role),
      tag: strOrFallback(customSession?.tag ?? defaultSession?.tag, session.tag),
      description: strOrFallback(
        customSession?.description ?? defaultSession?.description,
        session.description
      ),
    };
  });

  const mergeField = <K extends keyof typeof cms.form.fields>(
    key: K
  ): (typeof cms.form.fields)[K] => {
    const baseField = cms.form.fields[key];
    const arField = arForm.fields?.[key];
    const fbField = fallback.form.fields[key];
    if (key === "isEsmeMember") {
      const baseEsme = baseField as typeof cms.form.fields.isEsmeMember;
      return {
        ...baseEsme,
        label: strOrFallback(arField?.label ?? fbField.label, baseEsme.label),
        yesLabel: strOrFallback(arField?.yesLabel ?? fbField.yesLabel, baseEsme.yesLabel),
        noLabel: strOrFallback(arField?.noLabel ?? fbField.noLabel, baseEsme.noLabel),
      } as (typeof cms.form.fields)[K];
    }
    const baseStd = baseField as import("@/lib/cms/types").FormFieldConfig;
    return {
      ...baseStd,
      label: strOrFallback(arField?.label ?? fbField?.label, baseStd.label),
      placeholder: strOrFallback(arField?.placeholder ?? fbField?.placeholder, baseStd.placeholder),
      helperText: strOrFallback(
        arField?.helperText ?? fbField?.helperText,
        baseStd.helperText || ""
      ) || undefined,
    } as (typeof cms.form.fields)[K];
  };

  return {
    ...cms,
    eventDate: strOrFallback(ar.eventDate, fallback.eventDate),
    eventVenue: strOrFallback(ar.eventVenue, fallback.eventVenue),
    eventTime: strOrFallback(ar.eventTime, fallback.eventTime),
    landing: {
      statusBadge: strOrFallback(arLanding.statusBadge, fallback.landing.statusBadge),
      titleLine1: strOrFallback(arLanding.titleLine1, fallback.landing.titleLine1),
      titleHighlight: strOrFallback(arLanding.titleHighlight, fallback.landing.titleHighlight),
      subtitle: strOrFallback(arLanding.subtitle, fallback.landing.subtitle),
      primaryCtaLabel: strOrFallback(arLanding.primaryCtaLabel, fallback.landing.primaryCtaLabel),
      secondaryCtaLabel: strOrFallback(
        arLanding.secondaryCtaLabel,
        fallback.landing.secondaryCtaLabel
      ),
      certificateBadge: strOrFallback(
        arLanding.certificateBadge,
        fallback.landing.certificateBadge
      ),
      certificateTitle: strOrFallback(
        arLanding.certificateTitle,
        fallback.landing.certificateTitle
      ),
      certificateDescription: strOrFallback(
        arLanding.certificateDescription,
        fallback.landing.certificateDescription
      ),
      storyEyebrow: strOrFallback(arLanding.storyEyebrow, fallback.landing.storyEyebrow),
      storyTitle: strOrFallback(arLanding.storyTitle, fallback.landing.storyTitle),
      storyLead: strOrFallback(arLanding.storyLead, fallback.landing.storyLead),
      storyPillars: mergedPillars,
      aboutEyebrow: strOrFallback(arLanding.aboutEyebrow, fallback.landing.aboutEyebrow),
      aboutTitle: strOrFallback(arLanding.aboutTitle, fallback.landing.aboutTitle),
      aboutText: strOrFallback(arLanding.aboutText, fallback.landing.aboutText),
      experienceBullets:
        arLanding.experienceBullets && arLanding.experienceBullets.length > 0
          ? arLanding.experienceBullets
          : fallback.landing.experienceBullets,
      galleryEyebrow: strOrFallback(arLanding.galleryEyebrow, fallback.landing.galleryEyebrow),
      galleryTitle: strOrFallback(arLanding.galleryTitle, fallback.landing.galleryTitle),
      gallerySubtitle: strOrFallback(arLanding.gallerySubtitle, fallback.landing.gallerySubtitle),
      ctaTitle: strOrFallback(arLanding.ctaTitle, fallback.landing.ctaTitle),
      ctaDescription: strOrFallback(arLanding.ctaDescription, fallback.landing.ctaDescription),
      ctaButtonLabel: strOrFallback(arLanding.ctaButtonLabel, fallback.landing.ctaButtonLabel),
    },
    highlights:
      cms.eventStats && cms.eventStats.length > 0
        ? cms.eventStats.map((stat, idx) => ({
            value: stat.value,
            label: strOrFallback(
              stat.label.ar || ar.highlights?.[idx]?.label || fallback.highlights[idx]?.label,
              stat.label.en
            ),
          }))
        : cms.highlights.map((h, idx) => ({
            value: strOrFallback(ar.highlights?.[idx]?.value ?? fallback.highlights[idx]?.value, h.value),
            label: strOrFallback(ar.highlights?.[idx]?.label ?? fallback.highlights[idx]?.label, h.label),
          })),
    gallery: mergedGallery,
    agenda: {
      eyebrow: strOrFallback(arAgenda.eyebrow, fallback.agenda.eyebrow),
      title: strOrFallback(arAgenda.title, fallback.agenda.title),
      subtitle: strOrFallback(arAgenda.subtitle, fallback.agenda.subtitle),
      hall1Name: strOrFallback(arAgenda.hall1Name, fallback.agenda.hall1Name),
      hall1Capacity: strOrFallback(arAgenda.hall1Capacity, fallback.agenda.hall1Capacity),
      hall1Subtitle: strOrFallback(arAgenda.hall1Subtitle, fallback.agenda.hall1Subtitle),
      hall2Name: strOrFallback(arAgenda.hall2Name, fallback.agenda.hall2Name),
      hall2Capacity: strOrFallback(arAgenda.hall2Capacity, fallback.agenda.hall2Capacity),
      hall2Subtitle: strOrFallback(arAgenda.hall2Subtitle, fallback.agenda.hall2Subtitle),
      sessions: mergedSessions,
    },
    form: {
      ...cms.form,
      bannerBadge: strOrFallback(arForm.bannerBadge, fallback.form.bannerBadge),
      bannerTitle: strOrFallback(arForm.bannerTitle, fallback.form.bannerTitle),
      bannerDescription: strOrFallback(arForm.bannerDescription, fallback.form.bannerDescription),
      steps: {
        step1: {
          navLabel: strOrFallback(arForm.steps?.step1?.navLabel, fallback.form.steps.step1.navLabel),
          title: strOrFallback(arForm.steps?.step1?.title, fallback.form.steps.step1.title),
          subtitle: strOrFallback(arForm.steps?.step1?.subtitle, fallback.form.steps.step1.subtitle),
        },
        step2: {
          navLabel: strOrFallback(arForm.steps?.step2?.navLabel, fallback.form.steps.step2.navLabel),
          title: strOrFallback(arForm.steps?.step2?.title, fallback.form.steps.step2.title),
          subtitle: strOrFallback(arForm.steps?.step2?.subtitle, fallback.form.steps.step2.subtitle),
        },
        step3: {
          navLabel: strOrFallback(arForm.steps?.step3?.navLabel, fallback.form.steps.step3.navLabel),
          title: strOrFallback(arForm.steps?.step3?.title, fallback.form.steps.step3.title),
          subtitle: strOrFallback(arForm.steps?.step3?.subtitle, fallback.form.steps.step3.subtitle),
        },
        step4: {
          navLabel: strOrFallback(arForm.steps?.step4?.navLabel, fallback.form.steps.step4.navLabel),
          title: strOrFallback(arForm.steps?.step4?.title, fallback.form.steps.step4.title),
          subtitle: strOrFallback(arForm.steps?.step4?.subtitle, fallback.form.steps.step4.subtitle),
        },
      },
      fields: {
        fullName: mergeField("fullName"),
        nationalId: mergeField("nationalId"),
        phone: mergeField("phone"),
        email: mergeField("email"),
        city: mergeField("city"),
        university: mergeField("university"),
        faculty: mergeField("faculty"),
        department: mergeField("department"),
        customMajor: mergeField("customMajor"),
        academicYear: mergeField("academicYear"),
        graduationYear: mergeField("graduationYear"),
        jobTitle: mergeField("jobTitle"),
        company: mergeField("company"),
        isEsmeMember: mergeField("isEsmeMember"),
        committee: mergeField("committee"),
        idPhotoUrl: mergeField("idPhotoUrl"),
        avatarUrl: mergeField("avatarUrl"),
      },
      termsLabel: strOrFallback(arForm.termsLabel, fallback.form.termsLabel),
      submitButtonLabel: strOrFallback(arForm.submitButtonLabel, fallback.form.submitButtonLabel),
    },
    confirmation: {
      ...cms.confirmation,
      badgeLabel: strOrFallback(arConf.badgeLabel, fallback.confirmation.badgeLabel),
      heading: strOrFallback(arConf.heading, fallback.confirmation.heading),
      subheading: strOrFallback(arConf.subheading, fallback.confirmation.subheading),
      whatsappBadge: strOrFallback(arConf.whatsappBadge, fallback.confirmation.whatsappBadge),
      whatsappTitle: strOrFallback(arConf.whatsappTitle, fallback.confirmation.whatsappTitle),
      whatsappDescription: strOrFallback(
        arConf.whatsappDescription,
        fallback.confirmation.whatsappDescription
      ),
      whatsappButtonLabel: strOrFallback(
        arConf.whatsappButtonLabel,
        fallback.confirmation.whatsappButtonLabel
      ),
      checklistTitle: strOrFallback(arConf.checklistTitle, fallback.confirmation.checklistTitle),
      checklist: cms.confirmation.checklist.map((item, idx) => ({
        title: strOrFallback(
          arConf.checklist?.[idx]?.title ?? fallback.confirmation.checklist[idx]?.title,
          item.title
        ),
        description: strOrFallback(
          arConf.checklist?.[idx]?.description ?? fallback.confirmation.checklist[idx]?.description,
          item.description
        ),
      })),
      linkedinCaption: strOrFallback(arConf.linkedinCaption, fallback.confirmation.linkedinCaption),
    },
    footer: {
      ...cms.footer,
      brandTitle: strOrFallback(arFooter.brandTitle, fallback.footer.brandTitle),
      chapterName: strOrFallback(arFooter.chapterName, fallback.footer.chapterName),
      tagline: strOrFallback(arFooter.tagline, fallback.footer.tagline),
      bio: strOrFallback(arFooter.bio, fallback.footer.bio),
      eventMeta: strOrFallback(arFooter.eventMeta, fallback.footer.eventMeta),
      portalLabel: strOrFallback(arFooter.portalLabel, fallback.footer.portalLabel),
      copyrightText: strOrFallback(arFooter.copyrightText, fallback.footer.copyrightText),
    },
  };
}

export function getLocalizedFormConfig(
  form: FullCmsData["form"],
  arForm: ArabicCmsData["form"] | undefined,
  lang: AppLanguage
): FullCmsData["form"] {
  if (lang !== "ar") return form;
  const fallback = DEFAULT_ARABIC_CMS.form;
  const src = arForm ?? fallback;

  const mergeField = <K extends keyof typeof form.fields>(key: K): (typeof form.fields)[K] => {
    const baseField = form.fields[key];
    const arField = src.fields?.[key];
    const fbField = fallback.fields[key];
    if (key === "isEsmeMember") {
      const baseEsme = baseField as typeof form.fields.isEsmeMember;
      return {
        ...baseEsme,
        label: strOrFallback(arField?.label ?? fbField.label, baseEsme.label),
        yesLabel: strOrFallback(arField?.yesLabel ?? fbField.yesLabel, baseEsme.yesLabel),
        noLabel: strOrFallback(arField?.noLabel ?? fbField.noLabel, baseEsme.noLabel),
      } as (typeof form.fields)[K];
    }
    const baseStd = baseField as import("@/lib/cms/types").FormFieldConfig;
    return {
      ...baseStd,
      label: strOrFallback(arField?.label ?? fbField?.label, baseStd.label),
      placeholder: strOrFallback(arField?.placeholder ?? fbField?.placeholder, baseStd.placeholder),
      helperText:
        strOrFallback(arField?.helperText ?? fbField?.helperText, baseStd.helperText || "") ||
        undefined,
    } as (typeof form.fields)[K];
  };

  return {
    ...form,
    bannerBadge: strOrFallback(src.bannerBadge, fallback.bannerBadge),
    bannerTitle: strOrFallback(src.bannerTitle, fallback.bannerTitle),
    bannerDescription: strOrFallback(src.bannerDescription, fallback.bannerDescription),
    steps: {
      step1: {
        navLabel: strOrFallback(src.steps?.step1?.navLabel, fallback.steps.step1.navLabel),
        title: strOrFallback(src.steps?.step1?.title, fallback.steps.step1.title),
        subtitle: strOrFallback(src.steps?.step1?.subtitle, fallback.steps.step1.subtitle),
      },
      step2: {
        navLabel: strOrFallback(src.steps?.step2?.navLabel, fallback.steps.step2.navLabel),
        title: strOrFallback(src.steps?.step2?.title, fallback.steps.step2.title),
        subtitle: strOrFallback(src.steps?.step2?.subtitle, fallback.steps.step2.subtitle),
      },
      step3: {
        navLabel: strOrFallback(src.steps?.step3?.navLabel, fallback.steps.step3.navLabel),
        title: strOrFallback(src.steps?.step3?.title, fallback.steps.step3.title),
        subtitle: strOrFallback(src.steps?.step3?.subtitle, fallback.steps.step3.subtitle),
      },
      step4: {
        navLabel: strOrFallback(src.steps?.step4?.navLabel, fallback.steps.step4.navLabel),
        title: strOrFallback(src.steps?.step4?.title, fallback.steps.step4.title),
        subtitle: strOrFallback(src.steps?.step4?.subtitle, fallback.steps.step4.subtitle),
      },
    },
    fields: {
      fullName: mergeField("fullName"),
      nationalId: mergeField("nationalId"),
      phone: mergeField("phone"),
      email: mergeField("email"),
      city: mergeField("city"),
      university: mergeField("university"),
      faculty: mergeField("faculty"),
      department: mergeField("department"),
      customMajor: mergeField("customMajor"),
      academicYear: mergeField("academicYear"),
      graduationYear: mergeField("graduationYear"),
      jobTitle: mergeField("jobTitle"),
      company: mergeField("company"),
      isEsmeMember: mergeField("isEsmeMember"),
      committee: mergeField("committee"),
      idPhotoUrl: mergeField("idPhotoUrl"),
      avatarUrl: mergeField("avatarUrl"),
    },
    termsLabel: strOrFallback(src.termsLabel, fallback.termsLabel),
    submitButtonLabel: strOrFallback(src.submitButtonLabel, fallback.submitButtonLabel),
  };
}
