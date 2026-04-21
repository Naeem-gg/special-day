"use client";

import { motion } from "framer-motion";

export function DNvitesLogo({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`inline-flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Animated heart icon */}
      <motion.svg
        width="32" height="32" viewBox="0 0 32 32" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F43F8F" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>
        <path
          d="M16 28s-12-7.5-12-15a7 7 0 0 1 12-4.9A7 7 0 0 1 28 13c0 7.5-12 15-12 15Z"
          fill="url(#heartGrad)"
        />
        {/* sparkle dots */}
        <motion.circle cx="24" cy="6" r="1.5" fill="#D4AF37"
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        />
        <motion.circle cx="8" cy="5" r="1" fill="#F43F8F"
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
        />
      </motion.svg>

      {/* Brand text */}
      <span
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        className="text-xl font-bold tracking-tight leading-none"
      >
        <span className="text-[#F43F8F]">DN</span>
        <span className="text-[#D4AF37]">vites</span>
      </span>
    </motion.div>
  );
}
