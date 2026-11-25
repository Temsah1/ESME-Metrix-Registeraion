"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Shield, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getDictionary } from "@/lib/i18n/dictionary";

export default function AdminLoginPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = getDictionary(lang);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(
          lang === "ar"
            ? "بيانات الدخول غير صحيحة، يُرجى التأكد من البريد وكلمة المرور."
            : authError.message || "Invalid administrative credentials."
        );
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError(t.dashboard.networkError);
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#0F243A]/90 border border-[#D97706]/25 backdrop-blur-md shadow-2xl text-start">
        <div className="flex justify-end mb-2">
          <LanguageSwitcher compact />
        </div>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#D97706]/10 border border-[#D97706]/30 flex items-center justify-center p-2 mb-3">
            <Image src="/esme_logo.png" alt="ESME Logo" width={42} height={42} className="object-contain" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {t.admin.loginTitle}
          </h1>
          <p className="text-xs text-slate-400 mt-1">{t.admin.loginSubtitle}</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#D97706]" /> {t.admin.emailLabel}
            </label>
            <input
              type="email"
              dir="ltr"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@esme-cu.com"
              className="w-full h-11 px-3.5 rounded-xl bg-[#15304B] border border-[#D97706]/20 text-white placeholder-slate-500 focus:outline-none focus:border-[#D97706] text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#D97706]" /> {t.admin.passwordLabel}
            </label>
            <input
              type="password"
              dir="ltr"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full h-11 px-3.5 rounded-xl bg-[#15304B] border border-[#D97706]/20 text-white placeholder-slate-500 focus:outline-none focus:border-[#D97706] text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-xs sm:text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(217,119,6,0.35)] disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            {loading ? t.admin.signingIn : t.admin.signInButton}
          </button>
        </form>

        <div className="mt-6 text-center text-[11px] text-slate-500">{t.admin.rlsNotice}</div>
      </div>
    </div>
  );
}
