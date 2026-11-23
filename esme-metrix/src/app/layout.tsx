import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "ESME METRIX — Registration & Digital Identity Platform",
  description: "Official Event Registration & Attendance Management System for ESME Cairo University Student Chapter.",
  keywords: ["ESME", "Cairo University", "Metrix", "Engineering", "Registration", "Attendance"],
  openGraph: {
    title: "ESME METRIX 2026",
    description: "Official Event Registration & Attendance Management System",
    images: ["/esme_logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#0A0F14] text-slate-100 min-h-screen flex flex-col antialiased tech-grid font-sans">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0A0F14]/80 border-b border-[#00C9A7]/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 rounded-lg bg-[#111820] border border-[#00C9A7]/30 flex items-center justify-center overflow-hidden p-1 group-hover:border-[#00C9A7] transition-colors">
                <Image
                  src="/esme_logo.png"
                  alt="ESME Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wider text-white group-hover:text-[#00C9A7] transition-colors">
                  ESME <span className="text-[#00C9A7]">METRIX</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-tighter">
                  CAIRO STUDENT CHAPTER
                </span>
              </div>
            </Link>

            <nav className="flex items-center gap-3">
              <Link
                href="/register"
                className="text-xs sm:text-sm px-3.5 py-1.5 rounded-lg bg-[#00C9A7] text-[#0A0F14] font-semibold hover:bg-[#2DD4BF] transition-all shadow-[0_0_15px_rgba(0,201,167,0.25)]"
              >
                Register Now
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Global Footer */}
        <footer className="border-t border-[#00C9A7]/10 bg-[#0A0F14]/90 py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
            <div>
              &copy; 2026 ESME Cairo University Student Chapter. All rights reserved.
            </div>
            <div className="text-[#00C9A7]/80 font-semibold tracking-wider">
              BE POSITIVE VALUABLE
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
