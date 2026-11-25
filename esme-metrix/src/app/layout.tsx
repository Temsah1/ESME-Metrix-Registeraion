import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import MotionProvider from "@/components/MotionProvider";
import AosInit from "@/components/motion/AosInit";
import SiteFooter from "@/components/SiteFooter";
import AppChromeShell from "@/components/AppChromeShell";
import { getFullCmsData } from "@/lib/cms/server";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://esme-metrix-registeration.vercel.app"
  ),
  title: "ESME METRIX — Registration & Digital Identity Platform",
  description:
    "Official Event Registration & Attendance Management System for ESME Cairo University Student Chapter.",
  keywords: ["ESME", "Cairo University", "Metrix", "Engineering", "Registration", "Attendance"],
  openGraph: {
    title: "ESME METRIX 2026",
    description: "Official Event Registration & Attendance Management System",
    images: ["/esme_logo.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cms = await getFullCmsData();

  const headerNode = (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#15304B]/85 border-b border-[#D97706]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-9 h-9 rounded-lg bg-[#0F243A] border border-[#D97706]/35 flex items-center justify-center overflow-hidden p-1 group-hover:border-[#D97706] transition-colors">
            <Image
              src={cms.heroLogoUrl || "/esme_logo.png"}
              alt="ESME Logo"
              width={32}
              height={32}
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wider text-white group-hover:text-[#D97706] transition-colors">
              ESME <span className="text-[#D97706]">METRIX</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-tighter">
              CAIRO STUDENT CHAPTER
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/#story"
            className="hidden md:inline-block text-xs font-medium text-slate-300 hover:text-[#F59E0B] transition-colors"
          >
            Story
          </Link>
          <Link
            href="/#gallery"
            className="hidden md:inline-block text-xs font-medium text-slate-300 hover:text-[#F59E0B] transition-colors"
          >
            Gallery
          </Link>
          <Link
            href="/#agenda"
            className="hidden md:inline-block text-xs font-medium text-slate-300 hover:text-[#F59E0B] transition-colors"
          >
            Agenda
          </Link>
          <Link
            href="/dashboard"
            className="text-xs sm:text-sm px-3 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:text-white hover:border-emerald-400 transition-all font-semibold"
          >
            Member Dashboard
          </Link>
          <Link
            href="/admin"
            className="hidden sm:inline-block text-xs sm:text-sm px-3.5 py-2 rounded-lg border border-[#D97706]/35 text-slate-200 hover:text-white hover:border-[#D97706] hover:bg-[#0F243A] transition-all font-semibold"
          >
            Admin Login
          </Link>
          <Link
            href="/register"
            className="text-xs sm:text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(217,119,6,0.3)]"
          >
            Register Now
          </Link>
        </nav>
      </div>
    </header>
  );

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="bg-[#15304B] text-slate-100 min-h-screen flex flex-col antialiased tech-grid font-sans"
      >
        <MotionProvider>
          <AosInit />
          <AppChromeShell
            header={headerNode}
            footer={<SiteFooter footer={cms.footer} logoUrl={cms.heroLogoUrl} />}
          >
            {children}
          </AppChromeShell>
        </MotionProvider>
      </body>
    </html>
  );
}
