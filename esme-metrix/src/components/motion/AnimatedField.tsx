"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fieldEntrance } from "@/components/motion/MotionTokens";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface AnimatedFieldProps {
  label: string;
  icon?: React.ReactNode;
  required?: boolean;
  error?: string;
  isValid?: boolean;
  helperText?: string;
  standalone?: boolean;
  children: React.ReactNode;
}

export default function AnimatedField({
  label,
  icon,
  required = false,
  error,
  isValid = false,
  helperText,
  standalone = false,
  children,
}: AnimatedFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      variants={standalone ? undefined : fieldEntrance}
      className="flex flex-col gap-1.5 relative"
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={() => setIsFocused(false)}
    >
      <div className="flex items-center justify-between">
        <label className={`text-xs font-semibold flex items-center gap-1.5 transition-colors duration-200 ${
          isFocused ? "text-[#F59E0B]" : "text-slate-300"
        }`}>
          {icon}
          <span>{label}</span>
          {required && <span className="text-[#D97706] font-bold">*</span>}
        </label>

        {/* Realtime Validation Indicator */}
        <AnimatePresence>
          {isValid && !error && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="text-[#10B981] flex items-center gap-1 text-[10px] font-mono font-bold"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>مكتمل</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input container with focus ring & error shake animation */}
      <motion.div
        animate={error ? { x: [-4, 4, -4, 4, 0] } : {}}
        transition={{ duration: 0.35 }}
        className={`rounded-xl transition-all duration-200 ${
          isFocused ? "shadow-[0_0_15px_rgba(217,119,6,0.25)]" : ""
        }`}
      >
        {children}
      </motion.div>

      {/* Helper & Error Messages */}
      <AnimatePresence mode="wait">
        {error ? (
          <motion.span
            key="error"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-amber-400 flex items-center gap-1 font-medium mt-0.5"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
            {error}
          </motion.span>
        ) : helperText ? (
          <span className="text-[10px] text-slate-400 font-mono mt-0.5">{helperText}</span>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
