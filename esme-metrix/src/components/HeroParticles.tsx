"use client";

import { useEffect } from "react";

/**
 * Enhanced ambient backdrop — GPU-composited CSS animations,
 * animated dots, aurora blobs, light beams. No WebGL / canvas loops.
 */
export default function HeroParticles() {
  useEffect(() => {
    const bar = document.getElementById("scroll-progress") as HTMLDivElement | null;
    if (!bar) return;
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      bar.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Aurora blob 1 */}
      <div
        className="absolute -top-32 -left-24 w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(217,119,6,0.5) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "auroraShift 24s linear infinite",
        }}
      />

      {/* Aurora blob 2 */}
      <div
        className="absolute top-1/3 -right-28 w-[420px] h-[420px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)",
          filter: "blur(90px)",
          animation: "auroraShift 30s linear infinite reverse",
        }}
      />

      {/* Aurora blob 3 */}
      <div
        className="absolute -bottom-40 left-1/3 w-[380px] h-[380px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "auroraShift 20s linear infinite 8s",
        }}
      />

      {/* Light beams */}
      <div className="light-beam opacity-60" style={{ top: "10%", bottom: "auto", height: "80%" }} />
      <div className="light-beam light-beam-delay opacity-40" style={{ top: "30%", bottom: "auto", height: "60%", width: "100px" }} />

      <div className="absolute inset-x-0 top-12 h-[420px] sm:h-[520px] overflow-hidden" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <span
            key={i}
            className="homepage-particle"
            style={{
              left: `${8 + ((i * 13) % 84)}%`,
              top: `${12 + ((i * 23) % 68)}%`,
              "--particle-delay": `${i * 0.55}s`,
              "--particle-duration": `${5.5 + (i % 4)}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Hexagonal lattice accent — top right */}
      <svg
        className="hidden sm:block absolute top-24 right-10 w-56 h-56 opacity-[0.08] text-[#F59E0B]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <polygon
          points="100,15 170,55 170,135 100,175 30,135 30,55"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />
        <polygon
          points="100,45 145,70 145,120 100,145 55,120 55,70"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="100" cy="95" r="5" fill="currentColor" />
        <circle cx="100" cy="15" r="2.5" fill="currentColor" className="animate-ping-live" style={{ animationDuration: "2s" }} />
        <circle cx="170" cy="55" r="2" fill="currentColor" />
        <circle cx="30" cy="135" r="2" fill="currentColor" />
      </svg>

      {/* Hexagonal lattice accent — bottom left */}
      <svg
        className="hidden md:block absolute bottom-28 left-8 w-44 h-44 opacity-[0.07] text-cyan-400"
        viewBox="0 0 200 200"
        fill="none"
      >
        <polygon
          points="100,20 165,58 165,134 100,172 35,134 35,58"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="100" cy="20" r="3.5" fill="currentColor" />
        <circle cx="165" cy="134" r="3.5" fill="currentColor" />
        <circle cx="35" cy="134" r="3.5" fill="currentColor" />
      </svg>

      {/* Animated dot grid */}
      <div className="hidden lg:block absolute top-1/4 left-1/4 opacity-30">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#F59E0B] hero-dot"
            style={{
              left: `${(i % 4) * 20}px`,
              top: `${Math.floor(i / 4) * 20}px`,
              "--dur": `${2.5 + (i * 0.3)}s`,
              "--delay": `${i * 0.2}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Floating circuit lines */}
      <svg
        className="hidden xl:block absolute top-1/2 left-1/2 w-[600px] h-[300px] -translate-x-1/2 -translate-y-1/2 opacity-[0.03]"
        viewBox="0 0 600 300"
        fill="none"
      >
        <path d="M0 150 H200 L250 100 H350 L400 150 H600" stroke="#F59E0B" strokeWidth="1" />
        <path d="M0 200 H100 L150 250 H450 L500 200 H600" stroke="#10B981" strokeWidth="0.8" />
        <circle cx="250" cy="100" r="4" fill="#F59E0B" />
        <circle cx="350" cy="100" r="4" fill="#F59E0B" />
        <circle cx="150" cy="250" r="3" fill="#10B981" />
        <circle cx="450" cy="250" r="3" fill="#10B981" />
      </svg>
    </div>
  );
}
