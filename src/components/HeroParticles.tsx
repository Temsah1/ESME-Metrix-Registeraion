"use client";

/**
 * Lightweight pure-2D ambient engineering grid & crystal accent backdrop.
 * Uses GPU-composited opacity/transform CSS only (no WebGL, 3D, or canvas loops).
 */
export default function HeroParticles() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Subtle GPU-friendly radial glow accents */}
      <div className="absolute -top-28 -left-24 w-[420px] h-[420px] rounded-full bg-[#D97706]/8 blur-[110px]" />
      <div className="absolute top-1/3 -right-28 w-[380px] h-[380px] rounded-full bg-cyan-500/6 blur-[110px]" />
      <div className="absolute -bottom-32 left-1/3 w-[360px] h-[360px] rounded-full bg-emerald-500/5 blur-[110px]" />

      {/* Crisp static 2D hexagonal lattice accents */}
      <svg
        className="hidden sm:block absolute top-24 right-10 w-56 h-56 opacity-[0.07] text-[#F59E0B]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <polygon
          points="100,15 170,55 170,135 100,175 30,135 30,55"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <polygon
          points="100,45 145,70 145,120 100,145 55,120 55,70"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="100" cy="95" r="5" fill="currentColor" />
      </svg>

      <svg
        className="hidden md:block absolute bottom-28 left-8 w-44 h-44 opacity-[0.06] text-cyan-400"
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
    </div>
  );
}
