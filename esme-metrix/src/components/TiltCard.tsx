"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Smooth 2D GPU-composited interactive card with shine effect.
 */
export default function TiltCard({ children, className = "" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shine, setShine] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setShine({ x, y, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setShine((s) => ({ ...s, opacity: 0 }));
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.18 }}
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.94, y: 2 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden ${className}`}
      style={{ willChange: "transform" }}
    >
      {/* Shine overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-[inherit]"
        style={{
          opacity: shine.opacity * 0.6,
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
        }}
      />
      {children}
    </motion.div>
  );
}
