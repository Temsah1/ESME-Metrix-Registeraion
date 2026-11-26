"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function IntroLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("metrix_intro_seen");
    if (hasSeen) return;

    const showFrame = requestAnimationFrame(() => setShow(true));
    const timer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("metrix_intro_seen", "true");
    }, 2200);

    return () => {
      cancelAnimationFrame(showFrame);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center intro-loader-bg text-white pointer-events-none select-none"
        >
          {/* Background aurora */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1.4, opacity: 0.25 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(ellipse, #D97706 0%, #10B981 50%, transparent 70%)",
              filter: "blur(100px)",
            }}
          />

          {/* Second aurora layer */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.15 }}
            transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
            className="absolute w-[300px] h-[300px] rounded-full"
            style={{
              background: "radial-gradient(ellipse, #06B6D4 0%, transparent 70%)",
              filter: "blur(60px)",
              transform: "translate(100px, -80px)",
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.1 }}
            className="relative z-10 w-24 h-24 rounded-full bg-[#082546] border-2 border-[#D97706]/70 shadow-[0_0_60px_rgba(217,119,6,0.5)] flex items-center justify-center overflow-hidden mb-6"
          >
            <Image
              src="/esme-icon.jpg"
              alt="ESME Logo"
              width={96}
              height={96}
              className="w-full h-full rounded-full object-cover"
              priority
            />
            {/* Rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-dashed border-[#D97706]/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, ease: "linear", repeat: Infinity }}
            />
          </motion.div>

          {/* Title */}
          <div className="relative z-10 text-center overflow-hidden">
            <motion.h1
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl font-black tracking-widest text-white"
            >
              ESME <span className="text-[#D97706]">METRIX</span>
            </motion.h1>

            <motion.p
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs font-mono text-[#F59E0B] tracking-wider uppercase mt-1.5"
            >
              Cairo University Student Chapter
            </motion.p>
          </div>

          {/* Progress bar */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "160px", opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.4, ease: "easeInOut" }}
            className="relative z-10 h-0.5 bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#10B981] mt-6 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.6)]"
          />

          {/* Loading dots */}
          <div className="relative z-10 flex gap-1.5 mt-5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]/60"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
