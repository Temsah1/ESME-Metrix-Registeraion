import Link from "next/link";
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
        </div>
      </section>
    </div>
  );
}
