"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Shield, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
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
        setError(authError.message || "Invalid administrative credentials.");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Unable to reach the authentication service. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#111820]/90 border border-[#00C9A7]/25 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#00C9A7]/10 border border-[#00C9A7]/30 flex items-center justify-center p-2 mb-3">
            <Image src="/esme_logo.png" alt="ESME Logo" width={42} height={42} className="object-contain" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Admin Console Login</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Authorized organizers & gate operators only
          </p>
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
              <Mail className="w-3.5 h-3.5 text-[#00C9A7]" /> Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@esme-cu.com"
              className="w-full h-11 px-3.5 rounded-xl bg-[#0A0F14] border border-[#00C9A7]/20 text-white placeholder-slate-600 focus:outline-none focus:border-[#00C9A7] text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#00C9A7]" /> Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full h-11 px-3.5 rounded-xl bg-[#0A0F14] border border-[#00C9A7]/20 text-white placeholder-slate-600 focus:outline-none focus:border-[#00C9A7] text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-[#00C9A7] to-[#007A65] text-[#0A0F14] font-bold text-xs sm:text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,201,167,0.3)] disabled:opacity-50 mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            SIGN IN TO DASHBOARD
          </button>
        </form>

        <div className="mt-6 text-center text-[11px] text-slate-500 font-mono">
          Single sign-on protected by Supabase Auth RLS.
        </div>
      </div>
    </div>
  );
}
