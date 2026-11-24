"use client";

import React, { useEffect, useState } from "react";

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  useEffect(() => {
    // Only enable custom cursor interactions on non-touch devices
    const isMouse = window.matchMedia("(pointer: fine)").matches;
    setIsPointerDevice(isMouse);

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    if (isMouse) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (isMouse) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <>
      {/* Scroll Progress Bar at the absolute top */}
      <div
        id="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Atmospheric Grain Texture */}
      <div className="grain-overlay" />

      {/* Interactive Desktop Spotlight following mouse */}
      {isPointerDevice && (
        <div
          className="fixed pointer-events-none z-30 transition-transform duration-75 ease-out rounded-full blur-[90px]"
          style={{
            width: "360px",
            height: "360px",
            background: "radial-gradient(circle, rgba(217, 119, 6, 0.08) 0%, rgba(245, 158, 11, 0.03) 40%, transparent 70%)",
            transform: `translate(${mousePos.x - 180}px, ${mousePos.y - 180}px)`,
          }}
        />
      )}

      {children}
    </>
  );
}
