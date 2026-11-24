import Link from "next/link";
<<<<<<< HEAD
import Image from "next/image";
import HeroParticles from "@/components/HeroParticles";
import TiltCard from "@/components/TiltCard";
import {
  QrCode,
  ShieldCheck,
  Share2,
  Calendar,
  MapPin,
  Users,
  Mic,
  Trophy,
  Building2,
  Zap,
  ArrowRight,
  ChevronRight,
  Globe,
  Layers,
  Award,
  Flame,
  Atom,
  Cpu,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

async function getSiteContent(): Promise<Record<string, string>> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase.from("site_content").select("key, value");
    if (!data) return {};
    return Object.fromEntries(data.map((row: { key: string; value: string }) => [row.key, row.value]));
  } catch {
    return {};
  }
}

export const revalidate = 60;

export default async function HomePage() {
  const cms = await getSiteContent();

  const eventDate = cms.event_date || "12 December 2026";
  const eventVenue = cms.event_venue || "Cairo University — Faculty of Engineering";
  const aboutText =
    cms.about_text ||
    "ESME METRIX is the premier materials and energy conference in Egypt, hosted by the ESME Cairo University Student Chapter. Bringing together over 500+ student engineers, researchers, and prominent corporate leaders from metallurgy, oil & gas, renewable energy, and robotics.";

  // High quality realistic photography for engineering conferences
  const galleryImage1 = cms.gallery_image_1 || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"; // Metallurgy / Advanced Lab
  const galleryImage2 = cms.gallery_image_2 || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"; // Keynote Auditorium / Hall
  const galleryImage3 = cms.gallery_image_3 || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"; // Chip / Mechatronics
  const galleryImage4 = cms.gallery_image_4 || "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=800&q=80"; // Networking Engineers / Ceremony

  // Dynamic CMS Agenda
  const rawAgenda = cms.event_agenda || `09:00 AM | Gates Open & Registration Desk | 🚪
10:00 AM | Opening Ceremony & Keynote Address | 🎤
12:00 PM | Materials & Petroleum Workshops | ⚡
02:00 PM | Mechatronics & Industry Exhibition | 🏢
04:00 PM | Engineering Competitions & Awards | 🏆
06:00 PM | Certificate Distribution & Gala | 🎓`;

  const timeline = rawAgenda
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      return {
        time: parts[0] || "09:00 AM",
        label: parts[1] || "Session",
        icon: parts[2] || "⚡",
      };
    });

  const highlights = [
    { icon: Users, label: "500+ Attendees", value: "500+" },
    { icon: Mic, label: "15+ Keynote Speakers", value: "15+" },
    { icon: Zap, label: "8+ Specialized Workshops", value: "8+" },
    { icon: Building2, label: "20+ Industrial Partners", value: "20+" },
    { icon: Trophy, label: "3 Technical Competitions", value: "3" },
    { icon: Award, label: "Accredited Certificate", value: "100%" },
  ];

  return (
    <div className="relative overflow-hidden flex-1 flex flex-col bg-[#15304B]">
      {/* Dynamic Background Particles */}
      <HeroParticles />

      {/* Tech grid background */}
      <div className="fixed inset-0 tech-grid pointer-events-none z-0 opacity-30" />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D97706]/7 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#10B981]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pt-14 pb-16 sm:pt-20 sm:pb-24 flex flex-col items-center text-center">
        
        {/* Registration Open Live Status */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] font-mono text-xs font-semibold mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
          </span>
          REGISTRATION OPEN — LIMITED CAPACITY
        </div>

        {/* Corporate Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 max-w-4xl">
          The Annual Materials &amp; Engineering Conference
          <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#F59E0B]">
            ESME METRIX 2026
          </span>
        </h1>

        <p className="max-w-2xl text-slate-300 text-sm sm:text-lg mb-8 leading-relaxed font-normal">
          Hosted by the <strong>ESME Cairo University Student Chapter</strong>. Bringing together students and leaders across <strong>هندسة الكيمياء</strong>، <strong>الميكانيكا</strong>، <strong>الهندسة المدنية</strong>، و<strong>المواد والبترول</strong>.
        </p>

        {/* Official Certificate Announcement Card */}
        <div className="w-full max-w-2xl p-4 rounded-2xl bg-[#0F243A]/90 border border-[#D97706]/40 animate-border-glow backdrop-blur-md flex items-center justify-between gap-4 mb-10 shadow-lg text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center shrink-0 shadow-md">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-white">
                  Official Certificate of Attendance
                </span>
                <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded font-bold">
                  معتمد
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                يحصل كل حاضر على شهادة حضور رسمية معتمدة وموثقة برقم تسجيله تسلم في مقر الفعالية.
              </p>
            </div>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
          <Link
            href="/register"
            className="w-full sm:w-auto px-9 py-4 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(217,119,6,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            REGISTER FOR ADMISSION
            <ChevronRight className="w-4 h-4" />
          </Link>
          <a
            href="#agenda"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-700 bg-[#0F243A]/80 text-slate-300 hover:text-white hover:border-[#D97706] font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            View Event Agenda <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Engineering Disciplines Grid including Chemical, Mechanical, Civil, and Materials */}
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left mb-16">
          <TiltCard className="p-5 rounded-2xl bg-[#0F243A]/85 border border-[#D97706]/25 flex flex-col justify-between shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#D97706]/15 flex items-center justify-center text-[#D97706] border border-[#D97706]/30">
                <Atom className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Materials &amp; Metallurgy</h3>
                <span className="text-[11px] text-[#F59E0B] font-mono">هندسة الفلزات والمواد</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Crystal lattices, advanced alloys, metallurgy testing, and nano-materials science.
            </p>
          </TiltCard>

          <TiltCard className="p-5 rounded-2xl bg-[#0F243A]/85 border border-[#F59E0B]/25 flex flex-col justify-between shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/15 flex items-center justify-center text-[#F59E0B] border border-[#F59E0B]/30">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Chemical &amp; Petroleum</h3>
                <span className="text-[11px] text-[#F59E0B] font-mono">هندسة الكيمياء والبترول</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Petrochemical processes, fluid dynamics, reaction engineering, and energy refining.
            </p>
          </TiltCard>

          <TiltCard className="p-5 rounded-2xl bg-[#0F243A]/85 border border-[#10B981]/25 flex flex-col justify-between shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#10B981]/15 flex items-center justify-center text-[#10B981] border border-[#10B981]/30">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Mechanical &amp; Robotics</h3>
                <span className="text-[11px] text-[#10B981] font-mono">هندسة الميكانيكا والميكاترونكس</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Machine design, thermal power, automation robotics, and precision manufacturing.
            </p>
          </TiltCard>

          <TiltCard className="p-5 rounded-2xl bg-[#0F243A]/85 border border-sky-500/25 flex flex-col justify-between shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-sky-500/15 flex items-center justify-center text-sky-400 border border-sky-500/30">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Civil &amp; Structures</h3>
                <span className="text-[11px] text-sky-400 font-mono">الهندسة المدنية والإنشاءات</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Concrete technology, structural integrity, smart materials in infrastructure, and geotechnical foundations.
            </p>
          </TiltCard>
        </div>

        {/* Quick Venue and Date Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md w-full">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0F243A]/90 border border-slate-700/60 text-left">
            <Calendar className="w-5 h-5 text-[#D97706] shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Date</div>
              <div className="text-xs sm:text-sm font-bold text-white">{eventDate}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0F243A]/90 border border-slate-700/60 text-left">
            <MapPin className="w-5 h-5 text-[#D97706] shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Venue</div>
              <div className="text-xs sm:text-sm font-bold text-white">{eventVenue}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── METRICS STRIP ── */}
      <section className="relative z-10 w-full bg-[#0A1F33] border-y border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {highlights.map((h, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-black text-white">{h.value}</span>
                <span className="text-xs text-slate-400 font-medium mt-1">{h.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVENT AGENDA ── */}
      <section id="agenda" className="relative z-10 max-w-6xl mx-auto px-4 py-20 w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-slate-700 bg-[#0F243A] text-slate-300 font-mono text-xs mb-3">
            <Layers className="w-3.5 h-3.5 text-[#F59E0B]" />
            Official Event Schedule
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            EVENT AGENDA
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            مواعيد وفقرات يوم الحدث الرسمية — السبت 12 ديسمبر 2026 في جامعة القاهرة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {timeline.map((item, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#0F243A]/90 border border-slate-800 hover:border-[#D97706]/40 flex items-start gap-4 transition-all"
            >
              <div className="text-2xl shrink-0 bg-[#15304B] w-12 h-12 rounded-xl flex items-center justify-center border border-slate-700">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="text-xs font-mono font-bold text-[#F59E0B] mb-1 tracking-wider">
                  {item.time}
                </div>
                <div className="text-sm font-semibold text-white leading-snug">
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT & REAL PHOTO GALLERY ── */}
      <section id="about" className="relative z-10 max-w-6xl mx-auto px-4 pb-20 w-full">
        <div className="rounded-3xl bg-[#0F243A]/90 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Content (5 cols) */}
            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-center">
              <div className="inline-block text-xs font-mono font-bold text-[#D97706] uppercase tracking-wider mb-2">
                About The Gathering
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                Pioneering Engineering at Cairo University
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-normal">
                {aboutText}
              </p>
              <div className="space-y-2.5 mb-8 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>شهادة حضور رسمية معتمدة لكل المشاركين.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>ورش عمل هندسية وتطبيقية مع خبراء ومسؤولي الشركات.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>مسابقات هندسية وجوائز للمشاريع المتميزة.</span>
                </div>
              </div>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg self-start"
              >
                Register Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right Photo Grid (7 cols) - Realistic Corporate Images */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-1 p-2 bg-[#091522] min-h-[380px]">
              {[galleryImage1, galleryImage2, galleryImage3, galleryImage4].map((src, i) => (
                <div key={i} className="relative overflow-hidden bg-[#15304B] rounded-lg group min-h-[190px]">
                  <Image
                    src={src}
                    alt={`Conference photo ${i + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-24 text-center w-full">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-[#0F243A] to-[#15304B] p-8 sm:p-14 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Secure Your Seat at ESME METRIX 2026
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
            Complete your online registration, obtain your encrypted entrance QR badge, and receive your official certificate of attendance.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:brightness-110 active:scale-95 transition-all"
          >
            REGISTER NOW — FREE ADMISSION
            <ChevronRight className="w-4 h-4" />
          </Link>
=======
import HeroParticles from "@/components/HeroParticles";
import { QrCode, ShieldCheck, Share2, Sparkles, UserCheck, Calendar, MapPin } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden flex-1 flex flex-col justify-center">
      {/* Dynamic Background Particles */}
      <HeroParticles />

      {/* Decorative Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D97706]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 py-16 sm:py-24 text-center flex flex-col items-center">
        {/* Organization Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D97706]/35 bg-[#0F243A]/80 backdrop-blur-md mb-8">
          <Sparkles className="w-4 h-4 text-[#D97706]" />
          <span className="text-xs font-mono font-medium text-slate-300 tracking-wide uppercase">
            ESME Cairo University Student Chapter • Metrix 2026
          </span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
          ENGINEERING <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-[#D97706]">EXCELLENCE</span>
          <br />
          MEETS DIGITAL IDENTITY
        </h1>

        <p className="max-w-2xl text-slate-300 text-base sm:text-lg mb-10 leading-relaxed font-normal">
          The premier event registration & attendance verification platform for ESME CU Chapter.
          Secure biometric registration, dynamic signed QR credentials, and frictionless event check-in.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(217,119,6,0.35)] hover:brightness-110 hover:shadow-[0_0_35px_rgba(217,119,6,0.5)] transition-all flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            REGISTER ATTENDANCE
          </Link>
          <Link
            href="/admin"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0F243A] border border-[#D97706]/35 text-slate-200 hover:text-white hover:border-[#D97706] hover:bg-[#1D3046] font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#D97706]" />
            ADMIN PORTAL
          </Link>
        </div>

        {/* Event Quick Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-14 max-w-lg w-full">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0F243A]/70 border border-[#D97706]/20 backdrop-blur-sm">
            <Calendar className="w-5 h-5 text-[#D97706] shrink-0" />
            <div className="text-left">
              <div className="text-[11px] text-slate-400 font-mono uppercase">Event Date</div>
              <div className="text-sm font-semibold text-white">November 2026 Season</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0F243A]/70 border border-[#D97706]/20 backdrop-blur-sm">
            <MapPin className="w-5 h-5 text-[#D97706] shrink-0" />
            <div className="text-left">
              <div className="text-[11px] text-slate-400 font-mono uppercase">Venue</div>
              <div className="text-sm font-semibold text-white">Cairo University Campus</div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full text-left">
          <div className="p-6 rounded-2xl bg-[#0F243A]/80 border border-[#D97706]/20 hover:border-[#D97706]/50 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#D97706]/10 flex items-center justify-center mb-4 text-[#D97706]">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-base mb-2">Unique QR Identity</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every attendee receives a cryptographically signed QR code ready for instant admission scanning.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F243A]/80 border border-[#D97706]/20 hover:border-[#D97706]/50 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#D97706]/10 flex items-center justify-center mb-4 text-[#D97706]">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-base mb-2">Social Amplification</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Personalized high-resolution attendance badges ready for 1-click sharing on LinkedIn.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F243A]/80 border border-[#D97706]/20 hover:border-[#D97706]/50 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#D97706]/10 flex items-center justify-center mb-4 text-[#D97706]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-base mb-2">Live Realtime Radar</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real-time attendance stream, duplicate check-in prevention, and instant analytics.
            </p>
          </div>
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
        </div>
      </section>
    </div>
  );
}
