"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function IntroLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show once per session so user isn't blocked on reload
    const hasSeen = sessionStorage.getItem("metrix_intro_seen");
    if (!hasSeen) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("metrix_intro_seen", "true");
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B1A2A] text-white pointer-events-none select-none"
        >
          {/* Animated Background Mesh Glow */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.3 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-[#D97706] to-[#10B981] blur-[120px]"
          />

          {/* Logo Reveal with Spring Scale */}
          <motion.div
            initial={{ scale: 0, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="relative z-10 w-20 h-20 rounded-2xl bg-[#0F243A] border-2 border-[#D97706]/60 p-3 shadow-[0_0_40px_rgba(217,119,6,0.4)] flex items-center justify-center mb-5"
          >
            <Image
              src="/esme_logo.png"
              alt="ESME Logo"
              width={56}
              height={56}
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Staggered Typography Reveal */}
          <div className="relative z-10 text-center overflow-hidden">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl sm:text-3xl font-black tracking-widest text-white"
            >
              ESME <span className="text-[#D97706]">METRIX</span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs font-mono text-[#F59E0B] tracking-wider uppercase mt-1"
            >
              Cairo University Student Chapter
            </motion.p>
          </div>

          {/* Sleek Line Progress */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
            className="relative z-10 h-0.5 bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#10B981] mt-5 rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
