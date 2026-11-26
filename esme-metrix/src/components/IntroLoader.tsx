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
    }, 1800);

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
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B1A2A] text-white pointer-events-none select-none"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.15, opacity: 0.3 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-[#D97706] to-[#10B981] blur-[120px]"
          />

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="relative z-10 w-20 h-20 rounded-full bg-[#082546] border-2 border-[#D97706]/60 shadow-[0_0_40px_rgba(217,119,6,0.4)] flex items-center justify-center overflow-hidden mb-5"
          >
            <Image
              src="/esme-icon.jpg"
              alt="ESME Logo"
              width={80}
              height={80}
              className="w-full h-full rounded-full object-cover"
              priority
            />
          </motion.div>

          <div className="relative z-10 text-center overflow-hidden">
            <motion.h1
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.3, ease: "easeOut" }}
              className="text-2xl sm:text-3xl font-black tracking-widest text-white"
            >
              ESME <span className="text-[#D97706]">METRIX</span>
            </motion.h1>

            <motion.p
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.45, ease: "easeOut" }}
              className="text-xs font-mono text-[#F59E0B] tracking-wider uppercase mt-1"
            >
              Cairo University Student Chapter
            </motion.p>
          </div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 1.1, delay: 0.35, ease: "easeInOut" }}
            className="relative z-10 h-0.5 bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#10B981] mt-5 rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
