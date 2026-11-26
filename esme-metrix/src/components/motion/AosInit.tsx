"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

/**
 * Scroll-reveal initializer via AOS with enhanced settings.
 */
export default function AosInit() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
      delay: 0,
      disable: prefersReducedMotion,
      mirror: false,
      anchorPlacement: "top-bottom",
    });

    // Refresh AOS on page load to catch all elements
    setTimeout(() => AOS.refresh(), 100);
  }, []);

  return null;
}
