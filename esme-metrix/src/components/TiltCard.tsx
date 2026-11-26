"use client";

import React from "react";
import { motion } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Smooth 2D GPU-composited interactive card (replaces legacy 3D perspective tilt).
 */
export default function TiltCard({ children, className = "" }: TiltCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`card-hover-lift relative ${className}`}
    >
      {children}
    </motion.div>
  );
}
