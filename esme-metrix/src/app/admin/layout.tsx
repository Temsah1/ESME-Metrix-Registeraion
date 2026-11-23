"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  QrCode,
  Search,
  LogOut,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { name: "Overview Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Registrants", href: "/admin/registrants", icon: Users },
  { name: "Attendance Feed", href: "/admin/attendance", icon: CheckSquare },
  { name: "Live Scanner", href: "/admin/scanner", icon: QrCode },
  { name: "Search & Verify", href: "/admin/search", icon: Search },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, don't show the dashboard shell
  const isLoginPage = pathname === "/admin" || pathname === "/admin/login";
  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    router.push("/admin");
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0F243A] border-b border-[#D97706]/20">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#D97706]" />
          <span className="text-sm font-bold text-white">METRIX ADMIN CONSOLE</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg border border-slate-700 text-slate-300"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-[#0F243A]/95 border-r border-[#D97706]/20 p-4 flex flex-col shrink-0`}
      >
        <div className="hidden md:flex items-center gap-3 px-3 py-4 border-b border-slate-800 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#D97706]/15 border border-[#D97706]/35 flex items-center justify-center p-1">
            <Image src="/esme_logo.png" alt="Logo" width={28} height={28} className="object-contain" />
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-wider">ADMIN PANEL</div>
            <div className="text-[10px] text-[#F59E0B] font-mono">ESME CU CHAPTER</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold shadow-[0_0_15px_rgba(217,119,6,0.3)]"
                    : "text-slate-300 hover:text-white hover:bg-[#1D3046]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Session Footer */}
        <div className="border-t border-slate-800 pt-4 mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <section className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#15304B] overflow-x-auto">
        {children}
      </section>
    </div>
  );
}
