import type { Metadata } from "next";
import "./globals.css";
import { Space_Grotesk, Inter, JetBrains_Mono, Cairo } from "next/font/google";
import MotionProvider from "@/components/MotionProvider";
import AosInit from "@/components/motion/AosInit";
import IntroLoader from "@/components/IntroLoader";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AppChromeShell from "@/components/AppChromeShell";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { LANGUAGE_STORAGE_KEY } from "@/lib/i18n/types";
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

const cairoArabic = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-arabic",
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
  icons: {
    icon: [
      { url: "/esme-icon.jpg?v=5", type: "image/jpeg" },
      { url: "/favicon.ico?v=5", sizes: "any" },
    ],
    shortcut: "/esme-icon.jpg?v=5",
    apple: "/esme-icon.jpg?v=5",
  },
  openGraph: {
    title: "ESME METRIX 2026",
    description: "Official Event Registration & Attendance Management System",
    images: ["/esme-icon.jpg?v=5"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cms = await getFullCmsData();
  const langBootScript = `(function(){try{var l=localStorage.getItem('${LANGUAGE_STORAGE_KEY}');if(l==='ar'){document.documentElement.lang='ar';document.documentElement.dir='rtl';}else{document.documentElement.lang='en';document.documentElement.dir='ltr';}}catch(e){}})();`;

  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} ${cairoArabic.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: langBootScript }} />
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#15304B] text-slate-100 min-h-screen flex flex-col antialiased tech-grid font-sans"
      >
        <MotionProvider>
          <LanguageProvider>
            <IntroLoader />
            <div className="grain-overlay" aria-hidden="true" />
            <AosInit />
            <AppChromeShell
              header={<SiteHeader heroLogoUrl={cms.heroLogoUrl || "/esme-icon.jpg"} />}
              footer={
                <SiteFooter
                  footer={cms.footer}
                  arFooter={cms.ar?.footer}
                  logoUrl={cms.heroLogoUrl}
                />
              }
            >
              {children}
            </AppChromeShell>
          </LanguageProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
