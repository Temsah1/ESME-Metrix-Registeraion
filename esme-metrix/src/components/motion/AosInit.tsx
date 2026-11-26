"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

/**
 * Lightweight 2D scroll-reveal initializer via AOS (transform + opacity only).
 */
export default function AosInit() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    AOS.init({
      duration: 550,
      easing: "ease-out-cubic",
      once: true,
      offset: 40,
      disable: prefersReducedMotion,
    });
  }, []);

  return null;
}
