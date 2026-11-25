"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";

function subscribePointerMedia(callback: () => void) {
  const mql = window.matchMedia("(pointer: fine)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const isPointerDevice = useSyncExternalStore(
    subscribePointerMedia,
    () => window.matchMedia("(pointer: fine)").matches,
    () => false
  );

  useEffect(() => {
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
    if (isPointerDevice) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (isPointerDevice) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [isPointerDevice]);

  return (
    <>
      <div id="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <div className="grain-overlay" />

      {isPointerDevice && (
        <div
          className="fixed pointer-events-none z-30 transition-transform duration-75 ease-out rounded-full blur-[90px]"
          style={{
            width: "360px",
            height: "360px",
            background:
              "radial-gradient(circle, rgba(217, 119, 6, 0.08) 0%, rgba(245, 158, 11, 0.03) 40%, transparent 70%)",
            transform: `translate(${mousePos.x - 180}px, ${mousePos.y - 180}px)`,
          }}
        />
      )}

      {children}
    </>
  );
}
